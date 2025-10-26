import { supabase } from '@/integrations/supabase/client';

interface LLMConfig {
  provider: 'mistral' | 'openrouter' | 'openai' | 'deepseek';
  model: string;
  apiKey?: string;
  endpoint?: string;
  useEdgeFunction?: boolean;
}

interface LLMRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
}

interface LLMResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model: string;
  provider: string;
}

const PROVIDER_CONFIGS = {
  mistral: {
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-large-latest',
    envKey: import.meta.env.VITE_MISTRAL_API_KEY
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    envKey: import.meta.env.VITE_DEEPSEEK_API_KEY
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'anthropic/claude-3-opus',
    envKeys: [
      import.meta.env.VITE_OPENROUTER_API_KEY_PRIMARY,
      import.meta.env.VITE_OPENROUTER_API_KEY_SECONDARY,
      import.meta.env.VITE_OPENROUTER_API_KEY_TERTIARY
    ].filter(key => key)
  }
};

// Configuration: utiliser DeepSeek pour les utilisateurs premium
// DÉSACTIVÉ: la clé DeepSeek ne fonctionne pas actuellement
const USE_DEEPSEEK_FOR_PREMIUM = false;

class LLMRouter {
  private cachedApiKeys: Map<string, string[]> = new Map();
  private lastFetchTime = 0;
  private cacheDuration = 60000; // 1 minute

  async fetchApiKeysFromSupabase(userId?: string): Promise<Map<string, string[]>> {
    const now = Date.now();

    // Utiliser le cache si disponible et récent
    if (this.cachedApiKeys.size > 0 && (now - this.lastFetchTime) < this.cacheDuration) {
      console.log('🔑 Utilisation des clés API en cache');
      return this.cachedApiKeys;
    }

    console.log('🔑 Récupération des clés API depuis Supabase...');

    try {
      let query = supabase
        .from('api_keys')
        .select('provider, api_key_encrypted')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      // Ne pas filtrer par user_id pour permettre l'utilisation des clés système
      // Les clés avec user_id=null sont des clés partagées pour tous les utilisateurs

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des clés API:', error);
        return this.getFallbackKeys();
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ Aucune clé API trouvée dans Supabase, utilisation des clés .env');
        return this.getFallbackKeys();
      }

      // Organiser les clés par provider
      const keysByProvider = new Map<string, string[]>();
      for (const row of data) {
        const provider = row.provider.toLowerCase();
        if (!keysByProvider.has(provider)) {
          keysByProvider.set(provider, []);
        }
        keysByProvider.get(provider)!.push(row.api_key_encrypted);
      }

      this.cachedApiKeys = keysByProvider;
      this.lastFetchTime = now;

      console.log('✅ Clés API récupérées:', Array.from(keysByProvider.keys()));
      return keysByProvider;
    } catch (error) {
      console.error('❌ Exception lors de la récupération des clés API:', error);
      return this.getFallbackKeys();
    }
  }

  private getFallbackKeys(): Map<string, string[]> {
    const fallbackKeys = new Map<string, string[]>();

    if (PROVIDER_CONFIGS.mistral.envKey) {
      fallbackKeys.set('mistral', [PROVIDER_CONFIGS.mistral.envKey]);
    }
    if (PROVIDER_CONFIGS.deepseek.envKey) {
      fallbackKeys.set('deepseek', [PROVIDER_CONFIGS.deepseek.envKey]);
    }
    if (PROVIDER_CONFIGS.openrouter.envKeys.length > 0) {
      fallbackKeys.set('openrouter', PROVIDER_CONFIGS.openrouter.envKeys);
    }

    return fallbackKeys;
  }

  async selectLLM(isAuthenticated: boolean, userHasCredits: boolean, userId?: string): Promise<LLMConfig> {
    // Récupérer les clés API depuis Supabase ou fallback sur .env
    const apiKeys = await this.fetchApiKeysFromSupabase(userId);

    // Si l'utilisateur a des crédits et est authentifié, on peut utiliser OpenRouter ou DeepSeek
    if (isAuthenticated && userHasCredits && USE_DEEPSEEK_FOR_PREMIUM) {
      const deepseekKeys = apiKeys.get('deepseek') || [];
      if (deepseekKeys.length > 0) {
        console.log('🎯 Utilisation de DeepSeek pour utilisateur premium', { isAuthenticated, userHasCredits });
        return {
          provider: 'deepseek',
          model: PROVIDER_CONFIGS.deepseek.model,
          apiKey: deepseekKeys[0],
          endpoint: PROVIDER_CONFIGS.deepseek.endpoint,
          useEdgeFunction: false
        };
      }
    }

    // Vérifier si OpenRouter est disponible avec plusieurs clés
    const openrouterKeys = apiKeys.get('openrouter') || [];
    if (openrouterKeys.length > 0) {
      console.log(`🎯 Utilisation d\'OpenRouter (Claude 3.5) - ${openrouterKeys.length} clés disponibles`, { isAuthenticated, userHasCredits });
      return {
        provider: 'openrouter',
        model: PROVIDER_CONFIGS.openrouter.model,
        apiKey: openrouterKeys[0],
        endpoint: PROVIDER_CONFIGS.openrouter.endpoint,
        useEdgeFunction: false
      };
    }

    // Fallback sur Mistral si disponible
    const mistralKeys = apiKeys.get('mistral') || [];
    if (mistralKeys.length > 0) {
      console.log('🎯 Utilisation de Mistral API', { isAuthenticated, userHasCredits });
      return {
        provider: 'mistral',
        model: PROVIDER_CONFIGS.mistral.model,
        apiKey: mistralKeys[0],
        endpoint: PROVIDER_CONFIGS.mistral.endpoint,
        useEdgeFunction: false
      };
    }

    throw new Error('Aucune clé API configurée. Veuillez configurer au moins une clé API (Mistral, OpenRouter ou DeepSeek).');
  }

  async callLLM(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    if (config.useEdgeFunction) {
      try {
        return await this.callViaEdgeFunction(config, request);
      } catch (error) {
        const fallbackProvider = config.provider === 'deepseek' ? 'DeepSeek' : 'Mistral';
        console.warn(`⚠️ Edge function failed, falling back to ${fallbackProvider}:`, error.message);

        if (config.provider === 'deepseek') {
          return await this.callDeepSeek(request);
        }
        return await this.callMistral(request);
      }
    } else {
      return this.callDirectly(config, request);
    }
  }

  private async callDirectly(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    if (config.provider === 'mistral') {
      return this.callMistral(request);
    }

    if (config.provider === 'deepseek') {
      return this.callDeepSeek(request);
    }

    if (config.provider === 'openrouter') {
      return this.callOpenRouter(request);
    }

    throw new Error(`Provider ${config.provider} not supported for direct calls`);
  }

  async callOpenRouter(request: LLMRequest, apiKeys?: string[]): Promise<LLMResponse> {
    // Si aucune clé fournie, récupérer depuis Supabase
    if (!apiKeys) {
      const keys = await this.fetchApiKeysFromSupabase();
      apiKeys = keys.get('openrouter') || [];
    }

    if (apiKeys.length === 0) {
      throw new Error('Aucune clé OpenRouter disponible');
    }

    console.log(`🔗 Appel OpenRouter API avec ${apiKeys.length} clés disponibles...`);

    let lastError: Error | null = null;

    for (let i = 0; i < apiKeys.length; i++) {
      const apiKey = apiKeys[i];
      console.log(`🔑 Tentative avec la clé #${i + 1}/${apiKeys.length}`);
      const startTime = Date.now();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      try {
        const response = await fetch(PROVIDER_CONFIGS.openrouter.endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Prompt Generator Pro'
          },
          body: JSON.stringify({
            model: PROVIDER_CONFIGS.openrouter.model,
            messages: request.messages,
            temperature: request.temperature || 0.7,
            max_tokens: request.maxTokens || 8000
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.warn(`⚠️ OpenRouter clé #${i + 1} a échoué:`, { status: response.status, error: errorData });

          if (response.status === 402 || response.status === 429) {
            console.log(`⏭️ Passage à la clé suivante...`);
            lastError = new Error(`Clé #${i + 1}: Crédits épuisés ou limite atteinte`);
            continue;
          }

          lastError = new Error(`Erreur API OpenRouter clé #${i + 1}: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
          continue;
        }

        const data = await response.json();
        const latency = Date.now() - startTime;
        console.log(`✅ OpenRouter API réponse reçue avec la clé #${i + 1} en ${latency}ms`);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error('❌ Format de réponse OpenRouter inattendu:', data);
          lastError = new Error('Format de réponse API OpenRouter inattendu');
          continue;
        }

        return {
          content: data.choices[0].message.content,
          usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
          model: PROVIDER_CONFIGS.openrouter.model,
          provider: 'openrouter'
        };
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.warn(`⚠️ Timeout avec la clé #${i + 1}`);
          lastError = new Error(`Timeout avec la clé #${i + 1}`);
          continue;
        }
        console.warn(`⚠️ Erreur avec la clé #${i + 1}:`, error.message);
        lastError = error;
        continue;
      }
    }

    console.error('❌ Toutes les clés OpenRouter ont échoué, fallback sur Mistral');
    const keys = await this.fetchApiKeysFromSupabase();
    const mistralKeys = keys.get('mistral');
    if (mistralKeys && mistralKeys.length > 0) {
      console.log('🔄 Utilisation de Mistral comme fallback...');
      return this.callMistral(request);
    }

    throw lastError || new Error('Toutes les clés OpenRouter ont échoué et aucun fallback disponible');
  }

  async callMistral(request: LLMRequest, apiKey?: string): Promise<LLMResponse> {
    console.log('🔗 Appel Mistral API...');

    // Si aucune clé fournie, récupérer depuis Supabase
    if (!apiKey) {
      const keys = await this.fetchApiKeysFromSupabase();
      const mistralKeys = keys.get('mistral') || [];
      if (mistralKeys.length === 0) {
        throw new Error('Clé API Mistral manquante. Veuillez configurer une clé Mistral dans les paramètres.');
      }
      apiKey = mistralKeys[0];
    }

    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(PROVIDER_CONFIGS.mistral.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: PROVIDER_CONFIGS.mistral.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 8000,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 402) {
          throw new Error('La clé API Mistral n\'a plus de crédits disponibles.');
        }

        throw new Error(`Erreur API Mistral: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      console.log(`✅ Mistral API réponse reçue en ${latency}ms`);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Format de réponse API Mistral inattendu');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        model: PROVIDER_CONFIGS.mistral.model,
        provider: 'mistral'
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La requête Mistral a pris trop de temps (>45s)');
      }
      throw error;
    }
  }

  async callDeepSeek(request: LLMRequest, apiKey?: string): Promise<LLMResponse> {
    console.log('🔗 Appel DeepSeek API...');

    // Si aucune clé fournie, récupérer depuis Supabase
    if (!apiKey) {
      const keys = await this.fetchApiKeysFromSupabase();
      const deepseekKeys = keys.get('deepseek') || [];
      if (deepseekKeys.length === 0) {
        throw new Error('Clé API DeepSeek manquante. Veuillez configurer une clé DeepSeek dans les paramètres.');
      }
      apiKey = deepseekKeys[0];
    }

    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(PROVIDER_CONFIGS.deepseek.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: PROVIDER_CONFIGS.deepseek.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 8000,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 402 || response.status === 429) {
          throw new Error('La clé API DeepSeek n\'a plus de crédits disponibles ou la limite est atteinte.');
        }

        throw new Error(`Erreur API DeepSeek: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      console.log(`✅ DeepSeek API réponse reçue en ${latency}ms`);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Format de réponse API DeepSeek inattendu');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        model: PROVIDER_CONFIGS.deepseek.model,
        provider: 'deepseek'
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La requête DeepSeek a pris trop de temps (>45s)');
      }
      throw error;
    }
  }

  private async callViaEdgeFunction(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Configuration Supabase manquante');
    }

    const functionUrl = `${supabaseUrl}/functions/v1/chat-with-openai`;
    console.log('🔗 Appel edge function:', { functionUrl, provider: config.provider, model: config.model });

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: request.messages,
        model: config.model,
        max_tokens: request.maxTokens || 8000,
        temperature: request.temperature || 0.7,
        provider: config.provider
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Edge function error:', { status: response.status, error: errorData });
      throw new Error(`Erreur Edge Function: ${response.status} - ${errorData.error || response.statusText}`);
    }

    console.log('✅ Edge function success');

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('❌ Format de réponse inattendu:', data);
      throw new Error('Format de réponse Edge Function inattendu');
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      model: config.model,
      provider: config.provider
    };
  }

  async generatePrompt(
    systemPrompt: string,
    userPrompt: string,
    options: {
      isAuthenticated: boolean;
      userHasCredits: boolean;
      temperature?: number;
      maxTokens?: number;
      userId?: string;
    }
  ): Promise<LLMResponse> {
    const config = await this.selectLLM(options.isAuthenticated, options.userHasCredits, options.userId);

    console.log('🎯 LLM sélectionné:', {
      provider: config.provider,
      model: config.model,
      isAuthenticated: options.isAuthenticated,
      userHasCredits: options.userHasCredits
    });

    const request: LLMRequest = {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: options.temperature,
      maxTokens: options.maxTokens
    };

    return this.callLLM(config, request);
  }
}

export const llmRouter = new LLMRouter();
export type { LLMConfig, LLMRequest, LLMResponse };

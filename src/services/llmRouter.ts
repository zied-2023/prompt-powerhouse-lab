import { supabase } from '@/integrations/supabase/client';

interface LLMConfig {
  provider: 'mistral' | 'openrouter' | 'openai' | 'deepseek' | 'gemini';
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
    envKey: import.meta.env.VITE_MISTRAL_API_KEY,
    maxOutputTokens: 16000 // Mistral Large supporte jusqu'à 128k context, 16k output
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    envKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
    maxOutputTokens: 8000
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'anthropic/claude-3-opus',
    envKeys: [
      import.meta.env.VITE_OPENROUTER_API_KEY_PRIMARY,
      import.meta.env.VITE_OPENROUTER_API_KEY_SECONDARY,
      import.meta.env.VITE_OPENROUTER_API_KEY_TERTIARY
    ].filter(key => key),
    maxOutputTokens: 4096
  },
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/',
    model: 'gemini-1.5-flash',
    envKey: 'AIzaSyCgl-H781pntE5MBo2RzP0FlDugIbVevcM',
    maxOutputTokens: 8192
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
    if (PROVIDER_CONFIGS.gemini.envKey) {
      fallbackKeys.set('gemini', [PROVIDER_CONFIGS.gemini.envKey]);
    }

    return fallbackKeys;
  }

  async selectLLM(isAuthenticated: boolean, userHasCredits: boolean, userId?: string): Promise<LLMConfig> {
    // Récupérer les clés API depuis Supabase ou fallback sur .env
    const apiKeys = await this.fetchApiKeysFromSupabase(userId);

    // RÈGLE STRICTE: JAMAIS Gemini en mode premium (utilisateur authentifié avec crédits)
    const isPremiumMode = isAuthenticated && userHasCredits;

    if (isPremiumMode) {
      console.log('🔒 MODE PREMIUM: Gemini désactivé');
    }

    // PRIORITÉ 1: Mistral (préféré par l'utilisateur)
    const mistralKeys = apiKeys.get('mistral') || [];
    if (mistralKeys.length > 0) {
      console.log('🎯 Utilisation de Mistral API (priorité 1)', { isAuthenticated, userHasCredits });
      return {
        provider: 'mistral',
        model: PROVIDER_CONFIGS.mistral.model,
        apiKey: mistralKeys[0],
        endpoint: PROVIDER_CONFIGS.mistral.endpoint,
        useEdgeFunction: false
      };
    }

    // PRIORITÉ 2: OpenRouter (fallback stable)
    const openrouterKeys = apiKeys.get('openrouter') || [];
    if (openrouterKeys.length > 0) {
      console.log(`🎯 Utilisation d'OpenRouter (priorité 2) - ${openrouterKeys.length} clés disponibles`, { isAuthenticated, userHasCredits });
      return {
        provider: 'openrouter',
        model: PROVIDER_CONFIGS.openrouter.model,
        apiKey: openrouterKeys[0],
        endpoint: PROVIDER_CONFIGS.openrouter.endpoint,
        useEdgeFunction: false
      };
    }

    // Si l'utilisateur a des crédits et est authentifié, on peut utiliser DeepSeek
    if (isPremiumMode && USE_DEEPSEEK_FOR_PREMIUM) {
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

    // Gemini UNIQUEMENT pour mode gratuit (pas authentifié OU pas de crédits)
    if (!isPremiumMode) {
      const geminiKeys = apiKeys.get('gemini') || [];
      if (geminiKeys.length > 0) {
        console.log('🎯 Utilisation de Gemini pour mode gratuit UNIQUEMENT', { isAuthenticated, userHasCredits });
        return {
          provider: 'gemini',
          model: PROVIDER_CONFIGS.gemini.model,
          apiKey: geminiKeys[0],
          endpoint: PROVIDER_CONFIGS.gemini.endpoint,
          useEdgeFunction: false
        };
      }
    }

    // Si on arrive ici en mode premium, c'est une erreur critique
    if (isPremiumMode) {
      throw new Error('MODE PREMIUM: Aucune API premium disponible (Mistral, OpenRouter ou DeepSeek). Gemini n\'est pas autorisé en mode premium.');
    }

    throw new Error('Aucune clé API configurée. Veuillez configurer au moins une clé API (Mistral, OpenRouter, DeepSeek ou Gemini).');
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

    if (config.provider === 'gemini') {
      return this.callGemini(request);
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
            max_tokens: request.maxTokens || 16000  // Augmenté pour les prompts longs
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

    console.error('❌ Toutes les clés OpenRouter ont échoué, tentative de fallback');
    const keys = await this.fetchApiKeysFromSupabase();

    // Essayer Gemini en premier (gratuit et fiable)
    const geminiKeys = keys.get('gemini');
    if (geminiKeys && geminiKeys.length > 0) {
      console.log('🔄 Utilisation de Gemini comme fallback...');
      try {
        return await this.callGemini(request);
      } catch (geminiError) {
        console.warn('⚠️ Gemini fallback a échoué:', geminiError);
      }
    }

    // Essayer Mistral si Gemini échoue
    const mistralKeys = keys.get('mistral');
    if (mistralKeys && mistralKeys.length > 0) {
      console.log('🔄 Utilisation de Mistral comme dernier fallback...');
      try {
        return await this.callMistral(request);
      } catch (mistralError) {
        console.warn('⚠️ Mistral fallback a échoué:', mistralError);
      }
    }

    throw lastError || new Error('Tous les providers ont échoué. Veuillez réessayer plus tard.');
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
          max_tokens: request.maxTokens || 16000,  // Augmenté pour les prompts longs
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

        if (response.status === 429) {
          console.warn('⚠️ Mistral API limite atteinte (429), tentative de fallback sur Gemini...');
          const keys = await this.fetchApiKeysFromSupabase();
          const geminiKeys = keys.get('gemini');
          if (geminiKeys && geminiKeys.length > 0) {
            console.log('🔄 Basculement automatique sur Gemini gratuit');
            return this.callGemini(request);
          }
          throw new Error('Limite de capacité Mistral atteinte. Veuillez réessayer dans quelques instants.');
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
          max_tokens: request.maxTokens || 16000,  // Augmenté pour les prompts longs
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

  async callGemini(request: LLMRequest, apiKey?: string): Promise<LLMResponse> {
    console.log('🔗 Appel Gemini API...');

    // Si aucune clé fournie, récupérer depuis Supabase
    if (!apiKey) {
      const keys = await this.fetchApiKeysFromSupabase();
      const geminiKeys = keys.get('gemini') || [];
      if (geminiKeys.length === 0) {
        throw new Error('Clé API Gemini manquante.');
      }
      apiKey = geminiKeys[0];
    }

    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      // Convertir les messages au format Gemini
      const systemMessage = request.messages.find(m => m.role === 'system')?.content || '';
      const userMessages = request.messages.filter(m => m.role === 'user' || m.role === 'assistant');

      // Combiner le system message avec le premier message utilisateur si présent
      const contents = userMessages.map((msg, index) => {
        const text = (index === 0 && systemMessage)
          ? `${systemMessage}\n\n${msg.content}`
          : msg.content;

        return {
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text }]
        };
      });

      const geminiEndpoint = `${PROVIDER_CONFIGS.gemini.endpoint}${PROVIDER_CONFIGS.gemini.model}:generateContent?key=${apiKey}`;

      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: request.temperature || 0.7,
            maxOutputTokens: request.maxTokens || 8192,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 429) {
          throw new Error('La clé API Gemini a atteint sa limite de requêtes.');
        }

        if (response.status === 404) {
          console.error('❌ Erreur 404 Gemini - Modèle non trouvé:', errorData);
          throw new Error(`Le modèle Gemini ${PROVIDER_CONFIGS.gemini.model} n'est pas disponible. Veuillez vérifier votre clé API.`);
        }

        throw new Error(`Erreur API Gemini: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      console.log(`✅ Gemini API réponse reçue en ${latency}ms`);

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Format de réponse API Gemini inattendu');
      }

      const content = data.candidates[0].content.parts.map((part: any) => part.text).join('');
      const promptTokens = data.usageMetadata?.promptTokenCount || 0;
      const completionTokens = data.usageMetadata?.candidatesTokenCount || 0;

      return {
        content,
        usage: {
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens
        },
        model: PROVIDER_CONFIGS.gemini.model,
        provider: 'gemini'
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La requête Gemini a pris trop de temps (>45s)');
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

  /**
   * Retourne le nombre maximum de tokens recommandé pour un mode donné
   * Utilise la limite du provider si aucun maxTokens n'est spécifié
   */
  getRecommendedMaxTokens(mode: 'free' | 'basic' | 'premium', provider?: 'mistral' | 'deepseek' | 'openrouter'): number {
    // Pour le mode premium avec prompt d'amélioration, utiliser la limite maximale du provider
    if (mode === 'premium') {
      const providerConfig = provider ? PROVIDER_CONFIGS[provider] : PROVIDER_CONFIGS.mistral;
      return providerConfig.maxOutputTokens;
    }

    // Pour les autres modes, utiliser des limites raisonnables
    return mode === 'basic' ? 8000 : 4000;
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

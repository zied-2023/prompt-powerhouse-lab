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

const MISTRAL_CONFIG = {
  endpoint: 'https://api.mistral.ai/v1/chat/completions',
  key: import.meta.env.VITE_MISTRAL_API_KEY,
  model: 'mistral-large-latest'
};

const DEEPSEEK_CONFIG = {
  endpoint: 'https://api.deepseek.com/v1/chat/completions',
  key: import.meta.env.VITE_DEEPSEEK_API_KEY,
  model: 'deepseek-chat'
};

const OPENROUTER_CONFIG = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: import.meta.env.VITE_OPENROUTER_API_KEY,
  model: 'anthropic/claude-3.5-sonnet'
};

// Configuration: utiliser DeepSeek pour les utilisateurs premium
// DÉSACTIVÉ: la clé DeepSeek ne fonctionne pas actuellement
const USE_DEEPSEEK_FOR_PREMIUM = false;

class LLMRouter {
  async selectLLM(isAuthenticated: boolean, userHasCredits: boolean): Promise<LLMConfig> {
    // Si l'utilisateur a des crédits et est authentifié, on peut utiliser OpenRouter ou DeepSeek
    if (isAuthenticated && userHasCredits && USE_DEEPSEEK_FOR_PREMIUM && DEEPSEEK_CONFIG.key) {
      console.log('🎯 Utilisation de DeepSeek pour utilisateur premium', { isAuthenticated, userHasCredits });
      return {
        provider: 'deepseek',
        model: DEEPSEEK_CONFIG.model,
        apiKey: DEEPSEEK_CONFIG.key,
        endpoint: DEEPSEEK_CONFIG.endpoint,
        useEdgeFunction: false
      };
    }

    // Vérifier si OpenRouter est disponible
    if (OPENROUTER_CONFIG.key) {
      console.log('🎯 Utilisation d\'OpenRouter (Claude 3.5)', { isAuthenticated, userHasCredits });
      return {
        provider: 'openrouter',
        model: OPENROUTER_CONFIG.model,
        apiKey: OPENROUTER_CONFIG.key,
        endpoint: OPENROUTER_CONFIG.endpoint,
        useEdgeFunction: false
      };
    }

    // Fallback sur Mistral si disponible
    if (MISTRAL_CONFIG.key) {
      console.log('🎯 Utilisation de Mistral API', { isAuthenticated, userHasCredits });
      return {
        provider: 'mistral',
        model: MISTRAL_CONFIG.model,
        apiKey: MISTRAL_CONFIG.key,
        endpoint: MISTRAL_CONFIG.endpoint,
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

  async callOpenRouter(request: LLMRequest): Promise<LLMResponse> {
    console.log('🔗 Appel OpenRouter API...');
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(OPENROUTER_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_CONFIG.key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt Generator Pro'
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.maxTokens || 8000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ OpenRouter error:', { status: response.status, error: errorData });

        if (response.status === 402) {
          throw new Error('La clé API OpenRouter n\'a plus de crédits disponibles.');
        }

        throw new Error(`Erreur API OpenRouter: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
      }

      const data = await response.json();
      const latency = Date.now() - startTime;
      console.log(`✅ OpenRouter API réponse reçue en ${latency}ms`);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Format de réponse OpenRouter inattendu:', data);
        throw new Error('Format de réponse API OpenRouter inattendu');
      }

      return {
        content: data.choices[0].message.content,
        usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
        model: OPENROUTER_CONFIG.model,
        provider: 'openrouter'
      };
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La requête OpenRouter a pris trop de temps (>45s)');
      }
      throw error;
    }
  }

  async callMistral(request: LLMRequest): Promise<LLMResponse> {
    console.log('🔗 Appel Mistral API...');

    if (!MISTRAL_CONFIG.key) {
      throw new Error('Clé API Mistral manquante. Veuillez configurer VITE_MISTRAL_API_KEY dans votre fichier .env');
    }

    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(MISTRAL_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MISTRAL_CONFIG.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MISTRAL_CONFIG.model,
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
        model: MISTRAL_CONFIG.model,
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

  async callDeepSeek(request: LLMRequest): Promise<LLMResponse> {
    console.log('🔗 Appel DeepSeek API...');
    const startTime = Date.now();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch(DEEPSEEK_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_CONFIG.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: DEEPSEEK_CONFIG.model,
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
        model: DEEPSEEK_CONFIG.model,
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
    }
  ): Promise<LLMResponse> {
    const config = await this.selectLLM(options.isAuthenticated, options.userHasCredits);

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

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
  key: '9rLgitb0iaYKdmdRzrkQhuAOBLldeJrj',
  model: 'mistral-large-latest'
};

const OPENROUTER_CONFIG = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: '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',
  model: 'anthropic/claude-3.5-sonnet'
};

// Configuration: activer OpenRouter pour les utilisateurs premium
const USE_OPENROUTER_FOR_PREMIUM = true;

class LLMRouter {
  async selectLLM(isAuthenticated: boolean, userHasCredits: boolean): Promise<LLMConfig> {
    // Si OpenRouter est activé ET l'utilisateur a des crédits
    if (USE_OPENROUTER_FOR_PREMIUM && isAuthenticated && userHasCredits) {
      console.log('🎯 Utilisation d\'OpenRouter (mode premium)');
      return {
        provider: 'openrouter',
        model: OPENROUTER_CONFIG.model,
        apiKey: OPENROUTER_CONFIG.key,
        endpoint: OPENROUTER_CONFIG.endpoint,
        useEdgeFunction: false
      };
    }

    // Par défaut: Mistral pour tous
    console.log('🎯 Utilisation de Mistral', { isAuthenticated, userHasCredits });
    return {
      provider: 'mistral',
      model: MISTRAL_CONFIG.model,
      apiKey: MISTRAL_CONFIG.key,
      endpoint: MISTRAL_CONFIG.endpoint,
      useEdgeFunction: false
    };
  }

  async callLLM(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    if (config.useEdgeFunction) {
      try {
        return await this.callViaEdgeFunction(config, request);
      } catch (error) {
        console.warn('⚠️ Edge function failed, falling back to Mistral:', error.message);
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

    if (config.provider === 'openrouter') {
      return this.callOpenRouter(request);
    }

    throw new Error(`Provider ${config.provider} not supported for direct calls`);
  }

  async callOpenRouter(request: LLMRequest): Promise<LLMResponse> {
    console.log('🔗 Appel OpenRouter API...');
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
        max_tokens: request.maxTokens || 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ OpenRouter error:', { status: response.status, error: errorData });

      if (response.status === 402) {
        throw new Error('La clé API OpenRouter n\'a plus de crédits disponibles.');
      }

      throw new Error(`Erreur API OpenRouter: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Réponse OpenRouter reçue');

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
  }

  async callMistral(request: LLMRequest): Promise<LLMResponse> {
    console.log('🔗 Appel Mistral API...');
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
        max_tokens: request.maxTokens || 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 402) {
        throw new Error('La clé API Mistral n\'a plus de crédits disponibles.');
      }

      throw new Error(`Erreur API Mistral: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Format de réponse API Mistral inattendu');
    }

    return {
      content: data.choices[0].message.content,
      usage: data.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      model: MISTRAL_CONFIG.model,
      provider: 'mistral'
    };
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
        max_tokens: request.maxTokens || 2000,
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

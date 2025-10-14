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

class LLMRouter {
  async selectLLM(isAuthenticated: boolean, userHasCredits: boolean): Promise<LLMConfig> {
    if (!isAuthenticated) {
      return {
        provider: 'mistral',
        model: MISTRAL_CONFIG.model,
        apiKey: MISTRAL_CONFIG.key,
        endpoint: MISTRAL_CONFIG.endpoint,
        useEdgeFunction: false
      };
    }

    if (userHasCredits) {
      return {
        provider: 'openrouter',
        model: 'anthropic/claude-3.5-sonnet',
        useEdgeFunction: true
      };
    }

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
      return this.callViaEdgeFunction(config, request);
    } else {
      return this.callDirectly(config, request);
    }
  }

  private async callDirectly(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
    if (config.provider === 'mistral') {
      return this.callMistral(request);
    }

    throw new Error(`Provider ${config.provider} not supported for direct calls`);
  }

  private async callMistral(request: LLMRequest): Promise<LLMResponse> {
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

    const functionUrl = `${supabaseUrl}/functions/v1/chat-with-openai`;

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
      throw new Error(`Erreur Edge Function: ${response.status} - ${errorData.error || response.statusText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
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

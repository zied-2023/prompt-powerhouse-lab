import { intelligentApiKeyManager, RequestContext } from './intelligentApiKeyManager';

export async function exampleTextGeneration() {
  const context: RequestContext = {
    task_type: 'text_generation',
    model_preference: 'quality',
    estimated_tokens: 500,
    priority: 'high',
    tags: ['text_generation', 'quality']
  };

  const apiKey = await intelligentApiKeyManager.selectBestApiKey(context);

  if (!apiKey) {
    throw new Error('No API key available');
  }

  const decryptedKey = intelligentApiKeyManager.decryptApiKey(apiKey.api_key_encrypted);

  const startTime = Date.now();
  let success = false;
  let tokensUsed = 0;
  let errorMessage: string | undefined;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${decryptedKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'Hello!' }],
        max_tokens: 500
      })
    });

    if (response.ok) {
      const data = await response.json();
      tokensUsed = data.usage?.total_tokens || 0;
      success = true;
      return data;
    } else {
      errorMessage = `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    success = false;
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw error;
  } finally {
    const responseTime = Date.now() - startTime;

    await intelligentApiKeyManager.logUsage({
      api_key_id: apiKey.id,
      context,
      success,
      tokens_used: tokensUsed,
      cost: tokensUsed * (apiKey.cost_per_token || 0),
      response_time_ms: responseTime,
      error_message: errorMessage
    });
  }
}

export async function exampleCodeGeneration() {
  const context: RequestContext = {
    task_type: 'code_generation',
    model_preference: 'fast',
    estimated_tokens: 1000,
    priority: 'medium',
    tags: ['code_generation', 'fast']
  };

  const apiKey = await intelligentApiKeyManager.selectBestApiKey(context);

  if (!apiKey) {
    throw new Error('No API key available');
  }

  return apiKey;
}

export async function exampleCostEffective() {
  const context: RequestContext = {
    task_type: 'translation',
    model_preference: 'cost_effective',
    estimated_tokens: 200,
    priority: 'low',
    tags: ['translation', 'cost_effective']
  };

  const apiKey = await intelligentApiKeyManager.selectBestApiKey(context);

  if (!apiKey) {
    throw new Error('No API key available');
  }

  return apiKey;
}

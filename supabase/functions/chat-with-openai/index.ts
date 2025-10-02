import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

// Interface pour les métriques des clés API
interface ApiKeyMetrics {
  failures: number;
  lastFailureTime: number;
  averageLatency: number;
  totalRequests: number;
  successfulRequests: number;
  quotaLimitHit: boolean;
  temporarilyDisabled: boolean;
  disabledUntil?: number;
}

// Store en mémoire pour les métriques (dans un vrai projet, utilisez Redis ou une base de données)
const keyMetrics = new Map<string, ApiKeyMetrics>();

// Configuration des clés avec priorité
interface ApiKeyConfig {
  key: string;
  priority: number; // 1 = plus haute priorité
  name: string;
}

function getApiKeyConfigs(provider: string): ApiKeyConfig[] {
  if (provider === 'openai') {
    const primaryKey = Deno.env.get('OPENAI_API_KEY_PRIMARY');
    const secondaryKey = Deno.env.get('OPENAI_API_KEY_SECONDARY');
    const fallbackKey = Deno.env.get('OPENAI_API_KEY');

    const configs: ApiKeyConfig[] = [];
    if (primaryKey) configs.push({ key: primaryKey, priority: 1, name: 'primary' });
    if (secondaryKey) configs.push({ key: secondaryKey, priority: 2, name: 'secondary' });
    if (fallbackKey) configs.push({ key: fallbackKey, priority: 3, name: 'fallback' });

    return configs;
  } else if (provider === 'openrouter') {
    const openrouterKey = Deno.env.get('OPENROUTER_API_KEY') || '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';

    const configs: ApiKeyConfig[] = [];
    if (openrouterKey) configs.push({ key: openrouterKey, priority: 1, name: 'openrouter' });

    return configs;
  } else {
    // DeepSeek API keys
    const deepseekV3 = Deno.env.get('DEEPSEEK_V3_API_KEY');
    const deepseekMain = Deno.env.get('DEEPSEEK_API_KEY');
    const deepseekFallback = Deno.env.get('deepseek');

    const configs: ApiKeyConfig[] = [];
    if (deepseekV3) configs.push({ key: deepseekV3, priority: 1, name: 'v3' });
    if (deepseekMain) configs.push({ key: deepseekMain, priority: 2, name: 'main' });
    if (deepseekFallback) configs.push({ key: deepseekFallback, priority: 3, name: 'fallback' });

    return configs;
  }
}

function initializeKeyMetrics(key: string): ApiKeyMetrics {
  return {
    failures: 0,
    lastFailureTime: 0,
    averageLatency: 0,
    totalRequests: 0,
    successfulRequests: 0,
    quotaLimitHit: false,
    temporarilyDisabled: false
  };
}

function getKeyMetrics(key: string): ApiKeyMetrics {
  if (!keyMetrics.has(key)) {
    keyMetrics.set(key, initializeKeyMetrics(key));
  }
  return keyMetrics.get(key)!;
}

function updateKeyMetrics(key: string, success: boolean, latency: number, isQuotaError: boolean = false) {
  const metrics = getKeyMetrics(key);
  
  metrics.totalRequests++;
  metrics.averageLatency = (metrics.averageLatency * (metrics.totalRequests - 1) + latency) / metrics.totalRequests;
  
  if (success) {
    metrics.successfulRequests++;
    metrics.failures = 0; // Reset failures on success
    metrics.temporarilyDisabled = false;
  } else {
    metrics.failures++;
    metrics.lastFailureTime = Date.now();
    
    if (isQuotaError) {
      metrics.quotaLimitHit = true;
    }
    
    // Désactiver temporairement après 3 échecs consécutifs
    if (metrics.failures >= 3) {
      metrics.temporarilyDisabled = true;
      metrics.disabledUntil = Date.now() + 60000; // 1 minute
      console.log(`Clé ${key.substring(0, 8)}... temporairement désactivée pour 1 minute`);
    }
  }
  
  keyMetrics.set(key, metrics);
}

function isKeyAvailable(key: string): boolean {
  const metrics = getKeyMetrics(key);
  
  if (metrics.temporarilyDisabled && metrics.disabledUntil) {
    if (Date.now() > metrics.disabledUntil) {
      metrics.temporarilyDisabled = false;
      metrics.disabledUntil = undefined;
      keyMetrics.set(key, metrics);
      return true;
    }
    return false;
  }
  
  return !metrics.temporarilyDisabled;
}

function selectBestApiKey(configs: ApiKeyConfig[]): ApiKeyConfig | null {
  // Filtrer les clés disponibles
  const availableConfigs = configs.filter(config => isKeyAvailable(config.key));
  
  if (availableConfigs.length === 0) {
    console.log('Aucune clé API disponible');
    return null;
  }
  
  // Trier par priorité, puis par performance
  availableConfigs.sort((a, b) => {
    const aMetrics = getKeyMetrics(a.key);
    const bMetrics = getKeyMetrics(b.key);
    
    // D'abord par priorité
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    
    // Ensuite par taux de succès
    const aSuccessRate = aMetrics.totalRequests > 0 ? aMetrics.successfulRequests / aMetrics.totalRequests : 1;
    const bSuccessRate = bMetrics.totalRequests > 0 ? bMetrics.successfulRequests / bMetrics.totalRequests : 1;
    
    if (aSuccessRate !== bSuccessRate) {
      return bSuccessRate - aSuccessRate; // Plus haut taux de succès en premier
    }
    
    // Enfin par latence
    return aMetrics.averageLatency - bMetrics.averageLatency;
  });
  
  return availableConfigs[0];
}

function shouldRetryWithFallback(status: number, error: any): boolean {
  // Retry sur les erreurs de quota, timeout, ou erreurs serveur
  return status === 429 || // Too Many Requests
         status >= 500 ||   // Server errors
         status === 0 ||    // Network timeout
         (error && (
           error.code === 'rate_limit_exceeded' ||
           error.code === 'quota_exceeded' ||
           error.type === 'insufficient_quota'
         ));
}

async function makeApiRequestWithFallback(
  configs: ApiKeyConfig[], 
  apiUrl: string, 
  requestBody: any, 
  provider: string
): Promise<{ response: Response; data: any; usedKey: string; usedKeyName: string }> {
  let lastError: any = null;
  let attemptCount = 0;
  
  // Essayer chaque clé disponible
  for (const config of configs) {
    if (!isKeyAvailable(config.key)) {
      console.log(`Clé ${config.name} temporairement désactivée, passage à la suivante`);
      continue;
    }
    
    attemptCount++;
    const startTime = Date.now();
    
    try {
      console.log(`Tentative ${attemptCount} avec clé ${config.name} (priorité ${config.priority})`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const latency = Date.now() - startTime;
      const data = await response.json();
      
      if (response.ok) {
        updateKeyMetrics(config.key, true, latency);
        console.log(`Succès avec clé ${config.name}, latence: ${latency}ms`);
        return { response, data, usedKey: config.key, usedKeyName: config.name };
      } else {
        const isQuotaError = response.status === 429 || 
                           (data.error && (data.error.code === 'rate_limit_exceeded' || 
                                         data.error.code === 'quota_exceeded'));
        
        updateKeyMetrics(config.key, false, latency, isQuotaError);
        
        console.log(`Échec avec clé ${config.name}, status: ${response.status}, erreur: ${data.error?.message || 'Inconnue'}`);
        
        lastError = data;
        
        // Si ce n'est pas une erreur qui justifie un fallback, arrêter ici
        if (!shouldRetryWithFallback(response.status, data.error)) {
          console.log('Erreur non récupérable, arrêt des tentatives');
          return { response, data, usedKey: config.key, usedKeyName: config.name };
        }
        
        // Continuer avec la clé suivante
        continue;
      }
    } catch (error) {
      const latency = Date.now() - startTime;
      updateKeyMetrics(config.key, false, latency);
      
      console.log(`Erreur réseau avec clé ${config.name}:`, error.message);
      lastError = { error: { message: error.message } };
      
      // Continuer avec la clé suivante en cas d'erreur réseau
      continue;
    }
  }
  
  // Toutes les tentatives ont échoué
  throw new Error(`Toutes les clés API ${provider} ont échoué. Dernière erreur: ${lastError?.error?.message || 'Erreur inconnue'}`);
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Parse the request body
    const body = await req.json()
    const { messages, model = 'gpt-4o-mini', max_tokens = 2000, temperature = 0.7, provider = 'openai' } = body
    
    console.log('Request data:', { provider, model, messages: messages.length, max_tokens, temperature })

    // Obtenir les configurations de clés pour le fournisseur
    const apiKeyConfigs = getApiKeyConfigs(provider);
    
    if (apiKeyConfigs.length === 0) {
      console.error(`Aucune clé API configurée pour ${provider}`);
      return new Response(
        JSON.stringify({ error: `Aucune clé API configurée pour ${provider}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sélectionner la meilleure clé disponible
    const selectedConfig = selectBestApiKey(apiKeyConfigs);
    
    if (!selectedConfig) {
      console.error('Toutes les clés API sont temporairement désactivées');
      return new Response(
        JSON.stringify({ error: 'Toutes les clés API sont temporairement indisponibles. Réessayez dans quelques minutes.' }),
        { 
          status: 503, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let apiUrl: string;
    let requestBody: any;

    if (provider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions';

      // Handle newer models that use max_completion_tokens instead of max_tokens
      const isNewerModel = model.includes('gpt-5') || model.includes('gpt-4.1') || model.includes('o3') || model.includes('o4');
      requestBody = {
        model,
        messages,
        ...(isNewerModel ? { max_completion_tokens: max_tokens } : { max_tokens }),
        ...(isNewerModel ? {} : { temperature }), // Newer models don't support temperature
      };
    } else if (provider === 'openrouter') {
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      requestBody = {
        model,
        messages,
        max_tokens,
        temperature,
      };
    } else {
      apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      requestBody = {
        model: model === 'gpt-4o-mini' ? 'deepseek-chat' : model,
        messages,
        max_tokens,
        temperature,
      };
    }
    
    console.log('Configuration sélectionnée:', { 
      provider, 
      keyName: selectedConfig.name, 
      priority: selectedConfig.priority,
      apiUrl 
    });

    // Faire l'appel API avec fallback automatique
    try {
      const { response, data, usedKeyName } = await makeApiRequestWithFallback(
        apiKeyConfigs.sort((a, b) => a.priority - b.priority), // Trier par priorité
        apiUrl,
        requestBody,
        provider
      );

      if (!response.ok) {
        return new Response(
          JSON.stringify({ error: data.error?.message || `${provider} API error` }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Ajouter des informations sur la clé utilisée dans les headers de réponse (pour debug)
      const responseHeaders = {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Used-Api-Key': usedKeyName,
        'X-Provider': provider
      };

      return new Response(
        JSON.stringify(data),
        { headers: responseHeaders }
      );

    } catch (error) {
      console.error('Erreur lors de l\'appel API avec fallback:', error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Erreur générale:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
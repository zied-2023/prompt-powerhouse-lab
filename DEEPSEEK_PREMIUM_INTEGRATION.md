# Intégration DeepSeek pour le Mode Premium

## Changements Implémentés

### Configuration DeepSeek

Le système utilise maintenant **DeepSeek** comme LLM principal pour les utilisateurs premium au lieu de Mistral.

```typescript
const DEEPSEEK_CONFIG = {
  endpoint: 'https://api.deepseek.com/v1/chat/completions',
  key: 'sk-c77ac1dcfee24d23b1d9a5ebb16ca066',
  model: 'deepseek-chat'
};

const USE_DEEPSEEK_FOR_PREMIUM = true; // ✅ Activé
```

## Logique de Sélection du LLM

### Avant
```
Tous les modes → Mistral (mistral-large-latest)
```

### Après
```
Mode Premium (authentifié + crédits) → DeepSeek (deepseek-chat)
Mode Gratuit/Basic                  → Mistral (mistral-large-latest)
```

## Méthode de Sélection

```typescript
async selectLLM(isAuthenticated: boolean, userHasCredits: boolean): Promise<LLMConfig> {
  // Mode Premium: DeepSeek
  if (USE_DEEPSEEK_FOR_PREMIUM && isAuthenticated && userHasCredits) {
    console.log('🎯 Utilisation de DeepSeek (mode premium)');
    return {
      provider: 'deepseek',
      model: 'deepseek-chat',
      // ...
    };
  }

  // Mode Gratuit/Basic: Mistral
  console.log('🎯 Utilisation de Mistral (mode gratuit/basic)');
  return {
    provider: 'mistral',
    model: 'mistral-large-latest',
    // ...
  };
}
```

## Implémentation API DeepSeek

### Caractéristiques
- **Timeout**: 45 secondes (avec AbortController)
- **Endpoint**: `https://api.deepseek.com/v1/chat/completions`
- **Modèle**: `deepseek-chat`
- **Compatible**: API OpenAI (format chat completions)

### Méthode callDeepSeek()

```typescript
async callDeepSeek(request: LLMRequest): Promise<LLMResponse> {
  console.log('🔗 Appel DeepSeek API...');

  // Timeout de 45 secondes
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

    // Gestion des erreurs et parsing de la réponse
    // ...
  }
}
```

### Gestion d'Erreurs Spécifique

```typescript
// Erreurs de crédits
if (response.status === 402 || response.status === 429) {
  throw new Error('La clé API DeepSeek n\'a plus de crédits...');
}

// Timeout
if (error.name === 'AbortError') {
  throw new Error('Timeout: La requête DeepSeek a pris trop de temps (>45s)');
}
```

## Fallback Strategy

Si une edge function échoue, le système utilise le bon provider en fallback:

```typescript
async callLLM(config: LLMConfig, request: LLMRequest): Promise<LLMResponse> {
  if (config.useEdgeFunction) {
    try {
      return await this.callViaEdgeFunction(config, request);
    } catch (error) {
      // Fallback intelligent
      if (config.provider === 'deepseek') {
        return await this.callDeepSeek(request); // ✅ Premium
      }
      return await this.callMistral(request);     // ✅ Gratuit/Basic
    }
  }
  // ...
}
```

## Avantages de DeepSeek

### Performance
- ✅ **Latence**: Généralement plus rapide que Mistral
- ✅ **Qualité**: Excellente génération de prompts structurés
- ✅ **Coût**: Très compétitif (économique)

### Capacités
- ✅ Support des instructions complexes
- ✅ Génération de prompts longs (jusqu'à 8000 tokens)
- ✅ Bonne compréhension du contexte
- ✅ Format de sortie cohérent

## Logging et Monitoring

### Identification du Provider

Le provider utilisé est toujours loggé:

```typescript
// En console
console.log('🎯 Utilisation de DeepSeek (mode premium)');
console.log('✅ DeepSeek API réponse reçue en 2345ms');

// Dans la réponse
{
  content: "...",
  model: "deepseek-chat",
  provider: "deepseek",  // ✅ Identifiable
  usage: { ... }
}
```

### Temps de Réponse

Tous les appels incluent le logging de latence:

```typescript
const latency = Date.now() - startTime;
console.log(`✅ DeepSeek API réponse reçue en ${latency}ms`);
```

## Tests Recommandés

### Scénarios à Valider

1. **Mode Premium**:
   ```
   ✅ Utilisateur authentifié + crédits > 0
   → Doit utiliser DeepSeek
   → Log: "🎯 Utilisation de DeepSeek (mode premium)"
   ```

2. **Mode Gratuit**:
   ```
   ✅ Utilisateur non authentifié OU crédits = 0
   → Doit utiliser Mistral
   → Log: "🎯 Utilisation de Mistral (mode gratuit/basic)"
   ```

3. **Fallback**:
   ```
   ✅ Edge function échoue en mode premium
   → Doit fallback sur DeepSeek (pas Mistral)
   ```

4. **Erreurs**:
   ```
   ✅ Timeout après 45s
   ✅ Erreur 402/429 (crédits insuffisants)
   ✅ Messages d'erreur clairs
   ```

## Comparaison Avant/Après

### Avant

| Mode | LLM | Modèle |
|------|-----|---------|
| Gratuit | Mistral | mistral-large-latest |
| Basic | Mistral | mistral-large-latest |
| Premium | Mistral | mistral-large-latest |

### Après

| Mode | LLM | Modèle |
|------|-----|---------|
| Gratuit | Mistral | mistral-large-latest |
| Basic | Mistral | mistral-large-latest |
| **Premium** | **DeepSeek** | **deepseek-chat** |

## Points d'Attention

### Quotas API

DeepSeek a des limites de rate limiting:
- Surveillez les erreurs 429
- Implémentez un retry avec backoff si nécessaire

### Monitoring

Suivez ces métriques dans la console:
- Temps de réponse moyen
- Taux d'erreur
- Tokens consommés
- Provider utilisé

### Basculement

Pour revenir à Mistral en cas de problème:

```typescript
// Dans llmRouter.ts
const USE_DEEPSEEK_FOR_PREMIUM = false; // Désactiver DeepSeek
```

## Fichiers Modifiés

- ✅ `src/services/llmRouter.ts`
  - Ajout `DEEPSEEK_CONFIG`
  - Ajout `callDeepSeek()`
  - Modification `selectLLM()`
  - Modification `callLLM()` (fallback)
  - Modification `callDirectly()`

## Vérification en Production

Pour vérifier que DeepSeek est bien utilisé:

1. Ouvrir la console navigateur (F12)
2. Générer un prompt en mode premium
3. Chercher dans les logs:
   ```
   🎯 Utilisation de DeepSeek (mode premium)
   🔗 Appel DeepSeek API...
   ✅ DeepSeek API réponse reçue en XXXms
   ```

## Résumé

✅ **DeepSeek activé** pour tous les utilisateurs premium
✅ **Mistral maintenu** pour les modes gratuit et basic
✅ **Fallback intelligent** selon le mode utilisateur
✅ **Timeout de 45s** avec gestion d'erreur
✅ **Logging complet** pour monitoring

Le système utilise maintenant le meilleur LLM selon le niveau d'abonnement de l'utilisateur!

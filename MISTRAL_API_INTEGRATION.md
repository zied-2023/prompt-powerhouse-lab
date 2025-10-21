# Intégration de l'API Mistral

## Configuration

La clé API Mistral a été ajoutée au fichier `.env`:

```
VITE_MISTRAL_API_KEY=9rLgitb0iaYKdmdRzrkQhuAOBLldeJrj
```

## Architecture

### Routeur LLM (`src/services/llmRouter.ts`)

Le système utilise un routeur intelligent (`llmRouter`) qui:
- Sélectionne automatiquement Mistral comme fournisseur par défaut
- Utilise le modèle `mistral-large-latest`
- Endpoint: `https://api.mistral.ai/v1/chat/completions`

### Configuration Mistral

```typescript
const MISTRAL_CONFIG = {
  endpoint: 'https://api.mistral.ai/v1/chat/completions',
  key: import.meta.env.VITE_MISTRAL_API_KEY,
  model: 'mistral-large-latest'
};
```

## Composants utilisant Mistral

### 1. PromptGeneratorSupabase
- Génération de prompts basée sur des critères
- Utilise `llmRouter.selectLLM()` et `llmRouter.callLLM()`

### 2. PromptImprovementSupabase
- Amélioration de prompts via MetaPromptOptimizer
- Optimisation réflexive via HierarchicalReflectiveOptimizer
- Les deux utilisent le routeur LLM

### 3. MetaPromptOptimizer
- Optimisation meta-cognitive des prompts
- Appelle `llmRouter.selectLLM()` et `llmRouter.callLLM()`

### 4. HierarchicalReflectiveOptimizer
- Optimisation itérative par analyse des échecs
- Appelle `llmRouter.selectLLM()` et `llmRouter.callLLM()`

## Fonctionnalités

### Sélection Automatique
```typescript
async selectLLM(isAuthenticated: boolean, userHasCredits: boolean): Promise<LLMConfig> {
  // Utilise Mistral pour tous les utilisateurs
  return {
    provider: 'mistral',
    model: MISTRAL_CONFIG.model,
    apiKey: MISTRAL_CONFIG.key,
    endpoint: MISTRAL_CONFIG.endpoint,
    useEdgeFunction: false
  };
}
```

### Appel API Mistral
```typescript
async callMistral(request: LLMRequest): Promise<LLMResponse> {
  // Validation de la clé
  if (!MISTRAL_CONFIG.key) {
    throw new Error('Clé API Mistral manquante');
  }

  // Appel avec timeout de 45 secondes
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
    })
  });

  return parsedResponse;
}
```

## Gestion des Erreurs

### Erreurs gérées:
1. **Clé manquante**: Message d'erreur clair
2. **Timeout**: 45 secondes max, message explicite
3. **Crédits épuisés**: Détection du code HTTP 402
4. **Erreurs API**: Parsing et affichage des messages d'erreur

### Exemple de gestion:
```typescript
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));

  if (response.status === 402) {
    throw new Error('La clé API Mistral n\'a plus de crédits disponibles.');
  }

  throw new Error(`Erreur API Mistral: ${response.status} - ${errorData.error?.message}`);
}
```

## Logging et Monitoring

Le système inclut un logging détaillé:
```typescript
console.log('🔗 Appel Mistral API...');
console.log(`✅ Mistral API réponse reçue en ${latency}ms`);
console.log('🎯 Configuration LLM sélectionnée:', llmConfig);
```

## Paramètres de Requête

### Par défaut:
- **Temperature**: 0.7 (équilibre créativité/précision)
- **Max Tokens**: 8000
- **Stream**: false (réponse complète)

### Personnalisables:
```typescript
const response = await llmRouter.callLLM(config, {
  messages: [...],
  temperature: 0.8,  // Personnalisable
  maxTokens: 4000    // Personnalisable
});
```

## Utilisation dans les Composants

### Exemple - Génération de prompt:
```typescript
const isAuthenticated = !!user;
const userHasCredits = (credits?.remaining_credits || 0) > 0;

const llmConfig = await llmRouter.selectLLM(isAuthenticated, userHasCredits);

const response = await llmRouter.callLLM(llmConfig, {
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  temperature: 0.7,
  maxTokens: 8000
});

const generatedPrompt = response.content;
```

## Format de Réponse

```typescript
interface LLMResponse {
  content: string;                    // Contenu généré
  usage: {
    prompt_tokens: number;            // Tokens du prompt
    completion_tokens: number;        // Tokens de la complétion
    total_tokens: number;             // Total
  };
  model: string;                      // Modèle utilisé
  provider: string;                   // Fournisseur (mistral)
}
```

## Modes de Génération

Le système adapte les prompts selon les crédits disponibles:

### Mode Free (≤10 crédits)
- Max 150 tokens
- Structure ultra-concise
- Pas d'exemples

### Mode Basic (11-50 crédits)
- Max 300 tokens
- Structure équilibrée
- Exemples limités

### Mode Premium (>50 crédits)
- Max 600 tokens
- Structure complète
- Méthodologie détaillée

## Avantages de Mistral

1. **Performance**: Réponses rapides (<5s généralement)
2. **Qualité**: Excellent pour la génération en français
3. **Coût**: Économique par rapport aux alternatives
4. **Fiabilité**: API stable et bien documentée
5. **Flexibilité**: Support de différents types de tâches

## Fallback et Résilience

Si Mistral échoue:
- Gestion d'erreur avec messages clairs
- Toast notifications pour l'utilisateur
- Logging détaillé pour le débogage
- Pas de fallback automatique (pour garantir la cohérence)

## Sécurité

- Clé API stockée dans les variables d'environnement
- Pas d'exposition de la clé côté client (sauf dans les headers de requête)
- Validation de la présence de la clé avant chaque appel
- Gestion des erreurs sans exposer la clé

## Notes Importantes

1. **Redémarrage requis**: Après modification du `.env`, redémarrer le serveur de développement
2. **Crédits**: Surveiller la consommation via le dashboard Mistral
3. **Rate Limiting**: Respecter les limites de l'API (géré automatiquement)
4. **Cache**: Pas de cache implémenté, chaque requête est envoyée à l'API

## Test de l'Intégration

Pour tester que Mistral fonctionne:
1. Ouvrir l'application
2. Aller sur la page de génération de prompts
3. Remplir le formulaire
4. Cliquer sur "Générer"
5. Vérifier dans la console: `🎯 Configuration LLM sélectionnée: { provider: 'mistral' }`
6. Vérifier le résultat généré

## Dépannage

### Erreur "Clé API manquante"
- Vérifier que `VITE_MISTRAL_API_KEY` est dans `.env`
- Redémarrer le serveur de développement

### Erreur 402 "Crédits épuisés"
- Vérifier le solde sur le dashboard Mistral
- Recharger des crédits si nécessaire

### Timeout
- Vérifier la connexion internet
- Vérifier que l'API Mistral est accessible

## Prochaines Étapes

- Monitorer l'utilisation des tokens
- Implémenter un cache pour les prompts fréquents
- Ajouter des métriques de performance
- Optimiser les system prompts pour réduire les tokens

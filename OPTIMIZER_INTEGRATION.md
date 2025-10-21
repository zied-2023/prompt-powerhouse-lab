# Intégration des Optimiseurs de Prompts

## Vue d'ensemble

Le système d'amélioration de prompts utilise maintenant deux approches d'optimisation sophistiquées:

1. **MetaPromptOptimizer** - Génération initiale avec approche méta-cognitive
2. **HierarchicalReflectiveOptimizer** - Itérations basées sur l'analyse des échecs

## Architecture

### MetaPromptOptimizer

**Fichier**: `src/services/metaPromptOptimizer.ts`

**Principe**: Utilise une approche méta-cognitive pour analyser et reconstruire les prompts.

**Processus**:
1. Décomposition des composants du prompt (rôle, contexte, tâche, format, contraintes)
2. Analyse des faiblesses (ambiguïtés, manques de clarté, instructions conflictuelles)
3. Restructuration cognitive alignée avec le fonctionnement des LLMs
4. Enrichissement intelligent sans diluer l'objectif principal
5. Validation de la cohérence et de la complétude

**Principes d'optimisation**:
- Clarté > Longueur
- Structure hiérarchique (du général au spécifique)
- Instructions explicites (éviter les sous-entendus)
- Exemples concrets quand nécessaire
- Contraintes mesurables

**Sortie**:
```typescript
{
  optimizedPrompt: string;
  improvements: string[];
  metaReasoning: string;
  qualityScore: number;
  confidence: number;
}
```

### HierarchicalReflectiveOptimizer

**Fichier**: `src/services/hierarchicalReflectiveOptimizer.ts`

**Principe**: Optimisation itérative par analyse hiérarchique des échecs et application de corrections ciblées.

**Processus**:
1. Analyse des échecs (hiérarchisés par sévérité: Critique, Important, Modéré, Mineur)
2. Application de corrections par ordre de priorité
3. Réévaluation et nouvelle itération si nécessaire
4. Convergence vers un score de qualité optimal (≥8.5/10)

**Hiérarchie des échecs**:
- **Critique** (Sévérité 10): Ambiguïtés majeures, instructions contradictoires
- **Important** (Sévérité 7-9): Manque de contexte, format flou
- **Modéré** (Sévérité 4-6): Structure sous-optimale, verbosité
- **Mineur** (Sévérité 1-3): Améliorations cosmétiques

**Sortie**:
```typescript
{
  finalPrompt: string;
  iterations: ReflectiveIteration[];
  totalImprovements: string[];
  convergenceScore: number;
  reflectiveInsights: string;
}
```

## Utilisation

### Interface Utilisateur

Le composant `PromptImprovementSupabase` offre maintenant deux boutons:

1. **Améliorer** (Bouton bleu-violet)
   - Utilise le MetaPromptOptimizer
   - Pour la génération initiale du prompt amélioré
   - Affiche le score de qualité et le niveau de confiance

2. **Optimiser (Réflexif)** (Bouton violet avec bordure)
   - Utilise le HierarchicalReflectiveOptimizer
   - Nécessite d'abord un prompt amélioré par MetaPromptOptimizer
   - Effectue des itérations pour corriger les faiblesses résiduelles
   - Affiche le nombre d'itérations et le score de convergence

### Workflow Recommandé

```
1. Entrer le prompt original
2. (Optionnel) Spécifier l'objectif d'amélioration
3. Cliquer sur "Améliorer" → MetaPromptOptimizer
4. Examiner le résultat
5. Si nécessaire, cliquer sur "Optimiser (Réflexif)" → HierarchicalReflectiveOptimizer
6. Obtenir la version finale optimisée
```

## Badges et Visualisation

- Badge **bleu** = MetaPromptOptimizer utilisé
- Badge **violet** = HierarchicalReflectiveOptimizer utilisé
- Insights affichés en bannière informative

## Intégration avec le Routeur LLM

Les deux optimiseurs utilisent le `llmRouter` pour:
- Sélectionner automatiquement le meilleur modèle LLM
- Gérer les appels API
- Optimiser les coûts selon le contexte (authentification, crédits)

## Décompte des Crédits

- Chaque amélioration via MetaPromptOptimizer coûte 1 crédit
- Chaque optimisation via HierarchicalReflectiveOptimizer coûte 1 crédit
- Les crédits sont décomptés uniquement en cas de succès

## Exemples de Résultats

### MetaPromptOptimizer
```
Score: 8.2/10
Confiance: 90%
Raisonnement: "Restructuration hiérarchique avec ajout de sections RÔLE et FORMAT pour une meilleure clarté"
```

### HierarchicalReflectiveOptimizer
```
3 itération(s) | Score: 9.1/10
Insights: "3 itération(s) réflexive(s) effectuée(s) | Score final: 9.1/10 | 2 problème(s) critique(s) corrigé(s) | Amélioration du score: +0.9 points"
```

## Configuration

Les optimiseurs sont configurables via:

### MetaPromptOptimizer
- `temperature: 0.8` (créativité modérée)
- `maxTokens: 8000`

### HierarchicalReflectiveOptimizer
- `maxIterations: 3`
- `convergenceThreshold: 8.5`
- `temperature: 0.6-0.7` (précision accrue)
- `maxTokens: 4000-8000`

## Notes Techniques

### Parsing des Réponses

Les deux optimiseurs supportent:
- Format JSON structuré (préféré)
- Fallback vers parsing de texte avec regex
- Gestion d'erreur robuste

### Analyse de Qualité

Le score de qualité est calculé selon:
- Clarté du prompt
- Structure hiérarchique
- Spécificité des instructions
- Présence de sections essentielles (RÔLE, CONTEXTE, FORMAT, CONTRAINTES)

### Gestion d'Erreurs

- Try-catch sur tous les appels LLM
- Retour de résultats par défaut en cas d'échec
- Logging détaillé pour le débogage
- Toast notifications pour l'utilisateur

## Avantages

1. **Approche scientifique**: Basée sur la recherche en ingénierie de prompts
2. **Flexibilité**: Deux niveaux d'optimisation selon les besoins
3. **Transparence**: Explications claires du raisonnement appliqué
4. **Itératif**: Amélioration continue jusqu'à convergence
5. **Mesurable**: Scores objectifs de qualité

## Limitations

- Nécessite des crédits pour chaque utilisation
- Dépend de la disponibilité des APIs LLM
- Le temps de traitement augmente avec le nombre d'itérations
- Résultats peuvent varier selon le modèle LLM utilisé

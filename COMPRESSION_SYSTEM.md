# Système de Compression Intelligente des Prompts

## Vue d'ensemble

Le système de compression intelligente optimise automatiquement les prompts générés en fonction du mode utilisateur (gratuit/basic/premium) et de la longueur souhaitée (court/moyen/long/très long), tout en éliminant les répétitions et exemples inutiles.

## Limites de Tokens par Mode et Longueur

### Mode Gratuit
- **Court**: 500 tokens (~375 mots)
- **Moyen**: 1000 tokens (~750 mots)
- **Long**: 1500 tokens (~1125 mots)
- **Très long**: 2000 tokens (~1500 mots)

### Mode Basic
- **Court**: 800 tokens (~600 mots)
- **Moyen**: 1500 tokens (~1125 mots)
- **Long**: 2500 tokens (~1875 mots)
- **Très long**: 3500 tokens (~2625 mots)

### Mode Premium
- **Court**: 1200 tokens (~900 mots)
- **Moyen**: 2500 tokens (~1875 mots)
- **Long**: 4000 tokens (~3000 mots)
- **Très long**: 6000 tokens (~4500 mots)

## Techniques de Compression

### 1. Suppression des Redondances
- Élimine les formules de politesse inutiles
- Supprime les introductions génériques
- Détecte et élimine les répétitions de mots consécutifs

### 2. Élimination des Répétitions
- Analyse les phrases pour détecter les doublons
- Compare les 50 premiers caractères de chaque phrase normalisée
- Garde uniquement les phrases uniques

### 3. Suppression des Exemples Inutiles
Nombre maximum d'exemples selon le mode et la longueur:

#### Mode Gratuit
- Court: 0 exemple
- Moyen: 1 exemple
- Long: 2 exemples
- Très long: 2 exemples

#### Mode Basic
- Court: 1 exemple
- Moyen: 2 exemples
- Long: 3 exemples
- Très long: 3 exemples

#### Mode Premium
- Court: 2 exemples
- Moyen: 3 exemples
- Long: 5 exemples
- Très long: 5 exemples

### 4. Nettoyage des Erreurs Courantes
- Supprime les explications du "pourquoi" trop longues
- Limite les références artistiques/styles (1-3 selon le mode)
- Supprime les emojis en mode gratuit
- Élimine les sections méthodologie/approche séparées
- Garde un seul format (évite les doublons format/livrable)

### 5. Simplification des Explications
Remplace les formulations longues par des versions courtes:
- "en tenant compte de" → "avec"
- "il est important de" → ""
- "c'est-à-dire" → ":"
- "par exemple" → "ex:"
- "afin de" → "pour"
- etc.

### 6. Conversion en Mots-clés
- Transforme les listes détaillées en format compact
- Supprime les mots de liaison inutiles (qui, que, dont, où)
- Optimise l'espacement

### 7. Compression Agressive (si nécessaire)
Si les techniques précédentes ne suffisent pas:
- Garde uniquement les titres de sections
- Conserve les points d'action directs
- Privilégie les éléments numérotés
- Coupe au maximum de tokens autorisé

## Utilisation dans le Code

```typescript
import { PromptCompressor, PromptLength } from '@/lib/promptCompressor';

// Mapper la longueur du formulaire
const promptLength = PromptCompressor.mapLengthFromForm(formData.length);

// Mode gratuit
const result = PromptCompressor.compressFree(prompt, promptLength);
console.log(result.compressed);
console.log(`Tokens: ${result.estimatedTokens}`);
console.log(`Compression: ${result.compressionRate}%`);
console.log(`Techniques: ${result.techniques.join(', ')}`);

// Mode basic
const result = PromptCompressor.compressBasic(prompt, promptLength);

// Mode premium
const optimized = PromptCompressor.formatPremium(prompt, promptLength);
```

## Résultat de la Compression

L'objet `CompressionResult` contient:
- `compressed`: Le prompt compressé
- `originalLength`: Longueur originale en caractères
- `compressedLength`: Longueur compressée en caractères
- `compressionRate`: Taux de compression en %
- `estimatedTokens`: Estimation des tokens utilisés
- `techniques`: Liste des techniques appliquées

## Avantages

1. **Pas de troncature**: Les prompts sont complets et cohérents
2. **Qualité préservée**: Le sens et la structure sont maintenus
3. **Adaptabilité**: S'ajuste automatiquement selon le mode et la longueur
4. **Efficacité**: Élimine uniquement ce qui est redondant ou inutile
5. **Transparence**: Log des techniques utilisées pour debug

## Exemples de Compression

### Avant (Mode Gratuit, Court)
```
Bonjour, je voudrais que vous créez un prompt. Expert en marketing digital,
vous devez créer une campagne publicitaire. Vous devez créer une campagne
publicitaire innovante. Par exemple, vous pourriez utiliser les réseaux sociaux.
Par exemple, Facebook est une excellente plateforme. Par exemple, Instagram
aussi. Ceci permet d'atteindre un large public. Afin de maximiser l'impact...
```

### Après (Mode Gratuit, Court)
```
Expert marketing digital. Campagne publicitaire innovante.
• Réseaux sociaux: Facebook, Instagram
• Maximiser impact
Format: Brief structuré actionnable
```

## Notes Importantes

- L'estimation des tokens (1 token ≈ 4 caractères) est approximative
- Les techniques de compression sont appliquées dans un ordre précis
- La compression agressive n'est utilisée qu'en dernier recours
- Le mode premium permet plus d'exemples et de détails

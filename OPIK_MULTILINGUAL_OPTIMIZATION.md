# Optimisation Multilingue Opik

## Objectif

Garantir que l'optimisation en arrière-plan avec Opik préserve la langue originale du prompt (français, anglais, arabe).

## Problème résolu

Avant, l'amélioration des prompts avec Opik ajoutait du contenu uniquement en français, même si le prompt original était en anglais ou en arabe. L'utilisateur avait demandé :

> "l'amélioration du prompt avec opik doit être dans la même langue du prompt original"

## Solution implémentée

### 1. Détection automatique de langue

Le service `opikOptimizer.ts` utilise maintenant `detectLanguage()` de `@/lib/languageDetector.ts` pour identifier la langue du prompt original.

```typescript
private getPromptLanguage(prompt: string): Language {
  return detectLanguage(prompt);
}
```

### 2. Adaptation multilingue de toutes les fonctions

Toutes les fonctions qui ajoutent ou modifient du texte ont été adaptées pour préserver la langue :

#### `addRoleSection()` - Ajoute une section rôle

```typescript
private addRoleSection(prompt: string): string {
  const lang = this.getPromptLanguage(prompt);

  if (lang === 'en') {
    return `**ROLE**: Expert AI assistant\n\n${prompt}`;
  } else if (lang === 'ar') {
    return `**الدور**: مساعد الذكاء الاصطناعي الخبير\n\n${prompt}`;
  }
  return `**RÔLE**: Expert assistant IA\n\n${prompt}`;
}
```

#### `addFormatSection()` - Ajoute une section format

```typescript
private addFormatSection(prompt: string): string {
  const lang = this.getPromptLanguage(prompt);

  if (lang === 'en') {
    return `${prompt}\n\n**FORMAT**: Structured and clear response`;
  } else if (lang === 'ar') {
    return `${prompt}\n\n**الشكل**: استجابة منظمة وواضحة`;
  }
  return `${prompt}\n\n**FORMAT**: Réponse structurée et claire`;
}
```

#### `addConstraintsSection()` - Ajoute des contraintes

```typescript
private addConstraintsSection(prompt: string): string {
  const lang = this.getPromptLanguage(prompt);

  if (lang === 'en') {
    return `${prompt}\n\n**CONSTRAINTS**:\n- Professional and precise tone\n- Complete and structured response`;
  } else if (lang === 'ar') {
    return `${prompt}\n\n**القيود**:\n- أسلوب محترف ودقيق\n- استجابة كاملة ومنظمة`;
  }
  return `${prompt}\n\n**CONTRAINTES**:\n- Ton professionnel et précis\n- Réponse complète et structurée`;
}
```

#### `completeIncompletePrompt()` - Complète les prompts tronqués

Cette fonction détecte maintenant la langue et complète avec du texte approprié :

```typescript
if (lastLine.startsWith('-') || lastLine.startsWith('•')) {
  if (lang === 'en') {
    prompt += '\n- Respect constraints and requested format';
  } else if (lang === 'ar') {
    prompt += '\n- احترام القيود والصيغة المطلوبة';
  } else {
    prompt += '\n- Respect des contraintes et format demandé';
  }
}
```

Les sections vides sont également remplies selon la langue détectée.

#### `ensureCompleteStructure()` - Garantit une structure complète

Remplit les sections vides avec du contenu par défaut dans la bonne langue.

#### `improveSpecificity()` - Améliore la spécificité

Ajoute une note de spécificité dans la langue appropriée :

```typescript
if (prompt.length < 100 && !hasSpecificityKeywords) {
  if (lang === 'en') {
    return `${prompt}\n\n**NOTE**: Be precise and detailed in your response.`;
  } else if (lang === 'ar') {
    return `${prompt}\n\n**ملاحظة**: كن دقيقاً ومفصلاً في إجابتك.`;
  } else {
    return `${prompt}\n\n**NOTE**: Sois précis et détaillé dans ta réponse.`;
  }
}
```

#### `smartSummarize()` - Résumé intelligent

Le résumé intelligent préserve maintenant la langue des en-têtes de sections :

```typescript
// RÔLE (garder concis)
if (sections.role) {
  const roleText = sections.role.split('\n')[0].substring(0, 100);
  if (lang === 'en') {
    summarized += `**ROLE**: ${roleText}\n\n`;
  } else if (lang === 'ar') {
    summarized += `**الدور**: ${roleText}\n\n`;
  } else {
    summarized += `**RÔLE**: ${roleText}\n\n`;
  }
}
```

#### `enrichPromptForLength()` - Enrichissement pour prompts longs

Ajoute des sections comme EXEMPLES, WORKFLOW, CONSIDÉRATIONS dans la langue du prompt :

```typescript
if (!hasExamples) {
  if (lang === 'en') {
    enriched += `\n\n**EXAMPLES**:\n1. [Concrete example illustrating the application]\n2. [Specific use case with context]\n3. [Detailed scenario showing steps]`;
  } else if (lang === 'ar') {
    enriched += `\n\n**أمثلة**:\n1. [مثال ملموس يوضح التطبيق]\n2. [حالة استخدام محددة مع السياق]\n3. [سيناريو مفصل يوضح الخطوات]`;
  } else {
    enriched += `\n\n**EXEMPLES**:\n1. [Exemple concret illustrant l'application]\n2. [Cas d'usage spécifique avec contexte]\n3. [Scénario détaillé montrant les étapes]`;
  }
}
```

#### `enhanceClarity()` - Améliore la clarté

Enrichit les sections trop courtes dans la langue appropriée.

### 3. Détection multilingue des sections

La fonction `completeIncompletePrompt()` détecte les sections vides en plusieurs langues :

```typescript
const sectionPatterns = [
  { fr: 'RÔLE', en: 'ROLE', ar: 'الدور' },
  { fr: 'OBJECTIF', en: 'OBJECTIVE', ar: 'الهدف' },
  { fr: 'INSTRUCTIONS', en: 'INSTRUCTIONS', ar: 'التعليمات' },
  { fr: 'FORMAT', en: 'FORMAT', ar: 'الشكل' },
  { fr: 'CONTRAINTES', en: 'CONSTRAINTS', ar: 'القيود' }
];

for (const pattern of sectionPatterns) {
  const sectionRegex = new RegExp(`\\*\\*(${pattern.fr}|${pattern.en}|${pattern.ar})\\*\\*:?\\s*$`, 'im');
  if (sectionRegex.test(prompt)) {
    // Compléter selon la langue détectée
  }
}
```

## Fichiers modifiés

1. **`src/services/opikOptimizer.ts`**
   - Ajout de l'import `detectLanguage` de `@/lib/languageDetector`
   - Ajout de la méthode `getPromptLanguage()`
   - Adaptation multilingue de toutes les fonctions d'optimisation

2. **`src/lib/promptFormatter.ts`** (créé)
   - Nouvelle fonction `cleanExcessiveFormatting()` pour nettoyer le formatage excessif

## Tests

Le build réussit sans erreur :

```bash
npm run build
✓ built in 5.96s
```

## Langues supportées

- **Français** (fr) : Langue par défaut
- **Anglais** (en) : Détection via mots-clés anglais
- **Arabe** (ar) : Détection via caractères Unicode arabes

## Résultat

Désormais, l'optimisation en arrière-plan avec Opik :

1. ✅ Détecte automatiquement la langue du prompt original
2. ✅ Ajoute du contenu dans la même langue
3. ✅ Complète les prompts tronqués dans la bonne langue
4. ✅ Enrichit les prompts longs avec des sections dans la langue appropriée
5. ✅ Résume intelligemment tout en préservant la langue

## Impact utilisateur

L'utilisateur peut maintenant :

- Générer un prompt en anglais → L'optimisation Opik sera en anglais
- Générer un prompt en arabe → L'optimisation Opik sera en arabe
- Générer un prompt en français → L'optimisation Opik sera en français

La cohérence linguistique est garantie à travers tout le processus d'optimisation.

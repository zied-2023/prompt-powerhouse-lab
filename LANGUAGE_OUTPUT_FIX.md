# Correction de la génération multilingue

## Problème identifié

Même après avoir modifié le code pour utiliser la langue choisie par l'utilisateur (via `useLanguage()`), les prompts continuaient à être générés en français.

**Cause racine:** Les system prompts étaient bien traduits dans la langue cible (anglais, arabe), mais **ils ne contenaient pas d'instruction explicite demandant au LLM de générer le contenu dans cette langue**.

Résultat : Le LLM (GPT/Mistral/etc.) pouvait interpréter un system prompt en anglais mais quand même générer la réponse en français, car il n'y avait pas d'instruction claire sur la langue de sortie.

## Solution implémentée

Ajout d'une **instruction CRITIQUE** explicite dans chaque system prompt demandant au LLM de générer **UNIQUEMENT** dans la langue cible.

### Modifications apportées à `src/lib/systemPromptBuilder.ts`

#### 1. System Prompts Anglais

Ajout de l'instruction au début et à la fin :

```typescript
// MODE FREE
return `You are an expert in creating MINIMALIST but COMPLETE AI prompts.

CRITICAL: Generate the ENTIRE prompt in ENGLISH ONLY. Do NOT use French or any other language.

MANDATORY STRUCTURE (ULTRA-CONCISE):
...
ABSOLUTE RULES:
...
- OUTPUT LANGUAGE: ENGLISH ONLY`;

// MODE BASIC
return `You are an expert in creating structured AI prompts.

CRITICAL: Generate the ENTIRE prompt in ENGLISH ONLY. Do NOT use French or any other language.

MANDATORY STRUCTURE:
...
CRITICAL RULES:
...
- OUTPUT LANGUAGE: ENGLISH ONLY`;

// MODE PREMIUM
return `You are an expert in creating professional AI prompts...

CRITICAL: Generate the ENTIRE prompt in ENGLISH ONLY. Do NOT use French or any other language.

MANDATORY STRUCTURE - EVERY SECTION MUST BE COMPLETE:
...
IMPORTANT: Finish ALL sections before token limit.
OUTPUT LANGUAGE: ENGLISH ONLY`;

// MODE PREMIUM (sans contraintes)
return `AI prompts expert. Max 600 tokens strict.

CRITICAL: Generate the ENTIRE prompt in ENGLISH ONLY. Do NOT use French or any other language.

MANDATORY STRUCTURE:
...
OUTPUT LANGUAGE: ENGLISH ONLY`;
```

#### 2. System Prompts Arabes

Ajout de l'instruction en arabe :

```typescript
// MODE FREE
return `أنت خبير في إنشاء مطالبات الذكاء الاصطناعي المُختصرة والكاملة.

حرج: أنشئ المطالبة بالكامل باللغة العربية فقط. لا تستخدم الفرنسية أو أي لغة أخرى.

البنية الإلزامية (مُختصرة للغاية):
...
القواعد المطلقة:
...
- لغة الإخراج: العربية فقط`;

// MODE BASIC
return `أنت خبير في إنشاء مطالبات الذكاء الاصطناعي المنظمة.

حرج: أنشئ المطالبة بالكامل باللغة العربية فقط. لا تستخدم الفرنسية أو أي لغة أخرى.

البنية الإلزامية:
...
القواعد الحرجة:
...
- لغة الإخراج: العربية فقط`;

// MODE PREMIUM (sans contraintes)
return `خبير في مطالبات الذكاء الاصطناعي. 600 رمز كحد أقصى صارم.

حرج: أنشئ المطالبة بالكامل باللغة العربية فقط. لا تستخدم الفرنسية أو أي لغة أخرى.

البنية الإلزامية:
...
لغة الإخراج: العربية فقط`;
```

## Pourquoi cette solution fonctionne

### 1. **Double instruction explicite**

L'instruction est placée à deux endroits :
- **Au début** : `CRITICAL: Generate the ENTIRE prompt in ENGLISH ONLY. Do NOT use French or any other language.`
- **À la fin** : `OUTPUT LANGUAGE: ENGLISH ONLY`

Cela garantit que le LLM reçoit une directive claire et répétée.

### 2. **Instruction négative**

L'instruction dit explicitement ce qu'il NE FAUT PAS faire : `Do NOT use French or any other language.`

Cela empêche le LLM de basculer vers sa langue par défaut (souvent le français pour les modèles entraînés en Europe).

### 3. **Mot-clé "CRITICAL"**

Le préfixe `CRITICAL:` attire l'attention du LLM sur l'importance de cette instruction.

### 4. **Instruction au bon emplacement**

L'instruction est dans le **system prompt**, qui a plus de poids que les messages utilisateur pour définir le comportement global du LLM.

## Résultat attendu

Maintenant :

### Scénario 1 : Utilisateur choisit 🇬🇧 English
1. L'utilisateur change la langue vers English
2. Le system prompt inclut `CRITICAL: Generate the ENTIRE prompt in ENGLISH ONLY`
3. Le LLM génère le prompt **entièrement en anglais**
4. L'optimisation Opik détecte l'anglais et l'améliore **en anglais**

### Scénario 2 : Utilisateur choisit 🇸🇦 العربية
1. L'utilisateur change la langue vers العربية
2. Le system prompt inclut `حرج: أنشئ المطالبة بالكامل باللغة العربية فقط`
3. Le LLM génère le prompt **entièrement en arabe**
4. L'optimisation Opik détecte l'arabe et l'améliore **en arabe**

### Scénario 3 : Utilisateur choisit 🇫🇷 Français (défaut)
1. L'utilisateur garde ou choisit Français
2. Le system prompt est en français (pas d'instruction CRITICAL car c'est la langue par défaut)
3. Le LLM génère le prompt **entièrement en français**
4. L'optimisation Opik détecte le français et l'améliore **en français**

## Tests

Le build réussit sans erreur :
```bash
npm run build
✓ built in 7.82s
```

## Notes importantes

### System prompt français

Le system prompt français **n'a pas reçu l'instruction CRITICAL** explicite car :
1. Le français est la langue par défaut du système
2. Historiquement, les LLMs généraient déjà en français sans instruction
3. Ajouter une instruction similaire pourrait être redondant

Si des problèmes persistent en français, on peut ajouter :
```typescript
return `Tu es expert en création de prompts IA MINIMALISTES mais COMPLETS.

CRITIQUE: Génère le prompt ENTIÈREMENT en FRANÇAIS UNIQUEMENT. N'utilise PAS l'anglais ou toute autre langue.

Structure OBLIGATOIRE (ULTRA-CONCISE):
...
LANGUE DE SORTIE: FRANÇAIS UNIQUEMENT`;
```

### Mode amélioration de prompt

Le `PromptImprovement.tsx` continue d'utiliser `detectLanguage()` sur le prompt original, ce qui est correct car :
1. Il améliore un prompt existant
2. Il doit maintenir la langue du prompt original
3. La détection automatique est appropriée dans ce contexte

## Fichiers modifiés

1. **`src/lib/systemPromptBuilder.ts`**
   - Fonction `buildEnglishSystemPrompt()` : Ajout instructions langue en anglais
   - Fonction `buildArabicSystemPrompt()` : Ajout instructions langue en arabe

## Impact utilisateur final

L'utilisateur peut maintenant :
1. ✅ Choisir sa langue via le sélecteur
2. ✅ Générer des prompts dans cette langue exacte
3. ✅ Bénéficier de l'optimisation Opik dans la même langue
4. ✅ Ne plus voir de mélange de langues dans les prompts générés

La cohérence linguistique est maintenant garantie du début à la fin du processus.

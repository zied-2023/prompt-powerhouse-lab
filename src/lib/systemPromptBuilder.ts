/**
 * Construction de system prompts multilingues pour la génération de prompts
 */

type Language = 'fr' | 'en' | 'ar';
type Mode = 'free' | 'basic' | 'premium';

interface LengthConstraints {
  words: string;
  tokens: number;
  description: string;
}

/**
 * Construit le system prompt selon la langue, le mode et les contraintes
 */
export function buildSystemPrompt(
  language: Language,
  mode: Mode,
  lengthConstraints?: LengthConstraints | null
): string {
  if (language === 'fr') {
    return buildFrenchSystemPrompt(mode, lengthConstraints);
  } else if (language === 'en') {
    return buildEnglishSystemPrompt(mode, lengthConstraints);
  } else if (language === 'ar') {
    return buildArabicSystemPrompt(mode, lengthConstraints);
  }

  // Fallback anglais
  return buildEnglishSystemPrompt(mode, lengthConstraints);
}

/**
 * System prompt français
 */
function buildFrenchSystemPrompt(
  mode: Mode,
  lengthConstraints?: LengthConstraints | null
): string {
  if (mode === 'free') {
    return `Tu es expert en création de prompts IA MINIMALISTES mais COMPLETS.

Structure OBLIGATOIRE (ULTRA-CONCISE):
**RÔLE**: [1 phrase - rôle spécialisé]
**OBJECTIF**: [1 phrase - résultat mesurable]
**INSTRUCTIONS**:
- [3 points max - actions directes]

RÈGLES ABSOLUES:
- ZÉRO exemple (supprimé automatiquement)
- ZÉRO explication longue (max 2 phrases par section)
- MAX 3 éléments par liste
- Priorité COMPLÉTUDE sur longueur
- TOUT doit se terminer par une ponctuation
- Si manque d'espace: RÉDUIRE mais FINIR toutes les sections`;
  } else if (mode === 'basic') {
    return `Tu es expert en création de prompts IA structurés.

Structure OBLIGATOIRE:
**RÔLE**: [Expert type]
**OBJECTIF**: [Précis, mesurable]
**INSTRUCTIONS**:
- [Points clés directs]
**FORMAT**: [Type sortie]
**CONTRAINTES**: [Limites et style]

RÈGLES CRITIQUES:
- IMPÉRATIF: Tu DOIS terminer COMPLÈTEMENT le prompt
- JAMAIS de texte tronqué ou incomplet
- Toutes les sections finies avec ponctuation
- 250-350 mots maximum
- Privilégie COMPLET sur LONG`;
  } else if (lengthConstraints) {
    return `Tu es un expert en création de prompts IA professionnels. Crée un prompt COMPLET et structuré.

Structure OBLIGATOIRE - CHAQUE SECTION DOIT ÊTRE COMPLÈTE:

# RÔLE
[Expert spécialisé - ${lengthConstraints.words.includes('800-1500') ? '2-3' : '1-2'} phrases complètes]

# CONTEXTE
[Situation et enjeux - ${lengthConstraints.words.includes('800-1500') ? '3-4' : lengthConstraints.words.includes('400-700') ? '2-3' : '2'} phrases complètes]

# OBJECTIF
[Objectif mesurable avec critères précis]

# INSTRUCTIONS
${lengthConstraints.words.includes('800-1500') ? '1-8. [6-8 étapes détaillées]' : lengthConstraints.words.includes('400-700') ? '1-6. [4-6 étapes]' : '1-5. [3-5 étapes]'}

# FORMAT DE SORTIE
[Description du format attendu]
${lengthConstraints.words.includes('800-1500') || lengthConstraints.words.includes('400-700') ? '[Si tableau nécessaire: inclure 2-3 lignes de données]' : ''}

# CONTRAINTES
• Longueur: ${lengthConstraints.words}
• [2-3 autres contraintes précises]

${lengthConstraints.words.includes('400-700') || lengthConstraints.words.includes('800-1500') ? '# EXEMPLE\n[1 exemple concret illustrant le format]' : ''}

IMPORTANT: Termine TOUTES les sections avant la limite de tokens.`;
  } else {
    return `Expert prompts IA. Max 600 tokens strict.

Structure OBLIGATOIRE:
**RÔLE**: [Expert spécialisé]
**OBJECTIF**: [Précis et mesurable]
**INSTRUCTIONS**:
- [Étapes avec méthodologie intégrée]
**ÉLÉMENTS REQUIS**: [2-3 éléments clés]
**LIVRABLE**: [Format structuré]

Max 3 styles. ZÉRO exemple long. ZÉRO section méthodologie séparée. Instructions ultra-directes sans justification.`;
  }
}

/**
 * System prompt anglais
 */
function buildEnglishSystemPrompt(
  mode: Mode,
  lengthConstraints?: LengthConstraints | null
): string {
  if (mode === 'free') {
    return `You are an expert in creating MINIMALIST but COMPLETE AI prompts.

MANDATORY STRUCTURE (ULTRA-CONCISE):
**ROLE**: [1 sentence - specialized role]
**OBJECTIVE**: [1 sentence - measurable result]
**INSTRUCTIONS**:
- [Max 3 points - direct actions]

ABSOLUTE RULES:
- ZERO examples (automatically removed)
- ZERO long explanations (max 2 sentences per section)
- MAX 3 items per list
- Priority: COMPLETENESS over length
- EVERYTHING must end with punctuation
- If space limited: REDUCE but FINISH all sections`;
  } else if (mode === 'basic') {
    return `You are an expert in creating structured AI prompts.

MANDATORY STRUCTURE:
**ROLE**: [Expert type]
**OBJECTIVE**: [Precise, measurable]
**INSTRUCTIONS**:
- [Direct key points]
**FORMAT**: [Output type]
**CONSTRAINTS**: [Limits and style]

CRITICAL RULES:
- IMPERATIVE: You MUST COMPLETELY finish the prompt
- NEVER truncated or incomplete text
- All sections finished with punctuation
- 250-350 words maximum
- Favor COMPLETE over LONG`;
  } else if (lengthConstraints) {
    return `You are an expert in creating professional AI prompts. Create a COMPLETE and structured prompt.

MANDATORY STRUCTURE - EVERY SECTION MUST BE COMPLETE:

# ROLE
[Specialized expert - ${lengthConstraints.words.includes('800-1500') ? '2-3' : '1-2'} complete sentences]

# CONTEXT
[Situation and stakes - ${lengthConstraints.words.includes('800-1500') ? '3-4' : lengthConstraints.words.includes('400-700') ? '2-3' : '2'} complete sentences]

# OBJECTIVE
[Measurable objective with precise criteria]

# INSTRUCTIONS
${lengthConstraints.words.includes('800-1500') ? '1-8. [6-8 detailed steps]' : lengthConstraints.words.includes('400-700') ? '1-6. [4-6 steps]' : '1-5. [3-5 steps]'}

# OUTPUT FORMAT
[Description of expected format]
${lengthConstraints.words.includes('800-1500') || lengthConstraints.words.includes('400-700') ? '[If table needed: include 2-3 data rows]' : ''}

# CONSTRAINTS
• Length: ${lengthConstraints.words}
• [2-3 other precise constraints]

${lengthConstraints.words.includes('400-700') || lengthConstraints.words.includes('800-1500') ? '# EXAMPLE\n[1 concrete example illustrating the format]' : ''}

IMPORTANT: Finish ALL sections before token limit.`;
  } else {
    return `AI prompts expert. Max 600 tokens strict.

MANDATORY STRUCTURE:
**ROLE**: [Specialized expert]
**OBJECTIVE**: [Precise and measurable]
**INSTRUCTIONS**:
- [Steps with integrated methodology]
**REQUIRED ELEMENTS**: [2-3 key elements]
**DELIVERABLE**: [Structured format]

Max 3 styles. ZERO long examples. ZERO separate methodology section. Ultra-direct instructions without justification.`;
  }
}

/**
 * System prompt arabe
 */
function buildArabicSystemPrompt(
  mode: Mode,
  lengthConstraints?: LengthConstraints | null
): string {
  if (mode === 'free') {
    return `أنت خبير في إنشاء مطالبات الذكاء الاصطناعي المُختصرة والكاملة.

البنية الإلزامية (مُختصرة للغاية):
**الدور**: [جملة واحدة - دور متخصص]
**الهدف**: [جملة واحدة - نتيجة قابلة للقياس]
**التعليمات**:
- [3 نقاط كحد أقصى - إجراءات مباشرة]

القواعد المطلقة:
- صفر أمثلة (يتم حذفها تلقائيًا)
- صفر شروحات طويلة (جملتان كحد أقصى لكل قسم)
- 3 عناصر كحد أقصى لكل قائمة
- الأولوية: الاكتمال على الطول
- يجب أن ينتهي كل شيء بعلامة ترقيم
- إذا كانت المساحة محدودة: اختصر لكن أكمل جميع الأقسام`;
  } else if (mode === 'basic') {
    return `أنت خبير في إنشاء مطالبات الذكاء الاصطناعي المنظمة.

البنية الإلزامية:
**الدور**: [نوع الخبير]
**الهدف**: [دقيق، قابل للقياس]
**التعليمات**:
- [نقاط رئيسية مباشرة]
**الشكل**: [نوع الإخراج]
**القيود**: [الحدود والأسلوب]

القواعد الحرجة:
- إلزامي: يجب عليك إكمال المطالبة بالكامل
- لا نصوص مبتورة أو غير مكتملة أبدًا
- جميع الأقسام منتهية بعلامات الترقيم
- 250-350 كلمة كحد أقصى
- فضّل الكامل على الطويل`;
  } else {
    return `خبير في مطالبات الذكاء الاصطناعي. 600 رمز كحد أقصى صارم.

البنية الإلزامية:
**الدور**: [خبير متخصص]
**الهدف**: [دقيق وقابل للقياس]
**التعليمات**:
- [خطوات مع منهجية متكاملة]
**العناصر المطلوبة**: [2-3 عناصر رئيسية]
**التسليم**: [شكل منظم]

3 أنماط كحد أقصى. صفر أمثلة طويلة. صفر قسم منهجية منفصل. تعليمات مباشرة للغاية بدون تبرير.`;
  }
}

/**
 * Construit le user prompt selon la langue
 */
export function buildUserPrompt(
  language: Language,
  data: {
    categoryLabel: string;
    subcategoryLabel?: string;
    description: string;
    objective?: string;
    targetAudience?: string;
    format?: string;
    tone?: string;
    length?: string;
  }
): string {
  if (language === 'fr') {
    let prompt = `Crée un prompt expert pour:
- Domaine: ${data.categoryLabel}`;
    if (data.subcategoryLabel) prompt += `\n- Spécialisation: ${data.subcategoryLabel}`;
    prompt += `\n- Description: ${data.description}`;
    if (data.objective) prompt += `\n- Objectif: ${data.objective}`;
    if (data.targetAudience) prompt += `\n- Public cible: ${data.targetAudience}`;
    if (data.format) prompt += `\n- Format souhaité: ${data.format}`;
    if (data.tone) prompt += `\n- Ton: ${data.tone}`;
    if (data.length) prompt += `\n- Longueur: ${data.length}`;
    return prompt;
  } else if (language === 'en') {
    let prompt = `Create an expert prompt for:
- Domain: ${data.categoryLabel}`;
    if (data.subcategoryLabel) prompt += `\n- Specialization: ${data.subcategoryLabel}`;
    prompt += `\n- Description: ${data.description}`;
    if (data.objective) prompt += `\n- Objective: ${data.objective}`;
    if (data.targetAudience) prompt += `\n- Target audience: ${data.targetAudience}`;
    if (data.format) prompt += `\n- Desired format: ${data.format}`;
    if (data.tone) prompt += `\n- Tone: ${data.tone}`;
    if (data.length) prompt += `\n- Length: ${data.length}`;
    return prompt;
  } else if (language === 'ar') {
    let prompt = `أنشئ مطالبة خبيرة لـ:
- المجال: ${data.categoryLabel}`;
    if (data.subcategoryLabel) prompt += `\n- التخصص: ${data.subcategoryLabel}`;
    prompt += `\n- الوصف: ${data.description}`;
    if (data.objective) prompt += `\n- الهدف: ${data.objective}`;
    if (data.targetAudience) prompt += `\n- الجمهور المستهدف: ${data.targetAudience}`;
    if (data.format) prompt += `\n- الشكل المطلوب: ${data.format}`;
    if (data.tone) prompt += `\n- الأسلوب: ${data.tone}`;
    if (data.length) prompt += `\n- الطول: ${data.length}`;
    return prompt;
  }

  // Fallback anglais
  return buildUserPrompt('en', data);
}

/**
 * Construit le system prompt pour l'amélioration de prompts
 */
export function buildImprovementSystemPrompt(
  language: Language,
  mode: Mode
): string {
  if (language === 'fr') {
    return buildFrenchImprovementPrompt(mode);
  } else if (language === 'en') {
    return buildEnglishImprovementPrompt(mode);
  } else if (language === 'ar') {
    return buildArabicImprovementPrompt(mode);
  }

  return buildEnglishImprovementPrompt(mode);
}

function buildFrenchImprovementPrompt(mode: Mode): string {
  if (mode === 'premium') {
    return `Tu es un expert en ingénierie de prompt. Améliore le prompt en appliquant ces CRITÈRES D'OPTIMISATION:

CRITÈRES D'ANALYSE ET OPTIMISATION:
1. CATÉGORIE/DOMAINE: Identifier et renforcer le domaine d'expertise
2. DESCRIPTION DE LA TÂCHE: Clarifier et préciser la tâche exacte
3. OBJECTIF PRINCIPAL: Définir un objectif mesurable et concret
4. PUBLIC CIBLE: Adapter le niveau de langage et les attentes
5. FORMAT DE SORTIE: Spécifier structure exacte (JSON, tableau, texte, etc.)
6. TON ET STYLE: Définir registre de langue et personnalité
7. LONGUEUR APPROXIMATIVE: Indiquer contrainte de taille (mots, tokens, durée)

Structure OBLIGATOIRE du prompt amélioré - CHAQUE SECTION COMPLÈTE:

# CONTEXTE & OBJECTIF
[2-3 phrases: domaine, tâche, objectif mesurable]

# RÔLE DE L'IA
[2 phrases: expertise, personnalité adaptée au public cible]

# STRUCTURE DU LIVRABLE
[Format exact détaillé avec sections/tableaux si nécessaire]

# CONTRAINTES
• Longueur: [nombre précis]
• Ton: [registre précis]
• Style: [caractéristiques]
• Public: [niveau et attentes]

# EXEMPLE DE SORTIE
[Exemple concret - minimum 3 lignes]

---

# AMÉLIORATIONS APPORTÉES
• Catégorie/Domaine: [amélioration]
• Description/Tâche: [amélioration]
• Objectif: [amélioration]
• Public cible: [amélioration]
• Format: [amélioration]
• Ton/Style: [amélioration]
• Longueur: [amélioration]

IMPORTANT:
- Applique TOUS les 7 critères
- Termine TOUTES les sections
- NE PAS ajouter d'introduction
- Retourne UNIQUEMENT le prompt amélioré`;
  } else {
    return `Tu es un expert en ingénierie de prompt. Améliore le prompt selon ces critères:

CRITÈRES D'OPTIMISATION:
1. CATÉGORIE: Renforcer le domaine
2. DESCRIPTION: Clarifier la tâche
3. OBJECTIF: Définir objectif mesurable
4. PUBLIC: Adapter niveau
5. FORMAT: Préciser structure
6. TON: Définir registre
7. LONGUEUR: Indiquer contrainte

Structure OBLIGATOIRE:
🎯 **CONTEXTE & OBJECTIF**
[Domaine + Tâche + Objectif]

🧑‍💻 **RÔLE DE L'IA**
[Expertise + Personnalité]

🗂 **STRUCTURE DU LIVRABLE**
[Format exact]

⚙️ **CONTRAINTES**
• Longueur: [nombre]
• Ton: [registre]
• Public: [niveau]

📝 **AMÉLIORATIONS**
[Liste des améliorations apportées]

RÈGLES:
- Applique les 7 critères
- Sois concis mais complet
- Retourne uniquement le prompt`;
  }
}

function buildEnglishImprovementPrompt(mode: Mode): string {
  if (mode === 'premium') {
    return `You are a prompt engineering expert. Improve the prompt by applying these OPTIMIZATION CRITERIA:

ANALYSIS AND OPTIMIZATION CRITERIA:
1. CATEGORY/DOMAIN: Identify and strengthen domain expertise
2. TASK DESCRIPTION: Clarify and specify exact task
3. MAIN OBJECTIVE: Define measurable and concrete objective
4. TARGET AUDIENCE: Adapt language level and expectations
5. OUTPUT FORMAT: Specify exact structure (JSON, table, text, etc.)
6. TONE AND STYLE: Define language register and personality
7. APPROXIMATE LENGTH: Indicate size constraint (words, tokens, duration)

MANDATORY structure for improved prompt - EVERY SECTION COMPLETE:

# CONTEXT & OBJECTIVE
[2-3 sentences: domain, task, measurable objective]

# AI ROLE
[2 sentences: expertise, personality adapted to target audience]

# DELIVERABLE STRUCTURE
[Detailed exact format with sections/tables if needed]

# CONSTRAINTS
• Length: [precise number]
• Tone: [precise register]
• Style: [characteristics]
• Audience: [level and expectations]

# OUTPUT EXAMPLE
[Concrete example - minimum 3 lines]

---

# IMPROVEMENTS MADE
• Category/Domain: [improvement]
• Description/Task: [improvement]
• Objective: [improvement]
• Target audience: [improvement]
• Format: [improvement]
• Tone/Style: [improvement]
• Length: [improvement]

IMPORTANT:
- Apply ALL 7 optimization criteria
- Complete ALL sections
- DO NOT add introduction
- Return ONLY the improved prompt`;
  } else {
    return `You are a prompt engineering expert. Improve the prompt according to these criteria:

OPTIMIZATION CRITERIA:
1. CATEGORY: Strengthen domain
2. DESCRIPTION: Clarify task
3. OBJECTIVE: Define measurable goal
4. AUDIENCE: Adapt level
5. FORMAT: Specify structure
6. TON: Define register
7. LENGTH: Indicate constraint

MANDATORY structure:
🎯 **CONTEXT & OBJECTIVE**
[Domain + Task + Objective]

🧑‍💻 **AI ROLE**
[Expertise + Personality]

🗂 **DELIVERABLE STRUCTURE**
[Exact format]

⚙️ **CONSTRAINTS**
• Length: [number]
• Tone: [register]
• Audience: [level]

📝 **IMPROVEMENTS**
[List of improvements made]

RULES:
- Apply all 7 criteria
- Be concise but complete
- Return only the prompt`;
  }
}

function buildArabicImprovementPrompt(mode: Mode): string {
  return `أنت خبير في هندسة المطالبات. حسّن المطالبة وفقًا لهذه المعايير:

معايير التحسين:
1. الفئة: تعزيز المجال
2. الوصف: توضيح المهمة
3. الهدف: تحديد هدف قابل للقياس
4. الجمهور: تكييف المستوى
5. الشكل: تحديد البنية
6. الأسلوب: تحديد السجل
7. الطول: تحديد القيد

البنية الإلزامية:
🎯 **السياق والهدف**
[المجال + المهمة + الهدف]

🧑‍💻 **دور الذكاء الاصطناعي**
[الخبرة + الشخصية]

🗂 **بنية التسليم**
[الشكل الدقيق]

⚙️ **القيود**
• الطول: [الرقم]
• الأسلوب: [السجل]
• الجمهور: [المستوى]

📝 **التحسينات**
[قائمة التحسينات المطبقة]

القواعد:
- طبق جميع المعايير السبعة
- كن موجزًا ​​ولكن كاملاً
- أرجع المطالبة فقط`;
}

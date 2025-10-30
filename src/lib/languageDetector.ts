/**
 * Détection automatique de la langue d'un texte
 */

type Language = 'fr' | 'en' | 'ar';

/**
 * Détecte la langue d'un texte en fonction des mots-clés caractéristiques
 */
export function detectLanguage(text: string): Language {
  if (!text || text.trim().length === 0) {
    return 'en'; // Par défaut anglais si vide
  }

  const lowerText = text.toLowerCase();

  // Mots-clés français très courants
  const frenchIndicators = [
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou',
    'est', 'sont', 'pour', 'avec', 'dans', 'sur', 'par', 'qui', 'que',
    'créer', 'faire', 'aider', 'développer', 'analyser', 'générer',
    'prompts', 'stratégie', 'contenu', 'marketing', 'réseaux sociaux',
    'améliorer', 'optimiser', 'écrire', 'rédiger'
  ];

  // Mots-clés anglais très courants
  const englishIndicators = [
    'the', 'is', 'are', 'and', 'or', 'to', 'of', 'in', 'for', 'with',
    'create', 'make', 'help', 'develop', 'analyze', 'generate',
    'prompts', 'strategy', 'content', 'marketing', 'social media',
    'improve', 'optimize', 'write', 'draft'
  ];

  // Mots-clés arabes caractéristiques
  const arabicIndicators = [
    'في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'التي', 'الذي',
    'يمكن', 'يجب', 'كيف', 'ماذا', 'لماذا', 'متى', 'أين'
  ];

  // Détection arabe (caractères arabes Unicode)
  const hasArabicChars = /[\u0600-\u06FF]/.test(text);
  if (hasArabicChars) {
    const arabicScore = arabicIndicators.filter(word =>
      lowerText.includes(word)
    ).length;
    if (arabicScore > 0) return 'ar';
  }

  // Compter les correspondances
  const frenchScore = frenchIndicators.filter(word =>
    new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
  ).length;

  const englishScore = englishIndicators.filter(word =>
    new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
  ).length;

  // Retourner la langue avec le score le plus élevé
  if (frenchScore > englishScore) {
    return 'fr';
  } else if (englishScore > frenchScore) {
    return 'en';
  }

  // Si égalité ou aucun match, utiliser des heuristiques supplémentaires

  // Détecter accents français
  const hasFrenchAccents = /[àâäéèêëïîôùûüÿç]/i.test(text);
  if (hasFrenchAccents) return 'fr';

  // Par défaut, anglais (langue internationale)
  return 'en';
}

/**
 * Retourne des exemples de détection
 */
export function getLanguageDetectionExamples() {
  return {
    fr: [
      "Créer une stratégie marketing pour les réseaux sociaux",
      "Générer des prompts pour améliorer le contenu",
      "Analyser les données et proposer des recommandations"
    ],
    en: [
      "Create a marketing strategy for social media",
      "Generate prompts to improve content",
      "Analyze data and provide recommendations"
    ],
    ar: [
      "إنشاء استراتيجية تسويقية لوسائل التواصل الاجتماعي",
      "توليد المطالبات لتحسين المحتوى",
      "تحليل البيانات وتقديم التوصيات"
    ]
  };
}

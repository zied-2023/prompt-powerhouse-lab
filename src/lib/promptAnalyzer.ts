export interface PromptComplexity {
  score: number;
  type: 'simple' | 'medium' | 'complex' | 'creative';
  suggestedProvider: 'openai' | 'deepseek' | 'openrouter' | 'gemini';
  suggestedModel: string;
  reasoning: string;
}

export function analyzePromptComplexity(
  description: string,
  objective?: string,
  domain?: string
): PromptComplexity {
  let score = 0;
  let type: PromptComplexity['type'] = 'simple';
  let suggestedProvider: PromptComplexity['suggestedProvider'] = 'deepseek';
  let suggestedModel = 'deepseek-chat';
  let reasoning = '';

  const text = `${description} ${objective || ''} ${domain || ''}`.toLowerCase();
  const wordCount = text.split(/\s+/).length;

  if (wordCount < 20) score += 1;
  else if (wordCount < 50) score += 2;
  else score += 3;

  const creativeKeywords = [
    'créatif', 'créative', 'créativité', 'imaginatif', 'original',
    'storytelling', 'histoire', 'récit', 'narrative', 'poétique',
    'artistique', 'design', 'conception', 'innovation', 'brainstorm'
  ];

  const technicalKeywords = [
    'code', 'algorithme', 'technique', 'développement', 'programming',
    'api', 'backend', 'frontend', 'database', 'sql', 'python', 'javascript',
    'architecture', 'système', 'debug', 'optimisation'
  ];

  const analyticalKeywords = [
    'analyse', 'analyser', 'évaluer', 'comparer', 'recherche',
    'étude', 'statistique', 'données', 'métrique', 'rapport',
    'insight', 'stratégie', 'planification', 'roi', 'kpi'
  ];

  const complexKeywords = [
    'complexe', 'détaillé', 'approfondi', 'exhaustif', 'complet',
    'multi-étapes', 'stratégique', 'expert', 'avancé', 'sophistiqué'
  ];

  let isCreative = false;
  let isTechnical = false;
  let isAnalytical = false;
  let isComplex = false;

  creativeKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 2;
      isCreative = true;
    }
  });

  technicalKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 1;
      isTechnical = true;
    }
  });

  analyticalKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 1;
      isAnalytical = true;
    }
  });

  complexKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 2;
      isComplex = true;
    }
  });

  if (domain) {
    const creativeDomains = ['design', 'content-creation', 'marketing'];
    const technicalDomains = ['development', 'research', 'finance'];

    if (creativeDomains.includes(domain)) {
      score += 1;
      isCreative = true;
    }
    if (technicalDomains.includes(domain)) {
      score += 1;
      isTechnical = true;
    }
  }

  if (score <= 3) {
    type = 'simple';
    suggestedProvider = 'deepseek';
    suggestedModel = 'deepseek-chat';
    reasoning = 'Prompt simple et direct - DeepSeek Chat (rapide et économique)';
  } else if (score <= 6) {
    type = 'medium';
    if (isTechnical) {
      suggestedProvider = 'openrouter';
      suggestedModel = 'qwen/qwen-2.5-72b-instruct';
      reasoning = 'Tâche technique de complexité moyenne - Qwen 2.5 72B (excellent pour le code)';
    } else {
      suggestedProvider = 'openai';
      suggestedModel = 'gpt-4o-mini';
      reasoning = 'Complexité moyenne - GPT-4O Mini (équilibré performance/coût)';
    }
  } else if (score <= 9) {
    type = 'complex';
    if (isCreative) {
      suggestedProvider = 'openrouter';
      suggestedModel = 'anthropic/claude-3.5-sonnet';
      reasoning = 'Tâche créative complexe - Claude 3.5 Sonnet (excellence en créativité)';
    } else if (isTechnical) {
      suggestedProvider = 'openrouter';
      suggestedModel = 'deepseek/deepseek-r1';
      reasoning = 'Tâche technique complexe - DeepSeek R1 (raisonnement avancé)';
    } else {
      suggestedProvider = 'openai';
      suggestedModel = 'gpt-4o';
      reasoning = 'Tâche complexe générale - GPT-4O (polyvalent et puissant)';
    }
  } else {
    type = 'creative';
    if (isCreative) {
      suggestedProvider = 'openrouter';
      suggestedModel = 'anthropic/claude-3.5-sonnet';
      reasoning = 'Tâche hautement créative - Claude 3.5 Sonnet (meilleur pour la créativité)';
    } else if (isTechnical && isAnalytical) {
      suggestedProvider = 'openrouter';
      suggestedModel = 'deepseek/deepseek-r1';
      reasoning = 'Tâche technique et analytique avancée - DeepSeek R1 (raisonnement profond)';
    } else {
      suggestedProvider = 'openrouter';
      suggestedModel = 'google/gemini-pro-1.5';
      reasoning = 'Tâche très complexe - Gemini Pro 1.5 (excellent pour l\'analyse approfondie)';
    }
  }

  return {
    score,
    type,
    suggestedProvider,
    suggestedModel,
    reasoning
  };
}

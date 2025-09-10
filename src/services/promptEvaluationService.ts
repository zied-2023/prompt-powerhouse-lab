import { supabase } from '@/integrations/supabase/client';

// Types pour le système d'évaluation
export interface PromptEvaluationCriteria {
  structure: number;      // 0-100: Cohérence logique, organisation
  precision: number;      // 0-100: Spécificité, absence d'ambiguïté
  context: number;        // 0-100: Pertinence des informations contextuelles
  efficiency: number;     // 0-100: Capacité à générer des sorties utiles
  adaptability: number;   // 0-100: Compatibilité multi-modèles
}

export interface PromptEvaluationResult {
  id: string;
  promptId: string;
  overallScore: number;   // 0-100
  criteria: PromptEvaluationCriteria;
  feedback: PromptFeedback;
  suggestions: PromptSuggestion[];
  benchmarkComparison?: BenchmarkComparison;
  evaluatedAt: string;
  evaluationVersion: string;
}

export interface PromptFeedback {
  level: 'excellent' | 'good' | 'average' | 'poor';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface PromptSuggestion {
  id: string;
  type: 'structure' | 'context' | 'precision' | 'format' | 'constraints';
  title: string;
  description: string;
  example: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BenchmarkComparison {
  category: string;
  averageScore: number;
  percentile: number;
  topPerformers: Array<{
    score: number;
    anonymizedPrompt: string;
  }>;
}

// Configuration des poids pour chaque critère selon le cas d'usage
const CRITERIA_WEIGHTS = {
  'content-marketing': {
    structure: 0.2,
    precision: 0.25,
    context: 0.3,
    efficiency: 0.15,
    adaptability: 0.1
  },
  'technical-documentation': {
    structure: 0.3,
    precision: 0.35,
    context: 0.2,
    efficiency: 0.1,
    adaptability: 0.05
  },
  'data-analysis': {
    structure: 0.25,
    precision: 0.3,
    context: 0.25,
    efficiency: 0.15,
    adaptability: 0.05
  },
  'creative-writing': {
    structure: 0.15,
    precision: 0.2,
    context: 0.35,
    efficiency: 0.2,
    adaptability: 0.1
  },
  'default': {
    structure: 0.2,
    precision: 0.25,
    context: 0.25,
    efficiency: 0.2,
    adaptability: 0.1
  }
};

class PromptEvaluationService {
  private readonly API_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';
  private readonly API_KEY = '9rLgitb0iaYKdmdRzrkQhuAOBLldeJrj';
  private readonly MODEL = 'mistral-large-latest';

  /**
   * Évalue un prompt selon les critères définis
   */
  async evaluatePrompt(
    promptContent: string, 
    category: string = 'default',
    targetModel: string = 'gpt-4'
  ): Promise<PromptEvaluationResult> {
    try {
      // 1. Analyse automatisée via LLM
      const automaticEvaluation = await this.performAutomaticEvaluation(promptContent, category, targetModel);
      
      // 2. Analyse heuristique (règles prédéfinies)
      const heuristicEvaluation = this.performHeuristicEvaluation(promptContent);
      
      // 3. Combinaison des évaluations
      const combinedCriteria = this.combineCriteriaScores(automaticEvaluation, heuristicEvaluation, category);
      
      // 4. Calcul du score global
      const overallScore = this.calculateOverallScore(combinedCriteria, category);
      
      // 5. Génération du feedback et suggestions
      const feedback = this.generateFeedback(overallScore, combinedCriteria);
      const suggestions = await this.generateSuggestions(promptContent, combinedCriteria, category);
      
      // 6. Comparaison avec benchmarks
      const benchmarkComparison = await this.getBenchmarkComparison(category, overallScore);

      const result: PromptEvaluationResult = {
        id: crypto.randomUUID(),
        promptId: '', // À définir lors de l'appel
        overallScore,
        criteria: combinedCriteria,
        feedback,
        suggestions,
        benchmarkComparison,
        evaluatedAt: new Date().toISOString(),
        evaluationVersion: '1.0.0'
      };

      return result;
    } catch (error) {
      console.error('Erreur lors de l\'évaluation:', error);
      throw new Error('Impossible d\'évaluer le prompt');
    }
  }

  /**
   * Évaluation automatisée via LLM expert
   */
  private async performAutomaticEvaluation(
    promptContent: string, 
    category: string, 
    targetModel: string
  ): Promise<PromptEvaluationCriteria> {
    const systemPrompt = `Tu es un expert en évaluation de prompts pour l'intelligence artificielle. 

Évalue ce prompt selon 5 critères précis (note de 0 à 100 pour chaque) :

1. **STRUCTURE** (0-100) : Organisation logique, clarté des instructions, hiérarchie des informations
2. **PRÉCISION** (0-100) : Spécificité des termes, absence d'ambiguïté, définitions claires
3. **CONTEXTE** (0-100) : Informations contextuelles pertinentes, background suffisant
4. **EFFICACITÉ** (0-100) : Capacité à générer des sorties utiles et pertinentes
5. **ADAPTABILITÉ** (0-100) : Compatibilité avec différents modèles d'IA

Catégorie du prompt: ${category}
Modèle cible: ${targetModel}

Réponds UNIQUEMENT au format JSON suivant :
{
  "structure": 85,
  "precision": 72,
  "context": 90,
  "efficiency": 78,
  "adaptability": 65
}`;

    const response = await fetch(this.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Prompt à évaluer: "${promptContent}"` }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // Fallback si le parsing JSON échoue
      return this.performHeuristicEvaluation(promptContent);
    }
  }

  /**
   * Évaluation heuristique basée sur des règles prédéfinies
   */
  private performHeuristicEvaluation(promptContent: string): PromptEvaluationCriteria {
    const text = promptContent.toLowerCase();
    const words = promptContent.split(/\s+/);
    const sentences = promptContent.split(/[.!?]+/).filter(s => s.trim());

    // Analyse de la structure
    const hasRoleDefinition = /\b(tu es|vous êtes|agis comme|role|expert|assistant)\b/i.test(promptContent);
    const hasObjective = /\b(objectif|but|mission|tâche|créer|générer|analyser)\b/i.test(promptContent);
    const hasFormat = /\b(format|structure|présentation|organise|liste|tableau)\b/i.test(promptContent);
    const hasConstraints = /\b(contrainte|limite|évite|maximum|minimum|obligatoire)\b/i.test(promptContent);
    
    let structureScore = 0;
    if (hasRoleDefinition) structureScore += 25;
    if (hasObjective) structureScore += 25;
    if (hasFormat) structureScore += 25;
    if (hasConstraints) structureScore += 25;

    // Analyse de la précision
    const hasSpecificTerms = words.filter(w => w.length > 6).length / words.length;
    const hasNumbers = /\d+/.test(promptContent);
    const hasExamples = /\b(exemple|par exemple|comme|tel que)\b/i.test(promptContent);
    
    let precisionScore = Math.min(100, hasSpecificTerms * 200);
    if (hasNumbers) precisionScore += 15;
    if (hasExamples) precisionScore += 15;
    precisionScore = Math.min(100, precisionScore);

    // Analyse du contexte
    const hasAudience = /\b(public|audience|utilisateur|client|lecteur)\b/i.test(promptContent);
    const hasBackground = /\b(contexte|situation|background|environnement)\b/i.test(promptContent);
    const hasIndustry = /\b(secteur|industrie|domaine|entreprise|business)\b/i.test(promptContent);
    
    let contextScore = words.length > 20 ? 40 : words.length * 2; // Base sur la longueur
    if (hasAudience) contextScore += 20;
    if (hasBackground) contextScore += 20;
    if (hasIndustry) contextScore += 20;
    contextScore = Math.min(100, contextScore);

    // Analyse de l'efficacité
    const hasActionVerbs = /\b(créer|générer|analyser|expliquer|décrire|lister|comparer|évaluer)\b/i.test(promptContent);
    const hasOutputSpec = /\b(résultat|sortie|output|réponse|livrable)\b/i.test(promptContent);
    const sentenceComplexity = sentences.length > 0 ? words.length / sentences.length : 0;
    
    let efficiencyScore = 30;
    if (hasActionVerbs) efficiencyScore += 30;
    if (hasOutputSpec) efficiencyScore += 25;
    if (sentenceComplexity > 8 && sentenceComplexity < 20) efficiencyScore += 15; // Complexité optimale
    efficiencyScore = Math.min(100, efficiencyScore);

    // Analyse de l'adaptabilité
    const hasModelAgnosticTerms = !/\b(gpt|chatgpt|claude|bard|gemini)\b/i.test(promptContent);
    const hasGenericInstructions = /\b(réponds|génère|crée|analyse)\b/i.test(promptContent);
    const avoidsTechnicalJargon = !/\b(token|embedding|fine-tuning|prompt engineering)\b/i.test(promptContent);
    
    let adaptabilityScore = 40;
    if (hasModelAgnosticTerms) adaptabilityScore += 25;
    if (hasGenericInstructions) adaptabilityScore += 20;
    if (avoidsTechnicalJargon) adaptabilityScore += 15;
    adaptabilityScore = Math.min(100, adaptabilityScore);

    return {
      structure: Math.round(structureScore),
      precision: Math.round(precisionScore),
      context: Math.round(contextScore),
      efficiency: Math.round(efficiencyScore),
      adaptability: Math.round(adaptabilityScore)
    };
  }

  /**
   * Combine les scores automatiques et heuristiques
   */
  private combineCriteriaScores(
    automatic: PromptEvaluationCriteria,
    heuristic: PromptEvaluationCriteria,
    category: string
  ): PromptEvaluationCriteria {
    // Pondération : 70% automatique, 30% heuristique
    const autoWeight = 0.7;
    const heuristicWeight = 0.3;

    return {
      structure: Math.round(automatic.structure * autoWeight + heuristic.structure * heuristicWeight),
      precision: Math.round(automatic.precision * autoWeight + heuristic.precision * heuristicWeight),
      context: Math.round(automatic.context * autoWeight + heuristic.context * heuristicWeight),
      efficiency: Math.round(automatic.efficiency * autoWeight + heuristic.efficiency * heuristicWeight),
      adaptability: Math.round(automatic.adaptability * autoWeight + heuristic.adaptability * heuristicWeight)
    };
  }

  /**
   * Calcule le score global pondéré selon la catégorie
   */
  private calculateOverallScore(criteria: PromptEvaluationCriteria, category: string): number {
    const weights = CRITERIA_WEIGHTS[category as keyof typeof CRITERIA_WEIGHTS] || CRITERIA_WEIGHTS.default;
    
    const weightedScore = 
      criteria.structure * weights.structure +
      criteria.precision * weights.precision +
      criteria.context * weights.context +
      criteria.efficiency * weights.efficiency +
      criteria.adaptability * weights.adaptability;

    return Math.round(weightedScore);
  }

  /**
   * Génère un feedback structuré
   */
  private generateFeedback(overallScore: number, criteria: PromptEvaluationCriteria): PromptFeedback {
    let level: PromptFeedback['level'];
    let summary: string;
    let priority: PromptFeedback['priority'];

    if (overallScore >= 85) {
      level = 'excellent';
      summary = 'Prompt de très haute qualité, prêt pour la production';
      priority = 'low';
    } else if (overallScore >= 70) {
      level = 'good';
      summary = 'Bon prompt avec quelques améliorations possibles';
      priority = 'medium';
    } else if (overallScore >= 50) {
      level = 'average';
      summary = 'Prompt correct mais nécessite des améliorations significatives';
      priority = 'medium';
    } else {
      level = 'poor';
      summary = 'Prompt nécessitant une refonte majeure';
      priority = 'high';
    }

    // Identifier les forces et faiblesses
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    Object.entries(criteria).forEach(([criterion, score]) => {
      if (score >= 80) {
        strengths.push(this.getCriterionLabel(criterion));
      } else if (score < 60) {
        weaknesses.push(this.getCriterionLabel(criterion));
      }
    });

    return { level, summary, strengths, weaknesses, priority };
  }

  /**
   * Génère des suggestions d'amélioration personnalisées
   */
  private async generateSuggestions(
    promptContent: string, 
    criteria: PromptEvaluationCriteria, 
    category: string
  ): Promise<PromptSuggestion[]> {
    const suggestions: PromptSuggestion[] = [];

    // Suggestions basées sur les scores faibles
    if (criteria.structure < 70) {
      suggestions.push({
        id: 'improve-structure',
        type: 'structure',
        title: 'Améliorer la structure',
        description: 'Organisez votre prompt avec des sections claires : rôle, objectif, contraintes, format de sortie',
        example: '**RÔLE**: Expert en marketing\n**OBJECTIF**: Créer un post LinkedIn\n**CONTRAINTES**: 150 mots maximum\n**FORMAT**: Texte + 3 hashtags',
        impact: 'high',
        difficulty: 'easy'
      });
    }

    if (criteria.precision < 70) {
      suggestions.push({
        id: 'add-precision',
        type: 'precision',
        title: 'Ajouter de la précision',
        description: 'Spécifiez les termes techniques, ajoutez des exemples concrets et définissez les attentes',
        example: 'Au lieu de "écris un article", utilisez "rédige un article de 800 mots sur [sujet] pour [audience] avec un ton [style]"',
        impact: 'high',
        difficulty: 'medium'
      });
    }

    if (criteria.context < 70) {
      suggestions.push({
        id: 'enrich-context',
        type: 'context',
        title: 'Enrichir le contexte',
        description: 'Ajoutez des informations sur le public cible, l\'industrie et l\'usage prévu',
        example: 'Contexte: "Pour une startup SaaS B2B ciblant les PME françaises, dans le cadre d\'une campagne de lancement produit"',
        impact: 'medium',
        difficulty: 'easy'
      });
    }

    if (criteria.efficiency < 70) {
      suggestions.push({
        id: 'improve-efficiency',
        type: 'format',
        title: 'Optimiser l\'efficacité',
        description: 'Définissez clairement le format de sortie attendu et les critères de qualité',
        example: 'Format de sortie: "Réponse structurée en 3 parties avec bullet points, exemples concrets et conclusion actionnable"',
        impact: 'high',
        difficulty: 'medium'
      });
    }

    if (criteria.adaptability < 70) {
      suggestions.push({
        id: 'improve-adaptability',
        type: 'constraints',
        title: 'Améliorer l\'adaptabilité',
        description: 'Évitez les références spécifiques à un modèle et utilisez des instructions génériques',
        example: 'Remplacez "En tant que GPT-4" par "En tant qu\'assistant IA expert"',
        impact: 'medium',
        difficulty: 'easy'
      });
    }

    return suggestions;
  }

  /**
   * Récupère les données de benchmark pour comparaison
   */
  private async getBenchmarkComparison(category: string, score: number): Promise<BenchmarkComparison> {
    // Simulation de données de benchmark (à remplacer par de vraies données)
    const benchmarkData = {
      'content-marketing': { average: 72, topScores: [95, 92, 89] },
      'technical-documentation': { average: 78, topScores: [96, 94, 91] },
      'data-analysis': { average: 75, topScores: [93, 90, 88] },
      'creative-writing': { average: 68, topScores: [94, 91, 87] },
      'default': { average: 70, topScores: [90, 85, 82] }
    };

    const data = benchmarkData[category as keyof typeof benchmarkData] || benchmarkData.default;
    const percentile = Math.round((score / 100) * 100);

    return {
      category,
      averageScore: data.average,
      percentile,
      topPerformers: data.topScores.map(topScore => ({
        score: topScore,
        anonymizedPrompt: `Prompt anonymisé avec score ${topScore}/100`
      }))
    };
  }

  /**
   * Sauvegarde l'évaluation en base de données
   */
  async saveEvaluation(evaluation: PromptEvaluationResult): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('prompt_evaluations')
        .insert({
          id: evaluation.id,
          prompt_id: evaluation.promptId,
          overall_score: evaluation.overallScore,
          criteria_scores: evaluation.criteria,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions,
          benchmark_comparison: evaluation.benchmarkComparison,
          evaluation_version: evaluation.evaluationVersion
        });

      return !error;
    } catch (error) {
      console.error('Erreur sauvegarde évaluation:', error);
      return false;
    }
  }

  /**
   * Récupère l'historique des évaluations d'un prompt
   */
  async getPromptEvaluationHistory(promptId: string): Promise<PromptEvaluationResult[]> {
    try {
      const { data, error } = await supabase
        .from('prompt_evaluations')
        .select('*')
        .eq('prompt_id', promptId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(row => ({
        id: row.id,
        promptId: row.prompt_id,
        overallScore: row.overall_score,
        criteria: row.criteria_scores,
        feedback: row.feedback,
        suggestions: row.suggestions,
        benchmarkComparison: row.benchmark_comparison,
        evaluatedAt: row.created_at,
        evaluationVersion: row.evaluation_version
      }));
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }

  /**
   * Utilitaires privées
   */
  private getCriterionLabel(criterion: string): string {
    const labels = {
      structure: 'Structure et organisation',
      precision: 'Précision et clarté',
      context: 'Richesse contextuelle',
      efficiency: 'Efficacité opérationnelle',
      adaptability: 'Adaptabilité multi-modèles'
    };
    return labels[criterion as keyof typeof labels] || criterion;
  }

  /**
   * Analyse comparative avec d'autres prompts similaires
   */
  async compareWithSimilarPrompts(promptContent: string, category: string): Promise<{
    similarPrompts: Array<{
      id: string;
      title: string;
      score: number;
      similarity: number;
    }>;
    averageScore: number;
    ranking: number;
  }> {
    // Implémentation future : utiliser des embeddings pour trouver des prompts similaires
    // et comparer les performances
    return {
      similarPrompts: [],
      averageScore: 0,
      ranking: 0
    };
  }

  /**
   * Génère un rapport d'évaluation complet
   */
  generateEvaluationReport(evaluation: PromptEvaluationResult): string {
    const { overallScore, criteria, feedback, suggestions } = evaluation;

    let report = `# Rapport d'Évaluation de Prompt\n\n`;
    report += `**Score Global**: ${overallScore}/100 (${feedback.level.toUpperCase()})\n\n`;
    report += `**Résumé**: ${feedback.summary}\n\n`;

    report += `## Détail des Critères\n\n`;
    Object.entries(criteria).forEach(([criterion, score]) => {
      const label = this.getCriterionLabel(criterion);
      const status = score >= 80 ? '✅' : score >= 60 ? '⚠️' : '❌';
      report += `- **${label}**: ${score}/100 ${status}\n`;
    });

    if (feedback.strengths.length > 0) {
      report += `\n## Points Forts\n\n`;
      feedback.strengths.forEach(strength => {
        report += `- ${strength}\n`;
      });
    }

    if (feedback.weaknesses.length > 0) {
      report += `\n## Points d'Amélioration\n\n`;
      feedback.weaknesses.forEach(weakness => {
        report += `- ${weakness}\n`;
      });
    }

    if (suggestions.length > 0) {
      report += `\n## Suggestions d'Amélioration\n\n`;
      suggestions.forEach((suggestion, index) => {
        report += `### ${index + 1}. ${suggestion.title}\n`;
        report += `${suggestion.description}\n\n`;
        report += `**Exemple**: ${suggestion.example}\n\n`;
        report += `**Impact**: ${suggestion.impact} | **Difficulté**: ${suggestion.difficulty}\n\n`;
      });
    }

    return report;
  }
}

export const promptEvaluationService = new PromptEvaluationService();
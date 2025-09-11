import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface EvaluationCriteria {
  clarity: number;
  specificity: number;
  context: number;
  structure: number;
  actionability: number;
}

interface PromptEvaluation {
  overallScore: number;
  criteria: EvaluationCriteria;
  feedback: string;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

interface EvaluationHistory {
  id: string;
  promptId: string;
  promptTitle: string;
  overallScore: number;
  createdAt: string;
  feedback: string;
}

interface EvaluationStats {
  totalEvaluations: number;
  averageScore: number;
  improvementTrend: number;
  topCategory: string;
}

export const usePromptEvaluation = () => {
  const { user } = useAuth();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistory[]>([]);
  const [evaluationStats, setEvaluationStats] = useState<EvaluationStats | null>(null);

  const evaluatePrompt = useCallback(async (prompt: string): Promise<PromptEvaluation> => {
    setIsEvaluating(true);
    
    try {
      // Simulation d'évaluation locale
      const clarity = Math.floor(Math.random() * 40) + 60;
      const specificity = Math.floor(Math.random() * 40) + 60;
      const context = Math.floor(Math.random() * 40) + 60;
      const structure = Math.floor(Math.random() * 40) + 60;
      const actionability = Math.floor(Math.random() * 40) + 60;

      const criteria: EvaluationCriteria = {
        clarity,
        specificity,
        context,
        structure,
        actionability
      };

      const overallScore = Math.round(
        (clarity + specificity + context + structure + actionability) / 5
      );

      const evaluation: PromptEvaluation = {
        overallScore,
        criteria,
        feedback: generateFeedback(overallScore),
        suggestions: generateSuggestions(criteria),
        strengths: generateStrengths(criteria),
        weaknesses: generateWeaknesses(criteria)
      };

      return evaluation;
    } finally {
      setIsEvaluating(false);
    }
  }, []);

  const getEvaluationHistory = useCallback(async (): Promise<EvaluationHistory[]> => {
    // Simulation de données d'historique
    const mockHistory: EvaluationHistory[] = [
      {
        id: '1',
        promptId: 'prompt-1',
        promptTitle: 'Prompt de création de contenu',
        overallScore: 85,
        createdAt: new Date().toISOString(),
        feedback: 'Excellent prompt avec une structure claire'
      },
      {
        id: '2',
        promptId: 'prompt-2',
        promptTitle: 'Prompt d\'analyse de données',
        overallScore: 72,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        feedback: 'Bon prompt mais pourrait être plus spécifique'
      }
    ];
    
    setEvaluationHistory(mockHistory);
    return mockHistory;
  }, []);

  const getEvaluationStats = useCallback(async (): Promise<EvaluationStats> => {
    // Simulation de statistiques
    const mockStats: EvaluationStats = {
      totalEvaluations: 15,
      averageScore: 78,
      improvementTrend: 5,
      topCategory: 'clarity'
    };
    
    setEvaluationStats(mockStats);
    return mockStats;
  }, []);

  return {
    evaluatePrompt,
    getEvaluationHistory,
    getEvaluationStats,
    isEvaluating,
    evaluationHistory,
    evaluationStats
  };
};

// Fonctions utilitaires
function generateFeedback(score: number): string {
  if (score >= 90) return "Excellent prompt ! Très bien structuré et clair.";
  if (score >= 80) return "Bon prompt avec une structure solide.";
  if (score >= 70) return "Prompt correct mais avec des améliorations possibles.";
  if (score >= 60) return "Prompt basique nécessitant des améliorations.";
  return "Prompt nécessitant une refonte complète.";
}

function generateSuggestions(criteria: EvaluationCriteria): string[] {
  const suggestions: string[] = [];
  
  if (criteria.clarity < 70) {
    suggestions.push("Utilisez des termes plus précis et évitez l'ambiguïté");
  }
  if (criteria.specificity < 70) {
    suggestions.push("Ajoutez plus de détails sur le résultat attendu");
  }
  if (criteria.context < 70) {
    suggestions.push("Fournissez plus de contexte pour guider la réponse");
  }
  if (criteria.structure < 70) {
    suggestions.push("Organisez votre prompt avec une structure claire");
  }
  if (criteria.actionability < 70) {
    suggestions.push("Rendez votre demande plus actionnable et concrète");
  }
  
  return suggestions;
}

function generateStrengths(criteria: EvaluationCriteria): string[] {
  const strengths: string[] = [];
  
  if (criteria.clarity >= 80) strengths.push("Formulation claire et précise");
  if (criteria.specificity >= 80) strengths.push("Demande spécifique et détaillée");
  if (criteria.context >= 80) strengths.push("Contexte bien défini");
  if (criteria.structure >= 80) strengths.push("Structure logique et organisée");
  if (criteria.actionability >= 80) strengths.push("Instructions actionables");
  
  return strengths;
}

function generateWeaknesses(criteria: EvaluationCriteria): string[] {
  const weaknesses: string[] = [];
  
  if (criteria.clarity < 60) weaknesses.push("Manque de clarté dans la formulation");
  if (criteria.specificity < 60) weaknesses.push("Trop vague, manque de spécificité");
  if (criteria.context < 60) weaknesses.push("Contexte insuffisant");
  if (criteria.structure < 60) weaknesses.push("Structure désorganisée");
  if (criteria.actionability < 60) weaknesses.push("Instructions peu actionables");
  
  return weaknesses;
}
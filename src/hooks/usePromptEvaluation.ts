import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { promptEvaluationService, type PromptEvaluationResult } from '@/services/promptEvaluationService';

export interface EvaluationHistory {
  id: string;
  promptId: string;
  promptTitle: string;
  overallScore: number;
  evaluatedAt: string;
  feedback: any;
}

export interface QualityTrends {
  daily: Array<{ date: string; averageScore: number; count: number }>;
  weekly: Array<{ week: string; averageScore: number; count: number }>;
  monthly: Array<{ month: string; averageScore: number; count: number }>;
}

export const usePromptEvaluation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistory[]>([]);
  const [qualityTrends, setQualityTrends] = useState<QualityTrends | null>(null);

  // Évaluer un prompt et sauvegarder le résultat
  const evaluateAndSavePrompt = async (
    promptId: string,
    promptContent: string,
    category: string = 'default',
    targetModel: string = 'gpt-4'
  ): Promise<PromptEvaluationResult | null> => {
    setIsLoading(true);
    
    try {
      // 1. Évaluer le prompt
      const evaluation = await promptEvaluationService.evaluatePrompt(
        promptContent, 
        category, 
        targetModel
      );
      
      evaluation.promptId = promptId;

      // 2. Sauvegarder en base de données
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      const { error } = await supabase
        .from('prompt_evaluations')
        .insert({
          prompt_id: promptId,
          user_id: user.id,
          overall_score: evaluation.overallScore,
          criteria_scores: evaluation.criteria,
          feedback: evaluation.feedback,
          suggestions: evaluation.suggestions,
          benchmark_comparison: evaluation.benchmarkComparison,
          evaluation_version: evaluation.evaluationVersion,
          category: category,
          target_model: targetModel
        });

      if (error) {
        console.error('Erreur sauvegarde évaluation:', error);
        toast({
          title: "Erreur de sauvegarde",
          description: "L'évaluation n'a pas pu être sauvegardée",
          variant: "destructive"
        });
        return evaluation; // Retourner quand même l'évaluation
      }

      // 3. Mettre à jour les benchmarks
      await updateBenchmarks(category, evaluation.overallScore, evaluation.criteria);

      toast({
        title: "Évaluation terminée",
        description: `Score: ${evaluation.overallScore}/100 - ${evaluation.feedback.level}`,
      });

      // 4. Recharger l'historique
      await loadEvaluationHistory();

      return evaluation;
    } catch (error) {
      console.error('Erreur évaluation:', error);
      toast({
        title: "Erreur d'évaluation",
        description: "Impossible d'évaluer le prompt",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger l'historique des évaluations
  const loadEvaluationHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('prompt_evaluations')
        .select(`
          id,
          prompt_id,
          overall_score,
          feedback,
          created_at,
          prompts!inner(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Erreur chargement historique:', error);
        return;
      }

      const history: EvaluationHistory[] = data.map(row => ({
        id: row.id,
        promptId: row.prompt_id,
        promptTitle: (row.prompts as any)?.title || 'Prompt sans titre',
        overallScore: row.overall_score,
        evaluatedAt: row.created_at,
        feedback: row.feedback
      }));

      setEvaluationHistory(history);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Charger les tendances qualité
  const loadQualityTrends = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Requête pour les tendances quotidiennes (7 derniers jours)
      const { data: dailyData, error: dailyError } = await supabase
        .from('prompt_evaluations')
        .select('overall_score, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (dailyError) {
        console.error('Erreur tendances quotidiennes:', dailyError);
        return;
      }

      // Grouper par jour
      const dailyTrends = new Map<string, { total: number; sum: number }>();
      
      dailyData?.forEach(row => {
        const date = new Date(row.created_at).toISOString().split('T')[0];
        const current = dailyTrends.get(date) || { total: 0, sum: 0 };
        dailyTrends.set(date, {
          total: current.total + 1,
          sum: current.sum + row.overall_score
        });
      });

      const daily = Array.from(dailyTrends.entries()).map(([date, stats]) => ({
        date,
        averageScore: Math.round(stats.sum / stats.total),
        count: stats.total
      }));

      setQualityTrends({
        daily,
        weekly: [], // À implémenter
        monthly: [] // À implémenter
      });

    } catch (error) {
      console.error('Erreur tendances:', error);
    }
  };

  // Mettre à jour les benchmarks
  const updateBenchmarks = async (
    category: string, 
    score: number, 
    criteria: any
  ) => {
    try {
      // Appeler la fonction de mise à jour des benchmarks
      const { error } = await supabase.rpc('update_evaluation_benchmarks');
      
      if (error) {
        console.error('Erreur mise à jour benchmarks:', error);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Obtenir les statistiques utilisateur
  const getUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_user_evaluation_stats', { target_user_id: user.id });

      if (error) {
        console.error('Erreur stats utilisateur:', error);
        return null;
      }

      return data[0] || null;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  // Comparer avec des prompts similaires
  const compareWithSimilar = async (promptContent: string, category: string) => {
    try {
      return await promptEvaluationService.compareWithSimilarPrompts(promptContent, category);
    } catch (error) {
      console.error('Erreur comparaison:', error);
      return null;
    }
  };

  // Charger les données au montage du hook
  useEffect(() => {
    loadEvaluationHistory();
    loadQualityTrends();
  }, []);

  return {
    evaluateAndSavePrompt,
    loadEvaluationHistory,
    loadQualityTrends,
    getUserStats,
    compareWithSimilar,
    evaluationHistory,
    qualityTrends,
    isLoading
  };
};
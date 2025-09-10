/*
  # Système d'évaluation des prompts

  1. Nouvelles Tables
    - `prompt_evaluations`
      - `id` (uuid, primary key)
      - `prompt_id` (uuid, foreign key vers prompts)
      - `user_id` (uuid, foreign key vers auth.users)
      - `overall_score` (integer, 0-100)
      - `criteria_scores` (jsonb, scores détaillés par critère)
      - `feedback` (jsonb, feedback structuré)
      - `suggestions` (jsonb, suggestions d'amélioration)
      - `benchmark_comparison` (jsonb, comparaison avec benchmarks)
      - `evaluation_version` (text, version de l'algorithme)
      - `category` (text, catégorie du prompt évalué)
      - `target_model` (text, modèle IA cible)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `evaluation_benchmarks`
      - `id` (uuid, primary key)
      - `category` (text, catégorie de prompt)
      - `average_score` (decimal, score moyen de la catégorie)
      - `sample_size` (integer, nombre de prompts dans l'échantillon)
      - `top_percentile_threshold` (integer, seuil pour le top 10%)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Politiques pour que les utilisateurs voient leurs propres évaluations
    - Accès en lecture seule aux benchmarks pour tous les utilisateurs connectés

  3. Index
    - Index sur prompt_id pour les requêtes fréquentes
    - Index sur user_id pour les dashboards utilisateur
    - Index sur category pour les comparaisons
*/

-- Table principale pour stocker les évaluations de prompts
CREATE TABLE IF NOT EXISTS public.prompt_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score integer NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  criteria_scores jsonb NOT NULL DEFAULT '{}',
  feedback jsonb NOT NULL DEFAULT '{}',
  suggestions jsonb NOT NULL DEFAULT '[]',
  benchmark_comparison jsonb DEFAULT '{}',
  evaluation_version text NOT NULL DEFAULT '1.0.0',
  category text NOT NULL DEFAULT 'default',
  target_model text NOT NULL DEFAULT 'gpt-4',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table pour stocker les données de benchmark par catégorie
CREATE TABLE IF NOT EXISTS public.evaluation_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL UNIQUE,
  average_score decimal(5,2) NOT NULL DEFAULT 0.00,
  sample_size integer NOT NULL DEFAULT 0,
  top_percentile_threshold integer NOT NULL DEFAULT 85,
  criteria_averages jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Table pour l'historique des améliorations de prompts
CREATE TABLE IF NOT EXISTS public.prompt_improvement_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_score integer NOT NULL,
  improved_score integer NOT NULL,
  improvement_delta integer GENERATED ALWAYS AS (improved_score - original_score) STORED,
  applied_suggestions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE public.prompt_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_improvement_history ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour prompt_evaluations
CREATE POLICY "Users can view their own prompt evaluations"
ON public.prompt_evaluations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prompt evaluations"
ON public.prompt_evaluations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prompt evaluations"
ON public.prompt_evaluations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Politiques RLS pour evaluation_benchmarks (lecture seule pour tous)
CREATE POLICY "Authenticated users can view benchmarks"
ON public.evaluation_benchmarks
FOR SELECT
TO authenticated
USING (true);

-- Politiques RLS pour prompt_improvement_history
CREATE POLICY "Users can view their own improvement history"
ON public.prompt_improvement_history
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own improvement history"
ON public.prompt_improvement_history
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_prompt_evaluations_prompt_id ON public.prompt_evaluations(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_evaluations_user_id ON public.prompt_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_evaluations_category ON public.prompt_evaluations(category);
CREATE INDEX IF NOT EXISTS idx_prompt_evaluations_score ON public.prompt_evaluations(overall_score DESC);
CREATE INDEX IF NOT EXISTS idx_prompt_evaluations_created_at ON public.prompt_evaluations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_evaluation_benchmarks_category ON public.evaluation_benchmarks(category);

CREATE INDEX IF NOT EXISTS idx_improvement_history_prompt_id ON public.prompt_improvement_history(prompt_id);
CREATE INDEX IF NOT EXISTS idx_improvement_history_user_id ON public.prompt_improvement_history(user_id);
CREATE INDEX IF NOT EXISTS idx_improvement_history_delta ON public.prompt_improvement_history(improvement_delta DESC);

-- Triggers pour updated_at
CREATE TRIGGER update_prompt_evaluations_updated_at
  BEFORE UPDATE ON public.prompt_evaluations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evaluation_benchmarks_updated_at
  BEFORE UPDATE ON public.evaluation_benchmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer des données de benchmark initiales
INSERT INTO public.evaluation_benchmarks (category, average_score, sample_size, criteria_averages) VALUES
('content-marketing', 72.5, 150, '{"structure": 75, "precision": 70, "context": 78, "efficiency": 68, "adaptability": 72}'),
('technical-documentation', 78.2, 120, '{"structure": 85, "precision": 82, "context": 75, "efficiency": 80, "adaptability": 69}'),
('data-analysis', 75.8, 95, '{"structure": 78, "precision": 85, "context": 72, "efficiency": 76, "adaptability": 68}'),
('creative-writing', 68.4, 200, '{"structure": 65, "precision": 60, "context": 82, "efficiency": 70, "adaptability": 75}'),
('default', 70.0, 500, '{"structure": 70, "precision": 68, "context": 72, "efficiency": 71, "adaptability": 69}')
ON CONFLICT (category) DO UPDATE SET
  average_score = EXCLUDED.average_score,
  sample_size = EXCLUDED.sample_size,
  criteria_averages = EXCLUDED.criteria_averages,
  updated_at = now();

-- Fonction pour calculer automatiquement les benchmarks
CREATE OR REPLACE FUNCTION public.update_evaluation_benchmarks()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Mettre à jour les benchmarks basés sur les évaluations réelles
  INSERT INTO public.evaluation_benchmarks (category, average_score, sample_size, criteria_averages)
  SELECT 
    category,
    AVG(overall_score)::decimal(5,2) as average_score,
    COUNT(*)::integer as sample_size,
    jsonb_build_object(
      'structure', AVG((criteria_scores->>'structure')::integer),
      'precision', AVG((criteria_scores->>'precision')::integer),
      'context', AVG((criteria_scores->>'context')::integer),
      'efficiency', AVG((criteria_scores->>'efficiency')::integer),
      'adaptability', AVG((criteria_scores->>'adaptability')::integer)
    ) as criteria_averages
  FROM public.prompt_evaluations
  WHERE created_at > now() - interval '30 days'
  GROUP BY category
  HAVING COUNT(*) >= 10
  ON CONFLICT (category) DO UPDATE SET
    average_score = EXCLUDED.average_score,
    sample_size = EXCLUDED.sample_size,
    criteria_averages = EXCLUDED.criteria_averages,
    updated_at = now();
END;
$$;

-- Fonction pour obtenir les statistiques d'un utilisateur
CREATE OR REPLACE FUNCTION public.get_user_evaluation_stats(target_user_id uuid)
RETURNS TABLE(
  total_evaluations bigint,
  average_score numeric,
  best_score integer,
  worst_score integer,
  improvement_trend text,
  top_category text
)
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_evaluations,
    AVG(overall_score)::numeric(5,2) as average_score,
    MAX(overall_score) as best_score,
    MIN(overall_score) as worst_score,
    CASE 
      WHEN AVG(CASE WHEN created_at > now() - interval '7 days' THEN overall_score END) > 
           AVG(CASE WHEN created_at BETWEEN now() - interval '14 days' AND now() - interval '7 days' THEN overall_score END)
      THEN 'improving'
      WHEN AVG(CASE WHEN created_at > now() - interval '7 days' THEN overall_score END) < 
           AVG(CASE WHEN created_at BETWEEN now() - interval '14 days' AND now() - interval '7 days' THEN overall_score END)
      THEN 'declining'
      ELSE 'stable'
    END as improvement_trend,
    (
      SELECT category 
      FROM public.prompt_evaluations pe2 
      WHERE pe2.user_id = target_user_id 
      GROUP BY category 
      ORDER BY AVG(overall_score) DESC 
      LIMIT 1
    ) as top_category
  FROM public.prompt_evaluations
  WHERE user_id = target_user_id;
END;
$$;

-- Accorder les permissions nécessaires
GRANT EXECUTE ON FUNCTION public.update_evaluation_benchmarks TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_evaluation_stats TO authenticated;
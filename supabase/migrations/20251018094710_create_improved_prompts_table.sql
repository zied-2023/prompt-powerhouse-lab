/*
  # Table des prompts améliorés

  1. Nouvelle Table
    - `improved_prompts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence auth.users)
      - `original_prompt` (text) - Prompt avant amélioration
      - `improved_prompt` (text) - Prompt après amélioration
      - `quality_score` (numeric) - Score de qualité Opik (0-10)
      - `improvements` (jsonb) - Liste des améliorations appliquées
      - `category` (text, nullable)
      - `title` (text) - Titre du prompt
      - `tokens_saved` (integer, nullable) - Nombre de tokens économisés
      - `opik_trace_id` (text, nullable) - ID de trace Opik
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Sécurité
    - Enable RLS sur `improved_prompts`
    - Politique SELECT: utilisateurs authentifiés peuvent voir leurs propres prompts
    - Politique INSERT: utilisateurs authentifiés peuvent créer leurs prompts
    - Politique UPDATE: utilisateurs authentifiés peuvent modifier leurs prompts
    - Politique DELETE: utilisateurs authentifiés peuvent supprimer leurs prompts

  3. Indexes
    - Index sur user_id pour performance
    - Index sur created_at pour tri
    - Index sur quality_score pour filtres

  4. Notes importantes
    - Permet de sauvegarder les prompts améliorés séparément
    - Garde une trace du prompt original pour comparaison
    - Stocke le score de qualité pour analytics
*/

-- Créer la table des prompts améliorés
CREATE TABLE IF NOT EXISTS improved_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_prompt text NOT NULL,
  improved_prompt text NOT NULL,
  quality_score numeric(3,1) CHECK (quality_score >= 0 AND quality_score <= 10),
  improvements jsonb DEFAULT '[]'::jsonb,
  category text,
  title text NOT NULL,
  tokens_saved integer,
  opik_trace_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_improved_prompts_user_id ON improved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_improved_prompts_created_at ON improved_prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_improved_prompts_quality_score ON improved_prompts(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_improved_prompts_category ON improved_prompts(category);

-- Enable RLS
ALTER TABLE improved_prompts ENABLE ROW LEVEL SECURITY;

-- Politique SELECT: utilisateurs peuvent voir leurs propres prompts améliorés
CREATE POLICY "Users can view own improved prompts"
  ON improved_prompts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique INSERT: utilisateurs peuvent créer leurs prompts améliorés
CREATE POLICY "Users can create own improved prompts"
  ON improved_prompts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique UPDATE: utilisateurs peuvent modifier leurs prompts améliorés
CREATE POLICY "Users can update own improved prompts"
  ON improved_prompts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique DELETE: utilisateurs peuvent supprimer leurs prompts améliorés
CREATE POLICY "Users can delete own improved prompts"
  ON improved_prompts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_improved_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_improved_prompts_updated_at_trigger ON improved_prompts;
CREATE TRIGGER update_improved_prompts_updated_at_trigger
  BEFORE UPDATE ON improved_prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_improved_prompts_updated_at();
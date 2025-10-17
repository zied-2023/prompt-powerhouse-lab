/*
  # Création de la table Opik Prompt Optimizations
  
  1. Nouvelle Table
    - `opik_prompt_optimizations`
      - `id` (uuid, primary key) - Identifiant unique de l'optimisation
      - `user_id` (uuid, foreign key) - Référence vers auth.users
      - `original_prompt` (text) - Prompt original avant optimisation
      - `optimized_prompt` (text) - Prompt après optimisation Opik
      - `quality_score` (numeric) - Score de qualité (0-10)
      - `category` (text) - Catégorie du prompt
      - `tokens_saved` (integer) - Nombre de tokens économisés
      - `created_at` (timestamptz) - Date de création
      
  2. Sécurité
    - Activation de RLS sur la table
    - Politique: Les utilisateurs peuvent voir uniquement leurs propres optimisations
    - Politique: Les utilisateurs authentifiés peuvent créer leurs optimisations
    
  3. Index
    - Index sur user_id pour des requêtes rapides
    - Index sur created_at pour tri chronologique
    - Index sur quality_score pour analytics
*/

-- Création de la table opik_prompt_optimizations
CREATE TABLE IF NOT EXISTS opik_prompt_optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_prompt text NOT NULL,
  optimized_prompt text NOT NULL,
  quality_score numeric CHECK (quality_score >= 0 AND quality_score <= 10) DEFAULT 5,
  category text DEFAULT 'general',
  tokens_saved integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Activation de RLS
ALTER TABLE opik_prompt_optimizations ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent lire leurs propres optimisations
CREATE POLICY "Users can view own optimizations"
  ON opik_prompt_optimizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent créer leurs optimisations
CREATE POLICY "Users can create own optimizations"
  ON opik_prompt_optimizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent mettre à jour leurs optimisations
CREATE POLICY "Users can update own optimizations"
  ON opik_prompt_optimizations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent supprimer leurs optimisations
CREATE POLICY "Users can delete own optimizations"
  ON opik_prompt_optimizations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_opik_optimizations_user_id ON opik_prompt_optimizations(user_id);
CREATE INDEX IF NOT EXISTS idx_opik_optimizations_created_at ON opik_prompt_optimizations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opik_optimizations_quality_score ON opik_prompt_optimizations(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_opik_optimizations_category ON opik_prompt_optimizations(category);

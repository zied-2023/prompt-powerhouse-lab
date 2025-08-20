-- Créer une table pour les prompts des utilisateurs
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Contraintes pour l'intégrité des données
  CONSTRAINT title_not_empty CHECK (length(trim(title)) > 0),
  CONSTRAINT content_not_empty CHECK (length(trim(content)) > 0),
  CONSTRAINT title_max_length CHECK (length(title) <= 200),
  CONSTRAINT content_max_length CHECK (length(content) <= 10000)
);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompts_category ON public.prompts(category);
CREATE INDEX idx_prompts_is_public ON public.prompts(is_public);
CREATE INDEX idx_prompts_created_at ON public.prompts(created_at DESC);
CREATE INDEX idx_prompts_tags ON public.prompts USING GIN(tags);

-- Activer Row Level Security
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres prompts
CREATE POLICY "Les utilisateurs peuvent voir leurs propres prompts" 
ON public.prompts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour voir les prompts publics
CREATE POLICY "Tout le monde peut voir les prompts publics" 
ON public.prompts 
FOR SELECT 
USING (is_public = true);

-- Politique pour créer ses propres prompts
CREATE POLICY "Les utilisateurs peuvent créer leurs propres prompts" 
ON public.prompts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour modifier ses propres prompts
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres prompts" 
ON public.prompts 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Politique pour supprimer ses propres prompts
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres prompts" 
ON public.prompts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Créer une table pour les catégories de prompts (optionnel)
CREATE TABLE public.prompt_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT category_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT category_name_max_length CHECK (length(name) <= 100)
);

-- Insérer quelques catégories par défaut
INSERT INTO public.prompt_categories (name, description) VALUES 
  ('Créatif', 'Prompts pour la création de contenu créatif'),
  ('Professionnel', 'Prompts pour un usage professionnel'),
  ('Technique', 'Prompts techniques et de développement'),
  ('Marketing', 'Prompts pour le marketing et la communication'),
  ('Éducation', 'Prompts à usage éducatif'),
  ('Personnel', 'Prompts pour usage personnel');

-- RLS pour les catégories (lecture seule pour tous)
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les catégories" 
ON public.prompt_categories 
FOR SELECT 
USING (true);
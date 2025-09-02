-- Corriger l'accès aux prompts du marketplace pour les utilisateurs connectés

-- Supprimer l'ancienne politique pour marketplace_prompts
DROP POLICY IF EXISTS "Accès public aux prompts en vente" ON public.marketplace_prompts;

-- Créer une politique qui permet aux utilisateurs connectés de voir les prompts en vente
CREATE POLICY "Utilisateurs connectés peuvent voir les prompts en vente" 
ON public.marketplace_prompts
FOR SELECT 
USING (
  is_for_sale = true 
  AND auth.uid() IS NOT NULL
);

-- Supprimer l'ancienne politique pour les prompts
DROP POLICY IF EXISTS "Accès public aux prompts publics et en vente" ON public.prompts;

-- Créer une politique pour que les utilisateurs connectés voient les prompts publics et en vente
CREATE POLICY "Utilisateurs connectés peuvent voir prompts publics et en vente" 
ON public.prompts
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (
    is_public = true 
    OR 
    EXISTS (
      SELECT 1 FROM public.marketplace_prompts mp 
      WHERE mp.prompt_id = prompts.id 
      AND mp.is_for_sale = true
    )
  )
);

-- Permettre aux utilisateurs connectés de voir les avis
DROP POLICY IF EXISTS "Accès public aux avis" ON public.marketplace_reviews;

CREATE POLICY "Utilisateurs connectés peuvent voir les avis" 
ON public.marketplace_reviews
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Permettre aux utilisateurs connectés de voir les types de licences
DROP POLICY IF EXISTS "Accès public aux types de licences" ON public.license_types;

CREATE POLICY "Utilisateurs connectés peuvent voir les types de licences" 
ON public.license_types
FOR SELECT 
USING (auth.uid() IS NOT NULL);
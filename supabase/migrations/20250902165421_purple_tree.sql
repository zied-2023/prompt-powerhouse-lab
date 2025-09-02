/*
  # Permettre l'accès public au marketplace

  1. Modifications des politiques RLS
    - Permettre à tous (même non connectés) de voir les prompts en vente
    - Permettre à tous de voir les avis publics
    - Permettre à tous de voir les types de licences

  2. Sécurité
    - Maintenir la protection pour les autres opérations
    - Seuls les prompts marqués comme "for sale" sont visibles
*/

-- Supprimer l'ancienne politique restrictive pour marketplace_prompts
DROP POLICY IF EXISTS "Tous peuvent voir les prompts en vente" ON public.marketplace_prompts;

-- Créer une nouvelle politique qui permet l'accès public aux prompts en vente
CREATE POLICY "Accès public aux prompts en vente" 
ON public.marketplace_prompts
FOR SELECT 
USING (is_for_sale = true);

-- Supprimer l'ancienne politique pour les avis
DROP POLICY IF EXISTS "Tous peuvent voir les avis" ON public.marketplace_reviews;

-- Créer une nouvelle politique pour l'accès public aux avis
CREATE POLICY "Accès public aux avis" 
ON public.marketplace_reviews
FOR SELECT 
USING (true);

-- Supprimer l'ancienne politique pour les types de licences
DROP POLICY IF EXISTS "Tous peuvent voir les types de licences" ON public.license_types;

-- Créer une nouvelle politique pour l'accès public aux types de licences
CREATE POLICY "Accès public aux types de licences" 
ON public.license_types
FOR SELECT 
USING (true);

-- Permettre l'accès public aux prompts qui sont liés aux marketplace_prompts
-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Tout le monde peut voir les prompts publics" ON public.prompts;

-- Créer une nouvelle politique pour voir les prompts publics ET ceux en vente
CREATE POLICY "Accès public aux prompts publics et en vente" 
ON public.prompts
FOR SELECT 
USING (
  is_public = true 
  OR 
  EXISTS (
    SELECT 1 FROM public.marketplace_prompts mp 
    WHERE mp.prompt_id = prompts.id 
    AND mp.is_for_sale = true
  )
);
-- Extension pour les nouvelles tables marketplace
-- Tables pour le marketplace de prompts

-- Table pour les prompts marketplace (étend la table prompts existante avec des fonctionnalités de vente)
CREATE TABLE public.marketplace_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  license_type TEXT NOT NULL DEFAULT 'standard',
  is_for_sale BOOLEAN NOT NULL DEFAULT false,
  sales_count INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.1000,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(prompt_id)
);

-- Table pour les licences disponibles
CREATE TABLE public.license_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  commercial_use BOOLEAN NOT NULL DEFAULT false,
  modification_allowed BOOLEAN NOT NULL DEFAULT false,
  redistribution_allowed BOOLEAN NOT NULL DEFAULT false,
  attribution_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour les transactions d'achat
CREATE TABLE public.marketplace_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketplace_prompt_id UUID NOT NULL REFERENCES public.marketplace_prompts(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  commission_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Table pour les avis et notes
CREATE TABLE public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketplace_prompt_id UUID NOT NULL REFERENCES public.marketplace_prompts(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES public.marketplace_transactions(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(reviewer_id, marketplace_prompt_id)
);

-- Table pour les favoris/wishlist
CREATE TABLE public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketplace_prompt_id UUID NOT NULL REFERENCES public.marketplace_prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, marketplace_prompt_id)
);

-- Table pour les rapports de contenu
CREATE TABLE public.content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  marketplace_prompt_id UUID NOT NULL REFERENCES public.marketplace_prompts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insérer les types de licences par défaut
INSERT INTO public.license_types (name, description, commercial_use, modification_allowed, redistribution_allowed, attribution_required) VALUES
('Standard', 'Usage personnel et commercial limité avec attribution', true, false, false, true),
('Premium', 'Usage commercial complet avec modifications autorisées', true, true, false, true),
('Extended', 'Usage commercial complet avec redistribution autorisée', true, true, true, true),
('Personal', 'Usage personnel uniquement', false, true, false, true);

-- Activer Row Level Security
ALTER TABLE public.marketplace_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour marketplace_prompts
CREATE POLICY "Tous peuvent voir les prompts en vente" ON public.marketplace_prompts
FOR SELECT USING (is_for_sale = true);

CREATE POLICY "Vendeurs peuvent voir leurs propres prompts" ON public.marketplace_prompts
FOR SELECT USING (seller_id = auth.uid());

CREATE POLICY "Vendeurs peuvent créer des prompts marketplace" ON public.marketplace_prompts
FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Vendeurs peuvent modifier leurs propres prompts" ON public.marketplace_prompts
FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "Vendeurs peuvent supprimer leurs propres prompts" ON public.marketplace_prompts
FOR DELETE USING (seller_id = auth.uid());

-- Politiques RLS pour license_types
CREATE POLICY "Tous peuvent voir les types de licences" ON public.license_types
FOR SELECT USING (true);

-- Politiques RLS pour marketplace_transactions
CREATE POLICY "Utilisateurs peuvent voir leurs propres transactions" ON public.marketplace_transactions
FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "Système peut créer des transactions" ON public.marketplace_transactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Système peut modifier les transactions" ON public.marketplace_transactions
FOR UPDATE USING (true);

-- Politiques RLS pour marketplace_reviews
CREATE POLICY "Tous peuvent voir les avis" ON public.marketplace_reviews
FOR SELECT USING (true);

CREATE POLICY "Utilisateurs peuvent créer des avis" ON public.marketplace_reviews
FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent modifier leurs propres avis" ON public.marketplace_reviews
FOR UPDATE USING (reviewer_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent supprimer leurs propres avis" ON public.marketplace_reviews
FOR DELETE USING (reviewer_id = auth.uid());

-- Politiques RLS pour user_favorites
CREATE POLICY "Utilisateurs peuvent voir leurs propres favoris" ON public.user_favorites
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent ajouter aux favoris" ON public.user_favorites
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent supprimer de leurs favoris" ON public.user_favorites
FOR DELETE USING (user_id = auth.uid());

-- Politiques RLS pour content_reports
CREATE POLICY "Utilisateurs peuvent voir leurs propres rapports" ON public.content_reports
FOR SELECT USING (reporter_id = auth.uid());

CREATE POLICY "Utilisateurs peuvent créer des rapports" ON public.content_reports
FOR INSERT WITH CHECK (reporter_id = auth.uid());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_marketplace_prompts_updated_at
  BEFORE UPDATE ON public.marketplace_prompts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_transactions_updated_at
  BEFORE UPDATE ON public.marketplace_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_reviews_updated_at
  BEFORE UPDATE ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_reports_updated_at
  BEFORE UPDATE ON public.content_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour optimiser les performances
CREATE INDEX idx_marketplace_prompts_for_sale ON public.marketplace_prompts(is_for_sale) WHERE is_for_sale = true;
CREATE INDEX idx_marketplace_prompts_featured ON public.marketplace_prompts(is_featured) WHERE is_featured = true;
CREATE INDEX idx_marketplace_prompts_seller ON public.marketplace_prompts(seller_id);
CREATE INDEX idx_marketplace_transactions_buyer ON public.marketplace_transactions(buyer_id);
CREATE INDEX idx_marketplace_transactions_seller ON public.marketplace_transactions(seller_id);
CREATE INDEX idx_marketplace_reviews_prompt ON public.marketplace_reviews(marketplace_prompt_id);
CREATE INDEX idx_user_favorites_user ON public.user_favorites(user_id);
CREATE INDEX idx_content_reports_status ON public.content_reports(status);
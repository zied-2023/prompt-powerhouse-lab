import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface MarketplacePrompt {
  id: string;
  prompt_id: string;
  seller_id: string;
  price: number;
  currency: string;
  license_type: string;
  is_for_sale: boolean;
  sales_count: number;
  is_featured: boolean;
  is_verified: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  // Relations
  prompts?: {
    id: string;
    title: string;
    content: string;
    description?: string;
    category?: string;
    tags?: string[];
    created_at: string;
  };
  profiles?: {
    email: string;
  };
  marketplace_reviews?: Array<{
    id: string;
    rating: number;
    comment?: string;
    reviewer_id: string;
    created_at: string;
    is_verified_purchase: boolean;
  }>;
}

export interface MarketplaceTransaction {
  id: string;
  buyer_id: string;
  seller_id: string;
  marketplace_prompt_id: string;
  amount: number;
  currency: string;
  commission_amount: number;
  payment_method?: string;
  payment_status: string;
  stripe_payment_intent_id?: string;
  transaction_date: string;
  created_at: string;
}

export interface LicenseType {
  id: string;
  name: string;
  description?: string;
  commercial_use: boolean;
  modification_allowed: boolean;
  redistribution_allowed: boolean;
  attribution_required: boolean;
}

export interface MarketplaceReview {
  id: string;
  reviewer_id: string;
  marketplace_prompt_id: string;
  rating: number;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

export const useMarketplace = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Récupérer tous les prompts du marketplace
  const getMarketplacePrompts = async (filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    licenseType?: string;
    sortBy?: 'created_at' | 'price' | 'sales_count' | 'rating';
    sortOrder?: 'asc' | 'desc';
    featured?: boolean;
  } = {}) => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('marketplace_prompts')
        .select(`
          *,
          prompts:prompt_id (
            id,
            title,
            content,
            description,
            category,
            tags,
            created_at
          ),
          profiles:seller_id (
            email
          ),
          marketplace_reviews (
            id,
            rating,
            comment,
            reviewer_id,
            created_at,
            is_verified_purchase
          )
        `)
        .eq('is_for_sale', true);

      // Appliquer les filtres
      if (filters.search) {
        query = query.or(`prompts.title.ilike.%${filters.search}%,prompts.description.ilike.%${filters.search}%,prompts.content.ilike.%${filters.search}%`);
      }

      if (filters.category) {
        query = query.eq('prompts.category', filters.category);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.licenseType) {
        query = query.eq('license_type', filters.licenseType);
      }

      if (filters.featured) {
        query = query.eq('is_featured', true);
      }

      // Appliquer le tri
      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: filters.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les prompts du marketplace",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérer les prompts d'un vendeur
  const getSellerPrompts = async (sellerId?: string) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user && !sellerId) {
        return [];
      }

      const targetSellerId = sellerId || session?.user?.id;

      const { data, error } = await supabase
        .from('marketplace_prompts')
        .select(`
          *,
          prompts:prompt_id (
            id,
            title,
            content,
            description,
            category,
            tags,
            created_at
          ),
          marketplace_reviews (
            id,
            rating,
            comment,
            reviewer_id,
            created_at,
            is_verified_purchase
          )
        `)
        .eq('seller_id', targetSellerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger vos prompts",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Publier un prompt sur le marketplace
  const publishPromptToMarketplace = async (promptData: {
    prompt_id: string;
    price: number;
    license_type: string;
    currency?: string;
  }) => {
    setIsSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentification requise",
          description: "Veuillez vous connecter pour publier un prompt",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('marketplace_prompts')
        .insert({
          prompt_id: promptData.prompt_id,
          seller_id: session.user.id,
          price: promptData.price,
          license_type: promptData.license_type,
          currency: promptData.currency || 'USD',
          is_for_sale: true
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la publication:', error);
        toast({
          title: "Erreur de publication",
          description: "Impossible de publier le prompt sur le marketplace",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Prompt publié",
        description: "Votre prompt a été publié sur le marketplace avec succès !",
      });

      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Mettre à jour un prompt du marketplace
  const updateMarketplacePrompt = async (id: string, updates: {
    price?: number;
    license_type?: string;
    is_for_sale?: boolean;
  }) => {
    setIsSaving(true);
    
    try {
      const { data, error } = await supabase
        .from('marketplace_prompts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur de mise à jour",
          description: "Impossible de mettre à jour le prompt",
          variant: "destructive"
        });
        return null;
      }

      toast({
        title: "Prompt mis à jour",
        description: "Votre prompt a été mis à jour avec succès !",
      });

      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Récupérer les types de licences disponibles
  const getLicenseTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('license_types')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erreur lors du chargement des licences:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur:', error);
      return [];
    }
  };

  // Ajouter un prompt aux favoris
  const addToFavorites = async (marketplacePromptId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast({
          title: "Authentification requise",
          description: "Veuillez vous connecter pour ajouter aux favoris",
          variant: "destructive"
        });
        return false;
      }

      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: session.user.id,
          marketplace_prompt_id: marketplacePromptId
        });

      if (error) {
        if (error.code === '23505') { // Conflit d'unicité
          toast({
            title: "Déjà en favoris",
            description: "Ce prompt est déjà dans vos favoris",
            variant: "destructive"
          });
        } else {
          console.error('Erreur lors de l\'ajout aux favoris:', error);
          toast({
            title: "Erreur",
            description: "Impossible d'ajouter aux favoris",
            variant: "destructive"
          });
        }
        return false;
      }

      toast({
        title: "Ajouté aux favoris",
        description: "Le prompt a été ajouté à vos favoris",
      });

      return true;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Supprimer un prompt des favoris
  const removeFromFavorites = async (marketplacePromptId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return false;
      }

      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', session.user.id)
        .eq('marketplace_prompt_id', marketplacePromptId);

      if (error) {
        console.error('Erreur lors de la suppression des favoris:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer des favoris",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Supprimé des favoris",
        description: "Le prompt a été supprimé de vos favoris",
      });

      return true;
    } catch (error) {
      console.error('Erreur:', error);
      return false;
    }
  };

  // Récupérer les favoris de l'utilisateur
  const getUserFavorites = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          *,
          marketplace_prompts (
            *,
            prompts:prompt_id (
              id,
              title,
              content,
              description,
              category,
              tags,
              created_at
            ),
            profiles:seller_id (
              email
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getMarketplacePrompts,
    getSellerPrompts,
    publishPromptToMarketplace,
    updateMarketplacePrompt,
    getLicenseTypes,
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
    isLoading,
    isSaving
  };
};
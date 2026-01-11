import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UserCredits {
  id: string;
  user_id: string;
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  credits: number;
  price_tnd: number;
  description: string;
}

export function useUserCredits() {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const isRefreshingRef = useRef(false);

  // Fetch user credits
  const fetchUserCredits = useCallback(async (silent = false) => {
    // Ne pas faire d'appel si l'authentification est en cours de chargement
    if (authLoading) return;
    
    // Ne pas faire d'appel si l'utilisateur n'est pas authentifié
    if (!user) {
      setIsLoading(false);
      setCredits(null);
      return;
    }

    // Éviter les appels simultanés
    if (isRefreshingRef.current && !silent) return;
    
    if (!silent) {
      isRefreshingRef.current = true;
      setIsLoading(true);
    }

    try {
      // Utiliser la session au lieu de getUser pour éviter les appels répétés
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        setCredits(null);
        return;
      }

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        // Gérer spécifiquement les erreurs 401/403 (non authentifié)
        if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
          if (import.meta.env.DEV) {
            console.warn('User not authenticated, skipping credits fetch');
          }
          setCredits(null);
          return;
        }
        if (import.meta.env.DEV) {
          console.error('Error fetching credits:', error);
        }
        return;
      }

      if (data) {
        setCredits({
          ...data,
          remaining_credits: data.total_credits - data.used_credits
        });
      } else {
        // Create credits for user if they don't exist
        await createUserCredits(session.user.id);
      }
    } catch (error: any) {
      // Gérer les erreurs d'authentification
      if (error?.status === 403 || error?.status === 401 || error?.message?.includes('JWT')) {
        if (import.meta.env.DEV) {
          console.warn('Authentication error, skipping credits fetch');
        }
        setCredits(null);
        return;
      }
      if (import.meta.env.DEV) {
        console.error('Error in fetchUserCredits:', error);
      }
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [user, authLoading]);

  // Create initial credits for new user
  const createUserCredits = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .insert({
          user_id: userId,
          total_credits: 5,
          used_credits: 0
        })
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error creating credits:', error);
        }
        return;
      }

      setCredits({
        ...data,
        remaining_credits: data.total_credits - data.used_credits
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in createUserCredits:', error);
      }
    }
  };

  // Default plans (fallback if database is empty)
  const defaultPlans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      credits: 100,
      price_tnd: 15,
      description: 'Parfait pour commencer'
    },
    {
      id: 'pro',
      name: 'Pro',
      credits: 500,
      price_tnd: 50,
      description: 'Pour les utilisateurs réguliers'
    },
    {
      id: 'premium',
      name: 'Premium',
      credits: 1500,
      price_tnd: 120,
      description: 'Pour les power users'
    }
  ];

  // Fetch subscription plans (public, no auth required)
  const fetchPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_tnd', { ascending: true });

      if (error) {
        // Si erreur d'authentification, utiliser les plans par défaut silencieusement
        if (error.code === 'PGRST301' || error.message?.includes('permission')) {
          if (import.meta.env.DEV) {
            console.warn('Permission denied for subscription_plans, using default plans');
          }
          setPlans(defaultPlans);
          return;
        }
        if (import.meta.env.DEV) {
          console.error('Error fetching plans:', error);
        }
        setPlans(defaultPlans);
        return;
      }

      // If no plans in database, use default plans
      setPlans(data && data.length > 0 ? data : defaultPlans);
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('Error in fetchPlans:', error);
      }
      setPlans(defaultPlans);
    }
  }, []);

  // Use a credit (increment used_credits)
  const useCredit = async (): Promise<boolean> => {
    if (import.meta.env.DEV) {
      console.log('useCredit called, current credits:', credits);
    }

    // Si pas de crédits chargés, continuer sans erreur
    if (!credits) {
      if (import.meta.env.DEV) {
        console.log('No credits loaded, skipping credit deduction');
      }
      return true;
    }

    // Ne pas bloquer si plus de crédits (juste logger)
    if (credits.remaining_credits <= 0) {
      if (import.meta.env.DEV) {
        console.log('No credits available, but not blocking:', credits);
      }
      return true;
    }

    try {
      if (import.meta.env.DEV) {
        console.log('Updating credits in database, incrementing used_credits to:', credits.used_credits + 1);
      }

      const { data, error } = await supabase
        .from('user_credits')
        .update({
          used_credits: credits.used_credits + 1
        })
        .eq('id', credits.id)
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error using credit:', error);
        }
        // Ne pas bloquer en cas d'erreur
        return true;
      }

      if (import.meta.env.DEV) {
        console.log('Credit update successful, new data:', data);
      }

      const newCredits = {
        ...data,
        remaining_credits: data.total_credits - data.used_credits
      };

      if (import.meta.env.DEV) {
        console.log('Setting new credits state:', newCredits);
      }
      setCredits(newCredits);

      return true;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in useCredit:', error);
      }
      // Ne pas bloquer en cas d'erreur
      return true;
    }
  };

  // Add credits after purchase
  const addCredits = async (amount: number) => {
    if (!credits) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({
          total_credits: credits.total_credits + amount
        })
        .eq('id', credits.id)
        .select()
        .single();

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error adding credits:', error);
        }
        return;
      }

      setCredits({
        ...data,
        remaining_credits: data.total_credits - data.used_credits
      });

      toast({
        title: "Crédits ajoutés",
        description: `${amount} crédits ont été ajoutés à votre compte.`,
        variant: "default"
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error in addCredits:', error);
      }
    }
  };

  useEffect(() => {
    // Ne charger les crédits que si l'utilisateur est authentifié
    if (!authLoading) {
      if (user) {
        fetchUserCredits();
      } else {
        setIsLoading(false);
        setCredits(null);
      }
    }
  }, [user, authLoading, fetchUserCredits]);

  useEffect(() => {
    // Charger les plans une seule fois (public)
    fetchPlans();

    // Écouter les changements de crédits en temps réel uniquement si l'utilisateur est connecté
    if (!user) return;

    const channel = supabase
      .channel('user_credits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Rafraîchir les crédits quand il y a un changement (silencieusement)
          // Ne pas logger pour éviter le spam de logs
          fetchUserCredits(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchPlans, fetchUserCredits]);

  return {
    credits,
    plans,
    isLoading,
    useCredit,
    addCredits,
    refetchCredits: fetchUserCredits
  };
}
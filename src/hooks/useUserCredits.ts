import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  // Fetch user credits
  const fetchUserCredits = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching credits:', error);
        return;
      }

      if (data) {
        setCredits({
          ...data,
          remaining_credits: data.total_credits - data.used_credits
        });
      } else {
        // Create credits for user if they don't exist
        await createUserCredits(user.user.id);
      }
    } catch (error) {
      console.error('Error in fetchUserCredits:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        console.error('Error creating credits:', error);
        return;
      }

      setCredits({
        ...data,
        remaining_credits: data.total_credits - data.used_credits
      });
    } catch (error) {
      console.error('Error in createUserCredits:', error);
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

  // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_tnd', { ascending: true });

      if (error) {
        console.error('Error fetching plans:', error);
        setPlans(defaultPlans);
        return;
      }

      // If no plans in database, use default plans
      setPlans(data && data.length > 0 ? data : defaultPlans);
    } catch (error) {
      console.error('Error in fetchPlans:', error);
      setPlans(defaultPlans);
    }
  };

  // Use a credit (increment used_credits)
  const useCredit = async (): Promise<boolean> => {
    console.log('useCredit called, current credits:', credits);
    
    // Si pas de crédits chargés, on réessaie de les récupérer
    if (!credits) {
      console.log('No credits loaded, trying to fetch...');
      await fetchUserCredits();
      // Si toujours pas de crédits après fetch, on laisse passer pour la sauvegarde
      if (!credits) {
        console.log('Still no credits after fetch, allowing operation');
        return true;
      }
    }
    
    if (credits.remaining_credits <= 0) {
      console.log('No credits available:', credits);
      toast({
        title: "Crédits épuisés",
        description: "Vous n'avez plus de crédits disponibles. Rechargez votre compte pour continuer.",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Updating credits in database, incrementing used_credits to:', credits.used_credits + 1);
      
      const { data, error } = await supabase
        .from('user_credits')
        .update({
          used_credits: credits.used_credits + 1
        })
        .eq('id', credits.id)
        .select()
        .single();

      if (error) {
        console.error('Error using credit:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'utiliser le crédit. Veuillez réessayer.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Credit update successful, new data:', data);
      
      const newCredits = {
        ...data,
        remaining_credits: data.total_credits - data.used_credits
      };
      
      console.log('Setting new credits state:', newCredits);
      setCredits(newCredits);

      return true;
    } catch (error) {
      console.error('Error in useCredit:', error);
      return false;
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
        console.error('Error adding credits:', error);
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
      console.error('Error in addCredits:', error);
    }
  };

  useEffect(() => {
    fetchUserCredits();
    fetchPlans();

    // Écouter les changements de crédits en temps réel
    const channel = supabase
      .channel('user_credits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits'
        },
        (payload) => {
          console.log('Real-time credit update:', payload);
          // Rafraîchir les crédits quand il y a un changement
          fetchUserCredits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    credits,
    plans,
    isLoading,
    useCredit,
    addCredits,
    refetchCredits: fetchUserCredits
  };
}
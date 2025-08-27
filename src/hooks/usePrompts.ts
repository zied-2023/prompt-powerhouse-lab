import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface PromptInput {
  title: string;
  content: string;
  description?: string;
  category?: string;
  tags?: string[];
  is_public?: boolean;
}

export const usePrompts = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const savePrompt = async (promptData: PromptInput) => {
    setIsSaving(true);
    
    try {
      // Rafraîchir la session si nécessaire
      const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
      
      if (sessionError || !session?.user) {
        toast({
          title: "Authentification requise",
          description: "Veuillez vous reconnecter pour sauvegarder vos prompts",
          variant: "destructive"
        });
        return null;
      }

      const { data, error } = await supabase
        .from('prompts')
        .insert({
          user_id: session.user.id,
          title: promptData.title,
          content: promptData.content,
          description: promptData.description,
          category: promptData.category,
          tags: promptData.tags,
          is_public: promptData.is_public || false
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        
        // Si c'est une erreur JWT, suggérer une reconnexion
        if (error.code === 'PGRST303') {
          toast({
            title: "Session expirée",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erreur de sauvegarde",
            description: "Impossible de sauvegarder le prompt. Veuillez réessayer.",
            variant: "destructive"
          });
        }
        return null;
      }

      toast({
        title: "Prompt sauvegardé",
        description: "Votre prompt a été sauvegardé avec succès !",
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

  const getUserPrompts = async () => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', session.user.id)
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

  const getPublicPrompts = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement:', error);
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
    savePrompt,
    getUserPrompts,
    getPublicPrompts,
    isSaving,
    isLoading
  };
};
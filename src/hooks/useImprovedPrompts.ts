import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ImprovedPromptData {
  originalPrompt: string;
  improvedPrompt: string;
  qualityScore: number;
  improvements: string[];
  category?: string;
  title: string;
  tokensSaved?: number;
  opikTraceId?: string;
}

export const useImprovedPrompts = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const saveImprovedPrompt = async (data: ImprovedPromptData) => {
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    setIsSaving(true);

    try {
      const { data: savedPrompt, error } = await supabase
        .from('improved_prompts')
        .insert({
          user_id: user.id,
          original_prompt: data.originalPrompt,
          improved_prompt: data.improvedPrompt,
          quality_score: data.qualityScore,
          improvements: data.improvements,
          category: data.category,
          title: data.title,
          tokens_saved: data.tokensSaved,
          opik_trace_id: data.opikTraceId
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la sauvegarde du prompt amélioré:', error);
        throw error;
      }

      console.log('✅ Prompt amélioré sauvegardé:', savedPrompt);
      return savedPrompt;
    } catch (error) {
      console.error('Exception lors de la sauvegarde:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const getImprovedPrompts = async () => {
    if (!user) {
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('improved_prompts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des prompts améliorés:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Exception lors de la récupération:', error);
      return [];
    }
  };

  const deleteImprovedPrompt = async (id: string) => {
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      const { error } = await supabase
        .from('improved_prompts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw error;
      }

      console.log('✅ Prompt amélioré supprimé');
    } catch (error) {
      console.error('Exception lors de la suppression:', error);
      throw error;
    }
  };

  return {
    saveImprovedPrompt,
    getImprovedPrompts,
    deleteImprovedPrompt,
    isSaving
  };
};

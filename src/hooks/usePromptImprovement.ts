
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { API_CONFIG } from '@/config/api';

export const usePromptImprovement = () => {
  const { t } = useTranslation();
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [improvementObjective, setImprovementObjective] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [isImproving, setIsImproving] = useState(false);

  const improvePromptWithAI = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: t('missingInfo'),
        description: t('enterOriginalPrompt'),
        variant: "destructive"
      });
      return;
    }

    setIsImproving(true);
    
    try {
      const systemPrompt = `Tu es un expert en optimisation de prompts pour l'intelligence artificielle. Ta mission est d'améliorer les prompts existants en les rendant plus efficaces, clairs et structurés.

Analyse le prompt fourni et améliore-le en suivant ces principes:
1. Clarté et précision des instructions
2. Structure logique et organisation
3. Spécificité des demandes
4. Contexte approprié
5. Format de sortie défini
6. Contraintes et paramètres clairs

Réponds au format suivant:
**PROMPT AMÉLIORÉ:**
[Le prompt optimisé]

**AMÉLIORATIONS APPORTÉES:**
• [Amélioration 1]
• [Amélioration 2]
• [Amélioration 3]
...`;

      let userPrompt = `Améliore ce prompt: "${originalPrompt}"`;
      if (improvementObjective.trim()) {
        userPrompt += `\n\nObjectif d'amélioration spécifique: ${improvementObjective}`;
      }

      console.log('Amélioration de prompt via API...');

      const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt Generator Lab'
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erreur API:', response.status, errorData);
        
        if (response.status === 402) {
          throw new Error('La clé API n\'a plus de crédits disponibles. Veuillez recharger votre compte OpenRouter ou utiliser une autre clé API.');
        }
        
        throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API reçue:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        
        // Extraire le prompt amélioré et les améliorations
        const improvedPromptMatch = content.match(/\*\*PROMPT AMÉLIORÉ:\*\*(.*?)\*\*AMÉLIORATIONS APPORTÉES:\*\*/s);
        const improvementsMatch = content.match(/\*\*AMÉLIORATIONS APPORTÉES:\*\*(.*)/s);
        
        if (improvedPromptMatch) {
          setImprovedPrompt(improvedPromptMatch[1].trim());
        } else {
          setImprovedPrompt(content);
        }
        
        if (improvementsMatch) {
          const improvementsList = improvementsMatch[1]
            .split('•')
            .filter(item => item.trim())
            .map(item => item.trim());
          setImprovements(improvementsList);
        }
        
        toast({
          title: t('improvementSuccess'),
          description: t('improvementSuccessDesc'),
        });
      } else {
        throw new Error('Format de réponse API inattendu');
      }
    } catch (error) {
      console.error('Erreur lors de l\'amélioration du prompt:', error);
      
      let errorMessage = "Impossible d'améliorer le prompt. Vérifiez votre connexion.";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte OpenRouter.";
      } else if (error.message.includes('model')) {
        errorMessage = "Modèle AI non disponible. Réessayez plus tard.";
      }
      
      toast({
        title: t('generationError'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedPrompt);
    toast({
      title: t('copiedSuccess'),
      description: t('promptCopiedClipboard'),
    });
  };

  return {
    originalPrompt,
    setOriginalPrompt,
    improvementObjective,
    setImprovementObjective,
    improvedPrompt,
    improvements,
    isImproving,
    improvePromptWithAI,
    copyToClipboard
  };
};

import { useState, useCallback } from 'react';
import { intelligentApiKeyManager, RequestContext, ApiKey } from '@/services/intelligentApiKeyManager';
import { toast } from '@/hooks/use-toast';

export const useIntelligentApiKey = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);

  const selectKey = useCallback(async (context: RequestContext): Promise<ApiKey | null> => {
    setIsSelecting(true);
    try {
      const key = await intelligentApiKeyManager.selectBestApiKey(context);
      setSelectedKey(key);

      if (!key) {
        toast({
          title: 'Aucune clé disponible',
          description: 'Veuillez configurer au moins une clé API',
          variant: 'destructive'
        });
      }

      return key;
    } catch (error) {
      console.error('Error selecting API key:', error);
      toast({
        title: 'Erreur de sélection',
        description: 'Impossible de sélectionner une clé API',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsSelecting(false);
    }
  }, []);

  const logUsage = useCallback(async (
    apiKeyId: string,
    context: RequestContext,
    success: boolean,
    options?: {
      tokens_used?: number;
      cost?: number;
      response_time_ms?: number;
      error_message?: string;
    }
  ) => {
    await intelligentApiKeyManager.logUsage({
      api_key_id: apiKeyId,
      context,
      success,
      ...options
    });
  }, []);

  return {
    selectKey,
    logUsage,
    isSelecting,
    selectedKey
  };
};

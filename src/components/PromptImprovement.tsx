import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Copy, TrendingUp, CheckCircle, Save } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrompts } from "@/hooks/usePrompts";
import { useUserCredits } from "@/hooks/useUserCredits";
import { PromptEvaluationWidget } from "@/components/PromptEvaluationWidget";

// Configuration API - Mistral
const API_CONFIG = {
  endpoint: 'https://api.mistral.ai/v1/chat/completions',
  key: '9rLgitb0iaYKdmdRzrkQhuAOBLldeJrj',
  model: 'mistral-large-latest'
};

const PromptImprovement = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  const { credits, useCredit, refetchCredits } = useUserCredits();
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

      const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.key}`,
          'Content-Type': 'application/json'
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
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          throw new Error('La clé API n\'a plus de crédits disponibles. Veuillez recharger votre compte Mistral ou utiliser une autre clé API.');
        }
        
        throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API Mistral reçue:', data);

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
        
        // Décompter le crédit après le succès de la génération
        const creditUsed = await useCredit();
        if (!creditUsed) {
          throw new Error('Impossible de décompter le crédit');
        }
        
        // Forcer la mise à jour des crédits dans l'interface
        await refetchCredits();
        
        toast({
          title: t('improvementSuccess'),
          description: `${t('improvementSuccessDesc')} Crédits restants: ${credits?.remaining_credits ? credits.remaining_credits - 1 : 0}`,
        });
      } else {
        throw new Error('Format de réponse API inattendu');
      }
    } catch (error) {
      console.error('Erreur lors de l\'amélioration du prompt:', error);
      
      let errorMessage = "Impossible d'améliorer le prompt.";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte Mistral.";
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

  const handleSavePrompt = async () => {
    if (!improvedPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Aucun prompt amélioré à sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const promptData = {
      title: `Prompt amélioré - ${new Date().toLocaleDateString()}`,
      content: improvedPrompt,
      description: `Prompt amélioré à partir de: "${originalPrompt.substring(0, 100)}..."`,
      category: "Amélioration",
      tags: ["amélioration", "optimisé"],
      is_public: false
    };

    const result = await savePrompt(promptData);
    if (result) {
      toast({
        title: "Prompt sauvegardé",
        description: "Votre prompt amélioré a été sauvegardé avec succès !",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulaire d'amélioration */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">{t('improvementTitle')}</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            {t('improvementDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt original */}
          <div className="space-y-3">
            <Label htmlFor="originalPrompt" className="text-sm font-semibold text-gray-700">
              {t('originalPrompt')} {t('required')}
            </Label>
            <Textarea
              id="originalPrompt"
              placeholder={t('originalPromptPlaceholder')}
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[120px] bg-white"
              rows={5}
            />
          </div>

          {/* Objectif d'amélioration */}
          <div className="space-y-3">
            <Label htmlFor="improvementObjective" className="text-sm font-semibold text-gray-700">
              {t('improvementObjective')} {t('optional')}
            </Label>
            <Input
              id="improvementObjective"
              placeholder={t('improvementObjectivePlaceholder')}
              value={improvementObjective}
              onChange={(e) => setImprovementObjective(e.target.value)}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
            />
          </div>

          <Button 
            onClick={improvePromptWithAI} 
            disabled={isImproving}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isImproving ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                {t('improvingPrompt')}
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-3" />
                {t('improvePrompt')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">{t('improvedPrompt')}</span>
            {improvedPrompt && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                  <Copy className="h-4 w-4 mr-2" />
                  {t('copy')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSavePrompt}
                  disabled={isSaving}
                  className="hover-lift glass-card border-white/30"
                >
                  {isSaving ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Sauvegarder
                </Button>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            {t('improvedPromptDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {improvedPrompt ? (
            <div className="space-y-6">
              {/* Prompt amélioré */}
              <div className="glass-card border-white/30 p-6 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed max-h-80 overflow-y-auto">
                  {improvedPrompt}
                </pre>
              </div>
              
              {/* Améliorations apportées */}
              {improvements.length > 0 && (
                <div className="glass-card border-white/30 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                    {t('improvements')}
                  </h4>
                  <ul className="space-y-2">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  🤖 <strong>{t('generatedByAI')} :</strong> {t('aiGeneratedDesc')}
                </p>
              </div>
              
              {/* Widget d'évaluation pour le prompt amélioré */}
              <div className="mt-6">
                <PromptEvaluationWidget 
                  promptContent={improvedPrompt}
                  category="improvement"
                  compact={true}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="font-medium text-lg mb-2">{t('readyForGeneration')}</p>
              <p className="text-sm">{t('aiWillCreate')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptImprovement;

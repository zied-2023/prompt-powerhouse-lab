
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Copy, Sparkles, TrendingUp, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Configuration API
const API_CONFIG = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: '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',
  model: 'claude-opus-4-20250514'
};

const PromptImprovement = () => {
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
      
      let errorMessage = "Impossible d'améliorer le prompt.";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte OpenRouter.";
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
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                <Copy className="h-4 w-4 mr-2" />
                {t('copy')}
              </Button>
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

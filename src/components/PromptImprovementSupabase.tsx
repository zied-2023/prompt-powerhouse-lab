import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Copy, TrendingUp, CircleCheck as CheckCircle, Save, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useImprovedPrompts } from "@/hooks/useImprovedPrompts";
import { supabase } from "@/integrations/supabase/client";
import { analyzePromptComplexity } from "@/lib/promptAnalyzer";
import { PromptCompressor } from "@/lib/promptCompressor";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { llmRouter } from "@/services/llmRouter";
import { useAuth } from "@/contexts/AuthContext";

const PromptImprovementSupabase = () => {
  const { t } = useTranslation();
  const { saveImprovedPrompt, isSaving } = useImprovedPrompts();
  const { credits, useCredit } = useUserCredits();
  const { user } = useAuth();
  
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [improvementObjective, setImprovementObjective] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

  const improvePrompt = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un prompt à améliorer.",
        variant: "destructive",
      });
      return;
    }

    const complexity = analyzePromptComplexity(
      originalPrompt,
      improvementObjective
    );

    setSelectedProvider(complexity.suggestedProvider);
    setSelectedModel(complexity.suggestedModel);
    setAiSuggestion(complexity.reasoning);

    setIsLoading(true);
    
    try {
      // Déterminer le mode selon les crédits
      const creditsRemaining = credits?.remaining_credits || 0;
      const mode = creditsRemaining <= 10 ? 'free' : creditsRemaining <= 50 ? 'basic' : 'premium';
      
      const systemPrompt = mode === 'free'
        ? `Expert en prompts. Améliore de façon ultra-concise (max 150 tokens).

Format:
**AMÉLIORÉ**: [prompt court]
**CHANGEMENTS**: [2-3 points]`
        : mode === 'basic'
        ? `Expert en prompts. Améliore efficacement (max 300 tokens).

Format:
**PROMPT AMÉLIORÉ**: [version optimisée]
**AMÉLIORATIONS**: [liste courte]`
        : `Expert en prompts. Améliore avec structure optimale (max 600 tokens).

Format:
**VERSION AMÉLIORÉE**: [prompt structuré]
**AMÉLIORATIONS**: [modifications clés]
**CONSEILS**: [2-3 recommandations]`;

      let userPrompt = `Améliore ce prompt: "${originalPrompt}"`;
      if (improvementObjective.trim()) {
        userPrompt += `\n\nObjectif d'amélioration spécifique: ${improvementObjective}`;
      }

      // Utiliser le routeur intelligent LLM
      const isAuthenticated = !!user;
      const userHasCredits = (credits?.remaining_credits || 0) > 0;

      const llmConfig = await llmRouter.selectLLM(isAuthenticated, userHasCredits);
      console.log('🎯 Configuration LLM sélectionnée:', llmConfig);

      const response = await llmRouter.callLLM(llmConfig, {
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
        maxTokens: 8000
      });

      if (response.content) {
        // Décompter le crédit après le succès
        const creditUsed = await useCredit();
        if (!creditUsed) {
          throw new Error('Impossible de décompter le crédit');
        }
        let improvedContent = response.content;
        
        // Appliquer la compression selon le mode
        if (mode === 'free') {
          const result = PromptCompressor.compressFree(improvedContent);
          improvedContent = result.compressed;
          console.log(`Mode Gratuit: ${result.estimatedTokens} tokens`);
        } else if (mode === 'basic') {
          const result = PromptCompressor.compressBasic(improvedContent);
          improvedContent = result.compressed;
          console.log(`Mode Basique: ${result.estimatedTokens} tokens`);
        } else {
          improvedContent = PromptCompressor.formatPremium(improvedContent);
        }
        
        setImprovedPrompt(improvedContent);
        toast({
          title: "Prompt amélioré !",
          description: `Mode ${mode === 'free' ? 'Gratuit' : mode === 'basic' ? 'Basique' : 'Premium'} avec ${complexity.suggestedProvider.toUpperCase()}`,
        });
      } else {
        throw new Error('Réponse invalide de l\'API');
      }

    } catch (error) {
      console.error('Erreur amélioration:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'améliorer le prompt. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedPrompt);
    toast({
      title: "Copié !",
      description: "Le prompt amélioré a été copié dans le presse-papiers.",
    });
  };

  const handleSavePrompt = async () => {
    if (!improvedPrompt || !originalPrompt) {
      toast({
        title: "Erreur",
        description: "Aucun prompt amélioré à sauvegarder.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveImprovedPrompt({
        originalPrompt: originalPrompt,
        improvedPrompt: improvedPrompt,
        qualityScore: 8,
        improvements: ["Optimisé via l'outil d'amélioration"],
        category: improvementObjective || "improvement",
        title: `Prompt Amélioré - ${new Date().toLocaleDateString()}`,
        tokensSaved: originalPrompt.length - improvedPrompt.length,
      });

      toast({
        title: "Succès !",
        description: "Le prompt amélioré a été sauvegardé.",
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder le prompt.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Amélioration de Prompts - Multi-API
          </CardTitle>
          <CardDescription className="text-lg">
            Sélection intelligente du meilleur modèle IA pour optimiser vos prompts
          </CardDescription>
          {aiSuggestion && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>IA sélectionnée:</strong> {aiSuggestion}
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Prompt original */}
          <div className="space-y-2">
            <Label htmlFor="original">Prompt à améliorer *</Label>
            <Textarea
              id="original"
              placeholder="Collez ici le prompt que vous souhaitez améliorer..."
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Objectif d'amélioration */}
          <div className="space-y-2">
            <Label htmlFor="objective">Objectif d'amélioration (optionnel)</Label>
            <Textarea
              id="objective"
              placeholder="Décrivez ce que vous souhaitez améliorer spécifiquement (ex: plus de clarté, meilleure structure, résultats plus précis...)"
              value={improvementObjective}
              onChange={(e) => setImprovementObjective(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Bouton d'amélioration */}
          <Button 
            onClick={improvePrompt}
            disabled={isLoading || !originalPrompt.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium py-3 h-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Amélioration en cours...
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5 mr-2" />
                Améliorer le Prompt
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      {improvedPrompt && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="gradient-text">Prompt Amélioré</span>
                {selectedProvider && (
                  <Badge variant="outline" className="ml-2">
                    {selectedProvider.toUpperCase()}: {selectedModel}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="border-white/30 dark:border-gray-700/30"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copier
                </Button>
                <Button
                  onClick={handleSavePrompt}
                  variant="outline"
                  size="sm"
                  className="border-white/30 dark:border-gray-700/30"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-white/20 dark:border-gray-700/20">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                {improvedPrompt}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptImprovementSupabase;
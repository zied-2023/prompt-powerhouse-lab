import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Copy, TrendingUp, CircleCheck as CheckCircle, Save, Info, Repeat } from "lucide-react";
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
import { metaPromptOptimizer } from "@/services/metaPromptOptimizer";
import { hierarchicalReflectiveOptimizer } from "@/services/hierarchicalReflectiveOptimizer";

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
  const [optimizerUsed, setOptimizerUsed] = useState<'meta' | 'reflective' | ''>('');
  const [reflectiveInsights, setReflectiveInsights] = useState<string>('');

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
      const isAuthenticated = !!user;
      const userHasCredits = (credits?.remaining_credits || 0) > 0;

      const result = await metaPromptOptimizer.optimizeWithMetaPrompt(
        originalPrompt,
        improvementObjective,
        userHasCredits,
        isAuthenticated
      );

      const creditUsed = await useCredit();
      if (!creditUsed) {
        throw new Error('Impossible de décompter le crédit');
      }

      setImprovedPrompt(result.optimizedPrompt);
      setOptimizerUsed('meta');
      setReflectiveInsights(result.metaReasoning);

      toast({
        title: "Prompt amélioré avec MetaPromptOptimizer",
        description: `Score: ${result.qualityScore.toFixed(1)}/10 | Confiance: ${(result.confidence * 100).toFixed(0)}%`,
      });

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

  const improveWithReflection = async () => {
    if (!improvedPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord améliorer le prompt avec MetaPromptOptimizer.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const isAuthenticated = !!user;
      const userHasCredits = (credits?.remaining_credits || 0) > 0;

      const failureContext = improvementObjective || "Optimisation itérative basée sur l'analyse des faiblesses";

      const result = await hierarchicalReflectiveOptimizer.optimizeWithReflection(
        improvedPrompt,
        failureContext,
        userHasCredits,
        isAuthenticated
      );

      const creditUsed = await useCredit();
      if (!creditUsed) {
        throw new Error('Impossible de décompter le crédit');
      }

      setImprovedPrompt(result.finalPrompt);
      setOptimizerUsed('reflective');
      setReflectiveInsights(result.reflectiveInsights);

      toast({
        title: "Optimisation réflexive terminée",
        description: `${result.iterations.length} itération(s) | Score: ${result.convergenceScore.toFixed(1)}/10`,
      });

    } catch (error) {
      console.error('Erreur optimisation réflexive:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'optimiser le prompt. Veuillez réessayer.",
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

          {/* Boutons d'amélioration */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={improvePrompt}
              disabled={isLoading || !originalPrompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 h-auto flex items-center justify-center"
            >
              {isLoading && optimizerUsed !== 'reflective' ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Amélioration...
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Améliorer
                </>
              )}
            </Button>

            <Button
              onClick={improveWithReflection}
              disabled={isLoading || !improvedPrompt.trim()}
              variant="outline"
              className="w-full border-2 border-purple-500 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 font-medium py-3 h-auto flex items-center justify-center"
            >
              {isLoading && optimizerUsed === 'reflective' ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Optimisation...
                </>
              ) : (
                <>
                  <Repeat className="h-5 w-5 mr-2" />
                  Optimiser (Réflexif)
                </>
              )}
            </Button>
          </div>

          {/* Info sur les optimiseurs */}
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <strong className="text-blue-700 dark:text-blue-300">MetaPromptOptimizer</strong>
              <p className="mt-1">Génération initiale avec approche méta-cognitive</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <strong className="text-purple-700 dark:text-purple-300">HierarchicalReflectiveOptimizer</strong>
              <p className="mt-1">Itérations basées sur l'analyse des échecs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultat */}
      {improvedPrompt && (
        <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="gradient-text">Prompt Amélioré</span>
                {optimizerUsed && (
                  <Badge
                    variant="outline"
                    className={optimizerUsed === 'meta'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 text-blue-700 dark:text-blue-300'
                      : 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 text-purple-700 dark:text-purple-300'
                    }
                  >
                    {optimizerUsed === 'meta' ? 'MetaPromptOptimizer' : 'HierarchicalReflective'}
                  </Badge>
                )}
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
          <CardContent className="space-y-4">
            {reflectiveInsights && (
              <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Insights de l'optimisation:</strong> {reflectiveInsights}
                </AlertDescription>
              </Alert>
            )}

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
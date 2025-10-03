import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Copy, TrendingUp, CircleCheck as CheckCircle, Save, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrompts } from "@/hooks/usePrompts";
import { supabase } from "@/integrations/supabase/client";
import { analyzePromptComplexity } from "@/lib/promptAnalyzer";
import { PromptCompressor } from "@/lib/promptCompressor";
import { useUserCredits } from "@/hooks/useUserCredits";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PromptImprovementSupabase = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  const { credits } = useUserCredits();
  
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
      // Déterminer si mode premium ou gratuit
      const isPremium = credits ? credits.remaining_credits > 20 : false;
      
      const systemPrompt = isPremium
        ? `Tu es un expert en optimisation de prompts pour l'intelligence artificielle. 

Ta mission est d'analyser et d'améliorer les prompts pour les rendre plus efficaces, précis et performants.

Critères d'amélioration :
- Clarté et précision des instructions
- Structure et organisation
- Contexte et exemples appropriés
- Contraintes et paramètres optimaux
- Réduction de l'ambiguïté
- Amélioration de la reproductibilité des résultats

Format de réponse :
1. **VERSION AMÉLIORÉE** : [prompt optimisé]
2. **AMÉLIORATIONS APPORTÉES** : [liste des modifications et justifications]
3. **CONSEILS D'UTILISATION** : [recommandations pour maximiser l'efficacité]

Conserve l'intention originale tout en optimisant la formulation et la structure.`
        : `Tu es un expert en optimisation de prompts. Améliore ce prompt de manière concise.

Réponds au format suivant:
**PROMPT AMÉLIORÉ:**
[Le prompt optimisé]

**AMÉLIORATIONS APPORTÉES:**
• [Amélioration 1]
• [Amélioration 2]
• [Amélioration 3]`;

      let userPrompt = `Améliore ce prompt: "${originalPrompt}"`;
      if (improvementObjective.trim()) {
        userPrompt += `\n\nObjectif d'amélioration spécifique: ${improvementObjective}`;
      }

      const { data, error } = await supabase.functions.invoke('chat-with-openai', {
        body: {
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
          model: complexity.suggestedModel,
          max_tokens: 2000,
          temperature: 0.7,
          provider: complexity.suggestedProvider
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.choices && data.choices[0]?.message?.content) {
        let improvedContent = data.choices[0].message.content;
        
        // Appliquer la compression si mode gratuit
        if (!isPremium) {
          const result = PromptCompressor.compressFree(improvedContent);
          improvedContent = result.compressed;
          console.log(`Compression: ${result.compressionRate}% (${result.originalLength} → ${result.compressedLength} caractères)`);
        }
        
        setImprovedPrompt(improvedContent);
        toast({
          title: "Prompt amélioré !",
          description: isPremium 
            ? `Mode Premium - Analyse détaillée avec ${complexity.suggestedProvider.toUpperCase()}`
            : `Mode Gratuit - Version optimisée avec ${complexity.suggestedProvider.toUpperCase()}`,
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
    if (!improvedPrompt) {
      toast({
        title: "Erreur",
        description: "Aucun prompt amélioré à sauvegarder.",
        variant: "destructive",
      });
      return;
    }

    await savePrompt({
      title: "Prompt Amélioré",
      content: improvedPrompt,
      description: "Prompt optimisé via l'outil d'amélioration",
      category: "improvement",
      tags: ["improved", "optimized"],
      is_public: false
    });
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
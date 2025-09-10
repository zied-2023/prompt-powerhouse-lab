import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Copy, 
  RefreshCw,
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
  Save
} from "lucide-react";
import { promptEvaluationService, type PromptEvaluationResult } from '@/services/promptEvaluationService';
import { usePrompts } from '@/hooks/usePrompts';

const PromptOptimizer = () => {
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [originalEvaluation, setOriginalEvaluation] = useState<PromptEvaluationResult | null>(null);
  const [optimizedEvaluation, setOptimizedEvaluation] = useState<PromptEvaluationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const { savePrompt, isSaving } = usePrompts();

  const handleOptimize = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un prompt à optimiser",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    
    try {
      // 1. Évaluer le prompt original
      const originalEval = await promptEvaluationService.evaluatePrompt(originalPrompt);
      setOriginalEvaluation(originalEval);

      // 2. Générer une version optimisée via IA
      const optimized = await generateOptimizedPrompt(originalPrompt, originalEval);
      setOptimizedPrompt(optimized);

      // 3. Évaluer le prompt optimisé
      const optimizedEval = await promptEvaluationService.evaluatePrompt(optimized);
      setOptimizedEvaluation(optimizedEval);

      const improvement = optimizedEval.overallScore - originalEval.overallScore;
      
      toast({
        title: "Optimisation terminée",
        description: `Amélioration de ${improvement > 0 ? '+' : ''}${improvement} points`,
        variant: improvement > 0 ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser le prompt. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const generateOptimizedPrompt = async (prompt: string, evaluation: PromptEvaluationResult): Promise<string> => {
    // Construire un prompt d'optimisation basé sur l'évaluation
    let optimizationInstructions = `Optimise ce prompt en appliquant ces améliorations spécifiques :\n\n`;
    
    evaluation.suggestions.forEach((suggestion, index) => {
      optimizationInstructions += `${index + 1}. ${suggestion.title}: ${suggestion.description}\n`;
      optimizationInstructions += `   Exemple: ${suggestion.example}\n\n`;
    });

    optimizationInstructions += `\nPrompt original à optimiser: "${prompt}"\n\n`;
    optimizationInstructions += `Réponds UNIQUEMENT avec le prompt optimisé, sans explication.`;

    // Appel à l'API pour l'optimisation
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 9rLgitb0iaYKdmdRzrkQhuAOBLldeJrj',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en optimisation de prompts. Tu dois améliorer les prompts selon les suggestions fournies.'
          },
          {
            role: 'user',
            content: optimizationInstructions
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'optimisation');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const copyOptimizedPrompt = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    toast({
      title: "Copié",
      description: "Le prompt optimisé a été copié dans le presse-papiers",
    });
  };

  const handleSaveOptimized = async () => {
    if (!optimizedPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Aucun prompt optimisé à sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const improvement = optimizedEvaluation && originalEvaluation 
      ? optimizedEvaluation.overallScore - originalEvaluation.overallScore 
      : 0;

    await savePrompt({
      title: `Prompt Optimisé (+${improvement} pts)`,
      content: optimizedPrompt,
      description: `Version optimisée avec amélioration de ${improvement} points`,
      category: 'optimized',
      tags: ['optimisé', 'amélioré', 'ia-generated']
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getImprovementBadge = (original: number, optimized: number) => {
    const diff = optimized - original;
    if (diff > 0) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
          +{diff} pts
        </Badge>
      );
    } else if (diff < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {diff} pts
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        Identique
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Optimiseur de Prompts IA
            </h3>
            <p className="text-muted-foreground">
              Améliorez automatiquement vos prompts grâce à notre système d'optimisation intelligent
            </p>
          </div>
        </div>
      </div>

      {/* Interface d'optimisation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Prompt original */}
        <Card className="glass-card border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-gray-500" />
              <span>Prompt Original</span>
            </CardTitle>
            <CardDescription>
              Saisissez le prompt que vous souhaitez optimiser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Collez ici votre prompt à optimiser..."
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="min-h-[200px] resize-none"
              disabled={isOptimizing}
            />
            
            {originalEvaluation && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score actuel</span>
                  <span className={`text-lg font-bold ${getScoreColor(originalEvaluation.overallScore)}`}>
                    {originalEvaluation.overallScore}/100
                  </span>
                </div>
                <Progress value={originalEvaluation.overallScore} className="h-2" />
                
                {originalEvaluation.feedback.weaknesses.length > 0 && (
                  <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                    <Lightbulb className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                      <strong>Points à améliorer:</strong> {originalEvaluation.feedback.weaknesses.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <Button 
              onClick={handleOptimize}
              disabled={isOptimizing || !originalPrompt.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              size="lg"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Optimisation en cours...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 mr-2" />
                  Optimiser le Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Prompt optimisé */}
        <Card className="glass-card border-white/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <span>Prompt Optimisé</span>
              </CardTitle>
              {optimizedPrompt && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={copyOptimizedPrompt}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveOptimized}
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!optimizedPrompt ? (
              <div className="text-center py-12 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Prêt pour l'optimisation</p>
                <p className="text-sm">Saisissez votre prompt original et lancez l'optimisation</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                  <pre className="whitespace-pre-wrap text-sm font-mono text-emerald-800 dark:text-emerald-200">
                    {optimizedPrompt}
                  </pre>
                </div>

                {optimizedEvaluation && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Score optimisé</span>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${getScoreColor(optimizedEvaluation.overallScore)}`}>
                          {optimizedEvaluation.overallScore}/100
                        </span>
                        {originalEvaluation && getImprovementBadge(originalEvaluation.overallScore, optimizedEvaluation.overallScore)}
                      </div>
                    </div>
                    <Progress value={optimizedEvaluation.overallScore} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comparaison détaillée */}
      {originalEvaluation && optimizedEvaluation && (
        <Card className="glass-card border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span>Comparaison Détaillée</span>
            </CardTitle>
            <CardDescription>
              Analyse comparative entre le prompt original et la version optimisée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scores" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scores">Scores par Critère</TabsTrigger>
                <TabsTrigger value="improvements">Améliorations</TabsTrigger>
              </TabsList>

              <TabsContent value="scores" className="space-y-4 mt-6">
                <div className="space-y-4">
                  {Object.entries(originalEvaluation.criteria).map(([criterion, originalScore]) => {
                    const optimizedScore = optimizedEvaluation.criteria[criterion as keyof typeof optimizedEvaluation.criteria];
                    const improvement = optimizedScore - originalScore;
                    
                    const labels = {
                      structure: 'Structure',
                      precision: 'Précision',
                      context: 'Contexte',
                      efficiency: 'Efficacité',
                      adaptability: 'Adaptabilité'
                    };

                    return (
                      <div key={criterion} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {labels[criterion as keyof typeof labels]}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {originalScore} → {optimizedScore}
                            </span>
                            <Badge variant={improvement > 0 ? "default" : improvement < 0 ? "destructive" : "secondary"}>
                              {improvement > 0 ? '+' : ''}{improvement}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Progress value={originalScore} className="h-2 opacity-60" />
                          <Progress value={optimizedScore} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Score global */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Score Global</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        <span className={getScoreColor(originalEvaluation.overallScore)}>
                          {originalEvaluation.overallScore}
                        </span>
                        <ArrowRight className="h-4 w-4 mx-2 inline" />
                        <span className={getScoreColor(optimizedEvaluation.overallScore)}>
                          {optimizedEvaluation.overallScore}
                        </span>
                      </span>
                      {getImprovementBadge(originalEvaluation.overallScore, optimizedEvaluation.overallScore)}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="improvements" className="space-y-4 mt-6">
                <div className="space-y-4">
                  {originalEvaluation.suggestions.map((suggestion, index) => (
                    <Card key={suggestion.id} className="border-l-4 border-l-emerald-500">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-semibold flex items-center">
                            <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                            {suggestion.title}
                          </h5>
                          <Badge variant="outline" className="text-xs">
                            Appliqué
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {suggestion.description}
                        </p>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded text-xs">
                          <strong>Résultat:</strong> Cette amélioration a contribué à l'optimisation globale du prompt
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {originalEvaluation.suggestions.length === 0 && (
                  <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      Votre prompt original était déjà de bonne qualité. L'optimisation s'est concentrée sur des ajustements mineurs.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Guide d'utilisation */}
      <Card className="glass-card border-white/30 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <Lightbulb className="h-5 w-5" />
            <span>Comment ça marche</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <h4 className="font-semibold">Analyse</h4>
              <p className="text-sm text-muted-foreground">
                Notre IA évalue votre prompt selon 5 critères de qualité
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
              </div>
              <h4 className="font-semibold">Optimisation</h4>
              <p className="text-sm text-muted-foreground">
                Génération automatique d'une version améliorée basée sur les faiblesses détectées
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">3</span>
              </div>
              <h4 className="font-semibold">Validation</h4>
              <p className="text-sm text-muted-foreground">
                Comparaison des scores pour mesurer l'amélioration obtenue
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptOptimizer;
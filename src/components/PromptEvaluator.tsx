import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  TrendingUp, 
  Copy, 
  Download,
  RefreshCw,
  Target,
  Zap,
  Eye,
  Award,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { promptEvaluationService, type PromptEvaluationResult } from '@/services/promptEvaluationService';

const PromptEvaluator = () => {
  const [promptContent, setPromptContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [targetModel, setTargetModel] = useState('gpt-4');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<PromptEvaluationResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const categories = [
    { value: 'content-marketing', label: 'Marketing de Contenu' },
    { value: 'technical-documentation', label: 'Documentation Technique' },
    { value: 'data-analysis', label: 'Analyse de Données' },
    { value: 'creative-writing', label: 'Écriture Créative' },
    { value: 'default', label: 'Général' }
  ];

  const targetModels = [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5', label: 'GPT-3.5' },
    { value: 'claude', label: 'Claude' },
    { value: 'mistral', label: 'Mistral' },
    { value: 'llama', label: 'Llama' }
  ];

  const handleEvaluate = async () => {
    if (!promptContent.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un prompt à évaluer",
        variant: "destructive"
      });
      return;
    }

    setIsEvaluating(true);
    
    try {
      const result = await promptEvaluationService.evaluatePrompt(
        promptContent, 
        selectedCategory, 
        targetModel
      );
      
      setEvaluation(result);
      setActiveTab('overview');
      
      toast({
        title: "Évaluation terminée",
        description: `Score global: ${result.overallScore}/100`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'évaluation",
        description: "Impossible d'évaluer le prompt. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    if (score >= 70) return <CheckCircle className="h-5 w-5 text-blue-500" />;
    if (score >= 50) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      excellent: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    const labels = {
      excellent: 'Excellent',
      good: 'Bon',
      average: 'Moyen',
      poor: 'Faible'
    };

    return (
      <Badge className={styles[level as keyof typeof styles]}>
        {labels[level as keyof typeof labels]}
      </Badge>
    );
  };

  const copyReport = () => {
    if (!evaluation) return;
    
    const report = promptEvaluationService.generateEvaluationReport(evaluation);
    navigator.clipboard.writeText(report);
    
    toast({
      title: "Rapport copié",
      description: "Le rapport d'évaluation a été copié dans le presse-papiers",
    });
  };

  const downloadReport = () => {
    if (!evaluation) return;
    
    const report = promptEvaluationService.generateEvaluationReport(evaluation);
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evaluation-prompt-${evaluation.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Rapport téléchargé",
      description: "Le rapport d'évaluation a été téléchargé",
    });
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Évaluateur de Prompts IA
            </h3>
            <p className="text-muted-foreground">
              Analysez et optimisez la qualité de vos prompts avec notre système d'évaluation automatisé
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire d'évaluation */}
        <Card className="glass-card border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span>Configuration de l'Évaluation</span>
            </CardTitle>
            <CardDescription>
              Saisissez votre prompt et configurez les paramètres d'évaluation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Prompt à évaluer */}
            <div className="space-y-2">
              <Label htmlFor="prompt-content">Prompt à évaluer *</Label>
              <Textarea
                id="prompt-content"
                placeholder="Collez ici le prompt que vous souhaitez évaluer..."
                value={promptContent}
                onChange={(e) => setPromptContent(e.target.value)}
                className="min-h-[150px] resize-none"
                disabled={isEvaluating}
              />
              <div className="text-xs text-muted-foreground">
                {promptContent.length} caractères • {promptContent.split(' ').length} mots
              </div>
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie d'usage</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isEvaluating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-model">Modèle cible</Label>
                <Select value={targetModel} onValueChange={setTargetModel} disabled={isEvaluating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetModels.map(model => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bouton d'évaluation */}
            <Button 
              onClick={handleEvaluate}
              disabled={isEvaluating || !promptContent.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              size="lg"
            >
              {isEvaluating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Évaluation en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Évaluer le Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Résultats d'évaluation */}
        <Card className="glass-card border-white/30 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-500" />
                <span>Résultats d'Évaluation</span>
              </CardTitle>
              {evaluation && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={copyReport}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadReport}>
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!evaluation ? (
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Prêt pour l'évaluation</p>
                <p className="text-sm">Configurez votre prompt et lancez l'analyse pour voir les résultats détaillés</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  {/* Score global */}
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      {getScoreIcon(evaluation.overallScore)}
                      <div>
                        <div className={`text-4xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                          {evaluation.overallScore}/100
                        </div>
                        <div className="text-sm text-muted-foreground">Score Global</div>
                      </div>
                      {getLevelBadge(evaluation.feedback.level)}
                    </div>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {evaluation.feedback.summary}
                    </p>
                  </div>

                  {/* Critères détaillés */}
                  <div className="space-y-4">
                    {Object.entries(evaluation.criteria).map(([criterion, score]) => {
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
                            <span className={`font-bold ${getScoreColor(score)}`}>
                              {score}/100
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Points forts et faiblesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluation.feedback.strengths.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Points Forts
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.feedback.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-emerald-600 dark:text-emerald-400 flex items-start">
                              <span className="w-1 h-1 bg-emerald-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {evaluation.feedback.weaknesses.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-700 dark:text-red-300 flex items-center">
                          <XCircle className="h-4 w-4 mr-2" />
                          Points d'Amélioration
                        </h4>
                        <ul className="space-y-1">
                          {evaluation.feedback.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-sm text-red-600 dark:text-red-400 flex items-start">
                              <span className="w-1 h-1 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-6 mt-6">
                  {/* Analyse détaillée par critère */}
                  <div className="space-y-4">
                    {Object.entries(evaluation.criteria).map(([criterion, score]) => {
                      const labels = {
                        structure: { 
                          title: 'Structure et Organisation',
                          description: 'Cohérence logique, hiérarchie des instructions, clarté de l\'organisation'
                        },
                        precision: { 
                          title: 'Précision et Clarté',
                          description: 'Spécificité des termes, absence d\'ambiguïté, définitions claires'
                        },
                        context: { 
                          title: 'Richesse Contextuelle',
                          description: 'Informations contextuelles pertinentes, background suffisant'
                        },
                        efficiency: { 
                          title: 'Efficacité Opérationnelle',
                          description: 'Capacité à générer des sorties utiles et pertinentes'
                        },
                        adaptability: { 
                          title: 'Adaptabilité Multi-modèles',
                          description: 'Compatibilité avec différents modèles d\'IA'
                        }
                      };
                      
                      const info = labels[criterion as keyof typeof labels];
                      
                      return (
                        <Card key={criterion} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{info.title}</h4>
                              <div className="flex items-center space-x-2">
                                <span className={`text-lg font-bold ${getScoreColor(score)}`}>
                                  {score}
                                </span>
                                <span className="text-sm text-muted-foreground">/100</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {info.description}
                            </p>
                            <Progress value={score} className="h-2" />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Benchmark */}
                  {evaluation.benchmarkComparison && (
                    <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2 text-violet-700 dark:text-violet-300">
                          <Award className="h-5 w-5" />
                          <span>Comparaison Benchmark</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                              {evaluation.benchmarkComparison.percentile}%
                            </div>
                            <div className="text-xs text-muted-foreground">Percentile</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                              {evaluation.benchmarkComparison.averageScore}
                            </div>
                            <div className="text-xs text-muted-foreground">Moyenne catégorie</div>
                          </div>
                          <div>
                            <div className="flex items-center justify-center">
                              {evaluation.overallScore > evaluation.benchmarkComparison.averageScore ? (
                                <ArrowUp className="h-6 w-6 text-emerald-500" />
                              ) : evaluation.overallScore < evaluation.benchmarkComparison.averageScore ? (
                                <ArrowDown className="h-6 w-6 text-red-500" />
                              ) : (
                                <Minus className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">vs Moyenne</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-6 mt-6">
                  {evaluation.suggestions.length === 0 ? (
                    <Alert className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                        <strong>Excellent travail !</strong> Votre prompt est déjà très bien optimisé. 
                        Aucune amélioration majeure n'est nécessaire.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-semibold">Suggestions d'Amélioration</h4>
                        <Badge variant="secondary">{evaluation.suggestions.length} suggestion{evaluation.suggestions.length > 1 ? 's' : ''}</Badge>
                      </div>

                      {evaluation.suggestions.map((suggestion, index) => {
                        const impactColors = {
                          high: 'border-red-200 bg-red-50 dark:bg-red-900/20',
                          medium: 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20',
                          low: 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                        };

                        const difficultyIcons = {
                          easy: '🟢',
                          medium: '🟡',
                          hard: '🔴'
                        };

                        return (
                          <Card key={suggestion.id} className={`${impactColors[suggestion.impact]} border-l-4`}>
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between mb-2">
                                <h5 className="font-semibold">{suggestion.title}</h5>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    Impact {suggestion.impact}
                                  </Badge>
                                  <span className="text-sm">
                                    {difficultyIcons[suggestion.difficulty]} {suggestion.difficulty}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {suggestion.description}
                              </p>
                              <div className="bg-background/50 p-3 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Exemple d'amélioration :</div>
                                <code className="text-sm font-mono">
                                  {suggestion.example}
                                </code>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exemples de prompts évalués */}
      <Card className="glass-card border-white/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <span>Exemples d'Évaluations</span>
          </CardTitle>
          <CardDescription>
            Découvrez comment différents prompts sont évalués par notre système
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exemple 1 - Prompt faible */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    Score: 35/100
                  </Badge>
                  <XCircle className="h-5 w-5 text-red-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <div className="text-xs text-red-600 dark:text-red-400 mb-1">Prompt original :</div>
                  <code className="text-sm">"Écris un article sur les chatbots."</code>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Structure:</span>
                    <span className="text-red-600">20/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Précision:</span>
                    <span className="text-red-600">25/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contexte:</span>
                    <span className="text-red-600">15/100</span>
                  </div>
                </div>
                <div className="text-xs text-red-600 dark:text-red-400">
                  <strong>Problèmes:</strong> Manque de contexte, objectif flou, aucune contrainte
                </div>
              </CardContent>
            </Card>

            {/* Exemple 2 - Prompt moyen */}
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Score: 72/100
                  </Badge>
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Prompt amélioré :</div>
                  <code className="text-sm">"Rédige un article de 800 mots sur les chatbots pour des PME, ton professionnel."</code>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Structure:</span>
                    <span className="text-yellow-600">75/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Précision:</span>
                    <span className="text-yellow-600">80/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contexte:</span>
                    <span className="text-yellow-600">65/100</span>
                  </div>
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400">
                  <strong>À améliorer:</strong> Ajouter des exemples, préciser le format de sortie
                </div>
              </CardContent>
            </Card>

            {/* Exemple 3 - Prompt excellent */}
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                    Score: 94/100
                  </Badge>
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Prompt optimisé :</div>
                  <code className="text-sm">"**RÔLE**: Expert en IA conversationnelle **MISSION**: Rédiger un article de 1000 mots sur les chatbots pour PME françaises **FORMAT**: Introduction + 3 sections + conclusion avec CTA **TON**: Professionnel mais accessible **CONTRAINTES**: Inclure 3 études de cas réelles et une FAQ"</code>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Structure:</span>
                    <span className="text-emerald-600">95/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Précision:</span>
                    <span className="text-emerald-600">92/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contexte:</span>
                    <span className="text-emerald-600">96/100</span>
                  </div>
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">
                  <strong>Excellent:</strong> Structure claire, contexte riche, instructions précises
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptEvaluator;
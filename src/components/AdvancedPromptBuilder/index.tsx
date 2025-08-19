import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

import { 
  Brain, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  Eye,
  Sparkles,
  Save,
  Download,
  Copy,
  RefreshCw
} from "lucide-react";

import StepSelector from './StepSelector';
import StepContent from './StepContent';
import SmartSuggestions from './SmartSuggestions';
import LivePreview from './LivePreview';
import ValidationFeedback from './ValidationFeedback';
import { PromptData, StepConfig } from './types';
import { getStepConfigs } from './stepConfigs';
import { validateStep, calculateOverallProgress } from './utils';

const AdvancedPromptBuilder = () => {
  const { t } = useTranslation();
  const stepConfigs = getStepConfigs(t);
  
  // États principaux
  const [currentStep, setCurrentStep] = useState(0);
  const [promptData, setPromptData] = useState<PromptData>({
    aiModel: '',
    objective: '',
    context: '',
    audience: '',
    tone: '',
    constraints: [],
    outputFormat: '',
    examples: [],
    keywords: []
  });
  
  // États d'interaction
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // États de l'UI
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Sauvegarde automatique
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('advancedPromptBuilder', JSON.stringify({
        currentStep,
        promptData,
        completedSteps: Array.from(completedSteps)
      }));
      setLastSaved(new Date());
    }, 1000);
    
    return () => clearTimeout(saveTimer);
  }, [currentStep, promptData, completedSteps]);

  // Validation en temps réel
  useEffect(() => {
    const errors = validateStep(currentStep, promptData);
    setValidationErrors(errors);
    
    if (errors.length === 0 && promptData.objective) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  }, [currentStep, promptData]);

  // Génération de suggestions contextuelles
  useEffect(() => {
    const generateSuggestions = async () => {
      // Logique de génération de suggestions basée sur l'étape actuelle et les données
      const newSuggestions = await getContextualSuggestions(currentStep, promptData);
      setSuggestions(newSuggestions);
    };
    
    generateSuggestions();
  }, [currentStep, promptData]);

  const handleStepChange = (newStep: number) => {
    // Validation avant changement d'étape
    const canNavigate = newStep <= currentStep + 1 || completedSteps.has(newStep - 1);
    
    if (canNavigate) {
      setCurrentStep(newStep);
      setShowPreview(false);
    } else {
      toast({
        title: "Étape non accessible",
        description: "Complétez les étapes précédentes pour continuer.",
        variant: "destructive"
      });
    }
  };

  const handleNext = () => {
    if (validationErrors.length === 0 && currentStep < stepConfigs.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePrompt = async () => {
    setIsGenerating(true);
    try {
      // Simulation de génération avec l'API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const prompt = buildFinalPrompt(promptData);
      setGeneratedPrompt(prompt);
      setShowPreview(true);
      
      toast({
        title: "Prompt généré avec succès",
        description: "Votre prompt optimisé est prêt à être utilisé."
      });
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le prompt. Réessayez.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const currentStepConfig = stepConfigs[currentStep];
  const overallProgress = calculateOverallProgress(completedSteps, stepConfigs.length);
  const isLastStep = currentStep === stepConfigs.length - 1;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* En-tête avec progression */}
          <Card className="mb-6 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Assistant de Prompts Avancé
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Créez des prompts ultra-précis guidé par l'IA
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {lastSaved && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          <Save className="h-3 w-3 mr-1" />
                          Sauvegardé
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        Dernière sauvegarde: {lastSaved.toLocaleTimeString()}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                    Étape {currentStep + 1}/{stepConfigs.length}
                  </Badge>
                </div>
              </div>
              
              {/* Barre de progression globale */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progression globale</span>
                  <span>{Math.round(overallProgress)}% complété</span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className="h-3 bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Navigation des étapes (sidebar) */}
            <div className="lg:col-span-3">
              <StepSelector
                steps={stepConfigs}
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepChange={handleStepChange}
                validationErrors={validationErrors}
              />
            </div>

            {/* Contenu principal */}
            <div className="lg:col-span-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm min-h-[600px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <currentStepConfig.icon className="h-6 w-6 text-violet-600" />
                      <div>
                        <CardTitle className="text-xl">{currentStepConfig.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {currentStepConfig.description}
                        </p>
                      </div>
                    </div>
                    
                    {validationErrors.length === 0 && promptData.objective && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Valide
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Feedback de validation */}
                  <ValidationFeedback errors={validationErrors} />
                  
                  {/* Contenu de l'étape */}
                  <StepContent
                    stepConfig={currentStepConfig}
                    data={promptData}
                    onChange={setPromptData}
                    suggestions={suggestions}
                  />
                  
                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Précédent</span>
                    </Button>
                    
                    {!isLastStep ? (
                      <Button
                        onClick={handleNext}
                        disabled={validationErrors.length > 0}
                        className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                      >
                        <span>Suivant</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={generatePrompt}
                        disabled={isGenerating || validationErrors.length > 0}
                        className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Génération...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Générer le Prompt</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panneau latéral (suggestions et prévisualisation) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Suggestions intelligentes */}
              <SmartSuggestions
                suggestions={suggestions}
                onApplySuggestion={(suggestion) => {
                  // Logique d'application des suggestions
                  toast({
                    title: "Suggestion appliquée",
                    description: "La suggestion a été intégrée à votre prompt."
                  });
                }}
              />
              
              {/* Prévisualisation en temps réel */}
              {(promptData.objective || showPreview) && (
                <LivePreview
                  data={promptData}
                  generatedPrompt={generatedPrompt}
                  onCopy={() => {
                    navigator.clipboard.writeText(generatedPrompt);
                    toast({ title: "Copié !", description: "Prompt copié dans le presse-papiers." });
                  }}
                  onDownload={() => {
                    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'prompt-optimise.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                    toast({ title: "Téléchargé !", description: "Prompt sauvegardé." });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Fonctions utilitaires
async function getContextualSuggestions(step: number, data: PromptData): Promise<string[]> {
  // Simulation de suggestions basées sur l'IA
  const suggestionsByStep = {
    0: ["Essayez d'être spécifique sur le type de contenu", "Mentionnez le format de sortie souhaité"],
    1: ["Ajoutez des détails sur le contexte d'utilisation", "Précisez l'environnement ou la situation"],
    2: ["Définissez le niveau d'expertise de votre audience", "Mentionnez leurs préférences ou contraintes"],
    // ... autres étapes
  };
  
  return suggestionsByStep[step] || [];
}

function buildFinalPrompt(data: PromptData): string {
  return `# Prompt Optimisé

**Modèle IA ciblé:** ${data.aiModel}

**Objectif principal:** ${data.objective}

**Contexte:** ${data.context}

**Public cible:** ${data.audience}

**Ton et style:** ${data.tone}

**Format de sortie:** ${data.outputFormat}

**Contraintes:**
${data.constraints.map(c => `- ${c}`).join('\n')}

**Mots-clés importants:** ${data.keywords.join(', ')}

---

Générez une réponse qui respecte strictement tous ces critères.`;
}

export default AdvancedPromptBuilder;
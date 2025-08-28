
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Sparkles, Target, Users, Zap, CheckCircle, AlertCircle, Eye, Save, Info } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrompts } from "@/hooks/usePrompts";
import StepObjective from "./MultiStepPromptBuilder/StepObjective";
import StepContext from "./MultiStepPromptBuilder/StepContext";
import StepConstraints from "./MultiStepPromptBuilder/StepConstraints";
import StepOutputFormat from "./MultiStepPromptBuilder/StepOutputFormat";
import StepReview from "./MultiStepPromptBuilder/StepReview";

interface PromptData {
  objective: {
    mainGoal: string;
    specificTargets: string[];
    successCriteria: string;
  };
  context: {
    background: string;
    targetAudience: string;
    industry: string;
    constraints: string[];
  };
  requirements: {
    tone: string;
    length: string;
    format: string;
    style: string;
    technicalLevel: string;
  };
  outputFormat: {
    structure: string;
    sections: string[];
    deliverables: string[];
  };
}

const MultiStepPromptBuilder = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { savePrompt, isSaving } = usePrompts();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [previewPrompt, setPreviewPrompt] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const [promptData, setPromptData] = useState<PromptData>({
    objective: {
      mainGoal: '',
      specificTargets: [],
      successCriteria: ''
    },
    context: {
      background: '',
      targetAudience: '',
      industry: '',
      constraints: []
    },
    requirements: {
      tone: '',
      length: '',
      format: '',
      style: '',
      technicalLevel: ''
    },
    outputFormat: {
      structure: '',
      sections: [],
      deliverables: []
    }
  });

  const steps = [
    {
      id: 1,
      title: t('stepObjectiveTitle'),
      description: t('stepObjectiveDesc'),
      icon: Target,
      component: StepObjective
    },
    {
      id: 2,
      title: t('stepContextTitle'),
      description: t('stepContextDesc'),
      icon: Users,
      component: StepContext
    },
    {
      id: 3,
      title: t('stepConstraintsTitle'),
      description: t('stepConstraintsDesc'),
      icon: AlertCircle,
      component: StepConstraints
    },
    {
      id: 4,
      title: t('stepOutputFormatTitle'),
      description: t('stepOutputFormatDesc'),
      icon: Zap,
      component: StepOutputFormat
    },
    {
      id: 5,
      title: t('stepReviewTitle'),
      description: t('stepReviewDesc'),
      icon: CheckCircle,
      component: StepReview
    }
  ];

  const progress = (completedSteps.size / steps.length) * 100;

  // Sauvegarde automatique
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('multiStepPromptData', JSON.stringify(promptData));
      localStorage.setItem('multiStepCurrentStep', currentStep.toString());
      localStorage.setItem('multiStepCompletedSteps', JSON.stringify(Array.from(completedSteps)));
      setLastSaved(new Date());
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [promptData, currentStep, completedSteps]);

  // Chargement des données sauvegardées
  useEffect(() => {
    const savedData = localStorage.getItem('multiStepPromptData');
    const savedStep = localStorage.getItem('multiStepCurrentStep');
    const savedCompleted = localStorage.getItem('multiStepCompletedSteps');
    
    if (savedData) {
      setPromptData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedCompleted) {
      setCompletedSteps(new Set(JSON.parse(savedCompleted)));
    }
  }, []);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (currentStep < steps.length) {
          nextStep();
        } else {
          generateAdvancedPrompt();
        }
      }
      if (e.ctrlKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      }
      if (e.ctrlKey && e.key === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  // Aperçu en temps réel
  useEffect(() => {
    const generatePreview = () => {
      if (!promptData.objective.mainGoal) return;
      
      let preview = `**${promptData.objective.mainGoal}**\n`;
      
      if (promptData.context.targetAudience) {
        preview += `\nPublic: ${promptData.context.targetAudience}`;
      }
      
      if (promptData.requirements.tone) {
        preview += `\nTon: ${promptData.requirements.tone}`;
      }
      
      if (promptData.outputFormat.structure) {
        preview += `\nFormat: ${promptData.outputFormat.structure}`;
      }
      
      setPreviewPrompt(preview);
    };

    generatePreview();
  }, [promptData]);

  const validateStep = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return !!promptData.objective.mainGoal;
      case 2:
        return !!promptData.context.targetAudience;
      case 3:
        return !!promptData.requirements.tone;
      case 4:
        return !!promptData.outputFormat.structure;
      case 5:
        return true; // Review step is always valid
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      // Marquer l'étape actuelle comme complétée si elle est valide
      if (validateStep(currentStep)) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = useCallback((stepId: number) => {
    // Permettre la navigation libre vers les étapes complétées ou la suivante
    if (stepId <= Math.max(...Array.from(completedSteps), 0) + 1 || stepId === 1) {
      setCurrentStep(stepId);
    }
  }, [completedSteps]);

  const updatePromptData = (stepData: Partial<PromptData>) => {
    setPromptData(prev => ({ ...prev, ...stepData }));
    
    // Marquer l'étape actuelle comme complétée si elle devient valide
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    }
  };

  const generateAdvancedPrompt = async () => {
    setIsGenerating(true);
    
    try {
      // Simulation de génération de prompt avancé
      const advancedPrompt = `
**RÔLE EXPERT** : Expert spécialisé en ${promptData.context.industry}

**MISSION PRINCIPALE** : ${promptData.objective.mainGoal}

**OBJECTIFS SPÉCIFIQUES** :
${promptData.objective.specificTargets.map(target => `• ${target}`).join('\n')}

**CONTEXTE ET BACKGROUND** :
${promptData.context.background}

**PUBLIC CIBLE** : ${promptData.context.targetAudience}

**CRITÈRES DE SUCCÈS** : ${promptData.objective.successCriteria}

**CONTRAINTES TECHNIQUES** :
${promptData.context.constraints.map(constraint => `• ${constraint}`).join('\n')}

**MÉTHODOLOGIE** :
1. Analyser le contexte spécifique
2. Identifier les éléments clés
3. Structurer la réponse selon le format requis
4. Valider la cohérence globale

**FORMAT DE SORTIE** : ${promptData.outputFormat.structure}

**SECTIONS REQUISES** :
${promptData.outputFormat.sections.map(section => `• ${section}`).join('\n')}

**LIVRABLES ATTENDUS** :
${promptData.outputFormat.deliverables.map(deliverable => `• ${deliverable}`).join('\n')}

**STYLE ET TON** : ${promptData.requirements.tone}
**NIVEAU TECHNIQUE** : ${promptData.requirements.technicalLevel}
**LONGUEUR APPROXIMATIVE** : ${promptData.requirements.length}
      `;

      setGeneratedPrompt(advancedPrompt.trim());
      
      toast({
        title: t('advancedPromptGenerated'),
        description: t('advancedPromptGeneratedDesc'),
      });
    } catch (error) {
      toast({
        title: t('generationError'),
        description: t('tryAgainLater'),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: t('copiedSuccess'),
      description: t('promptCopiedClipboard'),
    });
  };

  const handleSavePrompt = async () => {
    if (!generatedPrompt) {
      toast({
        title: "Aucun prompt à sauvegarder",
        description: "Générez d'abord un prompt avant de le sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const title = `Prompt Multi-étapes - ${promptData.objective.mainGoal.slice(0, 50)}`;

    await savePrompt({
      title: title,
      content: generatedPrompt,
      description: promptData.objective.mainGoal,
      category: 'multi-step',
      tags: [promptData.context.industry, promptData.requirements.tone].filter(Boolean)
    });
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <TooltipProvider>
      <div className={`grid grid-cols-1 xl:grid-cols-3 gap-8 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Sidebar avec les étapes */}
        <div className="xl:col-span-1">
          <Card className="glass-card border-white/30 shadow-2xl sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle className={`flex items-center justify-between text-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse flex-row-reverse' : 'space-x-3'}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="gradient-text">{t('multiStepBuilder')}</span>
                </div>
                {lastSaved && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs opacity-75 hover:opacity-100 transition-opacity">
                        <Save className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sauvegardé automatiquement à {lastSaved.toLocaleTimeString()}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                {t('multiStepBuilderDesc')}
              </CardDescription>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('progress')}
                </span>
                <span className="text-sm font-bold text-violet-600">
                  {isRTL ? `${steps.length}/${currentStep}` : `${currentStep}/${steps.length}`}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-3">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = completedSteps.has(step.id);
                const isAccessible = step.id <= Math.max(...Array.from(completedSteps), 0) + 1 || step.id === 1;
                const isValid = validateStep(step.id);
                
                return (
                  <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => isAccessible && goToStep(step.id)}
                        className={`flex items-start ${isRTL ? 'space-x-reverse flex-row-reverse' : 'space-x-3'} p-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          isActive 
                            ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 shadow-lg' 
                            : isCompleted 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' 
                            : isAccessible
                            ? 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 cursor-pointer'
                            : 'bg-gray-25 dark:bg-gray-900/25 opacity-50'
                        } ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isActive 
                            ? 'bg-violet-600 text-white shadow-lg' 
                            : isCompleted 
                            ? 'bg-emerald-600 text-white' 
                            : isAccessible
                            ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <IconComponent className="h-4 w-4" />
                          )}
                        </div>
                        <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <h4 className={`font-semibold text-sm ${
                              isActive ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {step.title}
                            </h4>
                            {isActive && isValid && (
                              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          {isCompleted && (
                            <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs">
                              <CheckCircle className="h-3 w-3" />
                            </Badge>
                          )}
                          {isActive && (
                            <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs">
                              Actuel
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="text-sm">
                        <p className="font-medium">{step.title}</p>
                        <p className="text-muted-foreground">{step.description}</p>
                        {!isAccessible && (
                          <p className="text-orange-600 dark:text-orange-400 mt-1">
                            <Info className="h-3 w-3 inline mr-1" />
                            Complétez les étapes précédentes
                          </p>
                        )}
                        {isAccessible && !isCompleted && (
                          <p className="text-blue-600 dark:text-blue-400 mt-1">
                            Cliquez pour accéder
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
            
            {/* Aperçu en temps réel */}
            {previewPrompt && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aperçu</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <pre className={`text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
                    {previewPrompt}
                  </pre>
                </div>
              </div>
            )}
            
            {/* Raccourcis clavier */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p className="font-medium mb-2">Raccourcis clavier :</p>
                <p><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl + ↵</kbd> Étape suivante</p>
                <p><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl + ←</kbd> Étape précédente</p>
                <p><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl + →</kbd> Étape suivante</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <div className="xl:col-span-2 space-y-6">
        {/* Étape actuelle */}
        <Card className="glass-card border-white/30 shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700">
                  {t('step')} {currentStep}
                </Badge>
                <CardTitle className="text-2xl gradient-text">
                  {steps[currentStep - 1].title}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-muted-foreground font-medium">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              data={promptData}
              updateData={updatePromptData}
            />
          </CardContent>
        </Card>

        {/* Navigation améliorée */}
        <div className="flex justify-between items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{t('previous')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Étape précédente (Ctrl + ←)</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            {/* Indicateur de validation */}
            {validateStep(currentStep) ? (
              <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Validé
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 dark:text-orange-400">
                <AlertCircle className="h-3 w-3 mr-1" />
                À compléter
              </Badge>
            )}

            {currentStep < steps.length ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  >
                    <span>{t('next')}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Étape suivante (Ctrl + ↵)</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={generateAdvancedPrompt}
                    disabled={isGenerating || !validateStep(currentStep)}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center space-x-2 transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                  >
                    {isGenerating ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    <span>{isGenerating ? t('generating') : t('generateAdvancedPrompt')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Générer le prompt final (Ctrl + ↵)</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Résultat */}
        {generatedPrompt && (
          <Card className="glass-card border-white/30 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="gradient-text">{t('advancedPromptResult')}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    {t('copy')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSavePrompt} 
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="glass-card border-white/30 p-6 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed max-h-96 overflow-y-auto">
                  {generatedPrompt}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
};

export default MultiStepPromptBuilder;

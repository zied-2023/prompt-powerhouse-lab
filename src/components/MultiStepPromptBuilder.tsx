
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Sparkles, Target, Users, Zap, CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  
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

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePromptData = (stepData: Partial<PromptData>) => {
    setPromptData(prev => ({ ...prev, ...stepData }));
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

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Sidebar avec les étapes */}
      <div className="xl:col-span-1">
        <Card className="glass-card border-white/30 shadow-2xl sticky top-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="gradient-text">{t('multiStepBuilder')}</span>
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">
              {t('multiStepBuilderDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('progress')}
                </span>
                <span className="text-sm font-bold text-violet-600">
                  {currentStep}/{steps.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-3">
              {steps.map((step) => {
                const IconComponent = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;
                
                return (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700' 
                        : isCompleted 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20' 
                        : 'bg-gray-50 dark:bg-gray-800/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-violet-600 text-white' 
                        : isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm ${
                        isActive ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                    {isCompleted && (
                      <Badge variant="secondary" className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                );
              })}
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

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t('previous')}</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 flex items-center space-x-2"
            >
              <span>{t('next')}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={generateAdvancedPrompt}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center space-x-2"
            >
              {isGenerating ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>{isGenerating ? t('generating') : t('generateAdvancedPrompt')}</span>
            </Button>
          )}
        </div>

        {/* Résultat */}
        {generatedPrompt && (
          <Card className="glass-card border-white/30 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="gradient-text">{t('advancedPromptResult')}</CardTitle>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {t('copy')}
                </Button>
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
  );
};

export default MultiStepPromptBuilder;

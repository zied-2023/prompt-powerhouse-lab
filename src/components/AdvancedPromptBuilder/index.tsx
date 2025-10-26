import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { opikService } from "@/services/opikService";
import { SEMANTIC_COMPRESSION_STEPS } from "@/lib/semanticCompressionGuide";

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
import { validateStep, calculateOverallProgress, getStepSuggestions } from './utils';

const AdvancedPromptBuilder = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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
  const [stepSuggestions, setStepSuggestions] = useState<string[]>([]);
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

  // Suggestions en temps réel (plus de validation bloquante)
  useEffect(() => {
    const errors = validateStep(currentStep, promptData);
    const stepSuggs = getStepSuggestions(currentStep, promptData);
    
    setValidationErrors(errors);
    setStepSuggestions(stepSuggs);
    
    // Marquer l'étape comme visitée (plus de condition stricte)
    setCompletedSteps(prev => new Set([...prev, currentStep]));
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
    // Navigation libre - plus de restrictions
    setCurrentStep(newStep);
    setShowPreview(false);
  };

  const handleNext = () => {
    if (currentStep < stepConfigs.length - 1) {
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
    const startTime = Date.now();

    try {
      // Simulation de génération avec l'API
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prompt = buildFinalPrompt(promptData);
      const latency = Date.now() - startTime;
      setGeneratedPrompt(prompt);
      setShowPreview(true);

      // Enregistrer la trace dans Opik si l'utilisateur est connecté
      if (user) {
        const traceId = opikService.generateTraceId();

        // Créer une description de l'input basée sur les données du prompt
        const promptInput = `Générer un prompt avec: Objectif: ${promptData.objective}, Contexte: ${promptData.context}, Audience: ${promptData.audience}, Ton: ${promptData.tone}`;

        await opikService.createTrace({
          userId: user.id,
          traceId: traceId,
          promptInput: promptInput,
          promptOutput: prompt,
          model: promptData.aiModel || 'advanced-builder',
          latencyMs: latency,
          tokensUsed: Math.ceil(prompt.length / 4),
          cost: 0,
          tags: {
            source: 'advanced-builder',
            hasConstraints: promptData.constraints.length > 0,
            hasKeywords: promptData.keywords.length > 0,
            outputFormat: promptData.outputFormat
          }
        });

        console.log('✅ Trace créée dans Analytics pour le prompt avancé');
      }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-4">
        <div className="max-w-4xl mx-auto">
          
          {/* En-tête avec progression */}
          <Card className="mb-6 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      Générateur de Prompts Avancé
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                      Créez des prompts optimisés étape par étape
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs">
                    Étape {currentStep + 1}/{stepConfigs.length}
                  </Badge>
                </div>
              </div>
              
              {/* Barre de progression globale */}
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progression</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress 
                  value={overallProgress} 
                  className="h-2 bg-gray-100 dark:bg-gray-700"
                />
              </div>
            </CardHeader>
          </Card>

          {/* Sections colorées selon les images */}
          <div className="space-y-4">
            {stepConfigs.map((step, index) => {
              const isCurrentStep = index === currentStep;
              const isCompleted = completedSteps.has(index);
              
              // Couleurs selon les images fournies
              const getStepColors = (stepIndex: number) => {
                const colors = [
                  { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', accent: 'text-green-700 dark:text-green-300', icon: 'bg-green-100 dark:bg-green-800' },
                  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', accent: 'text-blue-700 dark:text-blue-300', icon: 'bg-blue-100 dark:bg-blue-800' },
                  { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-700', accent: 'text-purple-700 dark:text-purple-300', icon: 'bg-purple-100 dark:bg-purple-800' },
                  { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-700', accent: 'text-yellow-700 dark:text-yellow-300', icon: 'bg-yellow-100 dark:bg-yellow-800' },
                  { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-700', accent: 'text-red-700 dark:text-red-300', icon: 'bg-red-100 dark:bg-red-800' },
                  { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-700', accent: 'text-indigo-700 dark:text-indigo-300', icon: 'bg-indigo-100 dark:bg-indigo-800' }
                ];
                return colors[stepIndex % colors.length];
              };
              
              const colors = getStepColors(index);
              
              return (
                <Card 
                  key={step.id}
                  className={`${colors.bg} ${colors.border} ${isCurrentStep ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' : 'shadow-sm'} 
                    transition-all duration-200 cursor-pointer hover:shadow-md`}
                  onClick={() => handleStepChange(index)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${colors.icon} rounded-lg flex items-center justify-center`}>
                          <step.icon className={`h-4 w-4 ${colors.accent}`} />
                        </div>
                        <div>
                          <CardTitle className={`text-lg ${colors.accent} flex items-center gap-2`}>
                            {index + 1}. {step.title}
                            {isCompleted && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-xs ${colors.accent}`}>
                          {step.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {isCurrentStep && (
                    <CardContent className="space-y-4">
                      {/* Feedback de validation */}
                      <ValidationFeedback 
                        errors={validationErrors} 
                        suggestions={stepSuggestions}
                      />
                      
                      {/* Suggestions intelligentes */}
                      {suggestions.length > 0 && (
                        <SmartSuggestions
                          suggestions={suggestions}
                          onApplySuggestion={(suggestion) => {
                            // Appliquer la suggestion selon l'étape actuelle
                            applySuggestionToStep(currentStep, suggestion, promptData, setPromptData);
                          }}
                        />
                      )}
                      
                      {/* Contenu de l'étape */}
                      <StepContent
                        stepConfig={step}
                        data={promptData}
                        onChange={setPromptData}
                        suggestions={suggestions}
                      />
                      
                      {/* Navigation */}
                      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <Button
                          onClick={handlePrevious}
                          disabled={currentStep === 0}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Précédent</span>
                        </Button>
                        
                        {!isLastStep ? (
                          <Button
                            onClick={handleNext}
                            size="sm"
                            className="flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                          >
                            <span>Suivant</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            onClick={generatePrompt}
                            disabled={isGenerating}
                            size="sm"
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
                                <span>Générer le Prompt Optimisé</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Prévisualisation en temps réel */}
          {(promptData.objective || showPreview) && (
            <Card className="mt-6 border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
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
            </Card>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

// Fonctions utilitaires
function applySuggestionToStep(step: number, suggestion: string, data: PromptData, setData: (data: PromptData) => void) {
  switch (step) {
    case 0: // Objectif
      if (suggestion.includes('créer un article')) {
        setData({ ...data, objective: 'Créer un article de blog informatif et engageant' });
      } else if (suggestion.includes('générer du code')) {
        setData({ ...data, objective: 'Générer du code fonctionnel et bien documenté' });
      } else if (suggestion.includes('analyser des données')) {
        setData({ ...data, objective: 'Analyser des données et fournir des insights utiles' });
      }
      break;
    case 1: // Contexte
      if (suggestion.includes('entreprise')) {
        setData({ ...data, context: 'Dans le contexte d\'une entreprise moderne...' });
      } else if (suggestion.includes('éducation')) {
        setData({ ...data, context: 'Dans un environnement éducatif...' });
      }
      break;
    case 2: // Audience
      if (suggestion.includes('débutants')) {
        setData({ ...data, audience: 'Débutants sans expérience préalable' });
      } else if (suggestion.includes('experts')) {
        setData({ ...data, audience: 'Professionnels expérimentés dans le domaine' });
      }
      break;
    case 3: // Ton
      if (suggestion.includes('professionnel')) {
        setData({ ...data, tone: 'professional' });
      } else if (suggestion.includes('créatif')) {
        setData({ ...data, tone: 'creative' });
      }
      break;
    case 4: // Contraintes
      if (suggestion.includes('longueur')) {
        setData({ ...data, constraints: [...data.constraints, 'Maximum 500 mots'] });
      } else if (suggestion.includes('format')) {
        setData({ ...data, outputFormat: 'bullet-points' });
      }
      break;
  }
}

async function getContextualSuggestions(step: number, data: PromptData): Promise<string[]> {
  // Suggestions contextuelles basées sur l'étape et les données existantes
  const suggestionsByStep = {
    0: [ // Objectif
      "Créer un article de blog informatif et engageant",
      "Générer du code fonctionnel et bien documenté", 
      "Analyser des données et fournir des insights utiles",
      "Rédiger un email professionnel persuasif",
      "Expliquer un concept complexe simplement",
      "Créer un tutoriel étape par étape"
    ],
    1: [ // Contexte
      "Dans le contexte d'une entreprise moderne",
      "Dans un environnement éducatif",
      "Pour une audience internationale",
      "Dans le domaine de la technologie",
      "Pour un usage personnel",
      "Dans un contexte créatif"
    ],
    2: [ // Audience
      "Débutants sans expérience préalable",
      "Professionnels expérimentés dans le domaine",
      "Étudiants universitaires",
      "Dirigeants d'entreprise",
      "Grand public",
      "Experts techniques"
    ],
    3: [ // Ton et Style
      "Adopter un ton professionnel et formel",
      "Utiliser un style créatif et inspirant",
      "Employer un langage technique précis",
      "Privilégier un ton amical et accessible",
      "Adopter une approche pédagogique",
      "Utiliser un style persuasif"
    ],
    4: [ // Contraintes
      "Limiter la longueur à 500 mots maximum",
      "Utiliser un format de liste à puces",
      "Inclure des exemples concrets",
      "Éviter le jargon technique",
      "Structurer en sections courtes",
      "Ajouter des appels à l'action"
    ],
    5: [ // Optimisation
      "Ajouter des mots-clés pertinents",
      "Améliorer la structure du prompt",
      "Préciser le format de sortie souhaité",
      "Enrichir le contexte fourni",
      "Définir des critères de qualité",
      "Inclure des exemples de référence"
    ]
  };
  
  // Filtrer les suggestions basées sur les données existantes
  let suggestions = suggestionsByStep[step] || [];
  
  // Personnalisation basée sur les données déjà saisies
  if (step === 1 && data.objective.includes('code')) {
    suggestions = suggestions.filter(s => s.includes('technologie') || s.includes('technique'));
  }
  
  if (step === 2 && data.context.includes('entreprise')) {
    suggestions = suggestions.filter(s => s.includes('professionnel') || s.includes('dirigeants'));
  }
  
  return suggestions.slice(0, 6); // Limiter à 6 suggestions
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
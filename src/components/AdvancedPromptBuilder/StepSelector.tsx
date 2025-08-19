import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Clock, AlertCircle, Lock } from 'lucide-react';
import { StepConfig } from './types';
import { calculateStepProgress } from './utils';

interface StepSelectorProps {
  steps: StepConfig[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepChange: (step: number) => void;
  validationErrors: string[];
}

const StepSelector: React.FC<StepSelectorProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepChange,
  validationErrors
}) => {
  const isStepAccessible = (stepIndex: number) => {
    return stepIndex <= currentStep + 1 || completedSteps.has(stepIndex - 1) || stepIndex === 0;
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (isStepAccessible(stepIndex)) return 'accessible';
    return 'locked';
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-6">
      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">
            Étapes de Construction
          </h3>
          
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const IconComponent = step.icon;
            const hasErrors = index === currentStep && validationErrors.length > 0;
            
            return (
              <Tooltip key={step.id}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => isStepAccessible(index) && onStepChange(index)}
                    className={`
                      p-4 rounded-xl transition-all duration-300 cursor-pointer transform hover:scale-105
                      ${status === 'current' 
                        ? 'bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border-2 border-violet-300 dark:border-violet-600 shadow-lg' 
                        : status === 'completed'
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                        : status === 'accessible'
                        ? 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'bg-gray-25 dark:bg-gray-900/25 border border-gray-100 dark:border-gray-800 opacity-60 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Icône d'état */}
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                        ${status === 'current'
                          ? hasErrors 
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-violet-600 text-white shadow-lg animate-pulse'
                          : status === 'completed'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : status === 'accessible'
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                        }
                      `}>
                        {status === 'completed' ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : status === 'locked' ? (
                          <Lock className="h-4 w-4" />
                        ) : hasErrors ? (
                          <AlertCircle className="h-5 w-5" />
                        ) : (
                          <IconComponent className="h-5 w-5" />
                        )}
                      </div>
                      
                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`
                            font-medium text-sm
                            ${status === 'current' 
                              ? 'text-violet-800 dark:text-violet-200' 
                              : status === 'completed'
                              ? 'text-emerald-800 dark:text-emerald-200'
                              : 'text-gray-700 dark:text-gray-300'
                            }
                          `}>
                            {step.title}
                          </h4>
                          
                          {/* Badges de statut */}
                          <div className="flex items-center space-x-1">
                            {step.required && (
                              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                                Requis
                              </Badge>
                            )}
                            {status === 'current' && !hasErrors && (
                              <Badge variant="secondary" className="text-xs bg-violet-100 text-violet-700">
                                Actuel
                              </Badge>
                            )}
                            {hasErrors && (
                              <Badge variant="destructive" className="text-xs">
                                {validationErrors.length}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {step.description}
                        </p>
                        
                        {/* Temps estimé */}
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{step.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    {step.tips && step.tips.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                          💡 Conseils:
                        </p>
                        <ul className="text-xs space-y-1">
                          {step.tips.slice(0, 2).map((tip, i) => (
                            <li key={i} className="text-muted-foreground">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {status === 'locked' && (
                      <p className="text-xs text-orange-600 dark:text-orange-400">
                        🔒 Complétez les étapes précédentes
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Légende */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Légende</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">Étape actuelle</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span className="text-gray-600 dark:text-gray-400">Complété</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">Verrouillé</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepSelector;
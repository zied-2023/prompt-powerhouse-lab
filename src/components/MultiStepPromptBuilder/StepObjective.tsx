
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StepObjectiveProps {
  data: any;
  updateData: (data: any) => void;
}

const StepObjective = ({ data, updateData }: StepObjectiveProps) => {
  const { t } = useTranslation();

  // Suggestions pour l'objectif principal
  const objectiveSuggestions = [
    "Créer une stratégie marketing complète pour lancer un nouveau produit sur le marché français",
    "Développer un plan de formation pour améliorer les compétences techniques de l'équipe",
    "Analyser les performances de vente et proposer des actions d'amélioration",
    "Concevoir une campagne de communication interne pour motiver les employés",
    "Élaborer un guide complet d'onboarding pour les nouveaux collaborateurs"
  ];

  // Suggestions pour les cibles spécifiques
  const targetSuggestions = [
    "Augmenter les ventes de 25% dans les 6 prochains mois",
    "Améliorer la satisfaction client à 90% minimum",
    "Réduire les coûts opérationnels de 15%",
    "Développer 3 nouvelles fonctionnalités produit",
    "Former 100% de l'équipe aux nouvelles procédures"
  ];

  // Suggestions pour les critères de succès
  const successCriteriaSuggestions = [
    "Atteinte des objectifs chiffrés dans les délais impartis",
    "Feedback positif de 85% des utilisateurs finaux",
    "Réduction mesurable des indicateurs clés",
    "Adoption généralisée par l'équipe cible",
    "ROI positif démontré dans les 3 mois"
  ];

  const applySuggestion = (field: string, suggestion: string) => {
    if (field === 'objective') {
      updateData({
        objective: {
          ...data.objective,
          mainGoal: suggestion
        }
      });
    } else if (field === 'success') {
      updateData({
        objective: {
          ...data.objective,
          successCriteria: suggestion
        }
      });
    }
  };

  const addTarget = () => {
    const newTargets = [...(data.objective?.specificTargets || []), ''];
    updateData({
      objective: {
        ...data.objective,
        specificTargets: newTargets
      }
    });
  };

  const addTargetFromSuggestion = (suggestion: string) => {
    const newTargets = [...(data.objective?.specificTargets || []), suggestion];
    updateData({
      objective: {
        ...data.objective,
        specificTargets: newTargets
      }
    });
  };

  const updateTarget = (index: number, value: string) => {
    const newTargets = [...(data.objective?.specificTargets || [])];
    newTargets[index] = value;
    updateData({
      objective: {
        ...data.objective,
        specificTargets: newTargets
      }
    });
  };

  const removeTarget = (index: number) => {
    const newTargets = data.objective?.specificTargets?.filter((_: any, i: number) => i !== index) || [];
    updateData({
      objective: {
        ...data.objective,
        specificTargets: newTargets
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="mainGoal" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('mainObjective')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="mainGoal"
          placeholder={t('mainObjectivePlaceholder')}
          value={data.objective?.mainGoal || ''}
          onChange={(e) => updateData({
            objective: {
              ...data.objective,
              mainGoal: e.target.value
            }
          })}
          className="animated-border min-h-[100px] bg-white dark:bg-gray-800"
          rows={4}
        />
        
        {/* Suggestions pour l'objectif principal */}
        <Card className="border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Suggestions d'objectifs</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {objectiveSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/30 text-xs border-violet-300 dark:border-violet-600 transition-colors"
                  onClick={() => applySuggestion('objective', suggestion)}
                >
                  {suggestion.slice(0, 50)}...
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('specificTargets')}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addTarget}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>{t('addTarget')}</span>
          </Button>
        </div>
        
        {/* Suggestions pour les cibles */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Cibles fréquentes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {targetSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 text-xs border-blue-300 dark:border-blue-600 transition-colors"
                  onClick={() => addTargetFromSuggestion(suggestion)}
                >
                  + {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          {data.objective?.specificTargets?.map((target: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={t('targetPlaceholder')}
                value={target}
                onChange={(e) => updateTarget(index, e.target.value)}
                className="flex-1 animated-border bg-white dark:bg-gray-800"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTarget(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )) || []}
        </div>
        
        {(!data.objective?.specificTargets || data.objective.specificTargets.length === 0) && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm">{t('noTargetsYet')}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="successCriteria" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('successCriteria')}
        </Label>
        <Textarea
          id="successCriteria"
          placeholder={t('successCriteriaPlaceholder')}
          value={data.objective?.successCriteria || ''}
          onChange={(e) => updateData({
            objective: {
              ...data.objective,
              successCriteria: e.target.value
            }
          })}
          className="animated-border bg-white dark:bg-gray-800"
          rows={3}
        />
        
        {/* Suggestions pour les critères de succès */}
        <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Exemples de critères</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {successCriteriaSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-xs border-emerald-300 dark:border-emerald-600 transition-colors"
                  onClick={() => applySuggestion('success', suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">{t('stepObjectiveTips')}</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• {t('tipObjective1')}</li>
          <li>• {t('tipObjective2')}</li>
          <li>• {t('tipObjective3')}</li>
        </ul>
      </div>
    </div>
  );
};

export default StepObjective;

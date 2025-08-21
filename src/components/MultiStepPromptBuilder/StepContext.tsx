
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Lightbulb } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StepContextProps {
  data: any;
  updateData: (data: any) => void;
}

const StepContext = ({ data, updateData }: StepContextProps) => {
  const { t } = useTranslation();

  // Suggestions pour le contexte selon l'industrie
  const backgroundSuggestions = {
    'technology': [
      "Entreprise SaaS B2B cherchant à améliorer l'acquisition client",
      "Startup technologique en phase de scale-up",
      "Équipe développement travaillant sur une application mobile"
    ],
    'healthcare': [
      "Hôpital souhaitant digitaliser ses processus",
      "Cabinet médical modernisant sa gestion patient",
      "Laboratoire optimisant ses analyses"
    ],
    'finance': [
      "Banque digitale développant de nouveaux services",
      "Fintech cherchant à se conformer aux réglementations",
      "Assurance automatisant ses processus de souscription"
    ],
    'default': [
      "Organisation cherchant à optimiser ses processus internes",
      "Équipe projet travaillant sur une transformation digitale",
      "Entreprise souhaitant améliorer sa performance opérationnelle"
    ]
  };

  // Suggestions pour l'audience cible
  const audienceSuggestions = [
    "Dirigeants et décideurs stratégiques",
    "Équipes opérationnelles et managers",
    "Clients B2B professionnels",
    "Utilisateurs finaux grand public",
    "Partenaires et fournisseurs",
    "Investisseurs et parties prenantes"
  ];

  // Suggestions pour les contraintes
  const constraintSuggestions = [
    "Budget limité de 50k€ maximum",
    "Délai de livraison de 3 mois",
    "Conformité RGPD obligatoire",
    "Compatibilité avec les systèmes existants",
    "Formation des équipes requise",
    "Validation par le comité de direction"
  ];

  const applyBackgroundSuggestion = (suggestion: string) => {
    updateData({
      context: {
        ...data.context,
        background: suggestion
      }
    });
  };

  const applyAudienceSuggestion = (suggestion: string) => {
    updateData({
      context: {
        ...data.context,
        targetAudience: suggestion
      }
    });
  };

  const addConstraintFromSuggestion = (suggestion: string) => {
    const newConstraints = [...(data.context?.constraints || []), suggestion];
    updateData({
      context: {
        ...data.context,
        constraints: newConstraints
      }
    });
  };

  const industries = [
    { value: 'technology', label: t('technology') },
    { value: 'healthcare', label: t('healthcare') },
    { value: 'finance', label: t('finance') },
    { value: 'education', label: t('education') },
    { value: 'marketing', label: t('marketing') },
    { value: 'retail', label: t('retail') },
    { value: 'manufacturing', label: t('manufacturing') },
    { value: 'consulting', label: t('consulting') },
    { value: 'media', label: t('media') },
    { value: 'other', label: t('other') }
  ];

  const addConstraint = () => {
    const newConstraints = [...(data.context?.constraints || []), ''];
    updateData({
      context: {
        ...data.context,
        constraints: newConstraints
      }
    });
  };

  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...(data.context?.constraints || [])];
    newConstraints[index] = value;
    updateData({
      context: {
        ...data.context,
        constraints: newConstraints
      }
    });
  };

  const removeConstraint = (index: number) => {
    const newConstraints = data.context?.constraints?.filter((_: any, i: number) => i !== index) || [];
    updateData({
      context: {
        ...data.context,
        constraints: newConstraints
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="background" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('contextBackground')} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="background"
          placeholder={t('contextBackgroundPlaceholder')}
          value={data.context?.background || ''}
          onChange={(e) => updateData({
            context: {
              ...data.context,
              background: e.target.value
            }
          })}
          className="animated-border min-h-[120px] bg-white dark:bg-gray-800"
          rows={5}
        />
        
        {/* Suggestions pour le contexte */}
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Exemples de contexte</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(backgroundSuggestions[data.context?.industry as keyof typeof backgroundSuggestions] || backgroundSuggestions.default).map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 text-xs border-purple-300 dark:border-purple-600 transition-colors"
                  onClick={() => applyBackgroundSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('targetAudience')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="targetAudience"
            placeholder={t('targetAudiencePlaceholder')}
            value={data.context?.targetAudience || ''}
            onChange={(e) => updateData({
              context: {
                ...data.context,
                targetAudience: e.target.value
              }
            })}
            className="animated-border bg-white dark:bg-gray-800"
          />
          
          {/* Suggestions pour l'audience */}
          <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-900/10">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700 dark:text-teal-300">Audiences courantes</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {audienceSuggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-900/30 text-xs border-teal-300 dark:border-teal-600 transition-colors"
                    onClick={() => applyAudienceSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <Label htmlFor="industry" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('industry')} <span className="text-red-500">*</span>
          </Label>
          <Select value={data.context?.industry || ''} onValueChange={(value) => updateData({
            context: {
              ...data.context,
              industry: value
            }
          })}>
            <SelectTrigger className="animated-border bg-white dark:bg-gray-800">
              <SelectValue placeholder={t('selectIndustry')} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              {industries.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('contextConstraints')}
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addConstraint}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>{t('addConstraint')}</span>
          </Button>
        </div>
        
        {/* Suggestions pour les contraintes */}
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Contraintes fréquentes</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {constraintSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/30 text-xs border-orange-300 dark:border-orange-600 transition-colors"
                  onClick={() => addConstraintFromSuggestion(suggestion)}
                >
                  + {suggestion}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          {data.context?.constraints?.map((constraint: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={t('constraintPlaceholder')}
                value={constraint}
                onChange={(e) => updateConstraint(index, e.target.value)}
                className="flex-1 animated-border bg-white dark:bg-gray-800"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeConstraint(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )) || []}
        </div>
        
        {(!data.context?.constraints || data.context.constraints.length === 0) && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm">{t('noConstraintsYet')}</p>
          </div>
        )}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">{t('stepContextTips')}</h4>
        <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
          <li>• {t('tipContext1')}</li>
          <li>• {t('tipContext2')}</li>
          <li>• {t('tipContext3')}</li>
        </ul>
      </div>
    </div>
  );
};

export default StepContext;

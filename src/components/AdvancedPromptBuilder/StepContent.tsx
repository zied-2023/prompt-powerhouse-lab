import { useTranslation } from "@/hooks/useTranslation";
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Plus, X, Sparkles } from 'lucide-react';
import { StepConfig, PromptData } from './types';

interface StepContentProps {
  stepConfig: StepConfig;
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}

const StepContent: React.FC<StepContentProps> = ({
  stepConfig,
  data,
  onChange,
  suggestions
}) => {
  const { t } = useTranslation();
  
  const renderContent = () => {
    switch (stepConfig.component) {
      case 'ObjectiveStep':
        return <ObjectiveStep data={data} onChange={onChange} suggestions={suggestions} />;
      case 'ContextStep':
        return <ContextStep data={data} onChange={onChange} suggestions={suggestions} />;
      case 'AudienceStep':
        return <AudienceStep data={data} onChange={onChange} suggestions={suggestions} />;
      case 'ToneStep':
        return <ToneStep data={data} onChange={onChange} suggestions={suggestions} />;
      case 'ConstraintsStep':
        return <ConstraintsStep data={data} onChange={onChange} suggestions={suggestions} />;
      case 'OptimizationStep':
        return <OptimizationStep data={data} onChange={onChange} suggestions={suggestions} />;
      default:
        return <div>Contenu de l'étape en cours de développement...</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Conseils et exemples */}
      {stepConfig.tips && stepConfig.tips.length > 0 && (
        <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-700/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 {t('tipsForStep')}
                </h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  {stepConfig.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Contenu principal de l'étape */}
      {renderContent()}
      
      {/* Exemples si disponibles */}
      {stepConfig.examples && stepConfig.examples.length > 0 && (
        <Card className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-700/50">
          <CardContent className="p-4">
            <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('inspirationExamples')}
            </h4>
            <div className="space-y-2">
              {stepConfig.examples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-emerald-200/50 dark:border-emerald-700/50 text-sm cursor-pointer hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-colors"
                  onClick={() => {
                    // Logique pour appliquer l'exemple
                    if (stepConfig.component === 'ObjectiveStep') {
                      onChange({ ...data, objective: example });
                    }
                    // Ajouter d'autres cas selon le composant
                  }}
                >
                  "{example}"
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Composants spécifiques pour chaque étape

const ObjectiveStep: React.FC<{
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}> = ({ data, onChange, suggestions }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="aiModel" className="text-sm font-medium">
          {t('targetAiModel')}
        </Label>
        <Select
          value={data.aiModel}
          onValueChange={(value) => onChange({ ...data, aiModel: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={t('selectAiModel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
            <SelectItem value="claude">Claude</SelectItem>
            <SelectItem value="midjourney">Midjourney</SelectItem>
            <SelectItem value="dall-e">DALL-E</SelectItem>
            <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="objective" className="text-sm font-medium">
          {t('mainObjectiveRequired')}
        </Label>
        <Textarea
          id="objective"
          value={data.objective}
          onChange={(e) => onChange({ ...data, objective: e.target.value })}
          placeholder={t('mainObjectivePlaceholder')}
          className="mt-2 min-h-[120px]"
        />
        <p className="text-xs text-gray-500 mt-1">
          {data.objective.length}/500 {t('characters')}
        </p>
      </div>
    </div>
  );
};

const ContextStep: React.FC<{
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="context" className="text-sm font-medium">
          {t('contextOptional')}
        </Label>
        <Textarea
          id="context"
          value={data.context}
          onChange={(e) => onChange({ ...data, context: e.target.value })}
          placeholder={t('contextPlaceholder')}
          className="mt-2 min-h-[150px]"
        />
      </div>
    </div>
  );
};

const AudienceStep: React.FC<{
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="audience" className="text-sm font-medium">
          {t('targetAudience')} ({t('optional')})
        </Label>
        <Textarea
          id="audience"
          value={data.audience}
          onChange={(e) => onChange({ ...data, audience: e.target.value })}
          placeholder={t('audiencePlaceholder')}
          className="mt-2 min-h-[100px]"
        />
      </div>
    </div>
  );
};

const ToneStep: React.FC<{
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tone" className="text-sm font-medium">
          {t('toneStyle')} ({t('optional')})
        </Label>
        <Select
          value={data.tone}
          onValueChange={(value) => onChange({ ...data, tone: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={t('chooseTone')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">{t('professional')}</SelectItem>
            <SelectItem value="friendly">{t('friendly')}</SelectItem>
            <SelectItem value="formal">{t('formal')}</SelectItem>
            <SelectItem value="casual">{t('casual')}</SelectItem>
            <SelectItem value="technical">{t('technical')}</SelectItem>
            <SelectItem value="creative">{t('creative')}</SelectItem>
            <SelectItem value="persuasive">{t('persuasive')}</SelectItem>
            <SelectItem value="educational">{t('educational')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="outputFormat" className="text-sm font-medium">
          {t('outputFormat')}
        </Label>
        <Select
          value={data.outputFormat}
          onValueChange={(value) => onChange({ ...data, outputFormat: value })}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder={t('responseFormat')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">{t('paragraphs')}</SelectItem>
            <SelectItem value="bullet-points">{t('bulletPoints')}</SelectItem>
            <SelectItem value="numbered-list">{t('numberedList')}</SelectItem>
            <SelectItem value="table">{t('table')}</SelectItem>
            <SelectItem value="code">{t('codeScript')}</SelectItem>
            <SelectItem value="step-by-step">{t('stepByStep')}</SelectItem>
            <SelectItem value="json">{t('jsonFormat')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

const ConstraintsStep: React.FC<{
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}> = ({ data, onChange }) => {
  const { t } = useTranslation();
  
  const addConstraint = () => {
    onChange({ ...data, constraints: [...data.constraints, ''] });
  };
  
  const removeConstraint = (index: number) => {
    const newConstraints = data.constraints.filter((_, i) => i !== index);
    onChange({ ...data, constraints: newConstraints });
  };
  
  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...data.constraints];
    newConstraints[index] = value;
    onChange({ ...data, constraints: newConstraints });
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">
            {t('constraintsSpecs')}
          </Label>
          <Button
            onClick={addConstraint}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            {t('addConstraint')}
          </Button>
        </div>
        
        {data.constraints.length === 0 ? (
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-dashed">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-3">
                {t('noConstraintsDefined')}
              </p>
              <Button onClick={addConstraint} variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('addConstraintButton')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {data.constraints.map((constraint, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={constraint}
                  onChange={(e) => updateConstraint(index, e.target.value)}
                  placeholder={t('constraintPlaceholder')}
                  className="flex-1"
                />
                <Button
                  onClick={() => removeConstraint(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Mots-clés */}
      <div>
        <Label htmlFor="keywords" className="text-sm font-medium">
          {t('importantKeywords')}
        </Label>
        <Input
          id="keywords"
          value={data.keywords.join(', ')}
          onChange={(e) => onChange({ 
            ...data, 
            keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
          })}
          placeholder={t('keywordsPlaceholder')}
          className="mt-2"
        />
      </div>
    </div>
  );
};

const OptimizationStep: React.FC<{
  data: PromptData;
  onChange: (data: PromptData) => void;
  suggestions: string[];
}> = ({ data, onChange, suggestions }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200 dark:border-violet-700">
        <CardContent className="p-4">
          <h4 className="font-medium text-violet-900 dark:text-violet-100 mb-3">
            🚀 {t('suggestedOptimizations')}
          </h4>
          <div className="space-y-2">
            {suggestions.length === 0 ? (
              <p className="text-sm text-violet-700 dark:text-violet-300">
                {t('excellent')}
              </p>
            ) : (
              suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Badge variant="secondary" className="bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-violet-800 dark:text-violet-200 flex-1">
                    {suggestion}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <div>
        <Label className="text-sm font-medium">
          {t('configSummary')}
        </Label>
        <Card className="mt-2 bg-gray-50 dark:bg-gray-800/50">
          <CardContent className="p-4 text-sm space-y-2">
            <div><strong>{t('objective')}:</strong> {data.objective || 'Non défini'}</div>
            <div><strong>{t('targetAudience')}:</strong> {data.audience || 'Non défini'}</div>
            <div><strong>{t('toneStyle')}:</strong> {data.tone || 'Non défini'}</div>
            <div><strong>Contraintes:</strong> {data.constraints.length} élément(s)</div>
            <div><strong>Mots-clés:</strong> {data.keywords.length} élément(s)</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StepContent;
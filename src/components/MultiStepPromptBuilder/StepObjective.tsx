
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StepObjectiveProps {
  data: any;
  updateData: (data: any) => void;
}

const StepObjective = ({ data, updateData }: StepObjectiveProps) => {
  const { t } = useTranslation();

  const addTarget = () => {
    const newTargets = [...(data.objective?.specificTargets || []), ''];
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

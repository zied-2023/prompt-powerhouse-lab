
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StepContextProps {
  data: any;
  updateData: (data: any) => void;
}

const StepContext = ({ data, updateData }: StepContextProps) => {
  const { t } = useTranslation();

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

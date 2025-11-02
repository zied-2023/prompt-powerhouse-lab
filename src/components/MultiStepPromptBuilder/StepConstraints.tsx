
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";

interface StepConstraintsProps {
  data: any;
  updateData: (data: any) => void;
}

const StepConstraints = ({ data, updateData }: StepConstraintsProps) => {
  const { t } = useTranslation();

  const toneOptions = [
    { value: 'professional', label: t('professional') },
    { value: 'casual', label: t('casual') },
    { value: 'technical', label: t('technical') },
    { value: 'creative', label: t('creative') },
    { value: 'persuasive', label: t('persuasive') },
    { value: 'educational', label: t('educational') },
    { value: 'authoritative', label: t('authoritative') },
    { value: 'friendly', label: t('friendly') }
  ];

  const lengthOptions = [
    { value: 'brief', label: t('brief') },
    { value: 'concise', label: t('concise') },
    { value: 'detailed', label: t('detailed') },
    { value: 'comprehensive', label: t('comprehensive') },
    { value: 'extensive', label: t('extensive') }
  ];

  const formatOptions = [
    { value: 'structured-report', label: t('structuredReport') },
    { value: 'bullet-points', label: t('bulletPoints') },
    { value: 'narrative', label: t('narrative') },
    { value: 'step-by-step', label: t('stepByStep') },
    { value: 'qa-format', label: t('qaFormat') },
    { value: 'presentation', label: t('presentation') }
  ];

  const styleOptions = [
    { value: 'analytical', label: t('analytical') },
    { value: 'descriptive', label: t('descriptive') },
    { value: 'comparative', label: t('comparative') },
    { value: 'argumentative', label: t('argumentative') },
    { value: 'instructional', label: t('instructional') },
    { value: 'consultative', label: t('consultative') }
  ];

  const technicalLevelOptions = [
    { value: 'beginner', label: t('beginner') },
    { value: 'intermediate', label: t('intermediate') },
    { value: 'advanced', label: t('advanced') },
    { value: 'expert', label: t('expert') }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card border-white/30">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('toneStyle')} <span className="text-red-500">*</span>
              </Label>
              <Select value={data.requirements?.tone || ''} onValueChange={(value) => updateData({
                requirements: {
                  ...data.requirements,
                  tone: value
                }
              })}>
                <SelectTrigger className="animated-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('selectTone')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('approximateLength')} <span className="text-red-500">*</span>
              </Label>
              <Select value={data.requirements?.length || ''} onValueChange={(value) => updateData({
                requirements: {
                  ...data.requirements,
                  length: value
                }
              })}>
                <SelectTrigger className="animated-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('selectLength')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {lengthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('technicalLevel')} <span className="text-red-500">*</span>
              </Label>
              <Select value={data.requirements?.technicalLevel || ''} onValueChange={(value) => updateData({
                requirements: {
                  ...data.requirements,
                  technicalLevel: value
                }
              })}>
                <SelectTrigger className="animated-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('selectTechnicalLevel')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {technicalLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/30">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('responseFormat')} <span className="text-red-500">*</span>
              </Label>
              <Select value={data.requirements?.format || ''} onValueChange={(value) => updateData({
                requirements: {
                  ...data.requirements,
                  format: value
                }
              })}>
                <SelectTrigger className="animated-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('selectFormat')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {formatOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('writingStyle')} <span className="text-red-500">*</span>
              </Label>
              <Select value={data.requirements?.style || ''} onValueChange={(value) => updateData({
                requirements: {
                  ...data.requirements,
                  style: value
                }
              })}>
                <SelectTrigger className="animated-border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('selectStyle')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
        <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">{t('stepConstraintsTips')}</h4>
        <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
          <li>• {t('tipConstraints1')}</li>
          <li>• {t('tipConstraints2')}</li>
          <li>• {t('tipConstraints3')}</li>
        </ul>
      </div>
    </div>
  );
};

export default StepConstraints;

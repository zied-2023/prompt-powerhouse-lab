
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Target, Users, Settings, FileText } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StepReviewProps {
  data: any;
  updateData: (data: any) => void;
}

const StepReview = ({ data, updateData }: StepReviewProps) => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t('objectiveReview'),
      icon: Target,
      content: [
        { label: t('mainObjective'), value: data.objective?.mainGoal },
        { label: t('specificTargets'), value: data.objective?.specificTargets?.length > 0 ? data.objective.specificTargets.join(', ') : t('notSpecified') },
        { label: t('successCriteria'), value: data.objective?.successCriteria || t('notSpecified') }
      ]
    },
    {
      title: t('contextReview'),
      icon: Users,
      content: [
        { label: t('contextBackground'), value: data.context?.background },
        { label: t('targetAudience'), value: data.context?.targetAudience },
        { label: t('industry'), value: data.context?.industry },
        { label: t('contextConstraints'), value: data.context?.constraints?.length > 0 ? data.context.constraints.join(', ') : t('notSpecified') }
      ]
    },
    {
      title: t('requirementsReview'),
      icon: Settings,
      content: [
        { label: t('toneStyle'), value: data.requirements?.tone },
        { label: t('approximateLength'), value: data.requirements?.length },
        { label: t('responseFormat'), value: data.requirements?.format },
        { label: t('writingStyle'), value: data.requirements?.style },
        { label: t('technicalLevel'), value: data.requirements?.technicalLevel }
      ]
    },
    {
      title: t('outputFormatReview'),
      icon: FileText,
      content: [
        { label: t('outputStructure'), value: data.outputFormat?.structure },
        { label: t('requiredSections'), value: data.outputFormat?.sections?.length > 0 ? data.outputFormat.sections.join(', ') : t('notSpecified') },
        { label: t('expectedDeliverables'), value: data.outputFormat?.deliverables?.length > 0 ? data.outputFormat.deliverables.join(', ') : t('notSpecified') }
      ]
    }
  ];

  const getCompletionStatus = () => {
    const requiredFields = [
      data.objective?.mainGoal,
      data.context?.background,
      data.context?.targetAudience,
      data.context?.industry,
      data.requirements?.tone,
      data.requirements?.length,
      data.requirements?.format,
      data.requirements?.style,
      data.requirements?.technicalLevel,
      data.outputFormat?.structure
    ];

    const completed = requiredFields.filter(field => field && field.trim() !== '').length;
    const total = requiredFields.length;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const completionStatus = getCompletionStatus();
  const isComplete = completionStatus.completed === completionStatus.total;

  return (
    <div className="space-y-6">
      {/* Status de completion */}
      <Card className={`glass-card border-white/30 ${isComplete ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isComplete ? (
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              ) : (
                <AlertCircle className="h-6 w-6 text-amber-600" />
              )}
              <div>
                <h3 className={`font-semibold ${isComplete ? 'text-emerald-800 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}`}>
                  {isComplete ? t('readyToGenerate') : t('almostReady')}
                </h3>
                <p className={`text-sm ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {isComplete ? t('allRequiredFieldsCompleted') : t('someFieldsMissing')}
                </p>
              </div>
            </div>
            <Badge variant={isComplete ? 'default' : 'secondary'} className={isComplete ? 'bg-emerald-600' : 'bg-amber-600'}>
              {completionStatus.completed}/{completionStatus.total} {t('completed')}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Résumé détaillé */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card key={index} className="glass-card border-white/30">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <IconComponent className="h-5 w-5 text-violet-600" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {item.label}:
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-2 rounded border">
                      {item.value || (
                        <span className="text-gray-400 dark:text-gray-500 italic">
                          {t('notSpecified')}
                        </span>
                      )}
                    </p>
                    {itemIndex < section.content.length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conseils finaux */}
      <Card className="glass-card border-white/30 bg-gradient-to-r from-violet-50 via-purple-50 to-blue-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <h4 className="font-semibold text-violet-800 dark:text-violet-300 mb-3 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>{t('finalTips')}</span>
          </h4>
          <ul className="text-sm text-violet-700 dark:text-violet-400 space-y-2">
            <li>• {t('finalTip1')}</li>
            <li>• {t('finalTip2')}</li>
            <li>• {t('finalTip3')}</li>
            <li>• {t('finalTip4')}</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepReview;

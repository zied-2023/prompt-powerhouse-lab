
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface StepOutputFormatProps {
  data: any;
  updateData: (data: any) => void;
}

const StepOutputFormat = ({ data, updateData }: StepOutputFormatProps) => {
  const { t } = useTranslation();

  const structureOptions = [
    { value: 'hierarchical', label: t('hierarchical') },
    { value: 'sequential', label: t('sequential') },
    { value: 'modular', label: t('modular') },
    { value: 'matrix', label: t('matrix') },
    { value: 'flowchart', label: t('flowchart') },
    { value: 'comparative', label: t('comparative') }
  ];

  const addSection = () => {
    const newSections = [...(data.outputFormat?.sections || []), ''];
    updateData({
      outputFormat: {
        ...data.outputFormat,
        sections: newSections
      }
    });
  };

  const updateSection = (index: number, value: string) => {
    const newSections = [...(data.outputFormat?.sections || [])];
    newSections[index] = value;
    updateData({
      outputFormat: {
        ...data.outputFormat,
        sections: newSections
      }
    });
  };

  const removeSection = (index: number) => {
    const newSections = data.outputFormat?.sections?.filter((_: any, i: number) => i !== index) || [];
    updateData({
      outputFormat: {
        ...data.outputFormat,
        sections: newSections
      }
    });
  };

  const addDeliverable = () => {
    const newDeliverables = [...(data.outputFormat?.deliverables || []), ''];
    updateData({
      outputFormat: {
        ...data.outputFormat,
        deliverables: newDeliverables
      }
    });
  };

  const updateDeliverable = (index: number, value: string) => {
    const newDeliverables = [...(data.outputFormat?.deliverables || [])];
    newDeliverables[index] = value;
    updateData({
      outputFormat: {
        ...data.outputFormat,
        deliverables: newDeliverables
      }
    });
  };

  const removeDeliverable = (index: number) => {
    const newDeliverables = data.outputFormat?.deliverables?.filter((_: any, i: number) => i !== index) || [];
    updateData({
      outputFormat: {
        ...data.outputFormat,
        deliverables: newDeliverables
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('outputStructure')} <span className="text-red-500">*</span>
        </Label>
        <Select value={data.outputFormat?.structure || ''} onValueChange={(value) => updateData({
          outputFormat: {
            ...data.outputFormat,
            structure: value
          }
        })}>
          <SelectTrigger className="animated-border bg-white dark:bg-gray-800">
            <SelectValue placeholder={t('selectStructure')} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {structureOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('requiredSections')} <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addSection}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>{t('addSection')}</span>
          </Button>
        </div>
        
        <div className="space-y-2">
          {data.outputFormat?.sections?.map((section: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={t('sectionPlaceholder')}
                value={section}
                onChange={(e) => updateSection(index, e.target.value)}
                className="flex-1 animated-border bg-white dark:bg-gray-800"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSection(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )) || []}
        </div>
        
        {(!data.outputFormat?.sections || data.outputFormat.sections.length === 0) && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm">{t('noSectionsYet')}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t('expectedDeliverables')} <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addDeliverable}
            className="flex items-center space-x-1"
          >
            <Plus className="h-4 w-4" />
            <span>{t('addDeliverable')}</span>
          </Button>
        </div>
        
        <div className="space-y-2">
          {data.outputFormat?.deliverables?.map((deliverable: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={t('deliverablePlaceholder')}
                value={deliverable}
                onChange={(e) => updateDeliverable(index, e.target.value)}
                className="flex-1 animated-border bg-white dark:bg-gray-800"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDeliverable(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )) || []}
        </div>
        
        {(!data.outputFormat?.deliverables || data.outputFormat.deliverables.length === 0) && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm">{t('noDeliverablesYet')}</p>
          </div>
        )}
      </div>

      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
        <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">{t('stepOutputFormatTips')}</h4>
        <ul className="text-sm text-orange-700 dark:text-orange-400 space-y-1">
          <li>• {t('tipOutputFormat1')}</li>
          <li>• {t('tipOutputFormat2')}</li>
          <li>• {t('tipOutputFormat3')}</li>
        </ul>
      </div>
    </div>
  );
};

export default StepOutputFormat;

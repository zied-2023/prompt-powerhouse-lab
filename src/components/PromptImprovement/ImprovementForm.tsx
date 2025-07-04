
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ImprovementFormProps {
  originalPrompt: string;
  setOriginalPrompt: (value: string) => void;
  improvementObjective: string;
  setImprovementObjective: (value: string) => void;
  onImprove: () => void;
  isImproving: boolean;
}

const ImprovementForm: React.FC<ImprovementFormProps> = ({
  originalPrompt,
  setOriginalPrompt,
  improvementObjective,
  setImprovementObjective,
  onImprove,
  isImproving
}) => {
  const { t } = useTranslation();

  return (
    <Card className="glass-card border-white/30 shadow-2xl hover-lift">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center space-x-3 text-2xl">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="gradient-text">{t('improvementTitle')}</span>
        </CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          {t('improvementDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="originalPrompt" className="text-sm font-semibold text-gray-700">
            {t('originalPrompt')} {t('required')}
          </Label>
          <Textarea
            id="originalPrompt"
            placeholder={t('originalPromptPlaceholder')}
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[120px] bg-white"
            rows={5}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="improvementObjective" className="text-sm font-semibold text-gray-700">
            {t('improvementObjective')} {t('optional')}
          </Label>
          <Input
            id="improvementObjective"
            placeholder={t('improvementObjectivePlaceholder')}
            value={improvementObjective}
            onChange={(e) => setImprovementObjective(e.target.value)}
            className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
          />
        </div>

        <Button 
          onClick={onImprove} 
          disabled={isImproving}
          className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
        >
          {isImproving ? (
            <>
              <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
              {t('improvingPrompt')}
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5 mr-3" />
              {t('improvePrompt')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ImprovementForm;

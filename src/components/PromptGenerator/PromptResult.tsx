
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface PromptResultProps {
  generatedPrompt: string;
  onCopy: () => void;
}

const PromptResult: React.FC<PromptResultProps> = ({ generatedPrompt, onCopy }) => {
  const { t } = useTranslation();

  return (
    <Card className="glass-card border-white/30 shadow-2xl hover-lift">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between text-2xl">
          <span className="gradient-text">{t('aiGeneratedPrompt')}</span>
          {generatedPrompt && (
            <Button variant="outline" size="sm" onClick={onCopy} className="hover-lift glass-card border-white/30">
              <Copy className="h-4 w-4 mr-2" />
              {t('copy')}
            </Button>
          )}
        </CardTitle>
        <CardDescription className="text-gray-600 font-medium">
          {t('aiGeneratedPromptDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generatedPrompt ? (
          <div className="glass-card border-white/30 p-6 rounded-xl">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed max-h-96 overflow-y-auto">
              {generatedPrompt}
            </pre>
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700 font-medium">
                🤖 <strong>{t('generatedByAI')} :</strong> {t('aiGeneratedDesc')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-violet-400" />
            </div>
            <p className="font-medium text-lg mb-2">{t('readyForGeneration')}</p>
            <p className="text-sm">{t('aiWillCreate')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptResult;

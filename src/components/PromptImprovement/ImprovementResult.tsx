
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, TrendingUp, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ImprovementResultProps {
  improvedPrompt: string;
  improvements: string[];
  onCopy: () => void;
}

const ImprovementResult: React.FC<ImprovementResultProps> = ({
  improvedPrompt,
  improvements,
  onCopy
}) => {
  const { t } = useTranslation();

  return (
    <Card className="glass-card border-white/30 shadow-2xl hover-lift">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center justify-between text-2xl">
          <span className="gradient-text">{t('improvedPrompt')}</span>
          {improvedPrompt && (
            <Button variant="outline" size="sm" onClick={onCopy} className="hover-lift glass-card border-white/30">
              <Copy className="h-4 w-4 mr-2" />
              {t('copy')}
            </Button>
          )}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
          {t('improvedPromptDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {improvedPrompt ? (
          <div className="space-y-6">
            <div className="glass-card border-white/30 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed max-h-80 overflow-y-auto">
                {improvedPrompt}
              </pre>
            </div>
            
            {improvements.length > 0 && (
              <div className="glass-card border-white/30 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                  {t('improvements')}
                </h4>
                <ul className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                🤖 <strong>{t('generatedByAI')} :</strong> {t('aiGeneratedDesc')}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-2xl flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
            <p className="font-medium text-lg mb-2">{t('readyForGeneration')}</p>
            <p className="text-sm">{t('aiWillCreate')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovementResult;

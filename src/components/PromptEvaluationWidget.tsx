import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Zap,
  TrendingUp,
  Eye
} from "lucide-react";
import { promptEvaluationService, type PromptEvaluationResult } from '@/services/promptEvaluationService';

interface PromptEvaluationWidgetProps {
  promptContent: string;
  category?: string;
  onEvaluationComplete?: (evaluation: PromptEvaluationResult) => void;
  compact?: boolean;
}

const PromptEvaluationWidget: React.FC<PromptEvaluationWidgetProps> = ({
  promptContent,
  category = 'default',
  onEvaluationComplete,
  compact = false
}) => {
  const [evaluation, setEvaluation] = useState<PromptEvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleEvaluate = async () => {
    if (!promptContent.trim()) return;

    setIsEvaluating(true);
    
    try {
      const result = await promptEvaluationService.evaluatePrompt(promptContent, category);
      setEvaluation(result);
      onEvaluationComplete?.(result);
    } catch (error) {
      console.error('Erreur évaluation widget:', error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    if (score >= 70) return <CheckCircle className="h-4 w-4 text-blue-500" />;
    if (score >= 50) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getLevelBadge = (level: string) => {
    const styles = {
      excellent: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      good: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      poor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    const labels = {
      excellent: 'Excellent',
      good: 'Bon',
      average: 'Moyen',
      poor: 'Faible'
    };

    return (
      <Badge className={styles[level as keyof typeof styles]}>
        {labels[level as keyof typeof labels]}
      </Badge>
    );
  };

  if (compact) {
    return (
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Qualité du Prompt</span>
            </div>
            
            {evaluation ? (
              <div className="flex items-center space-x-2">
                {getScoreIcon(evaluation.overallScore)}
                <span className={`font-bold ${getScoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}/100
                </span>
                {getLevelBadge(evaluation.feedback.level)}
              </div>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEvaluate}
                disabled={isEvaluating || !promptContent.trim()}
              >
                {isEvaluating ? (
                  <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1"></div>
                ) : (
                  <Eye className="h-3 w-3 mr-1" />
                )}
                Évaluer
              </Button>
            )}
          </div>

          {evaluation && (
            <div className="mt-3 space-y-2">
              <Progress value={evaluation.overallScore} className="h-1" />
              <p className="text-xs text-muted-foreground">
                {evaluation.feedback.summary}
              </p>
              {evaluation.suggestions.length > 0 && (
                <div className="text-xs text-blue-600 dark:text-blue-400">
                  💡 {evaluation.suggestions.length} suggestion{evaluation.suggestions.length > 1 ? 's' : ''} d'amélioration
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-white/30 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <span>Évaluation Qualité</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!evaluation ? (
          <div className="text-center space-y-4">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Analysez la qualité de ce prompt avec notre système d'évaluation IA
              </p>
            </div>
            <Button 
              onClick={handleEvaluate}
              disabled={isEvaluating || !promptContent.trim()}
              className="w-full"
            >
              {isEvaluating ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                  Évaluation...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Évaluer la Qualité
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Score principal */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {getScoreIcon(evaluation.overallScore)}
                <span className={`text-2xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}/100
                </span>
                {getLevelBadge(evaluation.feedback.level)}
              </div>
              <p className="text-sm text-muted-foreground">
                {evaluation.feedback.summary}
              </p>
            </div>

            {/* Critères rapides */}
            <div className="space-y-2">
              {Object.entries(evaluation.criteria).map(([criterion, score]) => {
                const labels = {
                  structure: 'Structure',
                  precision: 'Précision',
                  context: 'Contexte',
                  efficiency: 'Efficacité',
                  adaptability: 'Adaptabilité'
                };
                
                return (
                  <div key={criterion} className="flex justify-between items-center text-sm">
                    <span>{labels[criterion as keyof typeof labels]}</span>
                    <span className={`font-medium ${getScoreColor(score)}`}>
                      {score}/100
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Suggestions rapides */}
            {evaluation.suggestions.length > 0 && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Suggestions d'amélioration
                  </span>
                </div>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                  {evaluation.suggestions.slice(0, 2).map((suggestion, index) => (
                    <li key={index}>• {suggestion.title}</li>
                  ))}
                  {evaluation.suggestions.length > 2 && (
                    <li>• +{evaluation.suggestions.length - 2} autres suggestions</li>
                  )}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="flex-1"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Réévaluer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptEvaluationWidget;
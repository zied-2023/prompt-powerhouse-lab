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
  TrendingUp,
  Clock,
  Target,
  Lightbulb
} from 'lucide-react';
import { usePromptEvaluation } from '@/hooks/usePromptEvaluation';

interface PromptEvaluationWidgetProps {
  prompt?: string;
  promptContent?: string;
  category?: string;
  compact?: boolean;
  onEvaluationComplete?: (evaluation: any) => void;
}

export const PromptEvaluationWidget: React.FC<PromptEvaluationWidgetProps> = ({
  prompt,
  promptContent,
  category,
  compact,
  onEvaluationComplete
}) => {
  const actualPrompt = prompt || promptContent || '';
  const { evaluatePrompt, isEvaluating } = usePromptEvaluation();
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleEvaluate = async () => {
    if (!actualPrompt.trim()) return;
    
    try {
      const result = await evaluatePrompt(actualPrompt);
      setEvaluation(result);
      onEvaluationComplete?.(result);
    } catch (error) {
      console.error('Erreur lors de l\'évaluation:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Évaluation du Prompt</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!evaluation ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Analysez la qualité de votre prompt avec notre outil d'évaluation IA
            </p>
            <Button 
              onClick={handleEvaluate}
              disabled={isEvaluating || !actualPrompt.trim()}
              className="w-full"
            >
              {isEvaluating ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Évaluation en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Évaluer ce prompt
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score global */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <CheckCircle className={`h-8 w-8 ${getScoreColor(evaluation.overallScore)}`} />
                <span className={`text-3xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                  {evaluation.overallScore}/100
                </span>
              </div>
              <Badge 
                variant={evaluation.overallScore >= 85 ? "default" : evaluation.overallScore >= 70 ? "secondary" : "destructive"}
                className="text-sm"
              >
                {evaluation.overallScore >= 85 ? "Excellent" : 
                 evaluation.overallScore >= 70 ? "Bon" : "À améliorer"}
              </Badge>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score global</span>
                <span>{evaluation.overallScore}%</span>
              </div>
              <Progress value={evaluation.overallScore} className="h-2" />
            </div>

            {/* Feedback */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm mb-2">Analyse générale</h4>
              <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="flex-1"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Réévaluer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEvaluation(null)}
                className="flex-1"
              >
                Nouvelle évaluation
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
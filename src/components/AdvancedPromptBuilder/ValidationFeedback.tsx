import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle, 
  Info, 
  AlertTriangle,
  Lightbulb 
} from 'lucide-react';

interface ValidationFeedbackProps {
  errors: string[];
  warnings?: string[];
  suggestions?: string[];
}

const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  errors = [],
  warnings = [],
  suggestions = []
}) => {
  // Ne rien afficher s'il n'y a aucun feedback
  if (errors.length === 0 && warnings.length === 0 && suggestions.length === 0) {
    return (
      <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="font-medium text-emerald-800 dark:text-emerald-200">
                ✅ Étape validée
              </h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                Toutes les informations requises sont complètes. Vous pouvez passer à l'étape suivante.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Erreurs critiques */}
      {errors.length > 0 && (
        <Alert className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Informations manquantes
                </h4>
                <Badge variant="destructive" className="text-xs">
                  {errors.length}
                </Badge>
              </div>
              <ul className="space-y-1 text-sm">
                {errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2 text-red-700 dark:text-red-300">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Avertissements */}
      {warnings.length > 0 && (
        <Alert className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                  Recommandations
                </h4>
                <Badge variant="secondary" className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300">
                  {warnings.length}
                </Badge>
              </div>
              <ul className="space-y-1 text-sm">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start space-x-2 text-yellow-700 dark:text-yellow-300">
                    <span className="text-yellow-500 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Suggestions d'amélioration */}
      {suggestions.length > 0 && (
        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
          <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">
                  💡 Suggestions d'amélioration
                </h4>
                <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                  {suggestions.length}
                </Badge>
              </div>
              <ul className="space-y-1 text-sm">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2 text-blue-700 dark:text-blue-300">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Conseils contextuels */}
      {errors.length === 0 && warnings.length === 0 && suggestions.length === 0 && (
        <Alert className="border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <AlertDescription>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">
                💭 Conseil
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Plus vous fournirez de détails, plus le prompt généré sera précis et efficace.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ValidationFeedback;
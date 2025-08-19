import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Wand2, TrendingUp, Plus } from 'lucide-react';

interface SmartSuggestionsProps {
  suggestions: string[];
  onApplySuggestion: (suggestion: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  suggestions,
  onApplySuggestion
}) => {
  const suggestionCategories = [
    {
      title: "Améliorations",
      icon: TrendingUp,
      color: "blue",
      suggestions: suggestions.slice(0, 2)
    },
    {
      title: "Alternatives",
      icon: Wand2,
      color: "purple",
      suggestions: suggestions.slice(2, 4)
    },
    {
      title: "Ajouts",
      icon: Plus,
      color: "emerald",
      suggestions: suggestions.slice(4, 6)
    }
  ];

  if (suggestions.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 dark:text-gray-400 mb-2">
            Suggestions à venir
          </h3>
          <p className="text-sm text-gray-500">
            Continuez à remplir les étapes pour recevoir des suggestions personnalisées.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
          Suggestions IA
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {suggestionCategories.map((category, categoryIndex) => {
          if (category.suggestions.length === 0) return null;
          
          const IconComponent = category.icon;
          
          return (
            <div key={categoryIndex} className="space-y-3">
              <div className="flex items-center space-x-2">
                <IconComponent className={`h-4 w-4 text-${category.color}-500`} />
                <h4 className={`font-medium text-sm text-${category.color}-700 dark:text-${category.color}-300`}>
                  {category.title}
                </h4>
                <Badge variant="outline" className={`text-xs bg-${category.color}-50 dark:bg-${category.color}-900/30 text-${category.color}-600 dark:text-${category.color}-400 border-${category.color}-200 dark:border-${category.color}-700`}>
                  {category.suggestions.length}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {category.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`
                      p-3 rounded-lg border-l-4 border-${category.color}-400 dark:border-${category.color}-500
                      bg-${category.color}-50/50 dark:bg-${category.color}-900/10 
                      hover:bg-${category.color}-100/50 dark:hover:bg-${category.color}-900/20
                      transition-colors cursor-pointer group
                    `}
                    onClick={() => onApplySuggestion(suggestion)}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`text-sm text-${category.color}-800 dark:text-${category.color}-200 flex-1 pr-2`}>
                        {suggestion}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`
                          opacity-0 group-hover:opacity-100 transition-opacity
                          hover:bg-${category.color}-200 dark:hover:bg-${category.color}-800
                          text-${category.color}-700 dark:text-${category.color}-300
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApplySuggestion(suggestion);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Suggestions rapides */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Wand2 className="h-4 w-4 mr-1" />
            Actions rapides
          </h4>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={() => onApplySuggestion("Ajouter des exemples concrets")}
            >
              + Exemples
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={() => onApplySuggestion("Préciser le format de sortie")}
            >
              + Format
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-2"
              onClick={() => onApplySuggestion("Définir des contraintes")}
            >
              + Contraintes
            </Button>
          </div>
        </div>
        
        {/* Score de qualité */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Qualité du prompt
            </span>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              85%
            </Badge>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
              style={{ width: '85%' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Excellent ! Votre prompt est bien structuré.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartSuggestions;
import { useTranslation } from "@/hooks/useTranslation";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Copy, 
  Download, 
  Share, 
  Code, 
  FileText,
  Sparkles,
  ThumbsUp,
  BarChart3
} from 'lucide-react';
import { PromptData } from './types';
import { generatePromptPreview } from './utils';

interface LivePreviewProps {
  data: PromptData;
  generatedPrompt: string;
  onCopy: () => void;
  onDownload: () => void;
}

const LivePreview: React.FC<LivePreviewProps> = ({
  data,
  generatedPrompt,
  onCopy,
  onDownload
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('preview');
  
  const preview = generatePromptPreview(data);
  const wordCount = generatedPrompt ? generatedPrompt.split(' ').length : 0;
  const charCount = generatedPrompt ? generatedPrompt.length : 0;
  
  const qualityScore = calculateQualityScore(data);
  
  return (
    <div className="space-y-4">
      {/* Aperçu en temps réel */}
      {preview && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Eye className="h-5 w-5 text-blue-500 mr-2" />
              {t('livePreview')}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
              <pre className="text-sm whitespace-pre-wrap font-mono text-blue-900 dark:text-blue-100 leading-relaxed">
                {preview}
              </pre>
            </div>
            
            {/* Métriques rapides */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>{t('realTimeUpdate')}</span>
              <div className="flex items-center space-x-3">
                <span>{preview.length} {t('characters')}</span>
                <span>•</span>
                <span>{preview.split(' ').length} {t('words')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Score de qualité */}
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-sm">{t('qualityScore')}</span>
            </div>
            <Badge 
              className={`${
                qualityScore >= 80 
                  ? 'bg-emerald-500' 
                  : qualityScore >= 60 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              } text-white`}
            >
              {qualityScore}%
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                qualityScore >= 80 
                  ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                  : qualityScore >= 60 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                  : 'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              {qualityScore >= 80 ? `🎉 ${t('excellent2')}` : qualityScore >= 60 ? `👍 ${t('good')}` : `⚠️ ${t('needsImprovement')}`}
            </span>
            <span className="text-gray-500">
              {getQualityDetails(qualityScore).length} {t('criteriaValidated')}
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Prompt généré */}
      {generatedPrompt && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="h-5 w-5 text-violet-500 mr-2" />
                Prompt Final
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button onClick={onCopy} size="sm" variant="outline">
                  <Copy className="h-3 w-3 mr-1" />
                  Copier
                </Button>
                <Button onClick={onDownload} size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Télécharger
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Aperçu</span>
                </TabsTrigger>
                <TabsTrigger value="raw" className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Brut</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-violet-200/50 dark:border-violet-700/50 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {generatedPrompt.split('\n').map((line, index) => {
                      if (line.startsWith('#')) {
                        return (
                          <h3 key={index} className="text-violet-800 dark:text-violet-200 font-bold mb-2 mt-4">
                            {line.replace(/^#+\s*/, '')}
                          </h3>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <p key={index} className="font-semibold text-violet-700 dark:text-violet-300 mb-1">
                            {line}
                          </p>
                        );
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <li key={index} className="text-violet-600 dark:text-violet-400 ml-4">
                            {line.substring(2)}
                          </li>
                        );
                      }
                      if (line.trim()) {
                        return (
                          <p key={index} className="text-violet-800 dark:text-violet-200 mb-2">
                            {line}
                          </p>
                        );
                      }
                      return <br key={index} />;
                    })}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="raw">
                <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                    {generatedPrompt}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Statistiques */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>{wordCount} mots</span>
                <span>•</span>
                <span>{charCount} caractères</span>
                <span>•</span>
                <span>~{Math.ceil(wordCount / 200)} min de lecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-600">Optimisé</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Fonctions utilitaires
function calculateQualityScore(data: PromptData): number {
  let score = 0;
  const maxScore = 100;
  
  // Objectif défini (25 points)
  if (data.objective && data.objective.length >= 10) score += 25;
  
  // Contexte fourni (20 points)
  if (data.context && data.context.length >= 20) score += 20;
  
  // Audience définie (15 points)
  if (data.audience && data.audience.length >= 10) score += 15;
  
  // Ton sélectionné (15 points)
  if (data.tone) score += 15;
  
  // Format de sortie (10 points)
  if (data.outputFormat) score += 10;
  
  // Contraintes ou mots-clés (10 points)
  if (data.constraints.length > 0 || data.keywords.length > 0) score += 10;
  
  // Modèle IA spécifié (5 points)
  if (data.aiModel) score += 5;
  
  return Math.min(score, maxScore);
}

function getQualityDetails(score: number): string[] {
  const details = [];
  if (score >= 25) details.push('Objectif clair');
  if (score >= 45) details.push('Contexte détaillé');
  if (score >= 60) details.push('Audience définie');
  if (score >= 75) details.push('Ton approprié');
  if (score >= 85) details.push('Format spécifié');
  if (score >= 95) details.push('Contraintes ajoutées');
  return details;
}

export default LivePreview;
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Copy, 
  Download, 
  FileText,
  Code,
  Sparkles,
  BarChart3,
  ThumbsUp,
  Zap
} from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "@/hooks/use-toast";

interface RealTimePreviewProps {
  promptData?: any;
  generatedPrompt?: string;
  isGenerating?: boolean;
  onCopy?: () => void;
  onDownload?: () => void;
  className?: string;
}

const RealTimePreview: React.FC<RealTimePreviewProps> = ({
  promptData,
  generatedPrompt,
  isGenerating = false,
  onCopy,
  onDownload,
  className = ""
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('preview');
  const [livePreview, setLivePreview] = useState('');

  // Génération de la prévisualisation en temps réel
  useEffect(() => {
    if (!promptData) return;

    let preview = '';
    
    // Structure de base du prompt
    if (promptData.description || promptData.objective) {
      preview += `**CONTEXTE**\n${promptData.description || promptData.objective}\n\n`;
    }
    
    if (promptData.targetAudience || promptData.audience) {
      preview += `**PUBLIC CIBLE**\n${promptData.targetAudience || promptData.audience}\n\n`;
    }
    
    if (promptData.tone) {
      preview += `**TON**\n${promptData.tone}\n\n`;
    }
    
    if (promptData.format || promptData.outputFormat) {
      preview += `**FORMAT SOUHAITÉ**\n${promptData.format || promptData.outputFormat}\n\n`;
    }
    
    if (promptData.constraints && promptData.constraints.length > 0) {
      preview += `**CONTRAINTES**\n${promptData.constraints.join(', ')}\n\n`;
    }
    
    if (promptData.keywords && promptData.keywords.length > 0) {
      preview += `**MOTS-CLÉS**\n${promptData.keywords.join(', ')}\n\n`;
    }

    setLivePreview(preview.trim());
  }, [promptData]);

  // Calcul du score de qualité
  const calculateQualityScore = (): number => {
    if (!promptData) return 0;
    
    let score = 0;
    
    // Critères de base (60 points)
    if (promptData.description || promptData.objective) score += 20;
    if (promptData.targetAudience || promptData.audience) score += 15;
    if (promptData.tone) score += 15;
    if (promptData.format || promptData.outputFormat) score += 10;
    
    // Critères avancés (40 points)
    if (promptData.constraints && promptData.constraints.length > 0) score += 15;
    if (promptData.keywords && promptData.keywords.length > 0) score += 15;
    if (promptData.context) score += 10;
    
    return Math.min(score, 100);
  };

  const qualityScore = calculateQualityScore();
  const wordCount = generatedPrompt ? generatedPrompt.split(' ').length : 0;
  const charCount = generatedPrompt ? generatedPrompt.length : 0;

  const handleCopy = () => {
    const textToCopy = generatedPrompt || livePreview;
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copié !",
      description: "Le contenu a été copié dans le presse-papier",
    });
    onCopy?.();
  };

  const handleDownload = () => {
    const textToDownload = generatedPrompt || livePreview;
    const blob = new Blob([textToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.();
  };

  if (!promptData && !generatedPrompt) {
    return (
      <Card className={`border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${className}`}>
        <CardContent className="p-8 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Prévisualisation en temps réel
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Commencez à remplir le formulaire pour voir une prévisualisation de votre prompt
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Prévisualisation en temps réel */}
      {livePreview && !isGenerating && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Eye className="h-5 w-5 text-blue-500 mr-2" />
              Prévisualisation en temps réel
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
              <pre className="text-sm whitespace-pre-wrap font-mono text-blue-900 dark:text-blue-100 leading-relaxed">
                {livePreview}
              </pre>
            </div>
            
            {/* Métriques rapides */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>Mise à jour en temps réel</span>
              <div className="flex items-center space-x-3">
                <span>{livePreview.length} caractères</span>
                <span>•</span>
                <span>{livePreview.split(' ').length} mots</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Indicateur de génération */}
      {isGenerating && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Zap className="h-6 w-6 text-violet-500 animate-pulse" />
              <span className="text-lg font-semibold">Génération en cours...</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-violet-400 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Score de qualité */}
      {qualityScore > 0 && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
                <span className="font-medium text-sm">Score de qualité</span>
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
                {qualityScore >= 80 ? '🎉 Excellent' : qualityScore >= 60 ? '👍 Bon' : '⚠️ À améliorer'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Prompt généré final */}
      {generatedPrompt && !isGenerating && (
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-lg">
                <Sparkles className="h-5 w-5 text-violet-500 mr-2" />
                Prompt Généré
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button onClick={handleCopy} size="sm" variant="outline" className="hover-lift">
                  <Copy className="h-3 w-3 mr-1" />
                  Copier
                </Button>
                <Button onClick={handleDownload} size="sm" variant="outline" className="hover-lift">
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

export default RealTimePreview;
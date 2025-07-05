
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Sparkles, Wand2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useFormConstants } from "./PromptGenerator/FormConstants";
import PromptForm from "./PromptGenerator/PromptForm";
import PromptResult from "./PromptGenerator/PromptResult";
import { generatePromptWithAI } from "../services/promptApi";

const PromptGenerator = () => {
  const { t } = useTranslation();
  const { categories, subcategories, outputFormats, toneOptions, lengthOptions } = useFormConstants();
  
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
    objective: '',
    targetAudience: '',
    format: '',
    tone: '',
    length: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrompt = async () => {
    if (!formData.category || !formData.description) {
      toast({
        title: t('missingInfo'),
        description: t('chooseCategoryDesc'),
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const aiGeneratedPrompt = await generatePromptWithAI(formData, categories, outputFormats, toneOptions, lengthOptions);
      
      setGeneratedPrompt(aiGeneratedPrompt);
      
      toast({
        title: t('promptCreatedSuccess'),
        description: t('promptCreatedDesc'),
      });
    } catch (error) {
      console.error('Erreur:', error);
      
      let errorMessage = "Impossible de générer le prompt.";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte OpenRouter.";
      } else if (error.message.includes('connexion')) {
        errorMessage = "Vérifiez votre connexion internet.";
      }
      
      toast({
        title: t('generationError'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: t('copiedSuccess'),
      description: t('promptCopiedClipboard'),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulaire */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">{t('promptGeneratorTitle')}</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            {t('promptGeneratorDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PromptForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            subcategories={subcategories}
            outputFormats={outputFormats}
            toneOptions={toneOptions}
            lengthOptions={lengthOptions}
          />

          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                {t('generatingWithAI')}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                {t('generateWithAI')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <PromptResult 
        generatedPrompt={generatedPrompt}
        onCopy={copyToClipboard}
      />
    </div>
  );
};

export default PromptGenerator;

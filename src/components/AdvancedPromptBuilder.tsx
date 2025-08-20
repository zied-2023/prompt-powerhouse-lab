import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrompts } from "@/hooks/usePrompts";
import { 
  Sparkles, 
  FileText, 
  Settings, 
  GitBranch,
  Zap,
  Copy,
  Download,
  Share,
  Eye,
  Code,
  Layers,
  Target,
  Brain,
  Save
} from "lucide-react";

import StepObjective from "./MultiStepPromptBuilder/StepObjective";
import StepContext from "./MultiStepPromptBuilder/StepContext";
import StepOutputFormat from "./MultiStepPromptBuilder/StepOutputFormat";
import StepConstraints from "./MultiStepPromptBuilder/StepConstraints";
import StepReview from "./MultiStepPromptBuilder/StepReview";
import StepTemplates from "./MultiStepPromptBuilder/StepTemplates";
import StepVariables from "./MultiStepPromptBuilder/StepVariables";
import StepConditionalLogic from "./MultiStepPromptBuilder/StepConditionalLogic";

interface Variable {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  description: string;
  defaultValue: string;
  options?: string[];
  placeholder: string;
  required: boolean;
}

interface Condition {
  id: string;
  variable: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'not_empty';
  value: string;
  action: 'include' | 'exclude' | 'replace';
  content: string;
  description: string;
}

interface PromptData {
  objective: {
    mainGoal: string;
    specificTargets: string[];
    successCriteria: string;
  };
  context: {
    background: string;
    targetAudience: string;
    industry: string;
    constraints: string[];
  };
  requirements: {
    tone: string;
    length: string;
    format: string;
    style: string;
    technicalLevel: string;
  };
  outputFormat: {
    structure: string;
    sections: string[];
    deliverables: string[];
  };
}

const AdvancedPromptBuilder = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  const [activeTab, setActiveTab] = useState("builder");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [variables, setVariables] = useState<Variable[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [variableValues, setVariableValues] = useState<{ [key: string]: string }>({});
  
  const [promptData, setPromptData] = useState<PromptData>({
    objective: {
      mainGoal: '',
      specificTargets: [],
      successCriteria: ''
    },
    context: {
      background: '',
      targetAudience: '',
      industry: '',
      constraints: []
    },
    requirements: {
      tone: '',
      length: '',
      format: '',
      style: '',
      technicalLevel: ''
    },
    outputFormat: {
      structure: '',
      sections: [],
      deliverables: []
    }
  });

  const handleTemplateSelect = (template: any) => {
    // Appliquer le template aux données du prompt
    setPromptData(prev => ({
      ...prev,
      objective: {
        ...prev.objective,
        mainGoal: template.structure.objective
      },
      context: {
        ...prev.context,
        background: template.structure.context
      },
      requirements: {
        ...prev.requirements,
        format: template.structure.format
      }
    }));
    
    // Passer à l'onglet builder
    setActiveTab("builder");
    
    toast({
      title: "Template appliqué",
      description: `Le template "${template.name}" a été appliqué avec succès.`,
    });
  };

  const generateAdvancedPrompt = async () => {
    setIsGenerating(true);
    
    try {
      // Simuler un appel API pour générer le prompt avec toute la logique avancée
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let prompt = `# Prompt Avancé

## Objectif Principal
${promptData.objective.mainGoal}

## Contexte
${promptData.context.background}

### Public Cible
${promptData.context.targetAudience}

### Industrie
${promptData.context.industry}

## Exigences
- **Ton :** ${promptData.requirements.tone}
- **Longueur :** ${promptData.requirements.length}
- **Format :** ${promptData.requirements.format}
- **Style :** ${promptData.requirements.style}
- **Niveau technique :** ${promptData.requirements.technicalLevel}

## Structure de Sortie
${promptData.outputFormat.structure}

### Sections
${promptData.outputFormat.sections.map(section => `- ${section}`).join('\n')}

### Livrables
${promptData.outputFormat.deliverables.map(deliverable => `- ${deliverable}`).join('\n')}`;

      // Ajouter les variables si définies
      if (variables.length > 0) {
        prompt += `\n\n## Variables Définies\n`;
        variables.forEach(variable => {
          const value = variableValues[variable.id] || variable.defaultValue || `[${variable.name}]`;
          prompt += `- **${variable.name}:** ${value}\n`;
        });
      }

      // Ajouter la logique conditionnelle si définie
      if (conditions.length > 0) {
        prompt += `\n\n## Logique Conditionnelle\n`;
        conditions.forEach(condition => {
          prompt += `- Si ${condition.variable} ${condition.operator} "${condition.value}", alors ${condition.action} : "${condition.content}"\n`;
        });
      }

      prompt += `\n\n## Instructions Finales
Veuillez générer une réponse qui respecte strictement tous les critères ci-dessus. Assurez-vous que le contenu est adapté au public cible et respecte le ton et le style demandés.`;

      setGeneratedPrompt(prompt);
      setActiveTab("preview");
      
      toast({
        title: "Prompt généré avec succès",
        description: "Votre prompt avancé est prêt à être utilisé.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du prompt.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copié !",
      description: "Le prompt a été copié dans le presse-papiers.",
    });
  };

  const downloadPrompt = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-avance.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargé !",
      description: "Le prompt a été téléchargé.",
    });
  };

  const handleSavePrompt = async () => {
    if (!generatedPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Aucun prompt généré à sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const saveData = {
      title: `Prompt avancé - ${promptData.objective.mainGoal.substring(0, 50) || 'Sans titre'}`,
      content: generatedPrompt,
      description: `Prompt avancé généré avec builder multi-étapes`,
      category: "Avancé",
      tags: ["avancé", "multi-étapes", "builder"],
      is_public: false
    };

    const result = await savePrompt(saveData);
    if (result) {
      toast({
        title: "Prompt sauvegardé",
        description: "Votre prompt avancé a été sauvegardé avec succès !",
      });
    }
  };

  const calculateProgress = () => {
    let completedSteps = 0;
    let totalSteps = 4;
    
    if (promptData.objective.mainGoal) completedSteps++;
    if (promptData.context.background) completedSteps++;
    if (promptData.requirements.tone) completedSteps++;
    if (promptData.outputFormat.structure) completedSteps++;
    
    return (completedSteps / totalSteps) * 100;
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-900/20 dark:to-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl gradient-text">{t('multiStepTitle')}</CardTitle>
                <CardDescription>{t('multiStepDesc')}</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              <Sparkles className="h-3 w-3 mr-1" />
              Avancé
            </Badge>
          </div>
          
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression du prompt</span>
              <span>{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8 glass-card border-white/30 dark:border-gray-700/30 p-1.5">
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Layers className="h-4 w-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Builder</span>
          </TabsTrigger>
          <TabsTrigger value="variables" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Variables</span>
          </TabsTrigger>
          <TabsTrigger value="logic" className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4" />
            <span>Logique</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Aperçu</span>
          </TabsTrigger>
        </TabsList>

        {/* Templates */}
        <TabsContent value="templates">
          <StepTemplates onSelectTemplate={handleTemplateSelect} />
        </TabsContent>

        {/* Builder principal */}
        <TabsContent value="builder">
          <div className="space-y-8">
            <StepObjective
              data={promptData}
              updateData={(partial) => setPromptData(prev => ({ ...prev, ...partial }))}
            />
            <StepContext
              data={promptData}
              updateData={(partial) => setPromptData(prev => ({ ...prev, ...partial }))}
            />
            <StepConstraints
              data={promptData}
              updateData={(partial) => setPromptData(prev => ({ ...prev, ...partial }))}
            />
            <StepOutputFormat
              data={promptData}
              updateData={(partial) => setPromptData(prev => ({ ...prev, ...partial }))}
            />
          </div>
        </TabsContent>

        {/* Variables */}
        <TabsContent value="variables">
          <StepVariables
            variables={variables}
            onVariablesChange={setVariables}
            onVariableValuesChange={setVariableValues}
          />
        </TabsContent>

        {/* Logique conditionnelle */}
        <TabsContent value="logic">
          <StepConditionalLogic
            conditions={conditions}
            availableVariables={variables.map(v => v.name)}
            onConditionsChange={setConditions}
          />
        </TabsContent>

        {/* Aperçu */}
        <TabsContent value="preview">
          <div className="space-y-6">
            {generatedPrompt ? (
              <Card className="glass-card border-white/30 dark:border-gray-700/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Prompt Généré
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={copyToClipboard} size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                      <Button onClick={downloadPrompt} size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button 
                        onClick={handleSavePrompt} 
                        size="sm" 
                        variant="outline"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generatedPrompt}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-white/30 dark:border-gray-700/30">
                <CardContent className="text-center py-8">
                  <Zap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Aucun prompt généré
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Complétez les étapes du builder puis générez votre prompt avancé.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Actions principales */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Code className="h-3 w-3" />
                {variables.length} variable{variables.length > 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                {conditions.length} condition{conditions.length > 1 ? 's' : ''}
              </Badge>
            </div>
            <Button 
              onClick={generateAdvancedPrompt}
              disabled={isGenerating || !promptData.objective.mainGoal}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Générer le Prompt Avancé
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPromptBuilder;
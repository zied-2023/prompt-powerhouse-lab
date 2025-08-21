import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "@/hooks/use-toast";
import { 
  Code, 
  FileText, 
  Lightbulb, 
  BarChart, 
  MessageSquare, 
  Palette,
  Settings,
  Copy,
  Play,
  Variable,
  GitBranch,
  Zap,
  Sparkles,
  Eye
} from "lucide-react";

interface TemplateVariable {
  name: string;
  type: 'text' | 'select' | 'number' | 'textarea';
  label: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string;
}

interface ConditionalRule {
  variable: string;
  condition: 'equals' | 'contains' | 'greater' | 'less';
  value: string;
  thenText: string;
  elseText?: string;
}

interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  template: string;
  variables: TemplateVariable[];
  conditionalRules: ConditionalRule[];
  tags: string[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedTime: string;
}

const AdvancedTemplates: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTemplate, setSelectedTemplate] = useState<AdvancedTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('configure');

  const advancedTemplates: AdvancedTemplate[] = [
    {
      id: 'conditional-content',
      name: 'Générateur de Contenu Conditionnel',
      description: 'Template adaptatif qui change selon l\'audience et le format',
      category: 'Contenu',
      icon: <GitBranch className="h-5 w-5" />,
      template: `Créez un {{contentType}} pour {{audience}} sur le sujet "{{topic}}".

{{#if audience == "débutants"}}
Utilisez un langage simple et accessible, avec des exemples concrets et des explications détaillées.
{{else}}
Adoptez un ton professionnel avec un vocabulaire technique approprié.
{{/if}}

{{#if format == "article"}}
Structure: Introduction accrocheuse, 3-5 sections principales, conclusion avec appel à l'action.
Longueur: {{wordCount}} mots.
{{else if format == "post"}}
Format court et engageant pour les réseaux sociaux.
Incluez 2-3 hashtags pertinents.
{{else}}
Format: {{customFormat}}
{{/if}}

Ton: {{tone}}
Style: {{#if audience == "professionnels"}}Formel et informatif{{else}}Conversationnel et engageant{{/if}}

{{#if includeExamples == "oui"}}
Incluez au moins 2 exemples pratiques.
{{/if}}

{{#if includeCTA == "oui"}}
Terminez par un appel à l'action clair: {{ctaText}}
{{/if}}`,
      variables: [
        { name: 'contentType', type: 'select', label: 'Type de contenu', options: ['article de blog', 'newsletter', 'post LinkedIn', 'script vidéo', 'email marketing'], required: true },
        { name: 'audience', type: 'select', label: 'Audience cible', options: ['débutants', 'intermédiaires', 'experts', 'professionnels', 'grand public'], required: true },
        { name: 'topic', type: 'text', label: 'Sujet principal', placeholder: 'Ex: Intelligence Artificielle', required: true },
        { name: 'format', type: 'select', label: 'Format de sortie', options: ['article', 'post', 'personnalisé'], required: true },
        { name: 'customFormat', type: 'text', label: 'Format personnalisé', placeholder: 'Décrivez votre format' },
        { name: 'wordCount', type: 'number', label: 'Nombre de mots (pour articles)', defaultValue: '800' },
        { name: 'tone', type: 'select', label: 'Ton', options: ['professionnel', 'décontracté', 'inspirant', 'éducatif', 'persuasif'], required: true },
        { name: 'includeExamples', type: 'select', label: 'Inclure des exemples', options: ['oui', 'non'], defaultValue: 'oui' },
        { name: 'includeCTA', type: 'select', label: 'Inclure un appel à l\'action', options: ['oui', 'non'], defaultValue: 'non' },
        { name: 'ctaText', type: 'text', label: 'Texte de l\'appel à l\'action', placeholder: 'Ex: Contactez-nous pour en savoir plus' }
      ],
      conditionalRules: [
        { variable: 'audience', condition: 'equals', value: 'débutants', thenText: 'Utilisez un langage simple', elseText: 'Utilisez un vocabulaire technique' },
        { variable: 'format', condition: 'equals', value: 'article', thenText: 'Structure longue avec sections', elseText: 'Format court' }
      ],
      tags: ['contenu', 'marketing', 'conditionnel'],
      difficulty: 'Intermédiaire',
      estimatedTime: '5-10 min'
    },
    {
      id: 'dynamic-code-generator',
      name: 'Générateur de Code Dynamique',
      description: 'Template qui s\'adapte au langage et au niveau de complexité',
      category: 'Développement',
      icon: <Code className="h-5 w-5" />,
      template: `Écrivez du code {{language}} pour {{projectType}}.

Fonctionnalité: {{functionality}}

{{#if language == "JavaScript"}}
Utilisez ES6+ et les meilleures pratiques modernes.
{{#if framework}}Framework/Librairie: {{framework}}{{/if}}
{{else if language == "Python"}}
Suivez les conventions PEP 8.
{{#if framework}}Framework: {{framework}}{{/if}}
{{else}}
Respectez les conventions du langage {{language}}.
{{/if}}

Niveau de complexité: {{complexity}}

{{#if complexity == "débutant"}}
Ajoutez des commentaires détaillés pour expliquer chaque étape.
Utilisez des noms de variables explicites.
{{else if complexity == "intermédiaire"}}
Incluez une gestion d'erreurs appropriée.
Organisez le code en fonctions/méthodes réutilisables.
{{else}}
Optimisez pour les performances et la maintenabilité.
Implémentez des design patterns appropriés.
{{/if}}

{{#if includeTests == "oui"}}
Incluez des tests unitaires avec {{testFramework}}.
{{/if}}

{{#if includeDocumentation == "oui"}}
Ajoutez une documentation complète avec exemples d'utilisation.
{{/if}}

Exigences spécifiques:
{{requirements}}`,
      variables: [
        { name: 'language', type: 'select', label: 'Langage de programmation', options: ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Go', 'Rust', 'TypeScript'], required: true },
        { name: 'projectType', type: 'select', label: 'Type de projet', options: ['application web', 'API REST', 'script automation', 'application mobile', 'jeu', 'algorithme'], required: true },
        { name: 'functionality', type: 'textarea', label: 'Fonctionnalité à implémenter', placeholder: 'Décrivez précisément ce que le code doit faire', required: true },
        { name: 'framework', type: 'text', label: 'Framework/Librairie (optionnel)', placeholder: 'Ex: React, Django, Spring' },
        { name: 'complexity', type: 'select', label: 'Niveau de complexité', options: ['débutant', 'intermédiaire', 'avancé'], required: true },
        { name: 'includeTests', type: 'select', label: 'Inclure des tests', options: ['oui', 'non'], defaultValue: 'non' },
        { name: 'testFramework', type: 'text', label: 'Framework de test', placeholder: 'Ex: Jest, PyTest, JUnit' },
        { name: 'includeDocumentation', type: 'select', label: 'Inclure documentation', options: ['oui', 'non'], defaultValue: 'oui' },
        { name: 'requirements', type: 'textarea', label: 'Exigences spécifiques', placeholder: 'Performance, sécurité, compatibilité...' }
      ],
      conditionalRules: [
        { variable: 'language', condition: 'equals', value: 'JavaScript', thenText: 'ES6+ moderne', elseText: 'Conventions du langage' },
        { variable: 'complexity', condition: 'equals', value: 'débutant', thenText: 'Commentaires détaillés', elseText: 'Code optimisé' }
      ],
      tags: ['code', 'développement', 'programmation'],
      difficulty: 'Avancé',
      estimatedTime: '10-15 min'
    },
    {
      id: 'adaptive-analysis',
      name: 'Analyseur de Données Adaptatif',
      description: 'Template qui s\'adapte au type de données et aux objectifs d\'analyse',
      category: 'Data Science',
      icon: <BarChart className="h-5 w-5" />,
      template: `Analysez les données {{dataType}} pour {{analysisGoal}}.

Dataset: {{datasetDescription}}
Période: {{timePeriod}}
Volume: {{dataVolume}}

{{#if dataType == "ventes"}}
Métriques clés: Chiffre d'affaires, nombre de transactions, panier moyen, taux de conversion.
{{else if dataType == "marketing"}}
Métriques clés: CTR, CPC, ROAS, taux d'engagement, coût d'acquisition.
{{else if dataType == "utilisateurs"}}
Métriques clés: MAU, DAU, taux de rétention, durée de session, taux de conversion.
{{else}}
Métriques personnalisées: {{customMetrics}}
{{/if}}

Analyse requise:
{{#if analysisType == "descriptive"}}
- Statistiques descriptives (moyenne, médiane, écart-type)
- Distribution des données
- Identification des tendances
{{else if analysisType == "predictive"}}
- Modèles prédictifs
- Forecast des tendances futures
- Identification des facteurs d'influence
{{else if analysisType == "comparative"}}
- Comparaison période sur période
- Analyse des écarts
- Benchmarking
{{/if}}

{{#if includeVisualization == "oui"}}
Créez des visualisations appropriées:
{{#if dataType == "temporel"}}
- Graphiques en ligne pour les tendances
- Graphiques saisonniers
{{else}}
- Graphiques en barres pour les comparaisons
- Diagrammes circulaires pour les proportions
{{/if}}
{{/if}}

Livrables:
- Rapport d'analyse avec insights clés
- {{#if includeRecommendations == "oui"}}Recommandations actionables{{/if}}
- {{#if includeCode == "oui"}}Code d'analyse ({{analysisLanguage}}){{/if}}`,
      variables: [
        { name: 'dataType', type: 'select', label: 'Type de données', options: ['ventes', 'marketing', 'utilisateurs', 'financières', 'temporel', 'personnalisé'], required: true },
        { name: 'analysisGoal', type: 'text', label: 'Objectif de l\'analyse', placeholder: 'Ex: Identifier les facteurs de croissance', required: true },
        { name: 'datasetDescription', type: 'textarea', label: 'Description du dataset', placeholder: 'Décrivez vos données', required: true },
        { name: 'timePeriod', type: 'text', label: 'Période d\'analyse', placeholder: 'Ex: Janvier 2023 - Décembre 2023' },
        { name: 'dataVolume', type: 'text', label: 'Volume de données', placeholder: 'Ex: 100K lignes, 50 colonnes' },
        { name: 'customMetrics', type: 'text', label: 'Métriques personnalisées', placeholder: 'Pour type personnalisé' },
        { name: 'analysisType', type: 'select', label: 'Type d\'analyse', options: ['descriptive', 'predictive', 'comparative'], required: true },
        { name: 'includeVisualization', type: 'select', label: 'Inclure visualisations', options: ['oui', 'non'], defaultValue: 'oui' },
        { name: 'includeRecommendations', type: 'select', label: 'Inclure recommandations', options: ['oui', 'non'], defaultValue: 'oui' },
        { name: 'includeCode', type: 'select', label: 'Inclure code d\'analyse', options: ['oui', 'non'], defaultValue: 'non' },
        { name: 'analysisLanguage', type: 'select', label: 'Langage d\'analyse', options: ['Python', 'R', 'SQL', 'Excel'] }
      ],
      conditionalRules: [
        { variable: 'dataType', condition: 'equals', value: 'ventes', thenText: 'Métriques commerciales', elseText: 'Métriques génériques' },
        { variable: 'analysisType', condition: 'equals', value: 'predictive', thenText: 'Modèles ML', elseText: 'Statistiques descriptives' }
      ],
      tags: ['data', 'analyse', 'statistiques'],
      difficulty: 'Avancé',
      estimatedTime: '15-20 min'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Contenu': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
      'Développement': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      'Data Science': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
      'Marketing': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
      'Design': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Débutant': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      'Intermédiaire': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Avancé': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  };

  const handleVariableChange = (variableName: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variableName]: value
    }));
  };

  const processTemplate = (template: string, variables: Record<string, string>): string => {
    let processed = template;
    
    // Remplacer les variables simples {{variable}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      processed = processed.replace(regex, value || `[${key}]`);
    });

    // Traiter les conditions {{#if condition}}...{{/if}}
    const ifRegex = /\{\{#if\s+([^}]+)\}\}(.*?)\{\{\/if\}\}/gs;
    processed = processed.replace(ifRegex, (match, condition, content) => {
      const evaluateCondition = (cond: string): boolean => {
        // Parse conditions like "variable == value"
        const equalMatch = cond.match(/(\w+)\s*==\s*"([^"]+)"/);
        if (equalMatch) {
          const [, variable, value] = equalMatch;
          return variables[variable] === value;
        }
        
        // Simple variable check
        const simpleMatch = cond.match(/(\w+)/);
        if (simpleMatch) {
          const variable = simpleMatch[1];
          return variables[variable] === 'oui' || variables[variable] === 'true';
        }
        
        return false;
      };

      // Handle {{else}} within the content
      const elseParts = content.split('{{else}}');
      if (elseParts.length === 2) {
        return evaluateCondition(condition) ? elseParts[0].trim() : elseParts[1].trim();
      } else {
        return evaluateCondition(condition) ? content.trim() : '';
      }
    });

    // Traiter les conditions {{else if}}
    const elseIfRegex = /\{\{else if\s+([^}]+)\}\}/g;
    processed = processed.replace(elseIfRegex, (match, condition) => {
      // Cette logique devrait être intégrée dans le traitement des if ci-dessus
      return '';
    });

    return processed;
  };

  const generatePrompt = () => {
    if (!selectedTemplate) return;
    
    const prompt = processTemplate(selectedTemplate.template, variableValues);
    setGeneratedPrompt(prompt);
    setActiveTab('preview');
    
    toast({
      title: "Prompt généré !",
      description: "Votre prompt a été créé avec succès."
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copié !",
      description: "Le prompt a été copié dans le presse-papiers."
    });
  };

  const openTemplateDialog = (template: AdvancedTemplate) => {
    setSelectedTemplate(template);
    // Initialiser les valeurs par défaut
    const defaultValues: Record<string, string> = {};
    template.variables.forEach(variable => {
      if (variable.defaultValue) {
        defaultValues[variable.name] = variable.defaultValue;
      }
    });
    setVariableValues(defaultValues);
    setGeneratedPrompt('');
    setActiveTab('configure');
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Templates Avancés avec Variables
            </h3>
            <p className="text-muted-foreground">
              Templates intelligents qui s'adaptent à vos besoins avec variables et logique conditionnelle
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Variable className="h-4 w-4 text-blue-500" />
            <span>Variables dynamiques</span>
          </div>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-4 w-4 text-purple-500" />
            <span>Logique conditionnelle</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span>Génération instantanée</span>
          </div>
        </div>
      </div>

      {/* Grille des templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advancedTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/30 dark:border-gray-700/30">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/50 dark:to-purple-900/50 rounded-lg flex items-center justify-center">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                        {template.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm leading-relaxed mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Statistiques du template */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Variable className="h-3 w-3" />
                  <span>{template.variables.length} variables</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <GitBranch className="h-3 w-3" />
                  <span>{template.conditionalRules.length} conditions</span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Temps estimé */}
              <div className="text-xs text-muted-foreground flex items-center space-x-1">
                <Settings className="h-3 w-3" />
                <span>Configuration: {template.estimatedTime}</span>
              </div>
              
              <Dialog open={isDialogOpen && selectedTemplate?.id === template.id} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => openTemplateDialog(template)}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Configurer & Générer
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      {template.icon}
                      <span>{template.name}</span>
                    </DialogTitle>
                    <DialogDescription>
                      {template.description}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="configure" className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Configuration</span>
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span>Aperçu</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="configure" className="mt-4 overflow-y-auto max-h-[60vh]">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {template.variables.map((variable) => (
                            <div key={variable.name} className="space-y-2">
                              <Label htmlFor={variable.name} className="text-sm font-medium">
                                {variable.label}
                                {variable.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              
                              {variable.type === 'text' && (
                                <Input
                                  id={variable.name}
                                  placeholder={variable.placeholder}
                                  value={variableValues[variable.name] || ''}
                                  onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                                />
                              )}
                              
                              {variable.type === 'textarea' && (
                                <Textarea
                                  id={variable.name}
                                  placeholder={variable.placeholder}
                                  value={variableValues[variable.name] || ''}
                                  onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                                  className="min-h-[80px]"
                                />
                              )}
                              
                              {variable.type === 'select' && (
                                <Select
                                  value={variableValues[variable.name] || ''}
                                  onValueChange={(value) => handleVariableChange(variable.name, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Choisir ${variable.label.toLowerCase()}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {variable.options?.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                              
                              {variable.type === 'number' && (
                                <Input
                                  id={variable.name}
                                  type="number"
                                  placeholder={variable.placeholder}
                                  value={variableValues[variable.name] || ''}
                                  onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Annuler
                          </Button>
                          <Button onClick={generatePrompt} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                            <Zap className="h-4 w-4 mr-2" />
                            Générer le Prompt
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="preview" className="mt-4">
                      {generatedPrompt ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Prompt généré :</h4>
                            <Button variant="outline" size="sm" onClick={copyToClipboard}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copier
                            </Button>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border max-h-[50vh] overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                              {generatedPrompt}
                            </pre>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Configurez d'abord les variables pour voir l'aperçu</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdvancedTemplates;
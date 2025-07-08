import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Wand2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// Configuration des fournisseurs d'API
const API_PROVIDERS = {
  mistral: {
    name: 'Mistral AI',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    model: 'mistral-large-latest',
    consoleUrl: 'https://console.mistral.ai/',
    authHeader: (key: string) => `Bearer ${key}`
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    consoleUrl: 'https://platform.openai.com/api-keys',
    authHeader: (key: string) => `Bearer ${key}`
  },
  anthropic: {
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    consoleUrl: 'https://console.anthropic.com/',
    authHeader: (key: string) => key
  }
};

const PromptGenerator = () => {
  const { t } = useTranslation();
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
  const [apiKey, setApiKey] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('mistral');

  // Nouvelles catégories restructurées
  const categories = [
    { 
      value: 'content-creation', 
      label: t('contentCreation'), 
      description: t('contentCreationDesc')
    },
    { 
      value: 'business-professional', 
      label: t('businessProfessional'), 
      description: t('businessProfessionalDesc')
    },
    { 
      value: 'education-training', 
      label: t('educationTraining'), 
      description: t('educationTrainingDesc')
    },
    { 
      value: 'technology-development', 
      label: t('technologyDevelopment'), 
      description: t('technologyDevelopmentDesc')
    },
    { 
      value: 'analysis-research', 
      label: t('analysisResearch'), 
      description: t('analysisResearchDesc')
    },
    { 
      value: 'problem-solving', 
      label: t('problemSolving'), 
      description: t('problemSolvingDesc')
    },
    { 
      value: 'communication-relations', 
      label: t('communicationRelations'), 
      description: t('communicationRelationsDesc')
    }
  ];

  // Sous-catégories pour chaque catégorie principale
  const subcategories = {
    'content-creation': [
      { value: 'writing', label: t('writing') },
      { value: 'artistic-creation', label: t('artisticCreation') },
      { value: 'video-audio', label: t('videoAudio') },
      { value: 'marketing', label: t('marketing') },
      { value: 'literature', label: t('literature') }
    ],
    'business-professional': [
      { value: 'strategy', label: t('strategy') },
      { value: 'communication', label: t('communication') },
      { value: 'hr', label: t('hr') },
      { value: 'sales', label: t('sales') },
      { value: 'management', label: t('management') }
    ],
    'education-training': [
      { value: 'courses', label: t('courses') },
      { value: 'evaluation', label: t('evaluation') },
      { value: 'research', label: t('research') },
      { value: 'pedagogy', label: t('pedagogy') },
      { value: 'professional-training', label: t('professionalTraining') }
    ],
    'technology-development': [
      { value: 'programming', label: t('programming') },
      { value: 'data-science', label: t('dataScience') },
      { value: 'cybersecurity', label: t('cybersecurity') },
      { value: 'architecture', label: t('architecture') },
      { value: 'devops', label: t('devops') }
    ],
    'analysis-research': [
      { value: 'data-analysis', label: t('dataAnalysisSubcat') },
      { value: 'academic-research', label: t('academicResearch') },
      { value: 'competitive-intelligence', label: t('competitiveIntelligence') },
      { value: 'audit-evaluation', label: t('auditEvaluation') },
      { value: 'forecasting', label: t('forecasting') }
    ],
    'problem-solving': [
      { value: 'diagnosis', label: t('diagnosis') },
      { value: 'brainstorming', label: t('brainstorming') },
      { value: 'decision-making', label: t('decisionMaking') },
      { value: 'optimization', label: t('optimization') },
      { value: 'innovation', label: t('innovation') }
    ],
    'communication-relations': [
      { value: 'customer-relations', label: t('customerRelations') },
      { value: 'internal-communication', label: t('internalCommunication') },
      { value: 'negotiation', label: t('negotiation') },
      { value: 'presentation', label: t('presentation') },
      { value: 'public-relations', label: t('publicRelations') }
    ]
  };

  // Options pour les formats de sortie
  const outputFormats = [
    { value: 'bullet-list', label: t('bulletList') },
    { value: 'structured-paragraph', label: t('structuredParagraph') },
    { value: 'table', label: t('table') },
    { value: 'numbered-steps', label: t('numberedSteps') },
    { value: 'dialogue', label: t('dialogue') },
    { value: 'code-script', label: t('codeScript') }
  ];

  // Options pour le ton/style
  const toneOptions = [
    { value: 'professional', label: t('professional') },
    { value: 'casual', label: t('casual') },
    { value: 'technical', label: t('technical') },
    { value: 'creative', label: t('creative') },
    { value: 'persuasive', label: t('persuasive') },
    { value: 'educational', label: t('educational') }
  ];

  // Options pour la longueur
  const lengthOptions = [
    { value: 'short', label: t('short') },
    { value: 'medium', label: t('medium') },
    { value: 'long', label: t('long') },
    { value: 'very-detailed', label: t('veryDetailed') }
  ];

  const getSubcategories = (categoryValue: string) => {
    return subcategories[categoryValue as keyof typeof subcategories] || [];
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
      subcategory: '' // Reset subcategory when category changes
    });
  };

  const generatePromptWithAI = async (formData: any) => {
    if (!apiKey.trim()) {
      throw new Error('Veuillez configurer votre clé API dans les paramètres.');
    }

    const provider = API_PROVIDERS[selectedProvider as keyof typeof API_PROVIDERS];
    if (!provider) {
      throw new Error('Fournisseur d\'API non supporté.');
    }

    try {
      console.log(`Génération de prompt via ${provider.name}...`);
      
      const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || formData.category;
      const subcategoryLabel = formData.subcategory ? 
        getSubcategories(formData.category).find(sub => sub.value === formData.subcategory)?.label : '';

      const systemPrompt = `Tu es un expert en création de prompts pour l'intelligence artificielle. Crée un prompt détaillé et structuré.

Format requis:
**RÔLE**: [rôle expert spécialisé]
**MISSION**: [mission précise et claire]
**OBJECTIFS**: [objectifs détaillés et mesurables]
**MÉTHODOLOGIE**: [approche structurée]
**CONTRAINTES**: [contraintes techniques et contextuelles]
**LIVRABLES**: [résultats attendus avec format spécifique]
**STYLE**: [ton et style de communication]`;

      let userPrompt = `Crée un prompt expert pour:
- Domaine: ${categoryLabel}
${subcategoryLabel ? `- Spécialisation: ${subcategoryLabel}` : ''}
- Description: ${formData.description}`;

      if (formData.objective) userPrompt += `\n- Objectif: ${formData.objective}`;
      if (formData.targetAudience) userPrompt += `\n- Public cible: ${formData.targetAudience}`;
      if (formData.format) userPrompt += `\n- Format souhaité: ${outputFormats.find(f => f.value === formData.format)?.label}`;
      if (formData.tone) userPrompt += `\n- Ton: ${toneOptions.find(t => t.value === formData.tone)?.label}`;
      if (formData.length) userPrompt += `\n- Longueur: ${lengthOptions.find(l => l.value === formData.length)?.label}`;

      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': provider.authHeader(apiKey),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          throw new Error('La clé API n\'a plus de crédits disponibles. Veuillez recharger votre compte ou utiliser une autre clé API.');
        } else if (response.status === 429) {
          throw new Error('Limite de requêtes dépassée. Veuillez attendre quelques minutes avant de réessayer ou vérifier votre quota API.');
        } else if (response.status === 401) {
          throw new Error('Clé API invalide. Veuillez vérifier votre clé API.');
        }
        
        throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API Mistral reçue:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error(`Format de réponse API inattendu pour ${provider.name}`);
      }
    } catch (error) {
      console.error(`Erreur lors de la génération du prompt avec ${provider.name}:`, error);
      throw error;
    }
  };

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
      const aiGeneratedPrompt = await generatePromptWithAI(formData);
      
      setGeneratedPrompt(aiGeneratedPrompt);
      
      toast({
        title: t('promptCreatedSuccess'),
        description: t('promptCreatedDesc'),
      });
    } catch (error) {
      console.error('Erreur:', error);
      
      let errorMessage = "Impossible de générer le prompt.";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte.";
      } else if (error.message.includes('Limite de requêtes')) {
        errorMessage = "Limite de requêtes dépassée. Attendez quelques minutes avant de réessayer.";
      } else if (error.message.includes('Clé API invalide')) {
        errorMessage = "Clé API invalide. Vérifiez votre configuration.";
      } else if (error.message.includes('configurer votre clé')) {
        errorMessage = "Veuillez configurer votre clé API.";
      } else if (error.message.includes('connexion')) {
        errorMessage = "Vérifiez votre connexion internet.";
      } else if (error.message.includes('Fournisseur')) {
        errorMessage = "Fournisseur d'API non supporté.";
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
          {/* Configuration API Key */}
          <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
            <div className="space-y-3">
              <Label htmlFor="provider" className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Fournisseur d'API
              </Label>
              <select
                id="provider"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-3 py-2 border border-amber-300 dark:border-amber-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {Object.entries(API_PROVIDERS).map(([key, provider]) => (
                  <option key={key} value={key}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="apiKey" className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                Clé API {API_PROVIDERS[selectedProvider as keyof typeof API_PROVIDERS].name} (obligatoire)
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder={`Entrez votre clé API ${API_PROVIDERS[selectedProvider as keyof typeof API_PROVIDERS].name}...`}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="animated-border hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-amber-300 dark:border-amber-600"
              />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Obtenez votre clé API sur{' '}
                <a 
                  href={API_PROVIDERS[selectedProvider as keyof typeof API_PROVIDERS].consoleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-800 dark:hover:text-amber-300"
                >
                  {API_PROVIDERS[selectedProvider as keyof typeof API_PROVIDERS].consoleUrl.replace('https://', '')}
                </a>
              </p>
            </div>
          </div>

          {/* Sélection du fournisseur et clé API */}
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Fournisseurs supportés</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(API_PROVIDERS).map(([key, provider]) => (
                <div key={key} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border">
                  <div className={`w-3 h-3 rounded-full ${selectedProvider === key ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{provider.name}</span>
                </div>
              ))}
            </Label>
          </div>

          {/* Catégorie principale */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
              {t('mainCategory')} {t('required')}
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder={t('selectDomain')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-80">
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="font-medium py-3 px-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex flex-col">
                      <div className="font-semibold text-gray-800">{cat.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{cat.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sous-catégorie */}
          {formData.category && getSubcategories(formData.category).length > 0 && (
            <div className="space-y-3">
              <Label htmlFor="subcategory" className="text-sm font-semibold text-gray-700">
                {t('subcategory')} {t('optional')}
              </Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value})}>
                <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                  <SelectValue placeholder={t('chooseSpecialization')} />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-xl z-50 max-h-80">
                  {getSubcategories(formData.category).map((subcat) => (
                    <SelectItem key={subcat.value} value={subcat.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                      <div className="text-gray-800">{subcat.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description principale */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              {t('taskDescription')} {t('required')}
            </Label>
            <Textarea
              id="description"
              placeholder={t('taskDescriptionPlaceholder')}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[100px] bg-white"
              rows={4}
            />
          </div>

          {/* Objectif */}
          <div className="space-y-3">
            <Label htmlFor="objective" className="text-sm font-semibold text-gray-700">
              {t('mainObjective')} {t('optional')}
            </Label>
            <Input
              id="objective"
              placeholder={t('mainObjectivePlaceholder')}
              value={formData.objective}
              onChange={(e) => setFormData({...formData, objective: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
            />
          </div>

          {/* Public cible */}
          <div className="space-y-3">
            <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700">
              {t('targetAudience')} {t('optional')}
            </Label>
            <Input
              id="targetAudience"
              placeholder={t('targetAudiencePlaceholder')}
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
            />
          </div>

          {/* Format de sortie */}
          <div className="space-y-3">
            <Label htmlFor="format" className="text-sm font-semibold text-gray-700">
              {t('outputFormat')} {t('optional')}
            </Label>
            <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder={t('chooseFormat')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
                {outputFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ton/Style */}
          <div className="space-y-3">
            <Label htmlFor="tone" className="text-sm font-semibold text-gray-700">
              {t('toneStyle')} {t('optional')}
            </Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder={t('chooseTone')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
                {toneOptions.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Longueur */}
          <div className="space-y-3">
            <Label htmlFor="length" className="text-sm font-semibold text-gray-700">
              {t('approximateLength')} {t('optional')}
            </Label>
            <Select value={formData.length} onValueChange={(value) => setFormData({...formData, length: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder={t('chooseLength')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
                {lengthOptions.map((length) => (
                  <SelectItem key={length.value} value={length.value} className="font-medium py-2 px-4 hover:bg-gray-50 cursor-pointer">
                    {length.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating || !apiKey.trim()}
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
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">{t('aiGeneratedPrompt')}</span>
            {generatedPrompt && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                <Copy className="h-4 w-4 mr-2" />
                {t('copy')}
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            {t('aiGeneratedPromptDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="glass-card border-white/30 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed max-h-96 overflow-y-auto">
                {generatedPrompt}
              </pre>
              <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-sm text-emerald-700 font-medium">
                  🤖 <strong>{t('generatedByAI')} :</strong> {t('aiGeneratedDesc')}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">{t('readyForGeneration')}</p>
              <p className="text-sm">{t('aiWillCreate')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;

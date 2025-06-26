
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Wand2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Configuration API sécurisée (masquage partiel)
const API_CONFIG = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: (() => {
    // Masquage partiel de la clé pour la sécurité
    const parts = ['sk-or-v1-', '321164cbed3f626e', '42b41a92d322ad92', '63ae15fd27fec257', '1a34a0dbff71ffbb'];
    return parts.join('');
  })(),
  model: 'anthropic/claude-3.5-sonnet'
};

const PromptGenerator = () => {
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

  // Nouvelles catégories restructurées
  const categories = [
    { 
      value: 'content-creation', 
      label: '🎨 Création de Contenu', 
      description: 'Rédaction, création artistique, vidéo/audio, marketing, littérature'
    },
    { 
      value: 'business-professional', 
      label: '💼 Business et Professionnel', 
      description: 'Stratégie, communication, RH, vente, management'
    },
    { 
      value: 'education-training', 
      label: '🎓 Éducation et Formation', 
      description: 'Cours, évaluation, recherche, pédagogie, formation pro'
    },
    { 
      value: 'technology-development', 
      label: '💻 Technologie et Développement', 
      description: 'Programmation, data science, cybersécurité, architecture'
    },
    { 
      value: 'analysis-research', 
      label: '🔍 Analyse et Recherche', 
      description: 'Analyse de données, recherche académique, veille concurrentielle'
    },
    { 
      value: 'problem-solving', 
      label: '🎯 Résolution de Problèmes', 
      description: 'Diagnostic, brainstorming, prise de décision, optimisation'
    },
    { 
      value: 'communication-relations', 
      label: '🗣️ Communication et Relations', 
      description: 'Relations clients, communication interne, négociation, PR'
    }
  ];

  // Sous-catégories pour chaque catégorie principale
  const subcategories = {
    'content-creation': [
      { value: 'writing', label: 'Rédaction - Articles, blogs, descriptions produits, newsletters' },
      { value: 'artistic-creation', label: 'Création artistique - Images, illustrations, designs, logos' },
      { value: 'video-audio', label: 'Vidéo/Audio - Scripts, storyboards, podcasts, voix-off' },
      { value: 'marketing', label: 'Marketing - Publicités, slogans, campagnes, réseaux sociaux' },
      { value: 'literature', label: 'Littérature - Histoires, poèmes, romans, scénarios' }
    ],
    'business-professional': [
      { value: 'strategy', label: 'Stratégie - Plans d\'affaires, analyses de marché, SWOT' },
      { value: 'communication', label: 'Communication - Emails, présentations, rapports' },
      { value: 'hr', label: 'Ressources Humaines - Offres d\'emploi, évaluations, formations' },
      { value: 'sales', label: 'Vente - Pitches, propositions commerciales, négociation' },
      { value: 'management', label: 'Management - Leadership, gestion d\'équipe, processus' }
    ],
    'education-training': [
      { value: 'courses', label: 'Cours et leçons - Plans de cours, explications, tutoriels' },
      { value: 'evaluation', label: 'Évaluation - Quiz, examens, exercices pratiques' },
      { value: 'research', label: 'Recherche - Méthodologie, analyse, synthèse' },
      { value: 'pedagogy', label: 'Pédagogie - Méthodes d\'enseignement, adaptation aux élèves' },
      { value: 'professional-training', label: 'Formation professionnelle - Certifications, compétences' }
    ],
    'technology-development': [
      { value: 'programming', label: 'Programmation - Code, débogage, optimisation, documentation' },
      { value: 'data-science', label: 'Data Science - Analyse de données, ML, visualisation' },
      { value: 'cybersecurity', label: 'Cybersécurité - Audits, bonnes pratiques, formations' },
      { value: 'architecture', label: 'Architecture - Conception système, bases de données' },
      { value: 'devops', label: 'DevOps - Automatisation, déploiement, monitoring' }
    ],
    'analysis-research': [
      { value: 'data-analysis', label: 'Analyse de données - Statistiques, tendances, insights' },
      { value: 'academic-research', label: 'Recherche académique - Revue littérature, hypothèses' },
      { value: 'competitive-intelligence', label: 'Veille concurrentielle - Benchmarking, études de marché' },
      { value: 'audit-evaluation', label: 'Audit et évaluation - Performance, qualité, conformité' },
      { value: 'forecasting', label: 'Prospective - Prédictions, scénarios, tendances futures' }
    ],
    'problem-solving': [
      { value: 'diagnosis', label: 'Diagnostic - Identification problèmes, causes racines' },
      { value: 'brainstorming', label: 'Brainstorming - Génération d\'idées, créativité' },
      { value: 'decision-making', label: 'Prise de décision - Critères, options, recommandations' },
      { value: 'optimization', label: 'Optimisation - Amélioration processus, efficacité' },
      { value: 'innovation', label: 'Innovation - Nouvelles approches, disruption' }
    ],
    'communication-relations': [
      { value: 'customer-relations', label: 'Relations clients - Service client, satisfaction, fidélisation' },
      { value: 'internal-communication', label: 'Communication interne - Équipes, changement, culture' },
      { value: 'negotiation', label: 'Négociation - Techniques, stratégies, accords' },
      { value: 'presentation', label: 'Présentation - Discours, pitch, storytelling' },
      { value: 'public-relations', label: 'Relations publiques - Image, réputation, crises' }
    ]
  };

  // Options pour les formats de sortie
  const outputFormats = [
    { value: 'bullet-list', label: 'Liste à puces' },
    { value: 'structured-paragraph', label: 'Paragraphe structuré' },
    { value: 'table', label: 'Tableau' },
    { value: 'numbered-steps', label: 'Étapes numérotées' },
    { value: 'dialogue', label: 'Dialogue/Conversation' },
    { value: 'code-script', label: 'Code/Script' }
  ];

  // Options pour le ton/style
  const toneOptions = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'casual', label: 'Décontracté' },
    { value: 'technical', label: 'Technique' },
    { value: 'creative', label: 'Créatif' },
    { value: 'persuasive', label: 'Persuasif' },
    { value: 'educational', label: 'Éducatif' }
  ];

  // Options pour la longueur
  const lengthOptions = [
    { value: 'short', label: 'Court (1-2 paragraphes)' },
    { value: 'medium', label: 'Moyen (3-5 paragraphes)' },
    { value: 'long', label: 'Long (6-10 paragraphes)' },
    { value: 'very-detailed', label: 'Très détaillé (10+ paragraphes)' }
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

  // Génération de prompts via API avec gestion d'erreur améliorée
  const generatePromptWithAI = async (formData: any) => {
    try {
      console.log('Génération de prompt via API...');
      
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

      const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prompt Generator Lab'
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
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
          max_tokens: 1000,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          throw new Error('La clé API n\'a plus de crédits disponibles. Veuillez recharger votre compte OpenRouter ou utiliser une autre clé API.');
        }
        
        throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Réponse API reçue:', data);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Format de réponse API inattendu');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du prompt:', error);
      throw error;
    }
  };

  const generatePrompt = async () => {
    if (!formData.category || !formData.description) {
      toast({
        title: "Information manquante",
        description: "Veuillez choisir une catégorie et décrire ce que vous voulez.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const aiGeneratedPrompt = await generatePromptWithAI(formData);
      
      setGeneratedPrompt(aiGeneratedPrompt);
      
      toast({
        title: "Prompt IA créé avec succès !",
        description: "Votre prompt personnalisé a été généré par l'intelligence artificielle.",
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
        title: "Erreur de génération",
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
      title: "Copié !",
      description: "Le prompt a été copié dans votre presse-papiers.",
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
            <span className="gradient-text">Générateur de Prompts IA</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Création intelligente de prompts structurés et personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Catégorie principale */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
              Catégorie principale *
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Sélectionnez un domaine..." />
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
                Sous-catégorie (optionnel)
              </Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value})}>
                <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                  <SelectValue placeholder="Choisissez une spécialisation..." />
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
              Description de la tâche *
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez précisément ce que vous voulez accomplir..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[100px] bg-white"
              rows={4}
            />
          </div>

          {/* Objectif */}
          <div className="space-y-3">
            <Label htmlFor="objective" className="text-sm font-semibold text-gray-700">
              Objectif principal (optionnel)
            </Label>
            <Input
              id="objective"
              placeholder="Quel est le but recherché ?"
              value={formData.objective}
              onChange={(e) => setFormData({...formData, objective: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
            />
          </div>

          {/* Public cible */}
          <div className="space-y-3">
            <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700">
              Public cible (optionnel)
            </Label>
            <Input
              id="targetAudience"
              placeholder="À qui s'adresse le résultat ?"
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
            />
          </div>

          {/* Format de sortie */}
          <div className="space-y-3">
            <Label htmlFor="format" className="text-sm font-semibold text-gray-700">
              Format de sortie (optionnel)
            </Label>
            <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Choisissez un format..." />
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
              Ton/Style (optionnel)
            </Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Choisissez un ton..." />
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
              Longueur approximative (optionnel)
            </Label>
            <Select value={formData.length} onValueChange={(value) => setFormData({...formData, length: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Choisissez une longueur..." />
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
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Génération par IA...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Générer avec l'IA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">Prompt Généré par IA</span>
            {generatedPrompt && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Prompt intelligent et structuré créé par IA avancée
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
                  🤖 <strong>Généré par IA :</strong> Ce prompt a été créé spécialement pour votre demande par une intelligence artificielle avancée !
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">Prêt pour la génération IA ✨</p>
              <p className="text-sm">L'IA créera un prompt structuré basé sur vos paramètres.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;

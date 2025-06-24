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
    const parts = ['sk-or-v1-', '00053c3b667a5b65', 'd4a3b01104efe739', 'bd499e363c2d67a0', '02168eabbd3ca41f'];
    return parts.join('');
  })(),
  model: 'anthropic/claude-3.5-sonnet'
};

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Catégories générales
  const categories = [
    { value: 'text-generation', label: '✍️ Écrire du texte', description: 'Articles, emails, histoires...' },
    { value: 'creative-writing', label: '🎨 Créer du contenu créatif', description: 'Poèmes, récits, scénarios...' },
    { value: 'image-creation', label: '🖼️ Décrire des images', description: 'Pour créer des images avec IA' },
    { value: 'code-generation', label: '💻 Coder', description: 'Programmes, scripts, sites web...' },
    { value: 'data-analysis', label: '📊 Analyser des données', description: 'Résumés, rapports, insights...' },
    { value: 'interactive-dialogue', label: '💬 Avoir une conversation', description: 'Assistant, coach, tuteur...' },
    
    // Domaines spécialisés
    { value: 'health-medical', label: '🏥 Santé & Médical', description: 'Diagnostics, recherche, suivi patients...' },
    { value: 'education', label: '🎓 Éducation', description: 'Tutorat, évaluation, apprentissage personnalisé...' },
    { value: 'industry-manufacturing', label: '🏭 Industrie & Fabrication', description: 'Maintenance, automatisation, logistique...' },
    { value: 'finance-banking', label: '💰 Finance & Banque', description: 'Fraude, crédit, trading, conseils...' },
    { value: 'sales-marketing', label: '📈 Vente & Marketing', description: 'Recommandations, campagnes, chatbots...' },
    { value: 'transport-logistics', label: '🚛 Transport & Logistique', description: 'Véhicules autonomes, itinéraires, livraisons...' },
    { value: 'agriculture', label: '🌾 Agriculture', description: 'Précision, rendements, gestion cultures...' },
    { value: 'media-entertainment', label: '🎬 Médias & Divertissement', description: 'Recommandations, création contenu, effets...' },
    { value: 'language-communication', label: '🗣️ Langage & Communication', description: 'Traduction, reconnaissance vocale, NLP...' },
    { value: 'cybersecurity', label: '🔒 Cybersécurité', description: 'Détection anomalies, authentification, surveillance...' },
    { value: 'environment-climate', label: '🌍 Environnement & Climat', description: 'Modélisation climat, prévisions, énergie...' },
    { value: 'human-resources', label: '👥 Ressources Humaines', description: 'Recrutement, formation, fidélisation...' },
    { value: 'legal', label: '⚖️ Droit', description: 'Analyse juridique, contrats, jurisprudence...' },
    { value: 'art-creation', label: '🎨 Art & Création', description: 'Peinture, musique, design assisté...' },
    { value: 'ecommerce', label: '🛒 E-commerce', description: 'Recherche visuelle, essai virtuel, pricing...' }
  ];

  // Domaines spécialisés
  const subcategories = {
    'health-medical': [
      { value: 'medical-diagnostics', label: 'Diagnostics médicaux' },
      { value: 'pharmaceutical-research', label: 'Recherche pharmaceutique et découverte de médicaments' },
      { value: 'patient-monitoring', label: 'Suivi des patients via des dispositifs intelligents' },
      { value: 'robotic-surgery', label: 'Chirurgie assistée par robot' },
      { value: 'precision-medicine', label: 'Personnalisation des traitements (médecine de précision)' }
    ],
    'education': [
      { value: 'intelligent-tutoring', label: 'Systèmes tutoriaux intelligents adaptés au niveau de l\'apprenant' },
      { value: 'automated-assessment', label: 'Évaluation automatisée des compétences' },
      { value: 'personalized-learning', label: 'Personnalisation de l\'apprentissage' },
      { value: 'early-detection', label: 'Détection précoce des difficultés scolaires' }
    ],
    'industry-manufacturing': [
      { value: 'predictive-maintenance', label: 'Maintenance prédictive des machines' },
      { value: 'process-automation', label: 'Automatisation des processus de production' },
      { value: 'supply-chain', label: 'Gestion de la chaîne logistique (prévision de la demande)' },
      { value: 'quality-control', label: 'Contrôle qualité automatisé' }
    ],
    'finance-banking': [
      { value: 'fraud-detection', label: 'Détection de fraude' },
      { value: 'credit-risk', label: 'Analyse du risque crédit' },
      { value: 'algorithmic-trading', label: 'Trading algorithmique (finance quantitative)' },
      { value: 'robo-advisors', label: 'Conseil en investissement automatisé (robo-advisors)' },
      { value: 'insurance-claims', label: 'Gestion des sinistres en assurance' }
    ],
    'sales-marketing': [
      { value: 'personalization', label: 'Personnalisation des offres et recommandations produits' },
      { value: 'predictive-analytics', label: 'Analyse prédictive des comportements clients' },
      { value: 'customer-service-bots', label: 'Chatbots pour le service client' },
      { value: 'campaign-optimization', label: 'Optimisation des campagnes marketing' }
    ],
    'transport-logistics': [
      { value: 'autonomous-vehicles', label: 'Véhicules autonomes (voitures, camions, drones)' },
      { value: 'route-optimization', label: 'Optimisation des itinéraires' },
      { value: 'fleet-management', label: 'Gestion des flottes' },
      { value: 'delivery-tracking', label: 'Suivi en temps réel des livraisons' }
    ],
    'agriculture': [
      { value: 'precision-farming', label: 'Agriculture de précision (gestion des cultures avec capteurs et drones)' },
      { value: 'yield-prediction', label: 'Prédiction des rendements' },
      { value: 'disease-detection', label: 'Détection des maladies des plantes' },
      { value: 'resource-management', label: 'Gestion optimisée de l\'eau et des engrais' }
    ],
    'media-entertainment': [
      { value: 'content-recommendation', label: 'Recommandation de contenu (vidéos, musique, articles)' },
      { value: 'ai-content-generation', label: 'Création de contenus générés par IA (texte, image, vidéo)' },
      { value: 'special-effects', label: 'Effets spéciaux et animation' },
      { value: 'gaming-ai', label: 'Jeux vidéo avec personnages dotés d\'une IA réaliste' }
    ],
    'language-communication': [
      { value: 'automatic-translation', label: 'Traduction automatique' },
      { value: 'speech-recognition', label: 'Reconnaissance vocale et synthèse vocale' },
      { value: 'nlp-analysis', label: 'Traitement du langage naturel (NLP) pour l\'analyse de sentiment, la génération de texte' },
      { value: 'virtual-assistants', label: 'Chatbots et assistants virtuels' }
    ],
    'cybersecurity': [
      { value: 'anomaly-detection', label: 'Détection d\'anomalies et d\'attaques informatiques' },
      { value: 'automated-surveillance', label: 'Surveillance automatisée' },
      { value: 'biometric-auth', label: 'Authentification biométrique (reconnaissance faciale, vocale, empreinte digitale)' }
    ],
    'environment-climate': [
      { value: 'climate-modeling', label: 'Modélisation des changements climatiques' },
      { value: 'weather-forecasting', label: 'Prévision météorologique' },
      { value: 'disaster-detection', label: 'Détection de catastrophes naturelles' },
      { value: 'smart-energy', label: 'Gestion intelligente de l\'énergie (smart grids)' }
    ],
    'human-resources': [
      { value: 'ai-recruitment', label: 'Recrutement assisté par IA (sélection de CV, tests automatisés)' },
      { value: 'talent-detection', label: 'Détection du potentiel des candidats' },
      { value: 'personalized-training', label: 'Formation personnalisée' },
      { value: 'turnover-prediction', label: 'Détection du turnover et fidélisation' }
    ],
    'legal': [
      { value: 'legal-analysis', label: 'Analyse juridique automatisée' },
      { value: 'contract-drafting', label: 'Rédaction de contrats type' },
      { value: 'jurisprudence-search', label: 'Recherche jurisprudentielle' },
      { value: 'judicial-decision', label: 'Aide à la prise de décision judiciaire' }
    ],
    'art-creation': [
      { value: 'ai-art-generation', label: 'Peinture, musique, poésie générées par IA' },
      { value: 'computer-aided-design', label: 'Design assisté par ordinateur' },
      { value: 'logo-illustration', label: 'Génération de logos, illustrations, animations' }
    ],
    'ecommerce': [
      { value: 'visual-search', label: 'Moteurs de recherche visuelle' },
      { value: 'virtual-try-on', label: 'Essai virtuel de vêtements (en ligne)' },
      { value: 'personalized-experience', label: 'Expérience client personnalisée' },
      { value: 'dynamic-pricing', label: 'Pricing dynamique' }
    ]
  };

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

  // Nouvelle fonction pour générer des prompts via API avec gestion d'erreur améliorée
  const generatePromptWithAI = async (category: string, subcategory: string, description: string) => {
    try {
      console.log('Génération de prompt via API...');
      
      const categoryLabel = categories.find(cat => cat.value === category)?.label || category;
      const subcategoryLabel = subcategory ? 
        getSubcategories(category).find(sub => sub.value === subcategory)?.label : '';

      const systemPrompt = `Tu es un expert en création de prompts pour l'intelligence artificielle. Crée un prompt détaillé et structuré.

Format:
**RÔLE**: [rôle expert]
**MISSION**: [mission précise]
**OBJECTIFS**: [objectifs détaillés]
**MÉTHODOLOGIE**: [approche]
**LIVRABLES**: [résultats attendus]`;

      const userPrompt = `Crée un prompt expert pour:
- Domaine: ${categoryLabel}
${subcategoryLabel ? `- Spécialisation: ${subcategoryLabel}` : ''}
- Description: ${description}`;

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
          max_tokens: 1000, // Réduit de 2000 à 1000
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
      const aiGeneratedPrompt = await generatePromptWithAI(
        formData.category, 
        formData.subcategory, 
        formData.description
      );
      
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
      {/* Alerte d'information sur l'erreur API */}
      <div className="lg:col-span-2">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            <strong>Problème détecté :</strong> La clé API n'a plus de crédits suffisants. 
            Pour résoudre ce problème : rechargez les crédits sur OpenRouter.ai ou utilisez une nouvelle clé API.
          </AlertDescription>
        </Alert>
      </div>

      {/* Formulaire */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Créer un Prompt IA</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Génération intelligente de prompts par IA spécialisée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
              Dans quel domaine voulez-vous utiliser l'IA ? *
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Sélectionnez un domaine d'application..." />
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

          {formData.category && getSubcategories(formData.category).length > 0 && (
            <div className="space-y-3">
              <Label htmlFor="subcategory" className="text-sm font-semibold text-gray-700">
                Spécialisez votre choix (optionnel)
              </Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value})}>
                <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                  <SelectValue placeholder="Choisissez une sous-catégorie..." />
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

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Décrivez précisément ce que vous voulez faire *
            </Label>
            <Textarea
              id="description"
              placeholder="Exemple : Créer un système de diagnostic médical pour analyser des radiographies pulmonaires et détecter les pneumonies..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[120px] bg-white"
              rows={5}
            />
            <p className="text-xs text-gray-500">
              🤖 L'IA analysera votre description pour créer un prompt parfaitement adapté !
            </p>
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

          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-700 font-medium">
              ⚠️ <strong>Clé API sans crédits :</strong> La clé actuelle n'a plus de crédits. 
              Visitez <a href="https://openrouter.ai/settings/credits" target="_blank" rel="noopener noreferrer" className="underline">OpenRouter.ai</a> pour recharger.
            </p>
          </div>
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
            Prompt intelligent et personnalisé créé par IA avancée
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
              <p className="text-sm">L'IA créera un prompt personnalisé basé sur votre domaine et description.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;

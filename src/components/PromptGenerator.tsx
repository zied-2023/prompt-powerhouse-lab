import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Wand2 } from "lucide-react";

const PromptGenerator = () => {
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    // Catégories générales
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

  const generateDetailedPrompt = (category: string, description: string) => {
    const prompts = {
      'text-generation': `**RÔLE** : Tu es un expert rédacteur spécialisé dans la création de contenus textuels de haute qualité.

**CONTEXTE** : ${description}

**INSTRUCTIONS DÉTAILLÉES** :

1. **Structure et Organisation** :
   - Commence par un plan détaillé avec introduction, développement et conclusion
   - Utilise des titres et sous-titres clairs (H1, H2, H3)
   - Organise le contenu en paragraphes de 3-4 phrases maximum
   - Ajoute des transitions fluides entre les sections

2. **Style et Ton** :
   - Adapte le registre de langue au public cible
   - Utilise un vocabulaire précis et varié
   - Évite les répétitions et les formulations vagues
   - Maintiens un ton cohérent tout au long du texte

3. **Contenu et Qualité** :
   - Fournis des informations factuelles et vérifiables
   - Inclus des exemples concrets et des données chiffrées si pertinent
   - Développe chaque idée avec des arguments solides
   - Propose des solutions ou des perspectives nouvelles

**FORMAT DE RÉPONSE** :
- Longueur : [Spécifie le nombre de mots souhaité]
- Structure : Introduction (10%) - Développement (80%) - Conclusion (10%)
- Inclus une meta-description de 150-160 caractères

**LIVRABLES ATTENDUS** :
1. Le texte principal formaté
2. Une liste de 5 mots-clés secondaires utilisés
3. 3 suggestions de titres alternatifs`,

      'health-medical': `**RÔLE** : Tu es un expert en IA médicale avec une connaissance approfondie des applications de l'intelligence artificielle dans le domaine de la santé.

**MISSION MÉDICALE** : ${description}

**SPÉCIFICATIONS MÉDICALES** :

1. **Diagnostic et Analyse** :
   - Développe des approches d'analyse d'imagerie médicale (radiologie, IRM, scanner)
   - Intègre la reconnaissance de patterns dans les données de santé
   - Propose des algorithmes de détection précoce de maladies
   - Assure la conformité avec les standards médicaux (DICOM, HL7)

2. **Recherche et Développement** :
   - Analyse des bases de données biomédicales
   - Découverte de médicaments assistée par IA
   - Modélisation moléculaire et prédiction d'interactions
   - Essais cliniques virtuels et simulation

3. **Suivi Patient et Personnalisation** :
   - Développement de dispositifs IoT pour monitoring continu
   - Algorithmes de médecine de précision
   - Prédiction de réponse aux traitements
   - Gestion intelligente des dossiers médicaux électroniques

4. **Éthique et Sécurité** :
   - Respect de la confidentialité des données (RGPD, HIPAA)
   - Explicabilité des décisions de l'IA médicale
   - Validation clinique rigoureuse
   - Formation continue du personnel médical

**TECHNOLOGIES RECOMMANDÉES** :
- Apprentissage profond pour l'imagerie médicale
- NLP pour l'analyse de textes cliniques
- Réseaux de neurones convolutionnels pour la radiologie
- Algorithmes de recommandation pour les traitements

**LIVRABLES** :
1. Spécifications techniques détaillées
2. Protocoles de validation clinique
3. Plan de formation du personnel
4. Mesures de sécurité et conformité`,

      'education': `**RÔLE** : Tu es un expert en EdTech et intelligence artificielle éducative, spécialisé dans la personnalisation de l'apprentissage.

**PROJET ÉDUCATIF** : ${description}

**MÉTHODOLOGIE PÉDAGOGIQUE** :

1. **Personnalisation de l'Apprentissage** :
   - Analyse du profil d'apprentissage de chaque étudiant
   - Adaptation du rythme et du style pédagogique
   - Identification des lacunes et des forces
   - Recommandations de contenus personnalisés

2. **Systèmes Tutoriaux Intelligents** :
   - Dialogue interactif avec feedback immédiat
   - Questions adaptatives selon le niveau
   - Explications multiples pour chaque concept
   - Suivi des progrès en temps réel

3. **Évaluation Intelligente** :
   - Génération automatique de quiz adaptatifs
   - Correction automatisée avec feedback détaillé
   - Détection de la triche et du plagiat
   - Évaluation des compétences transversales

4. **Analyse Prédictive** :
   - Prédiction des risques de décrochage
   - Identification des étudiants à risque
   - Recommandations d'interventions précoces
   - Optimisation des parcours pédagogiques

**TECHNOLOGIES ÉDUCATIVES** :
- Learning Analytics et Educational Data Mining
- Systèmes de recommandation éducatifs
- Gamification et réalité virtuelle
- Chatbots pédagogiques multilingues

**LIVRABLES** :
1. Architecture du système éducatif intelligent
2. Algorithmes de personnalisation
3. Interface utilisateur intuitive
4. Métriques de performance pédagogique`,

      'finance-banking': `**RÔLE** : Tu es un expert en FinTech et intelligence artificielle financière, spécialisé dans les applications bancaires et d'assurance.

**MISSION FINANCIÈRE** : ${description}

**SPÉCIFICATIONS FINANCIÈRES** :

1. **Détection de Fraude** :
   - Algorithmes de détection d'anomalies en temps réel
   - Analyse comportementale des transactions
   - Scoring de risque dynamique
   - Intégration avec les systèmes de paiement

2. **Analyse de Crédit** :
   - Modèles de scoring alternatifs (données non-traditionnelles)
   - Évaluation du risque crédit en temps réel
   - Prédiction de défaut de paiement
   - Optimisation des taux d'intérêt

3. **Trading Algorithmique** :
   - Stratégies quantitatives automatisées
   - Analyse technique et fondamentale
   - Gestion des risques de marché
   - Exécution optimale des ordres

4. **Conseil en Investissement** :
   - Robo-advisors personnalisés
   - Allocation d'actifs optimisée
   - Rééquilibrage automatique de portefeuille
   - Planification financière intelligente

**CONFORMITÉ RÉGLEMENTAIRE** :
- Respect des normes Bâle III/IV
- Conformité MiFID II et GDPR
- Tests de stress automatisés
- Reporting réglementaire automatisé

**LIVRABLES** :
1. Architecture sécurisée des systèmes financiers
2. Modèles de risque validés
3. Interfaces utilisateur conformes
4. Documentation de conformité réglementaire`,

      'cybersecurity': `**RÔLE** : Tu es un expert en cybersécurité et intelligence artificielle, spécialisé dans la protection des systèmes informatiques.

**MISSION SÉCURITÉ** : ${description}

**STRATÉGIES DE SÉCURITÉ IA** :

1. **Détection d'Intrusions** :
   - Analyse comportementale des utilisateurs et systèmes
   - Détection d'anomalies réseau en temps réel
   - Classification automatique des menaces
   - Réponse automatisée aux incidents

2. **Authentification Biométrique** :
   - Reconnaissance faciale multi-facteurs
   - Analyse vocale et signature numérique
   - Détection de deepfakes et usurpation
   - Authentification continue et adaptative

3. **Analyse des Vulnérabilités** :
   - Scan automatisé des failles de sécurité
   - Priorisation intelligente des correctifs
   - Tests de pénétration automatisés
   - Gestion proactive des patches

4. **Intelligence des Menaces** :
   - Collecte et analyse de threat intelligence
   - Prédiction des nouvelles attaques
   - Partage automatisé d'indicateurs de compromission
   - Hunting proactif des menaces avancées

**TECHNOLOGIES SÉCURITAIRES** :
- Machine Learning pour la détection d'anomalies
- Deep Learning pour l'analyse de malwares
- NLP pour l'analyse de logs et communications
- Blockchain pour l'intégrité des données

**LIVRABLES** :
1. Architecture de sécurité Zero Trust
2. Playbooks de réponse aux incidents
3. Tableaux de bord de monitoring sécuritaire
4. Procédures de formation en cybersécurité`
    };

    // Pour les nouvelles catégories, on génère un prompt de base adapté
    if (!prompts[category as keyof typeof prompts]) {
      return `**RÔLE** : Tu es un expert en intelligence artificielle spécialisé dans le domaine "${category}".

**MISSION** : ${description}

**OBJECTIFS** :
1. Analyser les besoins spécifiques du domaine
2. Proposer des solutions IA adaptées et innovantes
3. Définir les métriques de performance appropriées
4. Assurer la conformité aux standards du secteur

**APPROCHE MÉTHODOLOGIQUE** :
- Identification des cas d'usage prioritaires
- Sélection des technologies IA appropriées
- Conception d'une architecture scalable
- Plan de déploiement progressif

**CONSIDÉRATIONS TECHNIQUES** :
- Qualité et préparation des données
- Choix des algorithmes d'apprentissage automatique
- Infrastructure et performance
- Sécurité et confidentialité

**LIVRABLES ATTENDUS** :
1. Spécifications fonctionnelles détaillées
2. Architecture technique recommandée
3. Plan de mise en œuvre avec jalons
4. Stratégie de maintenance et évolution

**CRITÈRES DE SUCCÈS** :
- Performance mesurable selon les KPIs métier
- Adoption réussie par les utilisateurs finaux
- Retour sur investissement démontrable
- Conformité aux exigences réglementaires`;
    }

    return prompts[category as keyof typeof prompts];
  };

  const generatePrompt = () => {
    if (!formData.category || !formData.description) {
      toast({
        title: "Information manquante",
        description: "Veuillez choisir une catégorie et décrire ce que vous voulez.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      const subcategoryInfo = formData.subcategory ? 
        ` - Sous-catégorie spécifique : ${getSubcategories(formData.category).find(sub => sub.value === formData.subcategory)?.label}` : '';
      
      const detailedPrompt = `**RÔLE** : Tu es un expert en intelligence artificielle spécialisé dans le domaine "${formData.category}"${subcategoryInfo}.

**MISSION** : ${formData.description}

**CONTEXTE SPÉCIALISÉ** :
${subcategoryInfo}

**OBJECTIFS DÉTAILLÉS** :
1. Analyser les besoins spécifiques du domaine et de la sous-catégorie
2. Proposer des solutions IA adaptées et innovantes
3. Définir les métriques de performance appropriées
4. Assurer la conformité aux standards du secteur

**APPROCHE MÉTHODOLOGIQUE** :
- Identification des cas d'usage prioritaires dans ce domaine spécifique
- Sélection des technologies IA les plus appropriées
- Conception d'une architecture scalable et performante
- Plan de déploiement progressif avec validation continue

**CONSIDÉRATIONS TECHNIQUES SPÉCIALISÉES** :
- Qualité et préparation des données spécifiques au domaine
- Choix des algorithmes d'apprentissage automatique optimaux
- Infrastructure et performance adaptées aux contraintes du secteur
- Sécurité, confidentialité et conformité réglementaire

**TECHNOLOGIES RECOMMANDÉES** :
- Machine Learning et Deep Learning adaptés au cas d'usage
- Outils de traitement de données spécialisés
- Frameworks d'IA appropriés au domaine
- Solutions d'intégration et de déploiement

**LIVRABLES ATTENDUS** :
1. Spécifications fonctionnelles détaillées et adaptées
2. Architecture technique recommandée avec justifications
3. Plan de mise en œuvre avec jalons et indicateurs de succès
4. Stratégie de maintenance, évolution et amélioration continue

**CRITÈRES DE SUCCÈS MESURABLES** :
- Performance quantifiable selon les KPIs métier du domaine
- Adoption réussie par les utilisateurs finaux
- Retour sur investissement démontrable
- Conformité totale aux exigences réglementaires du secteur

**POINTS D'ATTENTION SPÉCIFIQUES** :
- Risques et défis particuliers au domaine d'application
- Considérations éthiques et sociétales
- Évolutivité et adaptabilité de la solution
- Formation et accompagnement des équipes`;

      setGeneratedPrompt(detailedPrompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt spécialisé créé !",
        description: "Votre prompt détaillé et adapté à votre domaine est prêt.",
      });
    }, 2000);
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
            <span className="gradient-text">Créer un Prompt</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Choisissez votre domaine d'application et décrivez votre besoin
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
              💡 Plus vous êtes précis sur votre contexte et vos objectifs, meilleur sera le prompt généré !
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
                Création en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Créer mon Prompt Spécialisé
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">Votre Prompt Professionnel</span>
            {generatedPrompt && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Prompt spécialisé et optimisé pour votre domaine d'application
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
                  ✨ <strong>Prompt Spécialisé :</strong> Ce prompt est adapté à votre domaine spécifique et contient les meilleures pratiques pour obtenir des résultats de qualité professionnelle !
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">Prêt à créer votre prompt spécialisé ✨</p>
              <p className="text-sm">Sélectionnez votre domaine et décrivez votre projet pour générer un prompt adapté.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;

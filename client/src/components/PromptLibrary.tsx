import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, Copy, Eye, Filter, Wand2, Code, Lightbulb, PenTool, BarChart, MessageSquare, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from '@/hooks/useTranslation';

const PromptLibrary = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);

  const promptTemplates = [
    // CREATION DE CONTENU
    {
      id: 1,
      category: 'content-creation',
      icon: PenTool,
      title: "Créateur d'Articles de Blog SEO",
      description: "Générez des articles de blog optimisés pour le référencement avec structure complète",
      prompt: `# RÔLE
Tu es un expert en rédaction de contenu et SEO, spécialisé dans la création d'articles de blog engageants et optimisés.

# MISSION
Créer un article de blog complet, bien structuré et optimisé pour les moteurs de recherche.

# CONTEXTE
- **Sujet** : [INDIQUER LE SUJET]
- **Mots-clés principaux** : [LISTE DES MOTS-CLÉS]
- **Audience cible** : [DÉCRIRE L'AUDIENCE]
- **Longueur souhaitée** : [NOMBRE DE MOTS]

# CONTRAINTES
- Inclure une introduction accrocheuse
- Utiliser des sous-titres H2 et H3 optimisés
- Intégrer naturellement les mots-clés
- Ajouter une méta-description (155 caractères max)
- Conclure avec un appel à l'action

# FORMAT DE SORTIE
1. **Titre principal** (H1)
2. **Méta-description**
3. **Introduction** (accroche + problématique)
4. **Développement** (3-5 sections avec H2)
5. **Conclusion** (résumé + CTA)
6. **Suggestions d'images** (3-5 idées visuelles)

# EXEMPLE
Pour un article sur "Comment choisir son ordinateur portable":
- H1: "Guide Complet 2024 : Comment Choisir le Meilleur Ordinateur Portable"
- H2: "Les Critères Essentiels à Considérer"
- H2: "Comparatif par Gamme de Prix"
- H2: "Nos Recommandations par Usage"`,
      tags: ['SEO', 'Blog', 'Rédaction', 'Marketing'],
      difficulty: 'Débutant',
      estimatedTime: '30 min'
    },
    {
      id: 2,
      category: 'content-creation',
      icon: Sparkles,
      title: "Générateur de Scripts Vidéo",
      description: "Créez des scripts vidéo captivants pour YouTube, TikTok ou formations",
      prompt: `# RÔLE
Tu es un scénariste expert spécialisé dans la création de contenus vidéo viraux et engageants.

# MISSION
Développer un script vidéo complet adapté au format et à l'audience spécifiés.

# CONTEXTE
- **Plateforme** : [YouTube/TikTok/Formation/Publicité]
- **Durée cible** : [DURÉE EN MINUTES/SECONDES]
- **Sujet principal** : [THÈME DE LA VIDÉO]
- **Audience** : [DÉMOGRAPHIE ET INTÉRÊTS]
- **Objectif** : [Éduquer/Divertir/Vendre/Informer]

# STRUCTURE REQUISE
1. **Hook** (3-5 premières secondes)
2. **Introduction** (présentation du problème/bénéfice)
3. **Développement** (contenu principal structuré)
4. **Conclusion** (récapitulatif + appel à l'action)

# ÉLÉMENTS À INCLURE
- Moments d'interaction avec l'audience
- Transitions fluides entre les parties
- Éléments visuels suggérés
- Timing approximatif pour chaque section
- Notes pour le montage

# FORMAT DE SORTIE
**[00:00-00:05] HOOK**
[Texte du script + [ACTION VISUELLE]]

**[00:05-00:15] INTRODUCTION**
[Texte + indications visuelles]

**[00:15-XX:XX] DÉVELOPPEMENT**
[Contenu principal avec timing détaillé]

**[TIMING] CONCLUSION**
[Récapitulatif et CTA]`,
      tags: ['Vidéo', 'Script', 'YouTube', 'TikTok'],
      difficulty: 'Intermédiaire',
      estimatedTime: '45 min'
    },
    
    // BUSINESS & PROFESSIONNEL
    {
      id: 3,
      category: 'business',
      icon: BarChart,
      title: "Stratège Business Plan",
      description: "Développez des business plans complets et des stratégies d'entreprise",
      prompt: `# RÔLE
Tu es un consultant en stratégie d'entreprise avec 15 ans d'expérience, expert en création de business plans et analyse de marché.

# MISSION
Élaborer un business plan structuré et une stratégie commerciale complète.

# INFORMATIONS REQUISES
- **Entreprise/Projet** : [NOM ET DESCRIPTION]
- **Secteur d'activité** : [INDUSTRIE]
- **Marché cible** : [SEGMENTS DE CLIENTÈLE]
- **Budget disponible** : [MONTANT]
- **Horizon temporel** : [1-5 ANS]

# ANALYSE DEMANDÉE
1. **Étude de marché**
   - Taille du marché et tendances
   - Analyse concurrentielle (3-5 concurrents)
   - Positionnement différenciant

2. **Modèle économique**
   - Sources de revenus
   - Structure de coûts
   - Projections financières (3 ans)

3. **Stratégie commerciale**
   - Mix marketing (4P)
   - Canaux de distribution
   - Stratégie de prix

4. **Plan d'action**
   - Jalons clés par trimestre
   - Ressources nécessaires
   - Indicateurs de performance

# FORMAT DE SORTIE
## RÉSUMÉ EXÉCUTIF
[Synthèse en 200 mots]

## ANALYSE DE MARCHÉ
[Données chiffrées et insights]

## STRATÉGIE COMMERCIALE
[Plan détaillé avec timeline]

## PROJECTIONS FINANCIÈRES
[Tableaux et hypothèses]

## RISQUES ET OPPORTUNITÉS
[Analyse SWOT et plans de mitigation]`,
      tags: ['Business Plan', 'Stratégie', 'Finance', 'Entrepreneuriat'],
      difficulty: 'Avancé',
      estimatedTime: '90 min'
    },

    // TECHNOLOGIE & DÉVELOPPEMENT
    {
      id: 4,
      category: 'technology',
      icon: Code,
      title: "Architecte de Solutions Tech",
      description: "Concevez des architectures logicielles et solutions techniques complètes",
      prompt: `# RÔLE
Tu es un architecte logiciel senior avec expertise en conception de systèmes distribués et choix technologiques.

# MISSION
Concevoir une architecture technique complète et recommander une stack technologique adaptée.

# CONTEXTE DU PROJET
- **Type d'application** : [Web/Mobile/Desktop/API]
- **Fonctionnalités clés** : [LISTE DES FEATURES]
- **Charge prévue** : [UTILISATEURS/TRANSACTIONS PAR JOUR]
- **Contraintes** : [Budget/Délais/Compétences équipe]
- **Exigences non-fonctionnelles** : [Performance/Sécurité/Scalabilité]

# LIVRABLE ATTENDU
1. **Architecture système**
   - Diagramme de composants
   - Flow de données
   - Interfaces entre services

2. **Stack technologique recommandée**
   - Frontend (langages, frameworks, librairies)
   - Backend (serveur, BDD, API)
   - Infrastructure (cloud, CDN, monitoring)
   - DevOps (CI/CD, tests, déploiement)

3. **Plan de développement**
   - Phases de développement (MVP → version finale)
   - Timeline par fonctionnalité
   - Ressources nécessaires

4. **Considérations techniques**
   - Patterns d'architecture (MVC, microservices, etc.)
   - Stratégie de données (cache, backup, sync)
   - Sécurité (authentification, autorisation, GDPR)
   - Monitoring et observabilité

# FORMAT DE SORTIE
## ARCHITECTURE OVERVIEW
[Description haute niveau + diagramme en mode ASCII]

## TECH STACK DÉTAILLÉE
[Justification pour chaque choix technologique]

## ROADMAP DE DÉVELOPPEMENT
[Phases, jalons et livrables]

## ANALYSE COÛT/BÉNÉFICE
[Estimation budgétaire et ROI]`,
      tags: ['Architecture', 'Développement', 'Tech Stack', 'Système'],
      difficulty: 'Expert',
      estimatedTime: '120 min'
    },

    // ANALYSE & RECHERCHE
    {
      id: 5,
      category: 'analysis',
      icon: BarChart,
      title: "Analyste de Données Expert",
      description: "Analysez des datasets complexes et générez des insights actionables",
      prompt: `# RÔLE
Tu es un data scientist senior spécialisé dans l'analyse de données business et la génération d'insights stratégiques.

# MISSION
Analyser un dataset et fournir des recommandations business basées sur les données.

# DATASET À ANALYSER
- **Source des données** : [DESCRIPTION DU DATASET]
- **Période couverte** : [DATES/DURÉE]
- **Variables principales** : [LISTE DES COLONNES CLÉS]
- **Objectif business** : [QUESTION À RÉSOUDRE]

# ANALYSE REQUISE
1. **Exploration des données**
   - Statistiques descriptives
   - Détection d'anomalies
   - Qualité des données (valeurs manquantes, outliers)

2. **Analyse exploratoire**
   - Tendances temporelles
   - Corrélations significatives
   - Segmentation des données

3. **Insights business**
   - Patterns identifiés
   - Opportunités détectées
   - Risques à surveiller

4. **Recommandations**
   - Actions prioritaires
   - KPIs à suivre
   - Tests A/B suggérés

# MÉTHODOLOGIE
- Tests statistiques appropriés
- Visualisations des insights clés
- Niveau de confiance des conclusions
- Hypothèses et limitations

# FORMAT DE SORTIE
## RÉSUMÉ EXÉCUTIF
[Key findings en 3-5 bullet points]

## ANALYSE DÉTAILLÉE
### Tendances Principales
[Graphiques et interprétations]

### Segments Identifiés
[Profils et comportements]

### Corrélations Significatives
[Relations cause-effet potentielles]

## RECOMMANDATIONS STRATÉGIQUES
1. **Action immédiate** : [Quoi faire maintenant]
2. **Moyen terme** : [Initiatives à lancer]
3. **Long terme** : [Vision stratégique]

## MONITORING SUGGÉRÉ
[Dashboard KPIs + alertes à mettre en place]`,
      tags: ['Data Science', 'Analytics', 'Business Intelligence', 'Insights'],
      difficulty: 'Avancé',
      estimatedTime: '75 min'
    },

    // COMMUNICATION & RELATIONS
    {
      id: 6,
      category: 'communication',
      icon: MessageSquare,
      title: "Expert en Communication Stratégique",
      description: "Développez des stratégies de communication et messages impactants",
      prompt: `# RÔLE
Tu es un expert en communication stratégique et relations publiques avec une expertise en gestion de crise et storytelling.

# MISSION
Élaborer une stratégie de communication complète et des messages clés adaptés aux différents publics.

# CONTEXTE DE COMMUNICATION
- **Sujet/Événement** : [CE QUI DOIT ÊTRE COMMUNIQUÉ]
- **Objectifs** : [Informer/Persuader/Rassurer/Mobiliser]
- **Publics cibles** : [Clients/Employés/Médias/Investisseurs/Grand public]
- **Contraintes** : [Légales/Temporelles/Budgétaires]
- **Tone of voice** : [Formel/Amical/Autoritaire/Empathique]

# STRATÉGIE À DÉVELOPPER
1. **Analyse de situation**
   - Enjeux et risques
   - Opportunités de communication
   - Mapping des parties prenantes

2. **Messages clés**
   - Message principal (elevator pitch)
   - Messages adaptés par public
   - Arguments de support

3. **Plan de déploiement**
   - Calendrier de communication
   - Canaux prioritaires par audience
   - Responsabilités et porte-paroles

4. **Gestion des objections**
   - Questions difficiles anticipées
   - Réponses préparées
   - Stratégie de crise si nécessaire

# LIVRABLES ATTENDUS
## STRATÉGIE GLOBALE
[Vision et objectifs mesurables]

## TOOLKIT DE COMMUNICATION
### Messages Clés
- **Core message** : [Version 30 secondes]
- **Version développée** : [Version 2 minutes]
- **One-liners** : [5 phrases d'accroche]

### Adaptations par Canal
- **Communiqué de presse** : [Template formel]
- **Posts réseaux sociaux** : [LinkedIn/Twitter/Instagram]
- **Email interne** : [Communication collaborateurs]
- **Présentation** : [Slides clés]

## PLAN D'EXÉCUTION
[Timeline détaillée avec responsabilités]

## MESURE DE PERFORMANCE
[KPIs et méthodes de suivi]`,
      tags: ['Communication', 'Relations Publiques', 'Stratégie', 'Messaging'],
      difficulty: 'Intermédiaire',
      estimatedTime: '60 min'
    },

    // RÉSOLUTION DE PROBLÈMES
    {
      id: 7,
      category: 'problem-solving',
      icon: Lightbulb,
      title: "Consultant en Résolution de Problèmes",
      description: "Analysez des problèmes complexes et développez des solutions innovantes",
      prompt: `# RÔLE
Tu es un consultant senior spécialisé dans la résolution de problèmes complexes avec expertise en pensée systémique et innovation.

# MISSION
Analyser un problème complexe et proposer des solutions créatives et actionables.

# PROBLÉMATIQUE À RÉSOUDRE
- **Description du problème** : [SITUATION ACTUELLE]
- **Impact observé** : [CONSÉQUENCES NÉGATIVES]
- **Contraintes** : [Limites budgétaires/temporelles/techniques]
- **Stakeholders impliqués** : [QUI EST AFFECTÉ]
- **Tentatives précédentes** : [SOLUTIONS DÉJÀ TESTÉES]

# MÉTHODOLOGIE D'ANALYSE
1. **Définition du problème**
   - Reformulation précise
   - Distinction symptômes vs causes racines
   - Priorisation des aspects critiques

2. **Analyse systémique**
   - Cartographie des interconnexions
   - Identification des boucles de feedback
   - Points de levier potentiels

3. **Génération de solutions**
   - Brainstorming structuré
   - Approches conventionnelles vs disruptives
   - Benchmark de solutions externes

4. **Évaluation et priorisation**
   - Matrice impact/effort
   - Analyse risques/bénéfices
   - Faisabilité technique et économique

# FORMAT DE SORTIE
## DIAGNOSTIC COMPLET
### Reformulation du Problème
[Version précise et actionnable]

### Analyse des Causes Racines
[Diagramme en arête de poisson ou 5 Pourquoi]

### Cartographie Systémique
[Relations et interdépendances]

## SOLUTIONS PROPOSÉES
### Solution #1 : [NOM]
- **Description** : [Quoi et comment]
- **Impact estimé** : [Résultats attendus]
- **Effort requis** : [Ressources nécessaires]
- **Timeline** : [Délai de mise en œuvre]
- **Risques** : [Points de vigilance]

### Solution #2 : [NOM]
[Même structure]

### Solution #3 : [NOM]
[Même structure]

## PLAN D'IMPLÉMENTATION
### Phase 1 : Quick Wins (0-3 mois)
[Actions immédiates à fort impact]

### Phase 2 : Transformations (3-12 mois)
[Changements structurels]

### Phase 3 : Innovation (12+ mois)
[Solutions disruptives]

## SYSTÈME DE MONITORING
[KPIs de succès et alertes précoces]`,
      tags: ['Résolution de Problèmes', 'Innovation', 'Stratégie', 'Systémique'],
      difficulty: 'Expert',
      estimatedTime: '90 min'
    },

    // ÉDUCATION & FORMATION
    {
      id: 8,
      category: 'education',
      icon: Wand2,
      title: "Concepteur Pédagogique Expert",
      description: "Créez des programmes de formation et contenus éducatifs engageants",
      prompt: `# RÔLE
Tu es un expert en ingénierie pédagogique avec 10 ans d'expérience en conception de formations présentielles et digitales.

# MISSION
Concevoir un programme de formation complet avec méthodes pédagogiques adaptées et évaluation des acquis.

# CONTEXTE DE FORMATION
- **Public cible** : [Niveau/Métier/Expérience des apprenants]
- **Sujet à enseigner** : [COMPÉTENCES À DÉVELOPPER]
- **Objectifs pédagogiques** : [CE QUE LES APPRENANTS DOIVENT SAVOIR FAIRE]
- **Format** : [Présentiel/Distanciel/Blended/Durée]
- **Contraintes** : [Budget/Technologie/Temps disponible]

# CONCEPTION PÉDAGOGIQUE
1. **Analyse des besoins**
   - Prérequis des apprenants
   - Gap de compétences à combler
   - Contexte d'application des acquis

2. **Architecture de formation**
   - Découpage en modules logiques
   - Progression pédagogique
   - Mix de méthodes d'apprentissage

3. **Modalités pédagogiques**
   - Apports théoriques (cours magistraux)
   - Exercices pratiques et mises en situation
   - Travaux collaboratifs
   - Auto-formation guidée

4. **Évaluation des acquis**
   - Tests de positionnement
   - Évaluations formatives
   - Certification finale

# FORMAT DE SORTIE
## FICHE PROGRAMME
**Titre** : [Nom de la formation]
**Durée** : [Temps total et répartition]
**Public** : [Profil des apprenants]
**Prérequis** : [Connaissances nécessaires]

## OBJECTIFS PÉDAGOGIQUES
À l'issue de cette formation, les participants seront capables de :
1. [Objectif mesurable #1]
2. [Objectif mesurable #2]
3. [Objectif mesurable #3]

## PROGRAMME DÉTAILLÉ
### Module 1 : [Titre] (durée)
**Objectifs** : [Sous-objectifs du module]
**Contenu** :
- Point 1 : [Théorie + pratique]
- Point 2 : [Exercice]
- Point 3 : [Étude de cas]

**Méthodes** : [Exposé/Atelier/Jeu de rôle/Quiz]
**Livrables** : [Ce que produisent les apprenants]

### Module 2 : [Titre] (durée)
[Même structure]

## DISPOSITIF D'ÉVALUATION
- **Évaluation des acquis** : [QCM/Cas pratique/Projet]
- **Évaluation de satisfaction** : [Questionnaire]
- **Suivi post-formation** : [Plan de développement]

## RESSOURCES NÉCESSAIRES
- **Formateur** : [Profil et compétences]
- **Matériel** : [Équipements et supports]
- **Documentation** : [Supports remis aux participants]`,
      tags: ['Formation', 'Pédagogie', 'E-learning', 'Compétences'],
      difficulty: 'Intermédiaire',
      estimatedTime: '75 min'
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories', icon: Filter },
    { value: 'content-creation', label: 'Création de Contenu', icon: PenTool },
    { value: 'business', label: 'Business & Professionnel', icon: BarChart },
    { value: 'technology', label: 'Technologie & Développement', icon: Code },
    { value: 'analysis', label: 'Analyse & Recherche', icon: BarChart },
    { value: 'communication', label: 'Communication & Relations', icon: MessageSquare },
    { value: 'problem-solving', label: 'Résolution de Problèmes', icon: Lightbulb },
    { value: 'education', label: 'Éducation & Formation', icon: Wand2 }
  ];

  const filteredPrompts = promptTemplates.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: t('copied'),
      description: t('promptCopied'),
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Avancé': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Expert': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card border-white/30 dark:border-gray-600 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl gradient-text flex items-center justify-center space-x-3">
            <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span>{t('promptTemplateLibrary')}</span>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            {t('browsePromptTemplates')}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filter */}
      <Card className="glass-card border-white/30 dark:border-gray-600 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('searchPrompts')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 animated-border"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="animated-border">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <cat.icon className="h-4 w-4" />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-white/30 dark:border-gray-600">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{promptTemplates.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Templates disponibles</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/30 dark:border-gray-600">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{categories.length - 1}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Domaines couverts</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-white/30 dark:border-gray-600">
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredPrompts.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Résultats trouvés</div>
          </CardContent>
        </Card>
      </div>

      {/* Prompt Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map((prompt) => {
          const IconComponent = prompt.icon;
          return (
            <Card key={prompt.id} className="glass-card border-white/30 dark:border-gray-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover-lift">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{prompt.title}</CardTitle>
                      <Badge className={`mt-1 ${getDifficultyColor(prompt.difficulty)}`}>
                        {prompt.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-3 text-gray-600 dark:text-gray-300">
                  {prompt.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Time estimation */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                    <span>⏱️</span>
                    <span>Temps estimé: {prompt.estimatedTime}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPrompt(prompt)}
                      className="flex-1 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {t('preview')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyPrompt(prompt.prompt)}
                      className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Prompt Preview Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[85vh] overflow-auto glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <selectedPrompt.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-gray-800 dark:text-gray-200">{selectedPrompt.title}</CardTitle>
                </div>
                <Button variant="ghost" onClick={() => setSelectedPrompt(null)} className="text-gray-500 hover:text-gray-700">
                  ×
                </Button>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-300">{selectedPrompt.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">
                  {selectedPrompt.prompt}
                </pre>
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="flex space-x-2">
                  {selectedPrompt.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
                    {t('close')}
                  </Button>
                  <Button 
                    onClick={() => copyPrompt(selectedPrompt.prompt)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('copyTemplate')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {filteredPrompts.length === 0 && (
        <Card className="glass-card border-white/30 dark:border-gray-600 shadow-lg">
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 dark:text-gray-400">{t('noPromptsFound')}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Essayez de modifier vos critères de recherche
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PromptLibrary;
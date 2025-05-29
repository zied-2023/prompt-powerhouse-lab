
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
    description: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: 'text-generation', label: '✍️ Écrire du texte', description: 'Articles, emails, histoires...' },
    { value: 'creative-writing', label: '🎨 Créer du contenu créatif', description: 'Poèmes, récits, scénarios...' },
    { value: 'image-creation', label: '🖼️ Décrire des images', description: 'Pour créer des images avec IA' },
    { value: 'code-generation', label: '💻 Coder', description: 'Programmes, scripts, sites web...' },
    { value: 'data-analysis', label: '📊 Analyser des données', description: 'Résumés, rapports, insights...' },
    { value: 'interactive-dialogue', label: '💬 Avoir une conversation', description: 'Assistant, coach, tuteur...' }
  ];

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

4. **Optimisation** :
   - Intègre naturellement les mots-clés principaux
   - Crée des phrases d'accroche percutantes
   - Termine par un appel à l'action clair si approprié
   - Assure-toi que le contenu soit facilement scannable

**FORMAT DE RÉPONSE** :
- Longueur : [Spécifie le nombre de mots souhaité]
- Structure : Introduction (10%) - Développement (80%) - Conclusion (10%)
- Inclus une meta-description de 150-160 caractères

**LIVRABLES ATTENDUS** :
1. Le texte principal formaté
2. Une liste de 5 mots-clés secondaires utilisés
3. 3 suggestions de titres alternatifs`,

      'creative-writing': `**RÔLE** : Tu es un écrivain créatif reconnu, maître dans l'art de la narration et de l'expression artistique.

**PROJET CRÉATIF** : ${description}

**DIRECTIVES CRÉATIVES** :

1. **Développement Narratif** :
   - Construis une intrigue captivante avec un arc narratif clair
   - Développe des personnages multidimensionnels avec des motivations profondes
   - Crée un univers cohérent avec ses propres règles et atmosphère
   - Utilise des techniques narratives variées (dialogue, description, action)

2. **Style Littéraire** :
   - Emploie des figures de style pour enrichir le texte (métaphores, comparaisons)
   - Varie les rythmes et les longueurs de phrases
   - Crée des images sensorielles pour immerger le lecteur
   - Développe une voix narrative distinctive

3. **Émotion et Impact** :
   - Suscite des émotions authentiques chez le lecteur
   - Crée des moments de tension et de relâchement
   - Développe des thèmes profonds et universels
   - Laisse place à l'interprétation et à la réflexion

4. **Techniques Avancées** :
   - Utilise la règle du "show, don't tell"
   - Intègre des symboles et des leitmotivs
   - Crée des dialogues naturels et révélateurs
   - Maîtrise les ellipses et les non-dits

**STRUCTURE CRÉATIVE** :
- Accroche : Une ouverture qui captive immédiatement
- Développement : Progression logique avec rebondissements
- Climax : Point culminant émotionnellement fort
- Résolution : Fin satisfaisante qui résonne avec le début

**LIVRABLES** :
1. Le texte créatif complet
2. Une analyse des thèmes abordés
3. Des suggestions d'amélioration ou de développement`,

      'image-creation': `**RÔLE** : Tu es un directeur artistique expert en génération d'images IA, spécialisé dans la création de prompts visuels précis.

**BRIEF VISUEL** : ${description}

**SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES** :

1. **Composition et Cadrage** :
   - Définir le type de plan (plan large, plan moyen, gros plan, macro)
   - Spécifier l'angle de vue (en plongée, contre-plongée, niveau)
   - Déterminer la règle des tiers et les points focaux
   - Préciser le format (16:9, 4:3, carré, portrait, paysage)

2. **Éclairage et Atmosphère** :
   - Type d'éclairage (naturel, artificiel, studio, dramatique)
   - Direction de la lumière (frontale, latérale, rétroéclairage)
   - Qualité de la lumière (douce, dure, diffuse, directe)
   - Mood et ambiance générale (chaleureux, froid, mystérieux, énergique)

3. **Style et Rendu** :
   - Technique artistique (photographie, peinture, illustration, 3D)
   - Style artistique spécifique (réalisme, impressionnisme, minimalisme)
   - Qualité de l'image (haute résolution, détails fins, textures)
   - Post-traitement souhaité (contrastes, saturation, filtres)

4. **Éléments Visuels** :
   - Palette de couleurs précise (couleurs primaires, secondaires, accents)
   - Textures et matériaux (métal, bois, tissu, verre)
   - Éléments de décor et d'environnement
   - Effets spéciaux ou atmosphériques (brouillard, particules, reflets)

**PROMPT OPTIMISÉ POUR IA** :
[Sujet principal], [style artistique], [composition], [éclairage], [palette de couleurs], [qualité technique], [atmosphère], --ar [ratio] --quality [niveau] --style [paramètre]

**VARIATIONS SUGGÉRÉES** :
1. Version alternative avec éclairage différent
2. Variation de couleurs pour différents moods
3. Adaptation pour différents formats/usages`,

      'code-generation': `**RÔLE** : Tu es un développeur senior expert, architecte logiciel avec une maîtrise parfaite des bonnes pratiques de développement.

**DEMANDE DE DÉVELOPPEMENT** : ${description}

**SPÉCIFICATIONS TECHNIQUES** :

1. **Architecture et Structure** :
   - Analyser les besoins fonctionnels et techniques
   - Proposer une architecture modulaire et scalable
   - Définir les composants, services et leurs interactions
   - Respecter les principes SOLID et les design patterns appropriés

2. **Standards de Codage** :
   - Code propre, lisible et bien documenté
   - Nommage explicite pour variables, fonctions et classes
   - Commentaires pertinents pour la logique complexe
   - Respect des conventions du langage/framework utilisé

3. **Sécurité et Performance** :
   - Validation et sanitisation des données d'entrée
   - Gestion appropriée des erreurs et exceptions
   - Optimisation des performances et de la mémoire
   - Respect des bonnes pratiques de sécurité

4. **Tests et Documentation** :
   - Code testable avec séparation des responsabilités
   - Exemples d'utilisation et cas de test
   - Documentation technique claire
   - Instructions d'installation et de déploiement

**TECHNOLOGIES À CONSIDÉRER** :
- Langage principal : [À spécifier selon le projet]
- Framework/Librairies : [Recommandations selon les besoins]
- Base de données : [Type et structure selon les données]
- Outils de développement : [IDE, linters, formatters]

**LIVRABLES** :
1. Code source complet et fonctionnel
2. Documentation technique détaillée
3. Instructions d'installation et d'utilisation
4. Exemples d'utilisation avec données de test
5. Suggestions d'améliorations futures`,

      'data-analysis': `**RÔLE** : Tu es un data scientist expert avec une solide expertise en analyse statistique et en visualisation de données.

**MISSION D'ANALYSE** : ${description}

**MÉTHODOLOGIE D'ANALYSE APPROFONDIE** :

1. **Exploration et Préparation des Données** :
   - Examiner la structure, la qualité et la complétude des données
   - Identifier les valeurs aberrantes, manquantes ou incohérentes
   - Nettoyer et normaliser les données si nécessaire
   - Effectuer une analyse descriptive initiale (moyennes, médianes, écarts-types)

2. **Analyse Statistique Rigoureuse** :
   - Appliquer les tests statistiques appropriés selon le type de données
   - Calculer les corrélations et identifier les relations significatives
   - Effectuer des analyses de tendances et de saisonnalité
   - Utiliser des techniques d'analyse multivariée si pertinent

3. **Visualisation et Interprétation** :
   - Créer des graphiques clairs et informatifs (histogrammes, scatter plots, heatmaps)
   - Développer des tableaux de bord avec KPIs pertinents
   - Identifier les patterns, anomalies et insights cachés
   - Segmenter les données pour des analyses plus fines

4. **Insights Business et Recommandations** :
   - Traduire les résultats statistiques en insights business
   - Quantifier l'impact financier ou opérationnel des découvertes
   - Proposer des actions concrètes basées sur les données
   - Évaluer les risques et opportunités identifiés

**FORMAT DE RAPPORT** :
1. **Executive Summary** (2-3 paragraphes)
2. **Méthodologie** (sources, techniques utilisées)
3. **Résultats Clés** (avec visualisations)
4. **Insights et Interprétations**
5. **Recommandations Actionnables**
6. **Limitations et Biais Potentiels**

**LIVRABLES ATTENDUS** :
- Rapport d'analyse complet et structuré
- Visualisations professionnelles commentées
- Liste des recommandations prioritaires avec impact estimé
- Plan d'action pour implémenter les recommandations`,

      'interactive-dialogue': `**RÔLE** : Tu es un expert en conception d'interactions conversationnelles et en psychologie de la communication.

**MISSION DE DIALOGUE** : ${description}

**FRAMEWORK DE CONVERSATION AVANCÉ** :

1. **Personnalité et Ton Conversationnel** :
   - Développer une personnalité cohérente et authentique
   - Adapter le registre de langue selon l'interlocuteur et le contexte
   - Maintenir un ton empathique, professionnel et engageant
   - Intégrer de l'humour approprié et des éléments de personnalisation

2. **Techniques de Communication Active** :
   - Pratiquer l'écoute active et la reformulation
   - Poser des questions ouvertes pour approfondir la compréhension
   - Utiliser la technique du mirroring pour créer du rapport
   - Reconnaître et valider les émotions de l'interlocuteur

3. **Structure Conversationnelle** :
   - Commencer par un accueil chaleureux et contextuel
   - Identifier rapidement les besoins et attentes
   - Guider la conversation vers des solutions concrètes
   - Synthétiser et confirmer la compréhension mutuelle

4. **Gestion des Situations Complexes** :
   - Désamorcer les tensions avec diplomatie
   - Transformer les objections en opportunités d'approfondissement
   - Gérer les malentendus avec patience et clarification
   - Savoir quand escalader vers un expert humain

**TECHNIQUES CONVERSATIONNELLES** :
- **Questions de Découverte** : "Pouvez-vous me parler de..."
- **Validation Émotionnelle** : "Je comprends que cela puisse être frustrant..."
- **Reformulation Active** : "Si je comprends bien, vous souhaitez..."
- **Propositions Solutions** : "Voici plusieurs options qui pourraient vous aider..."

**ADAPTATIONS CONTEXTUELLES** :
- **Support Client** : Focus sur la résolution rapide et la satisfaction
- **Coaching** : Questions ouvertes pour stimuler la réflexion
- **Vente** : Identification des besoins et présentation de bénéfices
- **Formation** : Pédagogie progressive et vérification de compréhension

**LIVRABLES** :
1. Script de conversation type avec variantes
2. Banque de réponses pour situations fréquentes
3. Indicateurs de succès de la conversation
4. Protocoles d'escalade et de résolution de conflits`
    };

    return prompts[category as keyof typeof prompts] || '';
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
      const detailedPrompt = generateDetailedPrompt(formData.category, formData.description);
      setGeneratedPrompt(detailedPrompt);
      setIsGenerating(false);
      
      toast({
        title: "Prompt avancé créé !",
        description: "Votre prompt détaillé et spécifique est prêt à être utilisé.",
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
      {/* Formulaire simplifié */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Créer un Prompt</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Décrivez simplement ce que vous voulez faire avec l'IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
              Que voulez-vous faire ? *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 bg-white">
                <SelectValue placeholder="Choisissez une option..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
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

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Décrivez ce que vous voulez précisément *
            </Label>
            <Textarea
              id="description"
              placeholder="Exemple : Écris un email professionnel pour remercier un client après un achat..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[120px] bg-white"
              rows={5}
            />
            <p className="text-xs text-gray-500">
              💡 Plus vous êtes précis, meilleur sera le résultat !
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
                Créer mon Prompt Avancé
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
            Prompt détaillé et optimisé pour des résultats précis
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
                  ✨ <strong>Prompt Professionnel :</strong> Ce prompt contient des instructions détaillées, une structure claire et des spécifications techniques pour obtenir des résultats de haute qualité !
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">Prêt à créer votre prompt professionnel ✨</p>
              <p className="text-sm">Remplissez le formulaire à gauche pour générer un prompt détaillé et spécifique.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;

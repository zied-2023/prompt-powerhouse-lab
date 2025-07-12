import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Settings, Users, Target, TrendingUp, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface AdvancedPromptData {
  // Section 1: Context and Strategic Framework
  expertDomain: string;
  situationalContext: string;
  historyBackground: string;
  primaryObjectives: string[];
  secondaryObjectives: string[];
  interventionScope: string;
  
  // Section 2: Technical and Operational Constraints
  technicalConstraints: string[];
  temporalConstraints: string[];
  budgetaryConstraints: string[];
  regulatoryConstraints: string[];
  securityConstraints: string[];
  organizationalConstraints: string[];
  
  // Section 3: Performance Criteria and Success Measures
  quantitativeIndicators: string[];
  qualitativeIndicators: string[];
  validationCriteria: string[];
  impactMeasures: string[];
  correctionMechanisms: string[];
  
  // Section 4: Ecosystem Analysis and Stakeholders
  primaryStakeholders: string[];
  secondaryStakeholders: string[];
  indirectInfluencers: string[];
  powerAnalysis: string;
  interestMatrix: string;
  
  // Section 5: Needs and Expectations Analysis
  explicitNeeds: string[];
  implicitNeeds: string[];
  latentNeeds: string[];
  needsHierarchy: string;
  necessaryArbitrations: string[];
  
  // Output specifications
  detailLevel: string;
  toneRegister: string;
  responseStructure: string;
  lengthDensity: string;
  visualElements: string[];
}

const AdvancedPromptBuilder = () => {
  const { t } = useTranslation();
  const [promptData, setPromptData] = useState<AdvancedPromptData>({
    expertDomain: '',
    situationalContext: '',
    historyBackground: '',
    primaryObjectives: [],
    secondaryObjectives: [],
    interventionScope: '',
    technicalConstraints: [],
    temporalConstraints: [],
    budgetaryConstraints: [],
    regulatoryConstraints: [],
    securityConstraints: [],
    organizationalConstraints: [],
    quantitativeIndicators: [],
    qualitativeIndicators: [],
    validationCriteria: [],
    impactMeasures: [],
    correctionMechanisms: [],
    primaryStakeholders: [],
    secondaryStakeholders: [],
    indirectInfluencers: [],
    powerAnalysis: '',
    interestMatrix: '',
    explicitNeeds: [],
    implicitNeeds: [],
    latentNeeds: [],
    needsHierarchy: '',
    necessaryArbitrations: [],
    detailLevel: 'comprehensive',
    toneRegister: 'professional-expert',
    responseStructure: 'structured-analysis',
    lengthDensity: 'detailed',
    visualElements: []
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('context');

  const updateField = (field: keyof AdvancedPromptData, value: any) => {
    setPromptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateArrayField = (field: keyof AdvancedPromptData, index: number, value: string) => {
    const currentArray = promptData[field] as string[];
    const newArray = [...currentArray];
    newArray[index] = value;
    updateField(field, newArray);
  };

  const addToArrayField = (field: keyof AdvancedPromptData) => {
    const currentArray = promptData[field] as string[];
    updateField(field, [...currentArray, '']);
  };

  const removeFromArrayField = (field: keyof AdvancedPromptData, index: number) => {
    const currentArray = promptData[field] as string[];
    const newArray = currentArray.filter((_, i) => i !== index);
    updateField(field, newArray);
  };

  const generateAdvancedPrompt = async () => {
    setIsGenerating(true);
    
    try {
      // Build comprehensive prompt structure
      let prompt = `**ANALYSE SYSTÉMIQUE ET FORMULATION EXPERTE**\n\n`;
      
      // Section 1: Context and Strategic Framework
      prompt += `## 1. CONTEXTE ET CADRAGE STRATÉGIQUE\n\n`;
      if (promptData.expertDomain) {
        prompt += `**Domaine d'expertise:** ${promptData.expertDomain}\n\n`;
      }
      if (promptData.situationalContext) {
        prompt += `**Contexte situationnel:** ${promptData.situationalContext}\n\n`;
      }
      if (promptData.historyBackground) {
        prompt += `**Historique et antécédents:** ${promptData.historyBackground}\n\n`;
      }
      
      if (promptData.primaryObjectives.length > 0) {
        prompt += `**Objectifs primaires:**\n`;
        promptData.primaryObjectives.filter(obj => obj.trim()).forEach((obj, index) => {
          prompt += `${index + 1}. ${obj}\n`;
        });
        prompt += `\n`;
      }
      
      if (promptData.secondaryObjectives.length > 0) {
        prompt += `**Objectifs secondaires:**\n`;
        promptData.secondaryObjectives.filter(obj => obj.trim()).forEach((obj, index) => {
          prompt += `${index + 1}. ${obj}\n`;
        });
        prompt += `\n`;
      }
      
      if (promptData.interventionScope) {
        prompt += `**Périmètre d'intervention:** ${promptData.interventionScope}\n\n`;
      }

      // Section 2: Constraints
      prompt += `## 2. CONTRAINTES TECHNIQUES ET OPÉRATIONNELLES\n\n`;
      
      const constraintSections = [
        { data: promptData.technicalConstraints, label: 'Contraintes techniques' },
        { data: promptData.temporalConstraints, label: 'Contraintes temporelles' },
        { data: promptData.budgetaryConstraints, label: 'Contraintes budgétaires' },
        { data: promptData.regulatoryConstraints, label: 'Contraintes réglementaires' },
        { data: promptData.securityConstraints, label: 'Contraintes de sécurité' },
        { data: promptData.organizationalConstraints, label: 'Contraintes organisationnelles' }
      ];
      
      constraintSections.forEach(section => {
        if (section.data.length > 0 && section.data.some(item => item.trim())) {
          prompt += `**${section.label}:**\n`;
          section.data.filter(item => item.trim()).forEach((item, index) => {
            prompt += `- ${item}\n`;
          });
          prompt += `\n`;
        }
      });

      // Section 3: Performance Criteria
      prompt += `## 3. CRITÈRES DE PERFORMANCE ET MESURES DE SUCCÈS\n\n`;
      
      const performanceSections = [
        { data: promptData.quantitativeIndicators, label: 'Indicateurs quantitatifs' },
        { data: promptData.qualitativeIndicators, label: 'Indicateurs qualitatifs' },
        { data: promptData.validationCriteria, label: 'Critères de validation' },
        { data: promptData.impactMeasures, label: 'Mesures d\'impact' },
        { data: promptData.correctionMechanisms, label: 'Mécanismes de correction' }
      ];
      
      performanceSections.forEach(section => {
        if (section.data.length > 0 && section.data.some(item => item.trim())) {
          prompt += `**${section.label}:**\n`;
          section.data.filter(item => item.trim()).forEach((item, index) => {
            prompt += `- ${item}\n`;
          });
          prompt += `\n`;
        }
      });

      // Section 4: Stakeholders
      prompt += `## 4. ANALYSE ÉCOSYSTÉMIQUE ET PARTIES PRENANTES\n\n`;
      
      const stakeholderSections = [
        { data: promptData.primaryStakeholders, label: 'Parties prenantes primaires' },
        { data: promptData.secondaryStakeholders, label: 'Parties prenantes secondaires' },
        { data: promptData.indirectInfluencers, label: 'Influenceurs indirects' }
      ];
      
      stakeholderSections.forEach(section => {
        if (section.data.length > 0 && section.data.some(item => item.trim())) {
          prompt += `**${section.label}:**\n`;
          section.data.filter(item => item.trim()).forEach((item, index) => {
            prompt += `- ${item}\n`;
          });
          prompt += `\n`;
        }
      });
      
      if (promptData.powerAnalysis) {
        prompt += `**Analyse des pouvoirs:** ${promptData.powerAnalysis}\n\n`;
      }
      
      if (promptData.interestMatrix) {
        prompt += `**Matrice des intérêts:** ${promptData.interestMatrix}\n\n`;
      }

      // Section 5: Needs Analysis
      prompt += `## 5. ANALYSE DES BESOINS ET ATTENTES\n\n`;
      
      const needsSections = [
        { data: promptData.explicitNeeds, label: 'Besoins explicites' },
        { data: promptData.implicitNeeds, label: 'Besoins implicites' },
        { data: promptData.latentNeeds, label: 'Besoins latents' }
      ];
      
      needsSections.forEach(section => {
        if (section.data.length > 0 && section.data.some(item => item.trim())) {
          prompt += `**${section.label}:**\n`;
          section.data.filter(item => item.trim()).forEach((item, index) => {
            prompt += `- ${item}\n`;
          });
          prompt += `\n`;
        }
      });
      
      if (promptData.needsHierarchy) {
        prompt += `**Hiérarchisation des besoins:** ${promptData.needsHierarchy}\n\n`;
      }
      
      if (promptData.necessaryArbitrations.length > 0 && promptData.necessaryArbitrations.some(item => item.trim())) {
        prompt += `**Arbitrages nécessaires:**\n`;
        promptData.necessaryArbitrations.filter(item => item.trim()).forEach((item, index) => {
          prompt += `- ${item}\n`;
        });
        prompt += `\n`;
      }

      // Output specifications
      prompt += `## 6. SPÉCIFICATIONS DE LIVRABLE\n\n`;
      prompt += `**Niveau de détail requis:** ${promptData.detailLevel}\n`;
      prompt += `**Ton et registre:** ${promptData.toneRegister}\n`;
      prompt += `**Structure de réponse:** ${promptData.responseStructure}\n`;
      prompt += `**Longueur et densité:** ${promptData.lengthDensity}\n\n`;
      
      if (promptData.visualElements.length > 0 && promptData.visualElements.some(item => item.trim())) {
        prompt += `**Éléments visuels souhaités:**\n`;
        promptData.visualElements.filter(item => item.trim()).forEach((item, index) => {
          prompt += `- ${item}\n`;
        });
        prompt += `\n`;
      }

      prompt += `---\n\n**MISSION:** Effectuer une analyse systémique complète selon les paramètres ci-dessus et fournir des recommandations actionables et structurées.`;

      setGeneratedPrompt(prompt);
      
      toast({
        title: "Prompt avancé généré avec succès",
        description: "Votre prompt expert a été créé selon l'architecture complexe spécifiée.",
      });
      
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le prompt avancé.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copié avec succès",
      description: "Le prompt a été copié dans le presse-papiers.",
    });
  };

  const ArrayInputField = ({ 
    label, 
    field, 
    placeholder 
  }: { 
    label: string; 
    field: keyof AdvancedPromptData; 
    placeholder: string; 
  }) => {
    const values = promptData[field] as string[];
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</Label>
          <Button 
            type="button" 
            size="sm" 
            variant="outline"
            onClick={() => addToArrayField(field)}
            className="text-xs"
          >
            + Ajouter
          </Button>
        </div>
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => updateArrayField(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => removeFromArrayField(field, index)}
              className="px-2"
            >
              ×
            </Button>
          </div>
        ))}
        {values.length === 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 italic">
            Cliquez sur "Ajouter" pour commencer
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Formulaire Avancé */}
      <Card className="glass-card border-white/30 shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Architecture de Prompts Complexes</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Conception experte pour la formulation de prompts multidimensionnels
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Accordion type="single" value={activeSection} onValueChange={setActiveSection} className="space-y-4">
            
            {/* Section 1: Context and Strategic Framework */}
            <AccordionItem value="context" className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">1. Contexte et Cadrage Stratégique</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Domaine d'expertise</Label>
                  <Input
                    value={promptData.expertDomain}
                    onChange={(e) => updateField('expertDomain', e.target.value)}
                    placeholder="Spécifier le secteur, la discipline ou le champ d'application précis"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Contexte situationnel</Label>
                  <Textarea
                    value={promptData.situationalContext}
                    onChange={(e) => updateField('situationalContext', e.target.value)}
                    placeholder="Décrire l'environnement, les circonstances et les enjeux actuels"
                    className="min-h-20"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Historique et antécédents</Label>
                  <Textarea
                    value={promptData.historyBackground}
                    onChange={(e) => updateField('historyBackground', e.target.value)}
                    placeholder="Présenter les événements, décisions ou tentatives précédentes pertinentes"
                    className="min-h-20"
                  />
                </div>
                
                <ArrayInputField
                  label="Objectifs primaires"
                  field="primaryObjectives"
                  placeholder="Objectif principal à atteindre"
                />
                
                <ArrayInputField
                  label="Objectifs secondaires"
                  field="secondaryObjectives"
                  placeholder="Objectif secondaire ou complémentaire"
                />
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Périmètre d'intervention</Label>
                  <Textarea
                    value={promptData.interventionScope}
                    onChange={(e) => updateField('interventionScope', e.target.value)}
                    placeholder="Délimiter clairement ce qui est inclus et exclu du champ d'action"
                    className="min-h-20"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Technical and Operational Constraints */}
            <AccordionItem value="constraints" className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <Settings className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">2. Contraintes Techniques et Opérationnelles</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <ArrayInputField
                  label="Contraintes techniques"
                  field="technicalConstraints"
                  placeholder="Outils disponibles, technologies autorisées, limitations"
                />
                
                <ArrayInputField
                  label="Contraintes temporelles"
                  field="temporalConstraints"
                  placeholder="Délais critiques, phases de livraison, fenêtres d'opportunité"
                />
                
                <ArrayInputField
                  label="Contraintes budgétaires"
                  field="budgetaryConstraints"
                  placeholder="Enveloppes financières, coûts cachés, ROI attendu"
                />
                
                <ArrayInputField
                  label="Contraintes réglementaires"
                  field="regulatoryConstraints"
                  placeholder="Conformité légale, normes industrielles, certifications"
                />
                
                <ArrayInputField
                  label="Contraintes de sécurité"
                  field="securityConstraints"
                  placeholder="Niveaux de confidentialité, protection des données, accès"
                />
                
                <ArrayInputField
                  label="Contraintes organisationnelles"
                  field="organizationalConstraints"
                  placeholder="Politique interne, processus établis, hiérarchie"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Performance Criteria */}
            <AccordionItem value="performance" className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">3. Critères de Performance et Mesures de Succès</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <ArrayInputField
                  label="Indicateurs quantitatifs"
                  field="quantitativeIndicators"
                  placeholder="Métriques chiffrées, seuils de performance, benchmarks"
                />
                
                <ArrayInputField
                  label="Indicateurs qualitatifs"
                  field="qualitativeIndicators"
                  placeholder="Satisfaction utilisateur, perception qualité, respect des valeurs"
                />
                
                <ArrayInputField
                  label="Critères de validation"
                  field="validationCriteria"
                  placeholder="Tests d'acceptation, protocoles de vérification, audits"
                />
                
                <ArrayInputField
                  label="Mesures d'impact"
                  field="impactMeasures"
                  placeholder="Effets directs et indirects, conséquences à court et long terme"
                />
                
                <ArrayInputField
                  label="Mécanismes de correction"
                  field="correctionMechanisms"
                  placeholder="Seuils d'alerte, procédures de réajustement, plans de contingence"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Stakeholders */}
            <AccordionItem value="stakeholders" className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">4. Analyse Écosystémique et Parties Prenantes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <ArrayInputField
                  label="Parties prenantes primaires"
                  field="primaryStakeholders"
                  placeholder="Décideurs, utilisateurs finaux, équipes opérationnelles"
                />
                
                <ArrayInputField
                  label="Parties prenantes secondaires"
                  field="secondaryStakeholders"
                  placeholder="Partenaires, fournisseurs, organismes de régulation"
                />
                
                <ArrayInputField
                  label="Influenceurs indirects"
                  field="indirectInfluencers"
                  placeholder="Médias, opinion publique, concurrents, experts sectoriels"
                />
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Analyse des pouvoirs</Label>
                  <Textarea
                    value={promptData.powerAnalysis}
                    onChange={(e) => updateField('powerAnalysis', e.target.value)}
                    placeholder="Capacité d'influence, leviers d'action, rapports de force"
                    className="min-h-20"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Matrice des intérêts</Label>
                  <Textarea
                    value={promptData.interestMatrix}
                    onChange={(e) => updateField('interestMatrix', e.target.value)}
                    placeholder="Convergences et divergences d'objectifs, zones de conflit potentiel"
                    className="min-h-20"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Needs Analysis */}
            <AccordionItem value="needs" className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">5. Analyse des Besoins et Attentes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <ArrayInputField
                  label="Besoins explicites"
                  field="explicitNeeds"
                  placeholder="Demandes formalisées, cahiers des charges, spécifications"
                />
                
                <ArrayInputField
                  label="Besoins implicites"
                  field="implicitNeeds"
                  placeholder="Attentes non exprimées, habitudes d'usage, contraintes culturelles"
                />
                
                <ArrayInputField
                  label="Besoins latents"
                  field="latentNeeds"
                  placeholder="Opportunités d'amélioration, innovations potentielles, évolutions futures"
                />
                
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Hiérarchisation des besoins</Label>
                  <Textarea
                    value={promptData.needsHierarchy}
                    onChange={(e) => updateField('needsHierarchy', e.target.value)}
                    placeholder="Priorités, criticité, urgence relative"
                    className="min-h-20"
                  />
                </div>
                
                <ArrayInputField
                  label="Arbitrages nécessaires"
                  field="necessaryArbitrations"
                  placeholder="Compromis inévitables, trade-offs à négocier"
                />
              </AccordionContent>
            </AccordionItem>

            {/* Section 6: Output Specifications */}
            <AccordionItem value="output" className="border border-gray-200 dark:border-gray-600 rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">6. Spécifications du Livrable</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Niveau de détail</Label>
                    <select
                      value={promptData.detailLevel}
                      onChange={(e) => updateField('detailLevel', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="comprehensive">Complet et exhaustif</option>
                      <option value="detailed">Détaillé</option>
                      <option value="summary">Synthétique</option>
                      <option value="overview">Vue d'ensemble</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Ton et registre</Label>
                    <select
                      value={promptData.toneRegister}
                      onChange={(e) => updateField('toneRegister', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="professional-expert">Professionnel expert</option>
                      <option value="technical-specialist">Technique spécialisé</option>
                      <option value="executive-strategic">Exécutif stratégique</option>
                      <option value="academic-research">Académique recherche</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Structure de réponse</Label>
                    <select
                      value={promptData.responseStructure}
                      onChange={(e) => updateField('responseStructure', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="structured-analysis">Analyse structurée</option>
                      <option value="executive-summary">Résumé exécutif</option>
                      <option value="detailed-report">Rapport détaillé</option>
                      <option value="action-plan">Plan d'action</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Longueur et densité</Label>
                    <select
                      value={promptData.lengthDensity}
                      onChange={(e) => updateField('lengthDensity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="detailed">Détaillé et dense</option>
                      <option value="balanced">Équilibré</option>
                      <option value="concise">Concis et focalisé</option>
                      <option value="extended">Étendu et approfondi</option>
                    </select>
                  </div>
                </div>
                
                <ArrayInputField
                  label="Éléments visuels souhaités"
                  field="visualElements"
                  placeholder="Schémas, tableaux, graphiques, illustrations"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button 
              onClick={generateAdvancedPrompt}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>Génération en cours...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Générer le Prompt Expert</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultat généré */}
      <Card className="glass-card border-white/30 shadow-2xl">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Prompt Expert Généré</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            Architecture complète pour analyse systémique approfondie
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {generatedPrompt ? (
            <>
              <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white border-white/50"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </Button>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-mono">
                    {generatedPrompt}
                  </pre>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Prompt expert généré selon l'architecture de formulation complexe
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800/30 dark:to-teal-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Architecture de Prompt Prête
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Remplissez les sections pertinentes puis générez votre prompt expert multidimensionnel
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedPromptBuilder;
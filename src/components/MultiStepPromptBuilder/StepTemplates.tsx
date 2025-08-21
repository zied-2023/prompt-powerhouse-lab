import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Code, FileText, Lightbulb, BarChart, MessageSquare, Palette } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  structure: {
    objective: string;
    context: string;
    constraints: string;
    format: string;
  };
}

interface StepTemplatesProps {
  onSelectTemplate: (template: Template) => void;
}

const StepTemplates: React.FC<StepTemplatesProps> = ({ onSelectTemplate }) => {
  const { t } = useTranslation();

  const handleTemplateClick = (template: Template) => {
    // Applique le template avec des valeurs concrètes
    onSelectTemplate(template);
    
    // Affiche un toast pour confirmer l'application du template
    import("@/hooks/use-toast").then(({ toast }) => {
      toast({
        title: "Template appliqué",
        description: `Le template "${template.name}" a été appliqué à votre prompt. Personnalisez maintenant les champs selon vos besoins.`,
      });
    });
  };

  const templates: Template[] = [
    {
      id: 'content-creation',
      name: 'Création de Contenu',
      description: 'Template pour créer du contenu engageant pour les réseaux sociaux',
      category: 'Créatif',
      icon: <FileText className="h-5 w-5" />,
      structure: {
        objective: 'Créer un contenu engageant pour Instagram qui génère de l\'engagement et augmente la visibilité de la marque',
        context: 'Le contenu sera publié sur Instagram pour une marque de mode ciblant les jeunes adultes de 18-35 ans',
        constraints: 'Longueur: 150-200 mots, Ton: décontracté et inspirant, Inclure 3-5 hashtags pertinents',
        format: 'Post Instagram avec accroche, corps du texte et call-to-action'
      }
    },
    {
      id: 'code-generation',
      name: 'Génération de Code',
      description: 'Template pour générer du code React propre et maintenable',
      category: 'Technique',
      icon: <Code className="h-5 w-5" />,
      structure: {
        objective: 'Écrire un composant React TypeScript pour un système de gestion de tâches qui respecte les bonnes pratiques',
        context: 'Projet: Application de productivité, Framework: React + TypeScript + Tailwind CSS, Base de données: Supabase',
        constraints: 'Performance optimisée, accessibilité WCAG, tests unitaires inclus, documentation complète',
        format: 'Code TypeScript avec interfaces, hooks personnalisés et exemples d\'utilisation'
      }
    },
    {
      id: 'data-analysis',
      name: 'Analyse de Données',
      description: 'Template pour analyser et interpréter des données',
      category: 'Analytique',
      icon: <BarChart className="h-5 w-5" />,
      structure: {
        objective: 'Analyser [type de données] pour identifier [insights recherchés]',
        context: 'Dataset: [description], Période: [timeframe], Métrique clé: [KPI]',
        constraints: 'Méthodes statistiques, visualisations, niveau de confiance',
        format: 'Rapport avec graphiques, conclusions et recommandations'
      }
    },
    {
      id: 'brainstorming',
      name: 'Brainstorming Créatif',
      description: 'Template pour générer des idées innovantes',
      category: 'Innovation',
      icon: <Lightbulb className="h-5 w-5" />,
      structure: {
        objective: 'Générer [nombre] idées créatives pour [problème à résoudre]',
        context: 'Industrie: [secteur], Budget: [contraintes], Timeline: [délais]',
        constraints: 'Faisabilité, originalité, impact potentiel',
        format: 'Liste priorisée avec descriptions et évaluations'
      }
    },
    {
      id: 'conversation',
      name: 'Dialogue Conversationnel',
      description: 'Template pour créer des conversations naturelles',
      category: 'Communication',
      icon: <MessageSquare className="h-5 w-5" />,
      structure: {
        objective: 'Créer un dialogue [type] entre [participants] sur [sujet]',
        context: 'Contexte: [situation], Relation: [dynamique], Objectif: [but]',
        constraints: 'Ton naturel, authentique, adapté au public',
        format: 'Dialogue structuré avec indications scéniques'
      }
    },
    {
      id: 'design-brief',
      name: 'Brief Créatif',
      description: 'Template pour créer des briefs de design',
      category: 'Design',
      icon: <Palette className="h-5 w-5" />,
      structure: {
        objective: 'Concevoir [élément visuel] pour [marque/projet] qui [objectif]',
        context: 'Marque: [identité], Public: [démographie], Usage: [contexte]',
        constraints: 'Style, couleurs, formats, délais, budget',
        format: 'Moodboard avec spécifications techniques'
      }
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      'Créatif': 'bg-purple-100 text-purple-800 border-purple-200',
      'Technique': 'bg-blue-100 text-blue-800 border-blue-200',
      'Analytique': 'bg-green-100 text-green-800 border-green-200',
      'Innovation': 'bg-orange-100 text-orange-800 border-orange-200',
      'Communication': 'bg-pink-100 text-pink-800 border-pink-200',
      'Design': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Templates de Prompts Avancés</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Utilisez ces templates pré-configurés pour créer rapidement des prompts complexes et structurés.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer glass-card border-white/30 dark:border-gray-700/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {template.icon}
                  <CardTitle className="text-base">{template.name}</CardTitle>
                </div>
                <Badge variant="secondary" className={`${getCategoryColor(template.category)} text-xs`}>
                  {template.category}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                <div className="text-xs text-gray-500 dark:text-gray-400">Structure du template:</div>
                <div className="text-xs space-y-1">
                  <div><span className="font-medium">Objectif:</span> {template.structure.objective.slice(0, 50)}...</div>
                  <div><span className="font-medium">Format:</span> {template.structure.format.slice(0, 50)}...</div>
                </div>
              </div>
              <Button 
                onClick={() => handleTemplateClick(template)}
                size="sm" 
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                variant="default"
              >
                ✨ Appliquer ce Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepTemplates;
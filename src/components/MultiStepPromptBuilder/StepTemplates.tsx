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

  const templates: Template[] = [
    {
      id: 'content-creation',
      name: 'Création de Contenu',
      description: 'Template pour créer du contenu engageant',
      category: 'Créatif',
      icon: <FileText className="h-5 w-5" />,
      structure: {
        objective: 'Créer un contenu [type] pour [audience cible] qui [action souhaitée]',
        context: 'Le contenu sera publié sur [plateforme] pour atteindre [objectif business]',
        constraints: 'Longueur: [nombre de mots], Ton: [style], Références: [sources]',
        format: 'Structure avec introduction, corps principal et conclusion'
      }
    },
    {
      id: 'code-generation',
      name: 'Génération de Code',
      description: 'Template pour générer du code propre',
      category: 'Technique',
      icon: <Code className="h-5 w-5" />,
      structure: {
        objective: 'Écrire du code [langage] pour [fonctionnalité] qui respecte [standards]',
        context: 'Projet: [description], Framework: [tech stack], Contraintes: [limitations]',
        constraints: 'Performance, sécurité, maintenabilité, documentation',
        format: 'Code commenté avec exemples d\'utilisation'
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
                onClick={() => onSelectTemplate(template)}
                size="sm" 
                className="w-full"
                variant="outline"
              >
                Utiliser ce Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StepTemplates;
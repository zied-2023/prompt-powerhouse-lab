import { Target, Users, Palette, FileText, Lightbulb, Settings } from 'lucide-react';
import { StepConfig } from './types';

export const stepConfigs: StepConfig[] = [
  {
    id: 0,
    title: "Définir l'Objectif",
    description: "Précisez clairement ce que vous voulez obtenir de l'IA",
    icon: Target,
    component: 'ObjectiveStep',
    required: true,
    estimatedTime: "2-3 min",
    tips: [
      "Soyez spécifique sur le type de contenu désiré",
      "Mentionnez le format de sortie (liste, paragraphe, code, etc.)",
      "Indiquez la longueur approximative souhaitée"
    ],
    examples: [
      "Créer un plan marketing pour une startup technologique",
      "Rédiger un email de suivi commercial professionnel",
      "Générer du code Python pour analyser des données CSV"
    ]
  },
  {
    id: 1,
    title: "Contexte & Situation",
    description: "Fournissez le contexte nécessaire pour une réponse pertinente",
    icon: FileText,
    component: 'ContextStep',
    required: false,
    estimatedTime: "3-4 min",
    tips: [
      "Décrivez la situation actuelle ou le problème à résoudre",
      "Mentionnez les ressources ou contraintes disponibles",
      "Ajoutez des informations sur l'environnement d'utilisation"
    ],
    examples: [
      "Entreprise B2B de 50 employés, budget marketing limité",
      "Client potentiel rencontré en salon, intérêt pour nos services",
      "Dataset de 10 000 lignes avec colonnes: nom, âge, ville, revenus"
    ]
  },
  {
    id: 2,
    title: "Public Cible",
    description: "Définissez votre audience pour adapter le ton et le niveau",
    icon: Users,
    component: 'AudienceStep',
    required: false,
    estimatedTime: "2 min",
    tips: [
      "Précisez le niveau d'expertise (débutant, intermédiaire, expert)",
      "Mentionnez la fonction ou le rôle de votre audience",
      "Indiquez leurs préférences ou contraintes spécifiques"
    ],
    examples: [
      "Directeurs marketing de PME, 5-10 ans d'expérience",
      "Prospects B2B, décideurs techniques, budget 50k-200k€",
      "Développeurs Python junior à intermédiaire"
    ]
  },
  {
    id: 3,
    title: "Ton & Style",
    description: "Choisissez le ton et le style de communication appropriés",
    icon: Palette,
    component: 'ToneStep',
    required: false,
    estimatedTime: "1-2 min",
    tips: [
      "Adaptez le ton à votre audience et contexte",
      "Considérez la formalité requise",
      "Pensez à l'émotion que vous voulez transmettre"
    ]
  },
  {
    id: 4,
    title: "Contraintes & Spécifications",
    description: "Définissez les limitations et exigences spécifiques",
    icon: Settings,
    component: 'ConstraintsStep',
    required: false,
    estimatedTime: "2-3 min",
    tips: [
      "Mentionnez les contraintes de longueur",
      "Spécifiez les éléments à éviter ou inclure obligatoirement",
      "Indiquez les standards ou normes à respecter"
    ]
  },
  {
    id: 5,
    title: "Optimisation Finale",
    description: "Affinez et optimisez votre prompt avec l'IA",
    icon: Lightbulb,
    component: 'OptimizationStep',
    required: false,
    estimatedTime: "3-5 min",
    tips: [
      "Testez votre prompt avec des variations",
      "Utilisez les suggestions d'amélioration",
      "Vérifiez la cohérence globale"
    ]
  }
];
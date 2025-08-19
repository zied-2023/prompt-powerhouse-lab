import { Target, Users, Palette, FileText, Lightbulb, Settings } from 'lucide-react';
import { StepConfig } from './types';

export const getStepConfigs = (t: (key: string) => string): StepConfig[] => [
  {
    id: 0,
    title: t('advancedStepObjective'),
    description: t('advancedStepObjectiveDesc'),
    icon: Target,
    component: 'ObjectiveStep',
    required: false,
    estimatedTime: "2-3 min",
    tips: [
      t('objectiveTip1'),
      t('objectiveTip2'),
      t('objectiveTip3')
    ],
    examples: [
      t('objectiveExample1'),
      t('objectiveExample2'),
      t('objectiveExample3')
    ]
  },
  {
    id: 1,
    title: t('advancedStepContext'),
    description: t('advancedStepContextDesc'),
    icon: FileText,
    component: 'ContextStep',
    required: false,
    estimatedTime: "3-4 min",
    tips: [
      t('contextTip1'),
      t('contextTip2'),
      t('contextTip3')
    ],
    examples: [
      t('contextExample1'),
      t('contextExample2'),
      t('contextExample3')
    ]
  },
  {
    id: 2,
    title: t('advancedStepAudience'),
    description: t('advancedStepAudienceDesc'),
    icon: Users,
    component: 'AudienceStep',
    required: false,
    estimatedTime: "2 min",
    tips: [
      t('audienceTip1'),
      t('audienceTip2'),
      t('audienceTip3')
    ],
    examples: [
      t('audienceExample1'),
      t('audienceExample2'),
      t('audienceExample3')
    ]
  },
  {
    id: 3,
    title: t('advancedStepTone'),
    description: t('advancedStepToneDesc'),
    icon: Palette,
    component: 'ToneStep',
    required: false,
    estimatedTime: "1-2 min",
    tips: [
      t('toneTip1'),
      t('toneTip2'),
      t('toneTip3')
    ]
  },
  {
    id: 4,
    title: t('advancedStepConstraints'),
    description: t('advancedStepConstraintsDesc'),
    icon: Settings,
    component: 'ConstraintsStep',
    required: false,
    estimatedTime: "2-3 min",
    tips: [
      t('constraintsTip1'),
      t('constraintsTip2'),
      t('constraintsTip3')
    ]
  },
  {
    id: 5,
    title: t('advancedStepOptimization'),
    description: t('advancedStepOptimizationDesc'),
    icon: Lightbulb,
    component: 'OptimizationStep',
    required: false,
    estimatedTime: "3-5 min",
    tips: [
      t('optimizationTip1'),
      t('optimizationTip2'),
      t('optimizationTip3')
    ]
  }
];
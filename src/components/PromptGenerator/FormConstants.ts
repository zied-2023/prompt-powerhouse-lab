
import { useTranslation } from "@/hooks/useTranslation";

export const useFormConstants = () => {
  const { t } = useTranslation();

  const categories = [
    { 
      value: 'content-creation', 
      label: t('contentCreation'), 
      description: t('contentCreationDesc')
    },
    { 
      value: 'business-professional', 
      label: t('businessProfessional'), 
      description: t('businessProfessionalDesc')
    },
    { 
      value: 'education-training', 
      label: t('educationTraining'), 
      description: t('educationTrainingDesc')
    },
    { 
      value: 'technology-development', 
      label: t('technologyDevelopment'), 
      description: t('technologyDevelopmentDesc')
    },
    { 
      value: 'analysis-research', 
      label: t('analysisResearch'), 
      description: t('analysisResearchDesc')
    },
    { 
      value: 'problem-solving', 
      label: t('problemSolving'), 
      description: t('problemSolvingDesc')
    },
    { 
      value: 'communication-relations', 
      label: t('communicationRelations'), 
      description: t('communicationRelationsDesc')
    }
  ];

  const subcategories = {
    'content-creation': [
      { value: 'writing', label: t('writing') },
      { value: 'artistic-creation', label: t('artisticCreation') },
      { value: 'video-audio', label: t('videoAudio') },
      { value: 'marketing', label: t('marketing') },
      { value: 'literature', label: t('literature') }
    ],
    'business-professional': [
      { value: 'strategy', label: t('strategy') },
      { value: 'communication', label: t('communication') },
      { value: 'hr', label: t('hr') },
      { value: 'sales', label: t('sales') },
      { value: 'management', label: t('management') }
    ],
    'education-training': [
      { value: 'courses', label: t('courses') },
      { value: 'evaluation', label: t('evaluation') },
      { value: 'research', label: t('research') },
      { value: 'pedagogy', label: t('pedagogy') },
      { value: 'professional-training', label: t('professionalTraining') }
    ],
    'technology-development': [
      { value: 'programming', label: t('programming') },
      { value: 'data-science', label: t('dataScience') },
      { value: 'cybersecurity', label: t('cybersecurity') },
      { value: 'architecture', label: t('architecture') },
      { value: 'devops', label: t('devops') }
    ],
    'analysis-research': [
      { value: 'data-analysis', label: t('dataAnalysisSubcat') },
      { value: 'academic-research', label: t('academicResearch') },
      { value: 'competitive-intelligence', label: t('competitiveIntelligence') },
      { value: 'audit-evaluation', label: t('auditEvaluation') },
      { value: 'forecasting', label: t('forecasting') }
    ],
    'problem-solving': [
      { value: 'diagnosis', label: t('diagnosis') },
      { value: 'brainstorming', label: t('brainstorming') },
      { value: 'decision-making', label: t('decisionMaking') },
      { value: 'optimization', label: t('optimization') },
      { value: 'innovation', label: t('innovation') }
    ],
    'communication-relations': [
      { value: 'customer-relations', label: t('customerRelations') },
      { value: 'internal-communication', label: t('internalCommunication') },
      { value: 'negotiation', label: t('negotiation') },
      { value: 'presentation', label: t('presentation') },
      { value: 'public-relations', label: t('publicRelations') }
    ]
  };

  const outputFormats = [
    { value: 'bullet-list', label: t('bulletList') },
    { value: 'structured-paragraph', label: t('structuredParagraph') },
    { value: 'table', label: t('table') },
    { value: 'numbered-steps', label: t('numberedSteps') },
    { value: 'dialogue', label: t('dialogue') },
    { value: 'code-script', label: t('codeScript') }
  ];

  const toneOptions = [
    { value: 'professional', label: t('professional') },
    { value: 'casual', label: t('casual') },
    { value: 'technical', label: t('technical') },
    { value: 'creative', label: t('creative') },
    { value: 'persuasive', label: t('persuasive') },
    { value: 'educational', label: t('educational') }
  ];

  const lengthOptions = [
    { value: 'short', label: t('short') },
    { value: 'medium', label: t('medium') },
    { value: 'long', label: t('long') },
    { value: 'very-detailed', label: t('veryDetailed') }
  ];

  return {
    categories,
    subcategories,
    outputFormats,
    toneOptions,
    lengthOptions
  };
};

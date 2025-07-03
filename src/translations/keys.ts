
// Translation key types organized by category
export type NavigationKeys = 
  | 'title' | 'subtitle' | 'generator' | 'advanced' | 'library' | 'categories' | 'integration'
  | 'theme' | 'language' | 'advancedAI' | 'noCode';

export type FormKeys = 
  | 'titlePlaceholder' | 'category' | 'tone' | 'audience' | 'constraints' | 'context'
  | 'objective' | 'outputFormat' | 'generatePrompt' | 'copy' | 'examples'
  | 'required' | 'optional';

export type LanguageKeys = 'french' | 'arabic' | 'english';

export type PromptGeneratorKeys = 
  | 'promptGeneratorTitle' | 'promptGeneratorDesc' | 'quickGenerator' | 'quickGeneratorDesc'
  | 'detailedGenerator' | 'detailedGeneratorDesc' | 'generating' | 'generatedPrompt'
  | 'readyForGeneration' | 'aiWillCreate' | 'generatedByAI' | 'aiGeneratedDesc';

export type MultiStepKeys = 
  | 'multiStepTitle' | 'multiStepDesc' | 'step' | 'stepObjective' | 'stepObjectiveDesc'
  | 'stepContext' | 'stepContextDesc' | 'stepConstraints' | 'stepConstraintsDesc'
  | 'stepOutputFormat' | 'stepOutputFormatDesc' | 'stepReview' | 'stepReviewDesc'
  | 'previous' | 'next' | 'generate' | 'finalPrompt';

export type ImprovementKeys = 
  | 'improvement' | 'improvementTitle' | 'improvementDesc' | 'originalPrompt' 
  | 'originalPromptPlaceholder' | 'improvementObjective' | 'improvementObjectivePlaceholder'
  | 'improvePrompt' | 'improvingPrompt' | 'improvedPrompt' | 'improvedPromptDesc'
  | 'improvements' | 'improvementSuccess' | 'improvementSuccessDesc'
  | 'enterOriginalPrompt';

export type CategoryKeys = 
  | 'textGeneration' | 'textGenerationDesc' | 'blogPostGenerator' 
  | 'imageCreation' | 'imageCreationDesc' 
  | 'interactiveDialogue' | 'interactiveDialogueDesc' | 'customerSupportChatbot'
  | 'codeGeneration' | 'codeGenerationDesc' | 'reactComponentGenerator'
  | 'dataAnalysis' | 'dataAnalysisDesc'
  | 'creativeWriting' | 'creativeWritingDesc';

export type ColorKeys = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';

export type MessageKeys = 
  | 'missingInfo' | 'generationError' | 'copiedSuccess' | 'promptCopiedClipboard'
  | 'validationError' | 'nameDescriptionRequired' | 'categoryCreated' | 'categoryUpdated' | 'categoryDeleted';

export type CategoryManagerKeys = 
  | 'editCategory' | 'createNewCategory' | 'categoryName' | 'colorTheme' | 'categoryDescription'
  | 'exampleUseCases' | 'update' | 'create' | 'cancel' | 'addCategory';

export type MultiStepBuilderKeys = 
  | 'multiStepBuilder' | 'multiStepBuilderDesc' | 'progress' | 'generateAdvancedPrompt'
  | 'advancedPromptResult' | 'advancedPromptGenerated' | 'advancedPromptGeneratedDesc' | 'tryAgainLater'
  | 'stepObjectiveTitle' | 'stepContextTitle' | 'stepConstraintsTitle' | 'stepOutputFormatTitle' | 'stepReviewTitle';

export type ToneKeys = 
  | 'professional' | 'casual' | 'technical' | 'creative' | 'persuasive' | 'educational' | 'authoritative' | 'friendly';

export type LengthKeys = 'brief' | 'concise' | 'detailed' | 'comprehensive' | 'extensive';

export type FormatKeys = 
  | 'structuredReport' | 'bulletPoints' | 'narrative' | 'stepByStep' | 'qaFormat' | 'presentation';

export type StyleKeys = 
  | 'analytical' | 'descriptive' | 'comparative' | 'argumentative' | 'instructional' | 'consultative';

export type TechnicalLevelKeys = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type StepSpecificKeys = 
  | 'toneStyle' | 'selectTone' | 'approximateLength' | 'selectLength' | 'technicalLevel' | 'selectTechnicalLevel'
  | 'responseFormat' | 'selectFormat' | 'writingStyle' | 'selectStyle';

export type StepObjectiveKeys = 
  | 'mainObjective' | 'mainObjectivePlaceholder' | 'specificTargets' | 'addTarget' | 'targetPlaceholder'
  | 'noTargetsYet' | 'successCriteria' | 'successCriteriaPlaceholder' | 'stepObjectiveTips'
  | 'tipObjective1' | 'tipObjective2' | 'tipObjective3';

export type StepContextKeys = 
  | 'contextBackground' | 'contextBackgroundPlaceholder' | 'targetAudience' | 'targetAudiencePlaceholder'
  | 'industry' | 'selectIndustry' | 'contextConstraints' | 'addConstraint' | 'constraintPlaceholder'
  | 'noConstraintsYet' | 'stepContextTips' | 'tipContext1' | 'tipContext2' | 'tipContext3'
  | 'technology' | 'healthcare' | 'finance' | 'education' | 'marketing' | 'retail' | 'manufacturing'
  | 'consulting' | 'media' | 'other';

export type StepConstraintsKeys = 
  | 'stepConstraintsTips' | 'tipConstraints1' | 'tipConstraints2' | 'tipConstraints3';

export type StepOutputFormatKeys = 
  | 'outputStructure' | 'selectStructure' | 'requiredSections' | 'addSection' | 'sectionPlaceholder'
  | 'noSectionsYet' | 'expectedDeliverables' | 'addDeliverable' | 'deliverablePlaceholder' | 'noDeliverablesYet'
  | 'stepOutputFormatTips' | 'tipOutputFormat1' | 'tipOutputFormat2' | 'tipOutputFormat3'
  | 'hierarchical' | 'sequential' | 'modular' | 'matrix' | 'flowchart' | 'comparative';

export type StepReviewKeys = 
  | 'objectiveReview' | 'contextReview' | 'requirementsReview' | 'outputFormatReview' | 'notSpecified'
  | 'readyToGenerate' | 'almostReady' | 'allRequiredFieldsCompleted' | 'someFieldsMissing' | 'completed'
  | 'finalTips' | 'finalTip1' | 'finalTip2' | 'finalTip3' | 'finalTip4';

export type PromptGeneratorSpecificKeys =
  | 'contentCreation' | 'contentCreationDesc' | 'businessProfessional' | 'businessProfessionalDesc'
  | 'educationTraining' | 'educationTrainingDesc' | 'technologyDevelopment' | 'technologyDevelopmentDesc'
  | 'analysisResearch' | 'analysisResearchDesc' | 'problemSolving' | 'problemSolvingDesc'
  | 'communicationRelations' | 'communicationRelationsDesc' | 'writing' | 'artisticCreation'
  | 'videoAudio' | 'literature' | 'strategy' | 'communication' | 'hr' | 'sales' | 'management'
  | 'courses' | 'evaluation' | 'research' | 'pedagogy' | 'professionalTraining' | 'programming'
  | 'dataScience' | 'cybersecurity' | 'architecture' | 'devops' | 'dataAnalysisSubcat'
  | 'academicResearch' | 'competitiveIntelligence' | 'auditEvaluation' | 'forecasting'
  | 'diagnosis' | 'brainstorming' | 'decisionMaking' | 'optimization' | 'innovation'
  | 'customerRelations' | 'internalCommunication' | 'negotiation' | 'publicRelations'
  | 'bulletList' | 'structuredParagraph' | 'table' | 'numberedSteps' | 'dialogue' | 'codeScript'
  | 'short' | 'medium' | 'long' | 'veryDetailed' | 'chooseCategoryDesc' | 'promptCreatedSuccess'
  | 'promptCreatedDesc' | 'mainCategory' | 'selectDomain';

// Union of all translation keys
export type TranslationKey = 
  | NavigationKeys | FormKeys | LanguageKeys | PromptGeneratorKeys | MultiStepKeys
  | ImprovementKeys | CategoryKeys | ColorKeys | MessageKeys | CategoryManagerKeys
  | MultiStepBuilderKeys | ToneKeys | LengthKeys | FormatKeys | StyleKeys | TechnicalLevelKeys
  | StepSpecificKeys | StepObjectiveKeys | StepContextKeys | StepConstraintsKeys
  | StepOutputFormatKeys | StepReviewKeys | PromptGeneratorSpecificKeys;

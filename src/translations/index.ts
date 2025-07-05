// Translation types
export type TranslationKey = 
  | 'welcome'
  | 'description'
  | 'getStarted'
  | 'features'
  | 'feature1'
  | 'feature2'
  | 'feature3'
  | 'about'
  | 'contact'
  | 'home'
  | 'promptGeneratorTitle'
  | 'promptGeneratorDesc'
  | 'improvementTitle'
  | 'improvementDesc'
  | 'mainCategory'
  | 'required'
  | 'selectDomain'
  | 'subcategory'
  | 'optional'
  | 'chooseSpecialization'
  | 'taskDescription'
  | 'taskDescriptionPlaceholder'
  | 'mainObjective'
  | 'mainObjectivePlaceholder'
  | 'targetAudience'
  | 'targetAudiencePlaceholder'
  | 'outputFormat'
  | 'chooseFormat'
  | 'toneStyle'
  | 'chooseTone'
  | 'approximateLength'
  | 'chooseLength'
  | 'generateWithAI'
  | 'generatingWithAI'
  | 'aiGeneratedPrompt'
  | 'aiGeneratedPromptDesc'
  | 'copy'
  | 'readyForGeneration'
  | 'aiWillCreate'
  | 'missingInfo'
  | 'chooseCategoryDesc'
  | 'promptCreatedSuccess'
  | 'promptCreatedDesc'
  | 'generationError'
  | 'copiedSuccess'
  | 'promptCopiedClipboard'
  | 'generatedByAI'
  | 'aiGeneratedDesc'
  | 'contentCreation'
  | 'contentCreationDesc'
  | 'businessProfessional'
  | 'businessProfessionalDesc'
  | 'educationTraining'
  | 'educationTrainingDesc'
  | 'technologyDevelopment'
  | 'technologyDevelopmentDesc'
  | 'analysisResearch'
  | 'analysisResearchDesc'
  | 'problemSolving'
  | 'problemSolvingDesc'
  | 'communicationRelations'
  | 'communicationRelationsDesc'
  | 'writing'
  | 'artisticCreation'
  | 'videoAudio'
  | 'marketing'
  | 'literature'
  | 'strategy'
  | 'communication'
  | 'hr'
  | 'sales'
  | 'management'
  | 'courses'
  | 'evaluation'
  | 'research'
  | 'pedagogy'
  | 'professionalTraining'
  | 'programming'
  | 'dataScience'
  | 'cybersecurity'
  | 'architecture'
  | 'devops'
  | 'dataAnalysisSubcat'
  | 'academicResearch'
  | 'competitiveIntelligence'
  | 'auditEvaluation'
  | 'forecasting'
  | 'diagnosis'
  | 'brainstorming'
  | 'decisionMaking'
  | 'optimization'
  | 'innovation'
  | 'customerRelations'
  | 'internalCommunication'
  | 'negotiation'
  | 'presentation'
  | 'publicRelations'
  | 'bulletList'
  | 'structuredParagraph'
  | 'table'
  | 'numberedSteps'
  | 'dialogue'
  | 'codeScript'
  | 'professional'
  | 'casual'
  | 'technical'
  | 'creative'
  | 'persuasive'
  | 'educational'
  | 'short'
  | 'medium'
  | 'long'
  | 'veryDetailed'
  | 'originalPrompt'
  | 'originalPromptPlaceholder'
  | 'improvementObjective'
  | 'improvementObjectivePlaceholder'
  | 'improvePrompt'
  | 'improvingPrompt'
  | 'improvedPrompt'
  | 'improvedPromptDesc'
  | 'improvements'
  | 'improvementSuccess'
  | 'improvementSuccessDesc'
  | 'enterOriginalPrompt'
  | 'textGeneration'
  | 'textGenerationDesc'
  | 'blogPostGenerator'
  | 'imageCreation'
  | 'imageCreationDesc'
  | 'interactiveDialogue'
  | 'interactiveDialogueDesc'
  | 'customerSupportChatbot'
  | 'codeGeneration'
  | 'codeGenerationDesc'
  | 'reactComponentGenerator'
  | 'dataAnalysis'
  | 'dataAnalysisDesc'
  | 'creativeWriting'
  | 'creativeWritingDesc'
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'indigo'
  | 'validationError'
  | 'nameDescriptionRequired'
  | 'categoryCreated'
  | 'categoryUpdated'
  | 'categoryDeleted'
  | 'deleteConfirmation'
  | 'confirmDelete'
  | 'cancel'
  | 'edit'
  | 'delete'
  | 'save'
  | 'addCategory'
  | 'editCategory'
  | 'categoryName'
  | 'categoryDescription'
  | 'categoryColor'
  | 'categoryNamePlaceholder'
  | 'categoryDescriptionPlaceholder'
  | 'createCategory'
  | 'updateCategory'
  | 'categoryManagement'
  | 'categoryManagementDesc'
  | 'manageCategories'
  | 'customCategories'
  | 'noCustomCategories'
  | 'createFirstCategory'
  | 'progress'
  | 'style'
  | 'title'
  | 'format'
  | 'step'
  | 'length'
  | 'next'
  | 'previous'
  | 'background'
  | 'description'
  | 'theme'
  | 'createNewCategory'
  | 'colorTheme'
  | 'exampleUseCases'
  | 'update'
  | 'create'
  | 'categories'
  | 'french'
  | 'arabic'
  | 'english'
  | 'stepObjectiveTitle'
  | 'stepObjectiveDesc'
  | 'stepContextTitle'
  | 'stepContextDesc'
  | 'stepConstraintsTitle'
  | 'stepConstraintsDesc'
  | 'stepOutputFormatTitle'
  | 'stepOutputFormatDesc'
  | 'stepReviewTitle'
  | 'stepReviewDesc'
  | 'advancedPromptGenerated'
  | 'advancedPromptGeneratedDesc'
  | 'tryAgainLater'
  | 'multiStepBuilder'
  | 'multiStepBuilderDesc'
  | 'generating'
  | 'generateAdvancedPrompt'
  | 'advancedPromptResult'
  | 'authoritative'
  | 'friendly'
  | 'brief'
  | 'concise'
  | 'detailed'
  | 'comprehensive'
  | 'extensive'
  | 'structuredReport'
  | 'bulletPoints'
  | 'narrative'
  | 'stepByStep'
  | 'qaFormat'
  | 'analytical'
  | 'descriptive'
  | 'comparative'
  | 'argumentative'
  | 'instructional'
  | 'consultative'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'selectTone'
  | 'selectLength'
  | 'technicalLevel'
  | 'selectTechnicalLevel'
  | 'responseFormat'
  | 'selectFormat'
  | 'writingStyle'
  | 'selectStyle'
  | 'stepConstraintsTips'
  | 'tipConstraints1'
  | 'tipConstraints2'
  | 'tipConstraints3'
  | 'contextBackground'
  | 'contextBackgroundPlaceholder'
  | 'selectIndustry'
  | 'contextConstraints'
  | 'addConstraint'
  | 'constraintPlaceholder'
  | 'noConstraintsYet'
  | 'stepContextTips'
  | 'tipContext1'
  | 'tipContext2'
  | 'tipContext3'
  | 'specificTargets'
  | 'addTarget'
  | 'targetPlaceholder'
  | 'noTargetsYet'
  | 'successCriteria'
  | 'successCriteriaPlaceholder'
  | 'stepObjectiveTips'
  | 'tipObjective1'
  | 'tipObjective2'
  | 'tipObjective3'
  | 'outputStructure'
  | 'selectStructure'
  | 'requiredSections'
  | 'addSection'
  | 'sectionPlaceholder'
  | 'noSectionsYet'
  | 'expectedDeliverables'
  | 'addDeliverable'
  | 'deliverablePlaceholder'
  | 'noDeliverablesYet'
  | 'stepOutputFormatTips'
  | 'tipOutputFormat1'
  | 'tipOutputFormat2'
  | 'tipOutputFormat3'
  | 'hierarchical'
  | 'sequential'
  | 'modular'
  | 'matrix'
  | 'flowchart'
  | 'objectiveReview'
  | 'contextReview'
  | 'requirementsReview'
  | 'outputFormatReview'
  | 'notSpecified'
  | 'readyToGenerate'
  | 'allRequiredFieldsCompleted'
  | 'almostReady'
  | 'someFieldsMissing'
  | 'completed'
  | 'finalTips'
  | 'finalTip1'
  | 'finalTip2'
  | 'finalTip3'
  | 'finalTip4'
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education'
  | 'retail'
  | 'manufacturing'
  | 'consulting'
  | 'media'
  | 'other';

// Translation content
export const translations = {
  en: {
    welcome: 'Welcome to Prompt Generator Lab',
    description: 'Create powerful AI prompts with our advanced generator',
    getStarted: 'Get Started',
    features: 'Features',
    feature1: 'AI-Powered Generation',
    feature2: 'Multiple Categories',
    feature3: 'Easy to Use',
    about: 'About',
    contact: 'Contact',
    home: 'Home',
    promptGeneratorTitle: 'AI Prompt Generator',
    promptGeneratorDesc: 'Create professional prompts tailored to your needs',
    improvementTitle: 'Prompt Improvement',
    improvementDesc: 'Enhance and optimize your existing prompts',
    mainCategory: 'Main Category',
    required: '*',
    selectDomain: 'Select a domain',
    subcategory: 'Subcategory',
    optional: '(optional)',
    chooseSpecialization: 'Choose a specialization',
    taskDescription: 'Task Description',
    taskDescriptionPlaceholder: 'Describe what you want to accomplish...',
    mainObjective: 'Main Objective',
    mainObjectivePlaceholder: 'What is the main goal?',
    targetAudience: 'Target Audience',
    targetAudiencePlaceholder: 'Who is the target audience?',
    outputFormat: 'Output Format',
    chooseFormat: 'Choose a format',
    toneStyle: 'Tone & Style',
    chooseTone: 'Choose a tone',
    approximateLength: 'Approximate Length',
    chooseLength: 'Choose length',
    generateWithAI: 'Generate with AI',
    generatingWithAI: 'Generating...',
    aiGeneratedPrompt: 'AI Generated Prompt',
    aiGeneratedPromptDesc: 'Your optimized prompt ready to use',
    copy: 'Copy',
    readyForGeneration: 'Ready for generation',
    aiWillCreate: 'AI will create your perfect prompt',
    missingInfo: 'Missing Information',
    chooseCategoryDesc: 'Please select a category and describe your task',
    promptCreatedSuccess: 'Prompt Created!',
    promptCreatedDesc: 'Your AI prompt has been generated successfully',
    generationError: 'Generation Error',
    copiedSuccess: 'Copied!',
    promptCopiedClipboard: 'Prompt copied to clipboard',
    generatedByAI: 'Generated by AI',
    aiGeneratedDesc: 'This prompt was created using artificial intelligence',
    contentCreation: 'Content Creation',
    contentCreationDesc: 'Writing, design, and media production',
    businessProfessional: 'Business & Professional',
    businessProfessionalDesc: 'Strategy, management, and corporate tasks',
    educationTraining: 'Education & Training',
    educationTrainingDesc: 'Teaching, learning, and skill development',
    technologyDevelopment: 'Technology & Development',
    technologyDevelopmentDesc: 'Programming, systems, and technical solutions',
    analysisResearch: 'Analysis & Research',
    analysisResearchDesc: 'Data analysis, research, and insights',
    problemSolving: 'Problem Solving',
    problemSolvingDesc: 'Creative solutions and decision making',
    communicationRelations: 'Communication & Relations',
    communicationRelationsDesc: 'Interpersonal and public communications',
    writing: 'Writing',
    artisticCreation: 'Artistic Creation',
    videoAudio: 'Video & Audio',
    marketing: 'Marketing',
    literature: 'Literature',
    strategy: 'Strategy',
    communication: 'Communication',
    hr: 'Human Resources',
    sales: 'Sales',
    management: 'Management',
    courses: 'Courses',
    evaluation: 'Evaluation',
    research: 'Research',
    pedagogy: 'Pedagogy',
    professionalTraining: 'Professional Training',
    programming: 'Programming',
    dataScience: 'Data Science',
    cybersecurity: 'Cybersecurity',
    architecture: 'Architecture',
    devops: 'DevOps',
    dataAnalysisSubcat: 'Data Analysis',
    academicResearch: 'Academic Research',
    competitiveIntelligence: 'Competitive Intelligence',
    auditEvaluation: 'Audit & Evaluation',
    forecasting: 'Forecasting',
    diagnosis: 'Diagnosis',
    brainstorming: 'Brainstorming',
    decisionMaking: 'Decision Making',
    optimization: 'Optimization',
    innovation: 'Innovation',
    customerRelations: 'Customer Relations',
    internalCommunication: 'Internal Communication',
    negotiation: 'Negotiation',
    presentation: 'Presentation',
    publicRelations: 'Public Relations',
    bulletList: 'Bullet List',
    structuredParagraph: 'Structured Paragraph',
    table: 'Table',
    numberedSteps: 'Numbered Steps',
    dialogue: 'Dialogue',
    codeScript: 'Code/Script',
    professional: 'Professional',
    casual: 'Casual',
    technical: 'Technical',
    creative: 'Creative',
    persuasive: 'Persuasive',
    educational: 'Educational',
    short: 'Short',
    medium: 'Medium',
    long: 'Long',
    veryDetailed: 'Very Detailed',
    originalPrompt: 'Original Prompt',
    originalPromptPlaceholder: 'Enter your prompt to improve...',
    improvementObjective: 'Improvement Objective',
    improvementObjectivePlaceholder: 'What specific aspect to improve?',
    improvePrompt: 'Improve Prompt',
    improvingPrompt: 'Improving...',
    improvedPrompt: 'Improved Prompt',
    improvedPromptDesc: 'Your optimized and enhanced prompt',
    improvements: 'Improvements Made',
    improvementSuccess: 'Improvement Complete!',
    improvementSuccessDesc: 'Your prompt has been successfully improved',
    enterOriginalPrompt: 'Please enter the original prompt to improve',
    textGeneration: 'Text Generation',
    textGenerationDesc: 'Generate various types of text content',
    blogPostGenerator: 'Blog Post Generator',
    imageCreation: 'Image Creation',
    imageCreationDesc: 'Create and design visual content',
    interactiveDialogue: 'Interactive Dialogue',
    interactiveDialogueDesc: 'Conversational and interactive content',
    customerSupportChatbot: 'Customer Support Chatbot',
    codeGeneration: 'Code Generation',
    codeGenerationDesc: 'Programming and development assistance',
    reactComponentGenerator: 'React Component Generator',
    dataAnalysis: 'Data Analysis',
    dataAnalysisDesc: 'Analyze and interpret data',
    creativeWriting: 'Creative Writing',
    creativeWritingDesc: 'Creative and artistic writing',
    blue: 'Blue',
    green: 'Green',
    purple: 'Purple',
    orange: 'Orange',
    red: 'Red',
    indigo: 'Indigo',
    validationError: 'Validation Error',
    nameDescriptionRequired: 'Name and description are required',
    categoryCreated: 'Category Created',
    categoryUpdated: 'Category Updated',
    categoryDeleted: 'Category Deleted',
    deleteConfirmation: 'Delete Confirmation',
    confirmDelete: 'Are you sure you want to delete this category?',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    addCategory: 'Add Category',
    editCategory: 'Edit Category',
    categoryName: 'Category Name',
    categoryDescription: 'Category Description',
    categoryColor: 'Category Color',
    categoryNamePlaceholder: 'Enter category name...',
    categoryDescriptionPlaceholder: 'Enter category description...',
    createCategory: 'Create Category',
    updateCategory: 'Update Category',
    categoryManagement: 'Category Management',
    categoryManagementDesc: 'Manage your custom prompt categories',
    manageCategories: 'Manage Categories',
    customCategories: 'Custom Categories',
    noCustomCategories: 'No custom categories yet',
    createFirstCategory: 'Create your first custom category',
    progress: 'Progress',
    style: 'Style',
    title: 'Title',
    format: 'Format',
    step: 'Step',
    length: 'Length',
    next: 'Next',
    previous: 'Previous',
    background: 'Background',
    description: 'Description',
    theme: 'Theme',
    createNewCategory: 'Create New Category',
    colorTheme: 'Color Theme',
    exampleUseCases: 'Example Use Cases',
    update: 'Update',
    create: 'Create',
    categories: 'Categories',
    french: 'French',
    arabic: 'Arabic',
    english: 'English',
    stepObjectiveTitle: 'Define Objective',
    stepObjectiveDesc: 'Set clear goals and success criteria',
    stepContextTitle: 'Context & Background',
    stepContextDesc: 'Provide context and constraints',
    stepConstraintsTitle: 'Requirements & Style',
    stepConstraintsDesc: 'Specify tone, format, and style',
    stepOutputFormatTitle: 'Output Format',
    stepOutputFormatDesc: 'Define structure and deliverables',
    stepReviewTitle: 'Review & Generate',
    stepReviewDesc: 'Review and generate your prompt',
    advancedPromptGenerated: 'Advanced Prompt Generated',
    advancedPromptGeneratedDesc: 'Your advanced prompt has been created successfully',
    tryAgainLater: 'Please try again later',
    multiStepBuilder: 'Multi-Step Builder',
    multiStepBuilderDesc: 'Create advanced prompts step by step',
    generating: 'Generating...',
    generateAdvancedPrompt: 'Generate Advanced Prompt',
    advancedPromptResult: 'Advanced Prompt Result',
    authoritative: 'Authoritative',
    friendly: 'Friendly',
    brief: 'Brief',
    concise: 'Concise',
    detailed: 'Detailed',
    comprehensive: 'Comprehensive',
    extensive: 'Extensive',
    structuredReport: 'Structured Report',
    bulletPoints: 'Bullet Points',
    narrative: 'Narrative',
    stepByStep: 'Step-by-Step',
    qaFormat: 'Q&A Format',
    analytical: 'Analytical',
    descriptive: 'Descriptive',
    comparative: 'Comparative',
    argumentative: 'Argumentative',
    instructional: 'Instructional',
    consultative: 'Consultative',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
    selectTone: 'Select a tone',
    selectLength: 'Select length',
    technicalLevel: 'Technical Level',
    selectTechnicalLevel: 'Select technical level',
    responseFormat: 'Response Format',
    selectFormat: 'Select format',
    writingStyle: 'Writing Style',
    selectStyle: 'Select style',
    stepConstraintsTips: 'Requirements Tips',
    tipConstraints1: 'Choose tone based on your audience',
    tipConstraints2: 'Length affects detail level',
    tipConstraints3: 'Technical level should match user expertise',
    contextBackground: 'Context Background',
    contextBackgroundPlaceholder: 'Provide relevant background information...',
    selectIndustry: 'Select industry',
    contextConstraints: 'Context Constraints',
    addConstraint: 'Add Constraint',
    constraintPlaceholder: 'Enter a constraint...',
    noConstraintsYet: 'No constraints added yet',
    stepContextTips: 'Context Tips',
    tipContext1: 'Provide clear background context',
    tipContext2: 'Define your target audience precisely',
    tipContext3: 'Add relevant constraints and limitations',
    specificTargets: 'Specific Targets',
    addTarget: 'Add Target',
    targetPlaceholder: 'Enter a specific target...',
    noTargetsYet: 'No targets added yet',
    successCriteria: 'Success Criteria',
    successCriteriaPlaceholder: 'How will you measure success?',
    stepObjectiveTips: 'Objective Tips',
    tipObjective1: 'Be specific about your main goal',
    tipObjective2: 'Add measurable targets',
    tipObjective3: 'Define clear success criteria',
    outputStructure: 'Output Structure',
    selectStructure: 'Select structure',
    requiredSections: 'Required Sections',
    addSection: 'Add Section',
    sectionPlaceholder: 'Enter section name...',
    noSectionsYet: 'No sections added yet',
    expectedDeliverables: 'Expected Deliverables',
    addDeliverable: 'Add Deliverable',
    deliverablePlaceholder: 'Enter deliverable...',
    noDeliverablesYet: 'No deliverables added yet',
    stepOutputFormatTips: 'Output Format Tips',
    tipOutputFormat1: 'Choose structure that fits your needs',
    tipOutputFormat2: 'Define specific sections required',
    tipOutputFormat3: 'List all expected deliverables',
    hierarchical: 'Hierarchical',
    sequential: 'Sequential',
    modular: 'Modular',
    matrix: 'Matrix',
    flowchart: 'Flowchart',
    objectiveReview: 'Objective Review',
    contextReview: 'Context Review',
    requirementsReview: 'Requirements Review',
    outputFormatReview: 'Output Format Review',
    notSpecified: 'Not specified',
    readyToGenerate: 'Ready to Generate',
    allRequiredFieldsCompleted: 'All required fields completed',
    almostReady: 'Almost Ready',
    someFieldsMissing: 'Some fields are missing',
    completed: 'Completed',
    finalTips: 'Final Tips',
    finalTip1: 'Review all sections before generating',
    finalTip2: 'Make sure objectives are clear',
    finalTip3: 'Check that context is complete',
    finalTip4: 'Verify output format matches needs',
    technology: 'Technology',
    healthcare: 'Healthcare',
    finance: 'Finance',
    education: 'Education',
    retail: 'Retail',
    manufacturing: 'Manufacturing',
    consulting: 'Consulting',
    media: 'Media',
    other: 'Other'
  },
  fr: {
    welcome: 'Bienvenue dans Prompt Generator Lab',
    description: 'Créez des prompts IA puissants avec notre générateur avancé',
    getStarted: 'Commencer',
    features: 'Fonctionnalités',
    feature1: 'Génération par IA',
    feature2: 'Catégories multiples',
    feature3: 'Facile à utiliser',
    about: 'À propos',
    contact: 'Contact',
    home: 'Accueil',
    promptGeneratorTitle: 'Générateur de Prompts IA',
    promptGeneratorDesc: 'Créez des prompts professionnels adaptés à vos besoins',
    improvementTitle: 'Amélioration de Prompts',
    improvementDesc: 'Améliorez et optimisez vos prompts existants',
    mainCategory: 'Catégorie principale',
    required: '*',
    selectDomain: 'Sélectionner un domaine',
    subcategory: 'Sous-catégorie',
    optional: '(optionnel)',
    chooseSpecialization: 'Choisir une spécialisation',
    taskDescription: 'Description de la tâche',
    taskDescriptionPlaceholder: 'Décrivez ce que vous voulez accomplir...',
    mainObjective: 'Objectif principal',
    mainObjectivePlaceholder: 'Quel est l\'objectif principal ?',
    targetAudience: 'Public cible',
    targetAudiencePlaceholder: 'Qui est le public cible ?',
    outputFormat: 'Format de sortie',
    chooseFormat: 'Choisir un format',
    toneStyle: 'Ton et style',
    chooseTone: 'Choisir un ton',
    approximateLength: 'Longueur approximative',
    chooseLength: 'Choisir la longueur',
    generateWithAI: 'Générer avec IA',
    generatingWithAI: 'Génération...',
    aiGeneratedPrompt: 'Prompt Généré par IA',
    aiGeneratedPromptDesc: 'Votre prompt optimisé prêt à utiliser',
    copy: 'Copier',
    readyForGeneration: 'Prêt pour la génération',
    aiWillCreate: 'L\'IA va créer votre prompt parfait',
    missingInfo: 'Informations manquantes',
    chooseCategoryDesc: 'Veuillez sélectionner une catégorie et décrire votre tâche',
    promptCreatedSuccess: 'Prompt créé !',
    promptCreatedDesc: 'Votre prompt IA a été généré avec succès',
    generationError: 'Erreur de génération',
    copiedSuccess: 'Copié !',
    promptCopiedClipboard: 'Prompt copié dans le presse-papiers',
    generatedByAI: 'Généré par IA',
    aiGeneratedDesc: 'Ce prompt a été créé en utilisant l\'intelligence artificielle',
    contentCreation: 'Création de contenu',
    contentCreationDesc: 'Rédaction, design et production média',
    businessProfessional: 'Business et professionnel',
    businessProfessionalDesc: 'Stratégie, management et tâches d\'entreprise',
    educationTraining: 'Éducation et formation',
    educationTrainingDesc: 'Enseignement, apprentissage et développement des compétences',
    technologyDevelopment: 'Technologie et développement',
    technologyDevelopmentDesc: 'Programmation, systèmes et solutions techniques',
    analysisResearch: 'Analyse et recherche',
    analysisResearchDesc: 'Analyse de données, recherche et insights',
    problemSolving: 'Résolution de problèmes',
    problemSolvingDesc: 'Solutions créatives et prise de décision',
    communicationRelations: 'Communication et relations',
    communicationRelationsDesc: 'Communications interpersonnelles et publiques',
    writing: 'Rédaction',
    artisticCreation: 'Création artistique',
    videoAudio: 'Vidéo et audio',
    marketing: 'Marketing',
    literature: 'Littérature',
    strategy: 'Stratégie',
    communication: 'Communication',
    hr: 'Ressources humaines',
    sales: 'Ventes',
    management: 'Management',
    courses: 'Cours',
    evaluation: 'Évaluation',
    research: 'Recherche',
    pedagogy: 'Pédagogie',
    professionalTraining: 'Formation professionnelle',
    programming: 'Programmation',
    dataScience: 'Science des données',
    cybersecurity: 'Cybersécurité',
    architecture: 'Architecture',
    devops: 'DevOps',
    dataAnalysisSubcat: 'Analyse de données',
    academicResearch: 'Recherche académique',
    competitiveIntelligence: 'Intelligence concurrentielle',
    auditEvaluation: 'Audit et évaluation',
    forecasting: 'Prévision',
    diagnosis: 'Diagnostic',
    brainstorming: 'Brainstorming',
    decisionMaking: 'Prise de décision',
    optimization: 'Optimisation',
    innovation: 'Innovation',
    customerRelations: 'Relations client',
    internalCommunication: 'Communication interne',
    negotiation: 'Négociation',
    presentation: 'Présentation',
    publicRelations: 'Relations publiques',
    bulletList: 'Liste à puces',
    structuredParagraph: 'Paragraphe structuré',
    table: 'Tableau',
    numberedSteps: 'Étapes numérotées',
    dialogue: 'Dialogue',
    codeScript: 'Code/Script',
    professional: 'Professionnel',
    casual: 'Décontracté',
    technical: 'Technique',
    creative: 'Créatif',
    persuasive: 'Persuasif',
    educational: 'Éducatif',
    short: 'Court',
    medium: 'Moyen',
    long: 'Long',
    veryDetailed: 'Très détaillé',
    originalPrompt: 'Prompt original',
    originalPromptPlaceholder: 'Entrez votre prompt à améliorer...',
    improvementObjective: 'Objectif d\'amélioration',
    improvementObjectivePlaceholder: 'Quel aspect spécifique améliorer ?',
    improvePrompt: 'Améliorer le prompt',
    improvingPrompt: 'Amélioration...',
    improvedPrompt: 'Prompt amélioré',
    improvedPromptDesc: 'Votre prompt optimisé et amélioré',
    improvements: 'Améliorations apportées',
    improvementSuccess: 'Amélioration terminée !',
    improvementSuccessDesc: 'Votre prompt a été amélioré avec succès',
    enterOriginalPrompt: 'Veuillez entrer le prompt original à améliorer',
    textGeneration: 'Génération de texte',
    textGenerationDesc: 'Générer différents types de contenu textuel',
    blogPostGenerator: 'Générateur d\'articles de blog',
    imageCreation: 'Création d\'images',
    imageCreationDesc: 'Créer et concevoir du contenu visuel',
    interactiveDialogue: 'Dialogue interactif',
    interactiveDialogueDesc: 'Contenu conversationnel et interactif',
    customerSupportChatbot: 'Chatbot de support client',
    codeGeneration: 'Génération de code',
    codeGenerationDesc: 'Assistance en programmation et développement',
    reactComponentGenerator: 'Générateur de composants React',
    dataAnalysis: 'Analyse de données',
    dataAnalysisDesc: 'Analyser et interpréter les données',
    creativeWriting: 'Écriture créative',
    creativeWritingDesc: 'Écriture créative et artistique',
    blue: 'Bleu',
    green: 'Vert',
    purple: 'Violet',
    orange: 'Orange',
    red: 'Rouge',
    indigo: 'Indigo',
    validationError: 'Erreur de validation',
    nameDescriptionRequired: 'Le nom et la description sont requis',
    categoryCreated: 'Catégorie créée',
    categoryUpdated: 'Catégorie mise à jour',
    categoryDeleted: 'Catégorie supprimée',
    deleteConfirmation: 'Confirmation de suppression',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    save: 'Sauvegarder',
    addCategory: 'Ajouter une catégorie',
    editCategory: 'Modifier la catégorie',
    categoryName: 'Nom de la catégorie',
    categoryDescription: 'Description de la catégorie',
    categoryColor: 'Couleur de la catégorie',
    categoryNamePlaceholder: 'Entrez le nom de la catégorie...',
    categoryDescriptionPlaceholder: 'Entrez la description de la catégorie...',
    createCategory: 'Créer la catégorie',
    updateCategory: 'Mettre à jour la catégorie',
    categoryManagement: 'Gestion des catégories',
    categoryManagementDesc: 'Gérez vos catégories de prompts personnalisées',
    manageCategories: 'Gérer les catégories',
    customCategories: 'Catégories personnalisées',
    noCustomCategories: 'Aucune catégorie personnalisée pour le moment',
    createFirstCategory: 'Créez votre première catégorie personnalisée',
    progress: 'Progrès',
    style: 'Style',
    title: 'Titre',
    format: 'Format',
    step: 'Étape',
    length: 'Longueur',
    next: 'Suivant',
    previous: 'Précédent',
    background: 'Arrière-plan',
    description: 'Description',
    theme: 'Thème',
    createNewCategory: 'Créer nouvelle catégorie',
    colorTheme: 'Thème de couleur',
    exampleUseCases: 'Exemples d\'utilisation',
    update: 'Mettre à jour',
    create: 'Créer',
    categories: 'Catégories',
    french: 'Français',
    arabic: 'Arabe',
    english: 'Anglais',
    stepObjectiveTitle: 'Définir l\'objectif',
    stepObjectiveDesc: 'Fixez des objectifs clairs et des critères de succès',
    stepContextTitle: 'Contexte et arrière-plan',
    stepContextDesc: 'Fournissez le contexte et les contraintes',
    stepConstraintsTitle: 'Exigences et style',
    stepConstraintsDesc: 'Spécifiez le ton, le format et le style',
    stepOutputFormatTitle: 'Format de sortie',
    stepOutputFormatDesc: 'Définissez la structure et les livrables',
    stepReviewTitle: 'Révision et génération',
    stepReviewDesc: 'Révisez et générez votre prompt',
    advancedPromptGenerated: 'Prompt avancé généré',
    advancedPromptGeneratedDesc: 'Votre prompt avancé a été créé avec succès',
    tryAgainLater: 'Veuillez réessayer plus tard',
    multiStepBuilder: 'Constructeur multi-étapes',
    multiStepBuilderDesc: 'Créez des prompts avancés étape par étape',
    generating: 'Génération...',
    generateAdvancedPrompt: 'Générer un prompt avancé',
    advancedPromptResult: 'Résultat du prompt avancé',
    authoritative: 'Autoritaire',
    friendly: 'Amical',
    brief: 'Bref',
    concise: 'Concis',
    detailed: 'Détaillé',
    comprehensive: 'Complet',
    extensive: 'Étendu',
    structuredReport: 'Rapport structuré',
    bulletPoints: 'Points à puces',
    narrative: 'Narratif',
    stepByStep: 'Étape par étape',
    qaFormat: 'Format Q&R',
    analytical: 'Analytique',
    descriptive: 'Descriptif',
    comparative: 'Comparatif',
    argumentative: 'Argumentatif',
    instructional: 'Instructionnel',
    consultative: 'Consultatif',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',
    selectTone: 'Sélectionner un ton',
    selectLength: 'Sélectionner la longueur',
    technicalLevel: 'Niveau technique',
    selectTechnicalLevel: 'Sélectionner le niveau technique',
    responseFormat: 'Format de réponse',
    selectFormat: 'Sélectionner le format',
    writingStyle: 'Style d\'écriture',
    selectStyle: 'Sélectionner le style',
    stepConstraintsTips: 'Conseils sur les exigences',
    tipConstraints1: 'Choisissez le ton selon votre audience',
    tipConstraints2: 'La longueur affecte le niveau de détail',
    tipConstraints3: 'Le niveau technique doit correspondre à l\'expertise utilisateur',
    contextBackground: 'Contexte et arrière-plan',
    contextBackgroundPlaceholder: 'Fournissez des informations contextuelles pertinentes...',
    selectIndustry: 'Sélectionner l\'industrie',
    contextConstraints: 'Contraintes contextuelles',
    addConstraint: 'Ajouter une contrainte',
    constraintPlaceholder: 'Entrez une contrainte...',
    noConstraintsYet: 'Aucune contrainte ajoutée encore',
    stepContextTips: 'Conseils sur le contexte',
    tipContext1: 'Fournissez un contexte d\'arrière-plan clair',
    tipContext2: 'Définissez précisément votre public cible',
    tipContext3: 'Ajoutez des contraintes et limitations pertinentes',
    specificTargets: 'Objectifs spécifiques',
    addTarget: 'Ajouter un objectif',
    targetPlaceholder: 'Entrez un objectif spécifique...',
    noTargetsYet: 'Aucun objectif ajouté encore',
    successCriteria: 'Critères de succès',
    successCriteriaPlaceholder: 'Comment mesurerez-vous le succès ?',
    stepObjectiveTips: 'Conseils sur l\'objectif',
    tipObjective1: 'Soyez spécifique sur votre objectif principal',
    tipObjective2: 'Ajoutez des objectifs mesurables',
    tipObjective3: 'Définissez des critères de succès clairs',
    outputStructure: 'Structure de sortie',
    selectStructure: 'Sélectionner la structure',
    requiredSections: 'Sections requises',
    addSection: 'Ajouter une section',
    sectionPlaceholder: 'Entrez le nom de la section...',
    noSectionsYet: 'Aucune section ajoutée encore',
    expectedDeliverables: 'Livrables attendus',
    addDeliverable: 'Ajouter un livrable',
    deliverablePlaceholder: 'Entrez un livrable...',
    noDeliverablesYet: 'Aucun livrable ajouté encore',
    stepOutputFormatTips: 'Conseils sur le format de sortie',
    tipOutputFormat1: 'Choisissez une structure qui correspond à vos besoins',
    tipOutputFormat2: 'Définissez les sections spécifiques requises',
    tipOutputFormat3: 'Listez tous les livrables attendus',
    hierarchical: 'Hiérarchique',
    sequential: 'Séquentiel',
    modular: 'Modulaire',
    matrix: 'Matrice',
    flowchart: 'Organigramme',
    objectiveReview: 'Révision de l\'objectif',
    contextReview: 'Révision du contexte',
    requirementsReview: 'Révision des exigences',
    outputFormatReview: 'Révision du format de sortie',
    notSpecified: 'Non spécifié',
    readyToGenerate: 'Prêt à générer',
    allRequiredFieldsCompleted: 'Tous les champs requis sont complétés',
    almostReady: 'Presque prêt',
    someFieldsMissing: 'Certains champs manquent',
    completed: 'Complété',
    finalTips: 'Conseils finaux',
    finalTip1: 'Révisez toutes les sections avant de générer',
    finalTip2: 'Assurez-vous que les objectifs sont clairs',
    finalTip3: 'Vérifiez que le contexte est complet',
    finalTip4: 'Vérifiez que le format de sortie correspond aux besoins',
    technology: 'Technologie',
    healthcare: 'Santé',
    finance: 'Finance',
    education: 'Éducation',
    retail: 'Commerce de détail',
    manufacturing: 'Fabrication',
    consulting: 'Conseil',
    media: 'Médias',
    other: 'Autre'
  },
  ar: {
    welcome: 'مرحباً بك في مختبر مولد الـ Prompts',
    description: 'أنشئ prompts قوية للذكاء الاصطناعي باستخدام مولدنا المتقدم',
    getStarted: 'ابدأ الآن',
    features: 'المميزات',
    feature1: 'توليد بالذكاء الاصطناعي',
    feature2: 'فئات متعددة',
    feature3: 'سهل الاستخدام',
    about: 'حول',
    contact: 'اتصل',
    home: 'الرئيسية',
    promptGeneratorTitle: 'مولد Prompts الذكاء الاصطناعي',
    promptGeneratorDesc: 'أنشئ prompts احترافية مصممة لاحتياجاتك',
    improvementTitle: 'تحسين الـ Prompts',
    improvementDesc: 'حسّن وطوّر prompts الموجودة لديك',
    mainCategory: 'الفئة الرئيسية',
    required: '*',
    selectDomain: 'اختر مجالاً',
    subcategory: 'الفئة الفرعية',
    optional: '(اختياري)',
    chooseSpecialization: 'اختر تخصصاً',
    taskDescription: 'وصف المهمة',
    taskDescriptionPlaceholder: 'صف ما تريد إنجازه...',
    mainObjective: 'الهدف الرئيسي',
    mainObjectivePlaceholder: 'ما هو الهدف الرئيسي؟',
    targetAudience: 'الجمهور المستهدف',
    targetAudiencePlaceholder: 'من هو الجمهور المستهدف؟',
    outputFormat: 'تنسيق الإخراج',
    chooseFormat: 'اختر تنسيقاً',
    toneStyle: 'النبرة والأسلوب',
    chooseTone: 'اختر نبرة',
    approximateLength: 'الطول التقريبي',
    chooseLength: 'اختر الطول',
    generateWithAI: 'توليد بالذكاء الاصطناعي',
    generatingWithAI: 'جاري التوليد...',
    aiGeneratedPrompt: 'Prompt مولد بالذكاء الاصطناعي',
    aiGeneratedPromptDesc: 'prompt المحسن جاهز للاستخدام',
    copy: 'نسخ',
    readyForGeneration: 'جاهز للتوليد',
    aiWillCreate: 'الذكاء الاصطناعي سينشئ prompt مثالي لك',
    missingInfo: 'معلومات مفقودة',
    chooseCategoryDesc: 'يرجى اختيار فئة ووصف مهمتك',
    promptCreatedSuccess: 'تم إنشاء الـ Prompt!',
    promptCreatedDesc: 'تم توليد prompt الذكاء الاصطناعي بنجاح',
    generationError: 'خطأ في التوليد',
    copiedSuccess: 'تم النسخ!',
    promptCopiedClipboard: 'تم نسخ الـ Prompt إلى الحافظة',
    generatedByAI: 'مولد بالذكاء الاصطناعي',
    aiGeneratedDesc: 'تم إنشاء هذا الـ prompt باستخدام الذكاء الاصطناعي',
    contentCreation: 'إنشاء المحتوى',
    contentCreationDesc: 'الكتابة والتصميم وإنتاج الوسائط',
    businessProfessional: 'الأعمال والمهنية',
    businessProfessionalDesc: 'الاستراتيجية والإدارة والمهام المؤسسية',
    educationTraining: 'التعليم والتدريب',
    educationTrainingDesc: 'التدريس والتعلم وتطوير المهارات',
    technologyDevelopment: 'التكنولوجيا والتطوير',
    technologyDevelopmentDesc: 'البرمجة والأنظمة والحلول التقنية',
    analysisResearch: 'التحليل والبحث',
    analysisResearchDesc: 'تحليل البيانات والبحث والرؤى',
    problemSolving: 'حل المشاكل',
    problemSolvingDesc: 'الحلول الإبداعية واتخاذ القرارات',
    communicationRelations: 'التواصل والعلاقات',
    communicationRelationsDesc: 'التواصل الشخصي والعام',
    writing: 'الكتابة',
    artisticCreation: 'الإبداع الفني',
    videoAudio: 'الفيديو والصوت',
    marketing: 'التسويق',
    literature: 'الأدب',
    strategy: 'الاستراتيجية',
    communication: 'التواصل',
    hr: 'الموارد البشرية',
    sales: 'المبيعات',
    management: 'الإدارة',
    courses: 'الدورات',
    evaluation: 'التقييم',
    research: 'البحث',
    pedagogy: 'علم التربية',
    professionalTraining: 'التدريب المهني',
    programming: 'البرمجة',
    dataScience: 'علم البيانات',
    cybersecurity: 'الأمن السيبراني',
    architecture: 'الهندسة المعمارية',
    devops: 'DevOps',
    dataAnalysisSubcat: 'تحليل البيانات',
    academicResearch: 'البحث الأكاديمي',
    competitiveIntelligence: 'الذكاء التنافسي',
    auditEvaluation: 'التدقيق والتقييم',
    forecasting: 'التنبؤ',
    diagnosis: 'التشخيص',
    brainstorming: 'العصف الذهني',
    decisionMaking: 'اتخاذ القرارات',
    optimization: 'التحسين',
    innovation: 'الابتكار',
    customerRelations: 'علاقات العملاء',
    internalCommunication: 'التواصل الداخلي',
    negotiation: 'التفاوض',
    presentation: 'العرض',
    publicRelations: 'العلاقات العامة',
    bulletList: 'قائمة نقطية',
    structuredParagraph: 'فقرة منظمة',
    table: 'جدول',
    numberedSteps: 'خطوات مرقمة',
    dialogue: 'حوار',
    codeScript: 'كود/سكريبت',
    professional: 'مهني',
    casual: 'غير رسمي',
    technical: 'تقني',
    creative: 'إبداعي',
    persuasive: 'إقناعي',
    educational: 'تعليمي',
    short: 'قصير',
    medium: 'متوسط',
    long: 'طويل',
    veryDetailed: 'مفصل جداً',
    originalPrompt: 'الـ Prompt الأصلي',
    originalPromptPlaceholder: 'أدخل prompt للتحسين...',
    improvementObjective: 'هدف التحسين',
    improvementObjectivePlaceholder: 'أي جانب محدد للتحسين؟',
    improvePrompt: 'تحسين الـ Prompt',
    improvingPrompt: 'جاري التحسين...',
    improvedPrompt: 'Prompt محسن',
    improvedPromptDesc: 'prompt المحسن والمطور',
    improvements: 'التحسينات المطبقة',
    improvementSuccess: 'اكتمل التحسين!',
    improvementSuccessDesc: 'تم تحسين prompt بنجاح',
    enterOriginalPrompt: 'يرجى إدخال الـ prompt الأصلي للتحسين',
    textGeneration: 'توليد النصوص',
    textGenerationDesc: 'توليد أنواع مختلفة من المحتوى النصي',
    blogPostGenerator: 'مولد مقالات المدونة',
    imageCreation: 'إنشاء الصور',
    imageCreationDesc: 'إنشاء وتصميم المحتوى البصري',
    interactiveDialogue: 'الحوار التفاعلي',
    interactiveDialogueDesc: 'محتوى محادثة وتفاعلي',
    customerSupportChatbot: 'روبوت دعم العملاء',
    codeGeneration: 'توليد الكود',
    codeGenerationDesc: 'مساعدة البرمجة والتطوير',
    reactComponentGenerator: 'مولد مكونات React',
    dataAnalysis: 'تحليل البيانات',
    dataAnalysisDesc: 'تحليل وتفسير البيانات',
    creativeWriting: 'الكتابة الإبداعية',
    creativeWritingDesc: 'الكتابة الإبداعية والفنية',
    blue: 'أزرق',
    green: 'أخضر',
    purple: 'بنفسجي',
    orange: 'برتقالي',
    red: 'أحمر',
    indigo: 'نيلي',
    validationError: 'خطأ في التحقق',
    nameDescriptionRequired: 'الاسم والوصف مطلوبان',
    categoryCreated: 'تم إنشاء الفئة',
    categoryUpdated: 'تم تحديث الفئة',
    categoryDeleted: 'تم حذف الفئة',
    deleteConfirmation: 'تأكيد الحذف',
    confirmDelete: 'هل أنت متأكد من حذف هذه الفئة؟',
    cancel: 'إلغاء',
    edit: 'تحرير',
    delete: 'حذف',
    save: 'حفظ',
    addCategory: 'إضافة فئة',
    editCategory: 'تحرير الفئة',
    categoryName: 'اسم الفئة',
    categoryDescription: 'وصف الفئة',
    categoryColor: 'لون الفئة',
    categoryNamePlaceholder: 'أدخل اسم الفئة...',
    categoryDescriptionPlaceholder: 'أدخل وصف الفئة...',
    createCategory: 'إنشاء الفئة',
    updateCategory: 'تحديث الفئة',
    categoryManagement: 'إدارة الفئات',
    categoryManagementDesc: 'إدارة فئات الـ prompts المخصصة',
    manageCategories: 'إدارة الفئات',
    customCategories: 'الفئات المخصصة',
    noCustomCategories: 'لا توجد فئات مخصصة بعد',
    createFirstCategory: 'أنشئ فئتك المخصصة الأولى',
    progress: 'التقدم',
    style: 'الأسلوب',
    title: 'العنوان',
    format: 'التنسيق',
    step: 'الخطوة',
    length: 'الطول',
    next: 'التالي',
    previous: 'السابق',
    background: 'الخلفية',
    description: 'الوصف',
    theme: 'المظهر',
    createNewCategory: 'إنشاء فئة جديدة',
    colorTheme: 'موضوع اللون',
    exampleUseCases: 'أمثلة على الاستخدام',
    update: 'تحديث',
    create: 'إنشاء',
    categories: 'الفئات',
    french: 'فرنسي',
    arabic: 'عربي',
    english: 'إنجليزي',
    stepObjectiveTitle: 'تحديد الهدف',
    stepObjectiveDesc: 'ضع أهدافاً واضحة ومعايير نجاح',
    stepContextTitle: 'السياق والخلفية',
    stepContextDesc: 'قدم السياق والقيود',
    stepConstraintsTitle: 'المتطلبات والأسلوب',
    stepConstraintsDesc: 'حدد النبرة والتنسيق والأسلوب',
    stepOutputFormatTitle: 'تنسيق الإخراج',
    stepOutputFormatDesc: 'حدد الهيكل والمخرجات',
    stepReviewTitle: 'المراجعة والتوليد',
    stepReviewDesc: 'راجع وولد prompt الخاص بك',
    advancedPromptGenerated: 'تم توليد prompt متقدم',
    advancedPromptGeneratedDesc: 'تم إنشاء prompt المتقدم بنجاح',
    tryAgainLater: 'يرجى المحاولة مرة أخرى لاحقاً',
    multiStepBuilder: 'المنشئ متعدد الخطوات',
    multiStepBuilderDesc: 'أنشئ prompts متقدمة خطوة بخطوة',
    generating: 'جاري التوليد...',
    generateAdvancedPrompt: 'توليد prompt متقدم',
    advancedPromptResult: 'نتيجة الـ prompt المتقدم',
    authoritative: 'موثوق',
    friendly: 'ودود',
    brief: 'موجز',
    concise: 'مقتضب',
    detailed: 'مفصل',
    comprehensive: 'شامل',
    extensive: 'واسع النطاق',
    structuredReport: 'تقرير منظم',
    bulletPoints: 'نقاط',
    narrative: 'سردي',
    stepByStep: 'خطوة بخطوة',
    qaFormat: 'تنسيق سؤال وجواب',
    analytical: 'تحليلي',
    descriptive: 'وصفي',
    comparative: 'مقارن',
    argumentative: 'جدلي',
    instructional: 'تعليمي',
    consultative: 'استشاري',
    beginner: 'مبتدئ',
    intermediate: 'متوسط',
    advanced: 'متقدم',
    expert: 'خبير',
    selectTone: 'اختر النبرة',
    selectLength: 'اختر الطول',
    technicalLevel: 'المستوى التقني',
    selectTechnicalLevel: 'اختر المستوى التقني',
    responseFormat: 'تنسيق الاستجابة',
    selectFormat: 'اختر التنسيق',
    writingStyle: 'أسلوب الكتابة',
    selectStyle: 'اختر الأسلوب',
    stepConstraintsTips: 'نصائح المتطلبات',
    tipConstraints1: 'اختر النبرة حسب جمهورك',
    tipConstraints2: 'الطول يؤثر على مستوى التفصيل',
    tipConstraints3: 'يجب أن يتطابق المستوى التقني مع خبرة المستخدم',
    contextBackground: 'خلفية السياق',
    contextBackgroundPlaceholder: 'قدم معلومات خلفية ذات صلة...',
    selectIndustry: 'اختر الصناعة',
    contextConstraints: 'قيود السياق',
    addConstraint: 'أضف قيد',
    constraintPlaceholder: 'أدخل قيد...',
    noConstraintsYet: 'لم تتم إضافة قيود بعد',
    stepContextTips: 'نصائح السياق',
    tipContext1: 'قدم سياق خلفية واضح',
    tipContext2: 'حدد جمهورك المستهدف بدقة',
    tipContext3: 'أضف قيود وحدود ذات صلة',
    specificTargets: 'أهداف محددة',
    addTarget: 'أضف هدف',
    targetPlaceholder: 'أدخل هدف محدد...',
    noTargetsYet: 'لم تتم إضافة أهداف بعد',
    successCriteria: 'معايير النجاح',
    successCriteriaPlaceholder: 'كيف ستقيس النجاح؟',
    stepObjectiveTips: 'نصائح الهدف',
    tipObjective1: 'كن محدداً حول هدفك الرئيسي',
    tipObjective2: 'أضف أهداف قابلة للقياس',
    tipObjective3: 'حدد معايير نجاح واضحة',
    outputStructure: 'هيكل الإخراج',
    selectStructure: 'اختر الهيكل',
    requiredSections: 'الأقسام المطلوبة',
    addSection: 'أضف قسم',
    sectionPlaceholder: 'أدخل اسم القسم...',
    noSectionsYet: 'لم تتم إضافة أقسام بعد',
    expectedDeliverables: 'المخرجات المتوقعة',
    addDeliverable: 'أضف مخرج',
    deliverablePlaceholder: 'أدخل مخرج...',
    noDeliverablesYet: 'لم تتم إضافة مخرجات بعد',
    stepOutputFormatTips: 'نصائح تنسيق الإخراج',
    tipOutputFormat1: 'اختر هيكل يناسب احتياجاتك',
    tipOutputFormat2: 'حدد الأقسام المحددة المطلوبة',
    tipOutputFormat3: 'اسرد جميع المخرجات المتوقعة',
    hierarchical: 'هرمي',
    sequential: 'متسلسل',
    modular: 'معياري',
    matrix: 'مصفوفة',
    flowchart: 'مخطط انسيابي',
    objectiveReview: 'مراجعة الهدف',
    contextReview: 'مراجعة السياق',
    requirementsReview: 'مراجعة المتطلبات',
    outputFormatReview: 'مراجعة تنسيق الإخراج',
    notSpecified: 'غير محدد',
    readyToGenerate: 'جاهز للتوليد',
    allRequiredFieldsCompleted: 'تم إكمال جميع الحقول المطلوبة',
    almostReady: 'شبه جاهز',
    someFieldsMissing: 'بعض الحقول مفقودة',
    completed: 'مكتمل',
    finalTips: 'نصائح نهائية',
    finalTip1: 'راجع جميع الأقسام قبل التوليد',
    finalTip2: 'تأكد من وضوح الأهداف',
    finalTip3: 'تحقق من اكتمال السياق',
    finalTip4: 'تحقق من أن تنسيق الإخراج يطابق الاحتياجات',
    technology: 'التكنولوجيا',
    healthcare: 'الرعاية الصحية',
    finance: 'المالية',
    education: 'التعليم',
    retail: 'البيع بالتجزئة',
    manufacturing: 'التصنيع',
    consulting: 'الاستشارات',
    media: 'الإعلام',
    other: 'أخرى'
  }
} as const;

export default translations;

export interface TranslationKey {
  // Existing keys
  title: string;
  subtitle: string;
  generator: string;
  improvement: string;
  advanced: string;
  library: string;
  categories: string;
  integration: string;
  advancedAI: string;
  noCode: string;
  
  // Language selector keys
  english: string;
  french: string;
  arabic: string;
  
  // Category Manager keys
  textGeneration: string;
  textGenerationDesc: string;
  imageCreation: string;
  imageCreationDesc: string;
  interactiveDialogue: string;
  interactiveDialogueDesc: string;
  codeGeneration: string;
  codeGenerationDesc: string;
  dataAnalysis: string;
  dataAnalysisDesc: string;
  marketingAutomation: string;
  marketingAutomationDesc: string;
  creativeWriting: string;
  creativeWritingDesc: string;
  blogPostGenerator: string;
  customerSupportChatbot: string;
  reactComponentGenerator: string;
  
  // Colors
  blue: string;
  green: string;
  purple: string;
  orange: string;
  red: string;
  indigo: string;
  
  // Category Manager UI
  validationError: string;
  nameDescriptionRequired: string;
  categoryCreated: string;
  categoryUpdated: string;
  categoryDeleted: string;
  addNewCategory: string;
  editCategory: string;
  deleteCategory: string;
  confirmDelete: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  categoryName: string;
  categoryDescription: string;
  examples: string;
  color: string;
  addCategory: string;
  updateCategory: string;
  
  // Multi-step builder keys
  stepTitle: string;
  stepDescription: string;
  objectiveStep: string;
  objectiveStepDesc: string;
  contextStep: string;
  contextStepDesc: string;
  outputFormatStep: string;
  outputFormatStepDesc: string;
  constraintsStep: string;
  constraintsStepDesc: string;
  reviewStep: string;
  reviewStepDesc: string;
  editStep: string;
  editStepDesc: string;
  nextStep: string;
  previousStep: string;
  generatePrompt: string;
  objective: string;
  objectivePlaceholder: string;
  context: string;
  contextPlaceholder: string;
  technicalConstraints: string;
  technicalConstraintsPlaceholder: string;
  qualityRequirements: string;
  qualityRequirementsPlaceholder: string;
  timeConstraints: string;
  timeConstraintsPlaceholder: string;
  budgetConstraints: string;
  budgetConstraintsPlaceholder: string;
  finalPrompt: string;
  finalPromptDesc: string;
  generateFinalPrompt: string;
  generatingFinalPrompt: string;
  multiStepTitle: string;
  multiStepDesc: string;
  
  // Generator keys
  promptGeneratorTitle: string;
  promptGeneratorDesc: string;
  mainCategory: string;
  required: string;
  optional: string;
  selectDomain: string;
  subcategory: string;
  chooseSpecialization: string;
  taskDescription: string;
  taskDescriptionPlaceholder: string;
  mainObjective: string;
  mainObjectivePlaceholder: string;
  targetAudience: string;
  targetAudiencePlaceholder: string;
  outputFormat: string;
  chooseFormat: string;
  toneStyle: string;
  chooseTone: string;
  approximateLength: string;
  chooseLength: string;
  generateWithAI: string;
  generatingWithAI: string;
  aiGeneratedPrompt: string;
  aiGeneratedPromptDesc: string;
  copy: string;
  readyForGeneration: string;
  aiWillCreate: string;
  generatedByAI: string;
  aiGeneratedDesc: string;
  
  // Improvement keys
  improvementTitle: string;
  improvementDesc: string;
  originalPrompt: string;
  originalPromptPlaceholder: string;
  improvementObjective: string;
  improvementObjectivePlaceholder: string;
  improvePrompt: string;
  improvingPrompt: string;
  improvedPrompt: string;
  improvedPromptDesc: string;
  improvements: string;
  
  // Categories
  contentCreation: string;
  contentCreationDesc: string;
  businessProfessional: string;
  businessProfessionalDesc: string;
  educationTraining: string;
  educationTrainingDesc: string;
  technologyDevelopment: string;
  technologyDevelopmentDesc: string;
  analysisResearch: string;
  analysisResearchDesc: string;
  problemSolving: string;
  problemSolvingDesc: string;
  communicationRelations: string;
  communicationRelationsDesc: string;
  
  // Subcategories
  writing: string;
  artisticCreation: string;
  videoAudio: string;
  marketing: string;
  literature: string;
  strategy: string;
  communication: string;
  hr: string;
  sales: string;
  management: string;
  courses: string;
  evaluation: string;
  research: string;
  pedagogy: string;
  professionalTraining: string;
  programming: string;
  dataScience: string;
  cybersecurity: string;
  architecture: string;
  devops: string;
  dataAnalysisSubcat: string;
  academicResearch: string;
  competitiveIntelligence: string;
  auditEvaluation: string;
  forecasting: string;
  diagnosis: string;
  brainstorming: string;
  decisionMaking: string;
  optimization: string;
  innovation: string;
  customerRelations: string;
  internalCommunication: string;
  negotiation: string;
  presentation: string;
  publicRelations: string;
  
  // Formats
  bulletList: string;
  structuredParagraph: string;
  table: string;
  numberedSteps: string;
  dialogue: string;
  codeScript: string;
  
  // Tones
  professional: string;
  casual: string;
  technical: string;
  creative: string;
  persuasive: string;
  educational: string;
  
  // Lengths
  short: string;
  medium: string;
  long: string;
  veryDetailed: string;
  
  // Messages
  missingInfo: string;
  chooseCategoryDesc: string;
  enterOriginalPrompt: string;
  promptCreatedSuccess: string;
  promptCreatedDesc: string;
  generationError: string;
  copiedSuccess: string;
  promptCopiedClipboard: string;
  improvementSuccess: string;
  improvementSuccessDesc: string;
}

export const translations: Record<string, TranslationKey> = {
  en: {
    title: "AutoPrompt",
    subtitle: "Create optimized prompts with AI assistance",
    generator: "Generator",
    improvement: "Improvement",
    advanced: "Advanced",
    library: "Library",
    categories: "Categories",
    integration: "Integration",
    advancedAI: "Advanced AI",
    noCode: "No Code",
    
    // Language selector keys
    english: "English",
    french: "French",
    arabic: "Arabic",
    
    // Category Manager keys
    textGeneration: "Text Generation",
    textGenerationDesc: "Create written content with AI assistance",
    imageCreation: "Image Creation",
    imageCreationDesc: "Generate and edit images using AI",
    interactiveDialogue: "Interactive Dialogue",
    interactiveDialogueDesc: "Build conversational AI systems",
    codeGeneration: "Code Generation",
    codeGenerationDesc: "Automatic programming and development",
    dataAnalysis: "Data Analysis",
    dataAnalysisDesc: "Extract insights from data with AI",
    marketingAutomation: "Marketing Automation",
    marketingAutomationDesc: "Automate marketing campaigns and content",
    creativeWriting: "Creative Writing",
    creativeWritingDesc: "Write creative stories, poetry, and fiction",
    blogPostGenerator: "Blog Post Generator",
    customerSupportChatbot: "Customer Support Chatbot",
    reactComponentGenerator: "React Component Generator",
    
    // Colors
    blue: "Blue",
    green: "Green",
    purple: "Purple",
    orange: "Orange",
    red: "Red",
    indigo: "Indigo",
    
    // Category Manager UI
    validationError: "Validation Error",
    nameDescriptionRequired: "Name and description are required",
    categoryCreated: "Category Created",
    categoryUpdated: "Category Updated",
    categoryDeleted: "Category Deleted",
    addNewCategory: "Add New Category",
    editCategory: "Edit Category",
    deleteCategory: "Delete Category",
    confirmDelete: "Are you sure you want to delete this category?",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    categoryName: "Category Name",
    categoryDescription: "Category Description",
    examples: "Examples",
    color: "Color",
    addCategory: "Add Category",
    updateCategory: "Update Category",
    
    // Multi-step builder keys
    stepTitle: "Step",
    stepDescription: "Description",
    objectiveStep: "Objective",
    objectiveStepDesc: "Define your main goal and objective",
    contextStep: "Context",
    contextStepDesc: "Provide background information and context",
    outputFormatStep: "Output Format",
    outputFormatStepDesc: "Choose the desired output format",
    constraintsStep: "Constraints",
    constraintsStepDesc: "Define limitations and requirements",
    reviewStep: "Review",
    reviewStepDesc: "Review and finalize your prompt",
    editStep: "Edit",
    editStepDesc: "Edit and modify the prompt",
    nextStep: "Next Step",
    previousStep: "Previous Step",
    generatePrompt: "Generate Prompt",
    objective: "Objective",
    objectivePlaceholder: "Describe your main objective...",
    context: "Context",
    contextPlaceholder: "Provide relevant context and background...",
    technicalConstraints: "Technical Constraints",
    technicalConstraintsPlaceholder: "Specify technical requirements...",
    qualityRequirements: "Quality Requirements",
    qualityRequirementsPlaceholder: "Define quality standards...",
    timeConstraints: "Time Constraints",
    timeConstraintsPlaceholder: "Specify time limitations...",
    budgetConstraints: "Budget Constraints",
    budgetConstraintsPlaceholder: "Define budget limitations...",
    finalPrompt: "Final Prompt",
    finalPromptDesc: "Your complete multi-step prompt",
    generateFinalPrompt: "Generate Final Prompt",
    generatingFinalPrompt: "Generating final prompt...",
    multiStepTitle: "Multi-Step Prompt Builder",
    multiStepDesc: "Create complex prompts with guided steps",
    
    promptGeneratorTitle: "AI Prompt Generator",
    promptGeneratorDesc: "Create professional prompts tailored to your needs",
    mainCategory: "Main Category",
    required: "(Required)",
    optional: "(Optional)",
    selectDomain: "Select a domain",
    subcategory: "Subcategory",
    chooseSpecialization: "Choose a specialization",
    taskDescription: "Task Description",
    taskDescriptionPlaceholder: "Describe what you want to accomplish...",
    mainObjective: "Main Objective",
    mainObjectivePlaceholder: "What is your main goal?",
    targetAudience: "Target Audience",
    targetAudiencePlaceholder: "Who is this for?",
    outputFormat: "Output Format",
    chooseFormat: "Choose format",
    toneStyle: "Tone & Style",
    chooseTone: "Choose tone",
    approximateLength: "Approximate Length",
    chooseLength: "Choose length",
    generateWithAI: "Generate with AI",
    generatingWithAI: "Generating with AI...",
    aiGeneratedPrompt: "AI Generated Prompt",
    aiGeneratedPromptDesc: "Your optimized prompt is ready",
    copy: "Copy",
    readyForGeneration: "Ready for generation",
    aiWillCreate: "AI will create your perfect prompt",
    generatedByAI: "Generated by AI",
    aiGeneratedDesc: "This prompt was created by artificial intelligence",
    
    improvementTitle: "Prompt Improvement",
    improvementDesc: "Enhance existing prompts with AI optimization",
    originalPrompt: "Original Prompt",
    originalPromptPlaceholder: "Enter your current prompt...",
    improvementObjective: "Improvement Objective",
    improvementObjectivePlaceholder: "What aspect should be improved?",
    improvePrompt: "Improve Prompt",
    improvingPrompt: "Improving prompt...",
    improvedPrompt: "Improved Prompt",
    improvedPromptDesc: "Your enhanced prompt with improvements",
    improvements: "Improvements Made",
    
    contentCreation: "Content Creation",
    contentCreationDesc: "Writing, design, media production",
    businessProfessional: "Business & Professional",
    businessProfessionalDesc: "Strategy, management, communication",
    educationTraining: "Education & Training",
    educationTrainingDesc: "Learning, teaching, skill development",
    technologyDevelopment: "Technology & Development",
    technologyDevelopmentDesc: "Programming, systems, innovation",
    analysisResearch: "Analysis & Research",
    analysisResearchDesc: "Data analysis, studies, investigations",
    problemSolving: "Problem Solving",
    problemSolvingDesc: "Solutions, optimization, innovation",
    communicationRelations: "Communication & Relations",
    communicationRelationsDesc: "Interaction, relationships, collaboration",
    
    writing: "Writing",
    artisticCreation: "Artistic Creation",
    videoAudio: "Video & Audio",
    marketing: "Marketing",
    literature: "Literature",
    strategy: "Strategy",
    communication: "Communication",
    hr: "Human Resources",
    sales: "Sales",
    management: "Management",
    courses: "Courses",
    evaluation: "Evaluation",
    research: "Research",
    pedagogy: "Pedagogy",
    professionalTraining: "Professional Training",
    programming: "Programming",
    dataScience: "Data Science",
    cybersecurity: "Cybersecurity",
    architecture: "Architecture",
    devops: "DevOps",
    dataAnalysisSubcat: "Data Analysis",
    academicResearch: "Academic Research",
    competitiveIntelligence: "Competitive Intelligence",
    auditEvaluation: "Audit & Evaluation",
    forecasting: "Forecasting",
    diagnosis: "Diagnosis",
    brainstorming: "Brainstorming",
    decisionMaking: "Decision Making",
    optimization: "Optimization",
    innovation: "Innovation",
    customerRelations: "Customer Relations",
    internalCommunication: "Internal Communication",
    negotiation: "Negotiation",
    presentation: "Presentation",
    publicRelations: "Public Relations",
    
    bulletList: "Bullet List",
    structuredParagraph: "Structured Paragraph",
    table: "Table",
    numberedSteps: "Numbered Steps",
    dialogue: "Dialogue",
    codeScript: "Code/Script",
    
    professional: "Professional",
    casual: "Casual",
    technical: "Technical",
    creative: "Creative",
    persuasive: "Persuasive",
    educational: "Educational",
    
    short: "Short",
    medium: "Medium",
    long: "Long",
    veryDetailed: "Very Detailed",
    
    missingInfo: "Missing Information",
    chooseCategoryDesc: "Please choose a category and provide a description",
    enterOriginalPrompt: "Please enter your original prompt",
    promptCreatedSuccess: "Prompt Created Successfully",
    promptCreatedDesc: "Your optimized prompt is ready to use",
    generationError: "Generation Error",
    copiedSuccess: "Copied Successfully",
    promptCopiedClipboard: "Prompt copied to clipboard",
    improvementSuccess: "Improvement Successful",
    improvementSuccessDesc: "Your prompt has been enhanced"
  },
  fr: {
    title: "AutoPrompt",
    subtitle: "Créez des prompts optimisés avec l'assistance IA",
    generator: "Générateur",
    improvement: "Amélioration",
    advanced: "Avancé",
    library: "Bibliothèque",
    categories: "Catégories",
    integration: "Intégration",
    advancedAI: "IA Avancée",
    noCode: "Sans Code",
    
    // Language selector keys
    english: "Anglais",
    french: "Français",
    arabic: "Arabe",
    
    // Category Manager keys
    textGeneration: "Génération de Texte",
    textGenerationDesc: "Créer du contenu écrit avec l'assistance IA",
    imageCreation: "Création d'Images",
    imageCreationDesc: "Générer et éditer des images avec l'IA",
    interactiveDialogue: "Dialogue Interactif",
    interactiveDialogueDesc: "Construire des systèmes IA conversationnels",
    codeGeneration: "Génération de Code",
    codeGenerationDesc: "Programmation et développement automatique",
    dataAnalysis: "Analyse de Données",
    dataAnalysisDesc: "Extraire des insights de données avec l'IA",
    marketingAutomation: "Automatisation Marketing",
    marketingAutomationDesc: "Automatiser les campagnes et contenus marketing",
    blogPostGenerator: "Générateur d'Articles de Blog",
    customerSupportChatbot: "Chatbot Support Client",
    reactComponentGenerator: "Générateur de Composants React",
    
    // Multi-step builder keys
    stepTitle: "Étape",
    stepDescription: "Description",
    objectiveStep: "Objectif",
    objectiveStepDesc: "Définir votre objectif principal",
    contextStep: "Contexte",
    contextStepDesc: "Fournir des informations contextuelles",
    outputFormatStep: "Format de Sortie",
    outputFormatStepDesc: "Choisir le format de sortie désiré",
    constraintsStep: "Contraintes",
    constraintsStepDesc: "Définir les limitations et exigences",
    reviewStep: "Révision",
    reviewStepDesc: "Réviser et finaliser votre prompt",
    editStep: "Édition",
    editStepDesc: "Éditer et modifier le prompt",
    nextStep: "Étape Suivante",
    previousStep: "Étape Précédente",
    generatePrompt: "Générer le Prompt",
    objective: "Objectif",
    objectivePlaceholder: "Décrivez votre objectif principal...",
    context: "Contexte",
    contextPlaceholder: "Fournir le contexte et les informations pertinentes...",
    technicalConstraints: "Contraintes Techniques",
    technicalConstraintsPlaceholder: "Spécifier les exigences techniques...",
    qualityRequirements: "Exigences de Qualité",
    qualityRequirementsPlaceholder: "Définir les standards de qualité...",
    timeConstraints: "Contraintes de Temps",
    timeConstraintsPlaceholder: "Spécifier les limitations de temps...",
    budgetConstraints: "Contraintes Budgétaires",
    budgetConstraintsPlaceholder: "Définir les limitations budgétaires...",
    finalPrompt: "Prompt Final",
    finalPromptDesc: "Votre prompt multi-étapes complet",
    generateFinalPrompt: "Générer le Prompt Final",
    generatingFinalPrompt: "Génération du prompt final...",
    multiStepTitle: "Constructeur de Prompt Multi-Étapes",
    multiStepDesc: "Créer des prompts complexes avec des étapes guidées",
    
    promptGeneratorTitle: "Générateur de Prompts IA",
    promptGeneratorDesc: "Créez des prompts professionnels adaptés à vos besoins",
    mainCategory: "Catégorie Principale",
    required: "(Requis)",
    optional: "(Optionnel)",
    selectDomain: "Sélectionnez un domaine",
    subcategory: "Sous-catégorie",
    chooseSpecialization: "Choisissez une spécialisation",
    taskDescription: "Description de la Tâche",
    taskDescriptionPlaceholder: "Décrivez ce que vous voulez accomplir...",
    mainObjective: "Objectif Principal",
    mainObjectivePlaceholder: "Quel est votre objectif principal ?",
    targetAudience: "Public Cible",
    targetAudiencePlaceholder: "Pour qui est-ce destiné ?",
    outputFormat: "Format de Sortie",
    chooseFormat: "Choisir le format",
    toneStyle: "Ton et Style",
    chooseTone: "Choisir le ton",
    approximateLength: "Longueur Approximative",
    chooseLength: "Choisir la longueur",
    generateWithAI: "Générer avec l'IA",
    generatingWithAI: "Génération avec l'IA...",
    aiGeneratedPrompt: "Prompt Généré par l'IA",
    aiGeneratedPromptDesc: "Votre prompt optimisé est prêt",
    copy: "Copier",
    readyForGeneration: "Prêt pour la génération",
    aiWillCreate: "L'IA va créer votre prompt parfait",
    generatedByAI: "Généré par l'IA",
    aiGeneratedDesc: "Ce prompt a été créé par intelligence artificielle",
    
    improvementTitle: "Amélioration de Prompt",
    improvementDesc: "Améliorez vos prompts existants avec l'optimisation IA",
    originalPrompt: "Prompt Original",
    originalPromptPlaceholder: "Entrez votre prompt actuel...",
    improvementObjective: "Objectif d'Amélioration",
    improvementObjectivePlaceholder: "Quel aspect doit être amélioré ?",
    improvePrompt: "Améliorer le Prompt",
    improvingPrompt: "Amélioration du prompt...",
    improvedPrompt: "Prompt Amélioré",
    improvedPromptDesc: "Votre prompt amélioré avec des optimisations",
    improvements: "Améliorations Apportées",
    
    contentCreation: "Création de Contenu",
    contentCreationDesc: "Rédaction, design, production média",
    businessProfessional: "Business et Professionnel",
    businessProfessionalDesc: "Stratégie, management, communication",
    educationTraining: "Éducation et Formation",
    educationTrainingDesc: "Apprentissage, enseignement, développement de compétences",
    technologyDevelopment: "Technologie et Développement",
    technologyDevelopmentDesc: "Programmation, systèmes, innovation",
    analysisResearch: "Analyse et Recherche",
    analysisResearchDesc: "Analyse de données, études, investigations",
    problemSolving: "Résolution de Problèmes",
    problemSolvingDesc: "Solutions, optimisation, innovation",
    communicationRelations: "Communication et Relations",
    communicationRelationsDesc: "Interaction, relations, collaboration",
    
    writing: "Rédaction",
    artisticCreation: "Création Artistique",
    videoAudio: "Vidéo et Audio",
    marketing: "Marketing",
    literature: "Littérature",
    strategy: "Stratégie",
    communication: "Communication",
    hr: "Ressources Humaines",
    sales: "Ventes",
    management: "Management",
    courses: "Cours",
    evaluation: "Évaluation",
    research: "Recherche",
    pedagogy: "Pédagogie",
    professionalTraining: "Formation Professionnelle",
    programming: "Programmation",
    dataScience: "Science des Données",
    cybersecurity: "Cybersécurité",
    architecture: "Architecture",
    devops: "DevOps",
    dataAnalysisSubcat: "Analyse de Données",
    academicResearch: "Recherche Académique",
    competitiveIntelligence: "Intelligence Concurrentielle",
    auditEvaluation: "Audit et Évaluation",
    forecasting: "Prévision",
    diagnosis: "Diagnostic",
    brainstorming: "Brainstorming",
    decisionMaking: "Prise de Décision",
    optimization: "Optimisation",
    innovation: "Innovation",
    customerRelations: "Relations Client",
    internalCommunication: "Communication Interne",
    negotiation: "Négociation",
    presentation: "Présentation",
    publicRelations: "Relations Publiques",
    
    bulletList: "Liste à Puces",
    structuredParagraph: "Paragraphe Structuré",
    table: "Tableau",
    numberedSteps: "Étapes Numérotées",
    dialogue: "Dialogue",
    codeScript: "Code/Script",
    
    professional: "Professionnel",
    casual: "Décontracté",
    technical: "Technique",
    creative: "Créatif",
    persuasive: "Persuasif",
    educational: "Éducatif",
    
    short: "Court",
    medium: "Moyen",
    long: "Long",
    veryDetailed: "Très Détaillé",
    
    missingInfo: "Informations Manquantes",
    chooseCategoryDesc: "Veuillez choisir une catégorie et fournir une description",
    enterOriginalPrompt: "Veuillez entrer votre prompt original",
    promptCreatedSuccess: "Prompt Créé avec Succès",
    promptCreatedDesc: "Votre prompt optimisé est prêt à être utilisé",
    generationError: "Erreur de Génération",
    copiedSuccess: "Copié avec Succès",
    promptCopiedClipboard: "Prompt copié dans le presse-papiers",
    improvementSuccess: "Amélioration Réussie",
    improvementSuccessDesc: "Votre prompt a été amélioré"
  },
  ar: {
    title: "AutoPrompt",
    subtitle: "إنشاء نصوص توجيهية محسنة بمساعدة الذكاء الاصطناعي",
    generator: "المولد",
    improvement: "التحسين",
    advanced: "متقدم",
    library: "المكتبة",
    categories: "الفئات",
    integration: "التكامل",
    advancedAI: "ذكاء اصطناعي متقدم",
    noCode: "بدون كود",
    
    // Language selector keys
    english: "الإنجليزية",
    french: "الفرنسية",
    arabic: "العربية",
    
    // Category Manager keys
    textGeneration: "إنتاج النصوص",
    textGenerationDesc: "إنشاء محتوى مكتوب بمساعدة الذكاء الاصطناعي",
    imageCreation: "إنشاء الصور",
    imageCreationDesc: "توليد وتحرير الصور باستخدام الذكاء الاصطناعي",
    interactiveDialogue: "الحوار التفاعلي",
    interactiveDialogueDesc: "بناء أنظمة ذكاء اصطناعي محادثة",
    codeGeneration: "إنتاج الكود",
    codeGenerationDesc: "البرمجة والتطوير التلقائي",
    dataAnalysis: "تحليل البيانات",
    dataAnalysisDesc: "استخراج الرؤى من البيانات بالذكاء الاصطناعي",
    marketingAutomation: "أتمتة التسويق",
    marketingAutomationDesc: "أتمتة الحملات والمحتوى التسويقي",
    blogPostGenerator: "مولد مقالات المدونة",
    customerSupportChatbot: "روبوت دعم العملاء",
    reactComponentGenerator: "مولد مكونات React",
    
    // Multi-step builder keys
    stepTitle: "خطوة",
    stepDescription: "الوصف",
    objectiveStep: "الهدف",
    objectiveStepDesc: "تحديد هدفك الرئيسي",
    contextStep: "السياق",
    contextStepDesc: "توفير معلومات السياق والخلفية",
    outputFormatStep: "تنسيق الإخراج",
    outputFormatStepDesc: "اختيار تنسيق الإخراج المطلوب",
    constraintsStep: "القيود",
    constraintsStepDesc: "تحديد القيود والمتطلبات",
    reviewStep: "المراجعة",
    reviewStepDesc: "مراجعة وإنهاء النص التوجيهي",
    editStep: "التحرير",
    editStepDesc: "تحرير وتعديل النص التوجيهي",
    nextStep: "الخطوة التالية",
    previousStep: "الخطوة السابقة",
    generatePrompt: "إنتاج النص التوجيهي",
    objective: "الهدف",
    objectivePlaceholder: "اوصف هدفك الرئيسي...",
    context: "السياق",
    contextPlaceholder: "قدم السياق والمعلومات ذات الصلة...",
    technicalConstraints: "القيود التقنية",
    technicalConstraintsPlaceholder: "حدد المتطلبات التقنية...",
    qualityRequirements: "متطلبات الجودة",
    qualityRequirementsPlaceholder: "حدد معايير الجودة...",
    timeConstraints: "قيود الوقت",
    timeConstraintsPlaceholder: "حدد قيود الوقت...",
    budgetConstraints: "قيود الميزانية",
    budgetConstraintsPlaceholder: "حدد قيود الميزانية...",
    finalPrompt: "النص التوجيهي النهائي",
    finalPromptDesc: "نصك التوجيهي متعدد الخطوات الكامل",
    generateFinalPrompt: "إنتاج النص التوجيهي النهائي",
    generatingFinalPrompt: "جاري إنتاج النص التوجيهي النهائي...",
    multiStepTitle: "منشئ النص التوجيهي متعدد الخطوات",
    multiStepDesc: "إنشاء نصوص توجيهية معقدة بخطوات موجهة",
    
    promptGeneratorTitle: "مولد النصوص التوجيهية بالذكاء الاصطناعي",
    promptGeneratorDesc: "إنشاء نصوص توجيهية احترافية مخصصة لاحتياجاتك",
    mainCategory: "الفئة الرئيسية",
    required: "(مطلوب)",
    optional: "(اختياري)",
    selectDomain: "اختر مجالاً",
    subcategory: "الفئة الفرعية",
    chooseSpecialization: "اختر التخصص",
    taskDescription: "وصف المهمة",
    taskDescriptionPlaceholder: "صف ما تريد إنجازه...",
    mainObjective: "الهدف الرئيسي",
    mainObjectivePlaceholder: "ما هو هدفك الرئيسي؟",
    targetAudience: "الجمهور المستهدف",
    targetAudiencePlaceholder: "لمن هذا؟",
    outputFormat: "تنسيق الإخراج",
    chooseFormat: "اختر التنسيق",
    toneStyle: "النبرة والأسلوب",
    chooseTone: "اختر النبرة",
    approximateLength: "الطول التقريبي",
    chooseLength: "اختر الطول",
    generateWithAI: "إنتاج بالذكاء الاصطناعي",
    generatingWithAI: "جاري الإنتاج بالذكاء الاصطناعي...",
    aiGeneratedPrompt: "نص توجيهي مُنتج بالذكاء الاصطناعي",
    aiGeneratedPromptDesc: "نصك التوجيهي المحسن جاهز",
    copy: "نسخ",
    readyForGeneration: "جاهز للإنتاج",
    aiWillCreate: "الذكاء الاصطناعي سينشئ نصك التوجيهي المثالي",
    generatedByAI: "مُنتج بالذكاء الاصطناعي",
    aiGeneratedDesc: "هذا النص التوجيهي تم إنشاؤه بواسطة الذكاء الاصطناعي",
    
    improvementTitle: "تحسين النص التوجيهي",
    improvementDesc: "حسن النصوص التوجيهية الموجودة بالتحسين بالذكاء الاصطناعي",
    originalPrompt: "النص التوجيهي الأصلي",
    originalPromptPlaceholder: "أدخل نصك التوجيهي الحالي...",
    improvementObjective: "هدف التحسين",
    improvementObjectivePlaceholder: "ما الجانب الذي يجب تحسينه؟",
    improvePrompt: "حسن النص التوجيهي",
    improvingPrompt: "جاري تحسين النص التوجيهي...",
    improvedPrompt: "النص التوجيهي المحسن",
    improvedPromptDesc: "نصك التوجيهي المحسن مع التحسينات",
    improvements: "التحسينات المُدخلة",
    
    contentCreation: "إنشاء المحتوى",
    contentCreationDesc: "الكتابة، التصميم، إنتاج الوسائط",
    businessProfessional: "الأعمال والمهني",
    businessProfessionalDesc: "الإستراتيجية، الإدارة، التواصل",
    educationTraining: "التعليم والتدريب",
    educationTrainingDesc: "التعلم، التدريس، تطوير المهارات",
    technologyDevelopment: "التكنولوجيا والتطوير",
    technologyDevelopmentDesc: "البرمجة، الأنظمة، الابتكار",
    analysisResearch: "التحليل والبحث",
    analysisResearchDesc: "تحليل البيانات، الدراسات، التحقيقات",
    problemSolving: "حل المشكلات",
    problemSolvingDesc: "الحلول، التحسين، الابتكار",
    communicationRelations: "التواصل والعلاقات",
    communicationRelationsDesc: "التفاعل، العلاقات، التعاون",
    
    writing: "الكتابة",
    artisticCreation: "الإبداع الفني",
    videoAudio: "الفيديو والصوت",
    marketing: "التسويق",
    literature: "الأدب",
    strategy: "الإستراتيجية",
    communication: "التواصل",
    hr: "الموارد البشرية",
    sales: "المبيعات",
    management: "الإدارة",
    courses: "الدورات",
    evaluation: "التقييم",
    research: "البحث",
    pedagogy: "علم التربية",
    professionalTraining: "التدريب المهني",
    programming: "البرمجة",
    dataScience: "علم البيانات",
    cybersecurity: "الأمن السيبراني",
    architecture: "الهندسة المعمارية",
    devops: "DevOps",
    dataAnalysisSubcat: "تحليل البيانات",
    academicResearch: "البحث الأكاديمي",
    competitiveIntelligence: "الذكاء التنافسي",
    auditEvaluation: "التدقيق والتقييم",
    forecasting: "التنبؤ",
    diagnosis: "التشخيص",
    brainstorming: "العصف الذهني",
    decisionMaking: "اتخاذ القرار",
    optimization: "التحسين",
    innovation: "الابتكار",
    customerRelations: "علاقات العملاء",
    internalCommunication: "التواصل الداخلي",
    negotiation: "التفاوض",
    presentation: "العرض التقديمي",
    publicRelations: "العلاقات العامة",
    
    bulletList: "قائمة نقطية",
    structuredParagraph: "فقرة منظمة",
    table: "جدول",
    numberedSteps: "خطوات مرقمة",
    dialogue: "حوار",
    codeScript: "كود/نص برمجي",
    
    professional: "مهني",
    casual: "غير رسمي",
    technical: "تقني",
    creative: "إبداعي",
    persuasive: "إقناعي",
    educational: "تعليمي",
    
    short: "قصير",
    medium: "متوسط",
    long: "طويل",
    veryDetailed: "مفصل جداً",
    
    missingInfo: "معلومات مفقودة",
    chooseCategoryDesc: "يرجى اختيار فئة وتقديم وصف",
    enterOriginalPrompt: "يرجى إدخال نصك التوجيهي الأصلي",
    promptCreatedSuccess: "تم إنشاء النص التوجيهي بنجاح",
    promptCreatedDesc: "نصك التوجيهي المحسن جاهز للاستخدام",
    generationError: "خطأ في الإنتاج",
    copiedSuccess: "تم النسخ بنجاح",
    promptCopiedClipboard: "تم نسخ النص التوجيهي إلى الحافظة",
    improvementSuccess: "تم التحسين بنجاح",
    improvementSuccessDesc: "تم تحسين نصك التوجيهي"
  }
};

export default translations;

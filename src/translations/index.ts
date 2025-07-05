
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
  | 'hr'
  | 'progress'
  | 'style'
  | 'table'
  | 'title'
  | 'format'
  | 'required'
  | 'step'
  | 'length'
  | 'next'
  | 'previous'
  | 'presentation'
  | 'copy'
  | 'background'
  | 'description'
  | 'theme';

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
    theme: 'Theme'
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
    theme: 'Thème'
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
    theme: 'المظهر'
  }
} as const;

export default translations;

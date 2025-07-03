
export type TranslationKey = 
  // Navigation and basic UI
  | 'title' | 'subtitle' | 'generator' | 'advanced' | 'library' | 'categories' | 'integration'
  | 'theme' | 'language' | 'advancedAI' | 'noCode'
  
  // Form elements
  | 'titlePlaceholder' | 'category' | 'tone' | 'audience' | 'constraints' | 'context'
  | 'objective' | 'outputFormat' | 'generatePrompt' | 'copy' | 'examples'
  | 'required' | 'optional'
  
  // Languages
  | 'french' | 'arabic' | 'english'
  
  // Prompt Generator
  | 'promptGeneratorTitle' | 'promptGeneratorDesc' | 'quickGenerator' | 'quickGeneratorDesc'
  | 'detailedGenerator' | 'detailedGeneratorDesc' | 'generating' | 'generatedPrompt'
  | 'readyForGeneration' | 'aiWillCreate' | 'generatedByAI' | 'aiGeneratedDesc'
  
  // Multi-step builder
  | 'multiStepTitle' | 'multiStepDesc' | 'step' | 'stepObjective' | 'stepObjectiveDesc'
  | 'stepContext' | 'stepContextDesc' | 'stepConstraints' | 'stepConstraintsDesc'
  | 'stepOutputFormat' | 'stepOutputFormatDesc' | 'stepReview' | 'stepReviewDesc'
  | 'previous' | 'next' | 'generate' | 'finalPrompt'
  
  // Improvement section
  | 'improvement' | 'improvementTitle' | 'improvementDesc' | 'originalPrompt' 
  | 'originalPromptPlaceholder' | 'improvementObjective' | 'improvementObjectivePlaceholder'
  | 'improvePrompt' | 'improvingPrompt' | 'improvedPrompt' | 'improvedPromptDesc'
  | 'improvements' | 'improvementSuccess' | 'improvementSuccessDesc'
  | 'enterOriginalPrompt'
  
  // Categories
  | 'textGeneration' | 'textGenerationDesc' | 'blogPostGenerator' 
  | 'imageCreation' | 'imageCreationDesc' 
  | 'interactiveDialogue' | 'interactiveDialogueDesc' | 'customerSupportChatbot'
  | 'codeGeneration' | 'codeGenerationDesc' | 'reactComponentGenerator'
  | 'dataAnalysis' | 'dataAnalysisDesc'
  | 'creativeWriting' | 'creativeWritingDesc'
  
  // Colors
  | 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo'
  
  // Messages
  | 'missingInfo' | 'generationError' | 'copiedSuccess' | 'promptCopiedClipboard'
  | 'validationError' | 'nameDescriptionRequired' | 'categoryCreated';

const translations: Record<'fr' | 'ar' | 'en', Record<TranslationKey, string>> = {
  fr: {
    // Navigation and basic UI
    title: "Générateur de Prompts IA",
    subtitle: "Créez des prompts parfaits pour tous vos besoins IA",
    generator: "Générateur",
    advanced: "Avancé",
    library: "Bibliothèque",
    categories: "Catégories",
    integration: "Intégration",
    theme: "Thème",
    language: "Langue",
    advancedAI: "IA Avancée",
    noCode: "Sans Code",
    
    // Form elements
    titlePlaceholder: "Décrivez ce que vous voulez générer...",
    category: "Catégorie",
    tone: "Ton",
    audience: "Audience",
    constraints: "Contraintes",
    context: "Contexte",
    objective: "Objectif",
    outputFormat: "Format de sortie",
    generatePrompt: "Générer le Prompt",
    copy: "Copier",
    examples: "Exemples",
    required: "(requis)",
    optional: "(optionnel)",
    
    // Languages
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Prompt Generator
    promptGeneratorTitle: "Générateur de Prompts IA",
    promptGeneratorDesc: "Créez des prompts optimisés pour obtenir les meilleurs résultats de votre IA",
    quickGenerator: "Générateur Rapide",
    quickGeneratorDesc: "Créez rapidement un prompt basique",
    detailedGenerator: "Générateur Détaillé",
    detailedGeneratorDesc: "Configurez tous les paramètres pour un prompt optimal",
    generating: "Génération en cours...",
    generatedPrompt: "Prompt Généré",
    readyForGeneration: "Prêt pour la génération",
    aiWillCreate: "L'IA créera votre prompt optimisé",
    generatedByAI: "Généré par IA",
    aiGeneratedDesc: "Ce prompt a été optimisé par notre IA pour de meilleurs résultats",
    
    // Multi-step builder
    multiStepTitle: "Constructeur Multi-Étapes",
    multiStepDesc: "Créez des prompts complexes étape par étape",
    step: "Étape",
    stepObjective: "Définir l'Objectif",
    stepObjectiveDesc: "Décrivez clairement ce que vous voulez accomplir",
    stepContext: "Ajouter du Contexte",
    stepContextDesc: "Fournissez les informations de fond nécessaires",
    stepConstraints: "Définir les Contraintes",
    stepConstraintsDesc: "Spécifiez les limitations et exigences",
    stepOutputFormat: "Format de Sortie",
    stepOutputFormatDesc: "Définissez comment vous voulez que la réponse soit structurée",
    stepReview: "Révision et Génération",
    stepReviewDesc: "Vérifiez et générez votre prompt final",
    previous: "Précédent",
    next: "Suivant",
    generate: "Générer",
    finalPrompt: "Prompt Final",
    
    // Improvement section
    improvement: "Amélioration",
    improvementTitle: "Amélioration de Prompts",
    improvementDesc: "Optimisez vos prompts existants avec l'aide de l'IA",
    originalPrompt: "Prompt Original",
    originalPromptPlaceholder: "Collez ici le prompt que vous souhaitez améliorer...",
    improvementObjective: "Objectif d'Amélioration",
    improvementObjectivePlaceholder: "Ex: Rendre plus spécifique, améliorer la clarté, ajouter du contexte...",
    improvePrompt: "Améliorer le Prompt",
    improvingPrompt: "Amélioration en cours...",
    improvedPrompt: "Prompt Amélioré",
    improvedPromptDesc: "Version optimisée de votre prompt",
    improvements: "Améliorations Apportées",
    improvementSuccess: "Prompt amélioré avec succès",
    improvementSuccessDesc: "Votre prompt a été optimisé par l'IA",
    enterOriginalPrompt: "Veuillez saisir le prompt original",
    
    // Categories
    textGeneration: "Génération de Texte",
    textGenerationDesc: "Créez du contenu textuel de qualité",
    blogPostGenerator: "Générateur d'articles de blog",
    imageCreation: "Création d'Images",
    imageCreationDesc: "Générez des descriptions pour la création d'images",
    interactiveDialogue: "Dialogue Interactif",
    interactiveDialogueDesc: "Créez des conversations et des chatbots",
    customerSupportChatbot: "Chatbot de support client",
    codeGeneration: "Génération de Code",
    codeGenerationDesc: "Générez et optimisez du code",
    reactComponentGenerator: "Générateur de composants React",
    dataAnalysis: "Analyse de Données",
    dataAnalysisDesc: "Analysez et interprétez vos données",
    creativeWriting: "Écriture Créative",
    creativeWritingDesc: "Histoires, poèmes et contenu créatif",
    
    // Colors
    blue: "Bleu",
    green: "Vert",
    purple: "Violet",
    orange: "Orange",
    red: "Rouge",
    indigo: "Indigo",
    
    // Messages
    missingInfo: "Informations manquantes",
    generationError: "Erreur de génération",
    copiedSuccess: "Copié avec succès",
    promptCopiedClipboard: "Le prompt a été copié dans le presse-papiers",
    validationError: "Erreur de validation",
    nameDescriptionRequired: "Le nom et la description sont requis",
    categoryCreated: "Catégorie créée"
  },
  
  ar: {
    // Navigation and basic UI
    title: "مولد المطالبات بالذكاء الاصطناعي",
    subtitle: "أنشئ مطالبات مثالية لجميع احتياجات الذكاء الاصطناعي",
    generator: "المولد",
    advanced: "متقدم",
    library: "المكتبة",
    categories: "الفئات",
    integration: "التكامل",
    theme: "المظهر",
    language: "اللغة",
    advancedAI: "ذكاء اصطناعي متقدم",
    noCode: "بدون كود",
    
    // Form elements
    titlePlaceholder: "صف ما تريد إنتاجه...",
    category: "الفئة",
    tone: "النبرة",
    audience: "الجمهور",
    constraints: "القيود",
    context: "السياق",
    objective: "الهدف",
    outputFormat: "تنسيق الإخراج",
    generatePrompt: "إنتاج المطالبة",
    copy: "نسخ",
    examples: "أمثلة",
    required: "(مطلوب)",
    optional: "(اختياري)",
    
    // Languages
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Prompt Generator
    promptGeneratorTitle: "مولد المطالبات بالذكاء الاصطناعي",
    promptGeneratorDesc: "أنشئ مطالبات محسنة للحصول على أفضل النتائج من الذكاء الاصطناعي",
    quickGenerator: "المولد السريع",
    quickGeneratorDesc: "أنشئ مطالبة أساسية بسرعة",
    detailedGenerator: "المولد المفصل",
    detailedGeneratorDesc: "قم بتكوين جميع المعاملات للحصول على مطالبة مثالية",
    generating: "جارٍ الإنتاج...",
    generatedPrompt: "المطالبة المُنتجة",
    readyForGeneration: "جاهز للإنتاج",
    aiWillCreate: "سيقوم الذكاء الاصطناعي بإنشاء مطالبتك المحسنة",
    generatedByAI: "مُنتج بالذكاء الاصطناعي",
    aiGeneratedDesc: "تم تحسين هذه المطالبة بواسطة الذكاء الاصطناعي للحصول على نتائج أفضل",
    
    // Multi-step builder
    multiStepTitle: "المنشئ متعدد الخطوات",
    multiStepDesc: "أنشئ مطالبات معقدة خطوة بخطوة",
    step: "الخطوة",
    stepObjective: "تحديد الهدف",
    stepObjectiveDesc: "صف بوضوح ما تريد تحقيقه",
    stepContext: "إضافة السياق",
    stepContextDesc: "قدم المعلومات الخلفية اللازمة",
    stepConstraints: "تحديد القيود",
    stepConstraintsDesc: "حدد القيود والمتطلبات",
    stepOutputFormat: "تنسيق الإخراج",
    stepOutputFormatDesc: "حدد كيف تريد أن تكون الاستجابة منظمة",
    stepReview: "المراجعة والإنتاج",
    stepReviewDesc: "راجع وأنتج مطالبتك النهائية",
    previous: "السابق",
    next: "التالي",
    generate: "إنتاج",
    finalPrompt: "المطالبة النهائية",
    
    // Improvement section
    improvement: "التحسين",
    improvementTitle: "تحسين المطالبات",
    improvementDesc: "حسن مطالباتك الموجودة بمساعدة الذكاء الاصطناعي",
    originalPrompt: "المطالبة الأصلية",
    originalPromptPlaceholder: "الصق هنا المطالبة التي تريد تحسينها...",
    improvementObjective: "هدف التحسين",
    improvementObjectivePlaceholder: "مثال: جعلها أكثر تحديداً، تحسين الوضوح، إضافة السياق...",
    improvePrompt: "تحسين المطالبة",
    improvingPrompt: "جارٍ التحسين...",
    improvedPrompt: "المطالبة المحسنة",
    improvedPromptDesc: "النسخة المحسنة من مطالبتك",
    improvements: "التحسينات المطبقة",
    improvementSuccess: "تم تحسين المطالبة بنجاح",
    improvementSuccessDesc: "تم تحسين مطالبتك بواسطة الذكاء الاصطناعي",
    enterOriginalPrompt: "يرجى إدخال المطالبة الأصلية",
    
    // Categories
    textGeneration: "إنتاج النصوص",
    textGenerationDesc: "أنشئ محتوى نصي عالي الجودة",
    blogPostGenerator: "مولد مقالات المدونة",
    imageCreation: "إنشاء الصور",
    imageCreationDesc: "أنتج أوصاف لإنشاء الصور",
    interactiveDialogue: "الحوار التفاعلي",
    interactiveDialogueDesc: "أنشئ محادثات وروبوتات الدردشة",
    customerSupportChatbot: "روبوت دعم العملاء",
    codeGeneration: "إنتاج الكود",
    codeGenerationDesc: "أنتج وحسن الكود",
    reactComponentGenerator: "مولد مكونات React",
    dataAnalysis: "تحليل البيانات",
    dataAnalysisDesc: "حلل وفسر بياناتك",
    creativeWriting: "الكتابة الإبداعية",
    creativeWritingDesc: "قصص وقصائد ومحتوى إبداعي",
    
    // Colors
    blue: "أزرق",
    green: "أخضر",
    purple: "بنفسجي",
    orange: "برتقالي",
    red: "أحمر",
    indigo: "نيلي",
    
    // Messages
    missingInfo: "معلومات مفقودة",
    generationError: "خطأ في الإنتاج",
    copiedSuccess: "تم النسخ بنجاح",
    promptCopiedClipboard: "تم نسخ المطالبة إلى الحافظة",
    validationError: "خطأ في التحقق",
    nameDescriptionRequired: "الاسم والوصف مطلوبان",
    categoryCreated: "تم إنشاء الفئة"
  },
  
  en: {
    // Navigation and basic UI
    title: "AI Prompt Generator",
    subtitle: "Create perfect prompts for all your AI needs",
    generator: "Generator",
    advanced: "Advanced",
    library: "Library",
    categories: "Categories",
    integration: "Integration",
    theme: "Theme",
    language: "Language",
    advancedAI: "Advanced AI",
    noCode: "No Code",
    
    // Form elements
    titlePlaceholder: "Describe what you want to generate...",
    category: "Category",
    tone: "Tone",
    audience: "Audience",
    constraints: "Constraints",
    context: "Context",
    objective: "Objective",
    outputFormat: "Output Format",
    generatePrompt: "Generate Prompt",
    copy: "Copy",
    examples: "Examples",
    required: "(required)",
    optional: "(optional)",
    
    // Languages
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Prompt Generator
    promptGeneratorTitle: "AI Prompt Generator",
    promptGeneratorDesc: "Create optimized prompts to get the best results from your AI",
    quickGenerator: "Quick Generator",
    quickGeneratorDesc: "Quickly create a basic prompt",
    detailedGenerator: "Detailed Generator",
    detailedGeneratorDesc: "Configure all parameters for an optimal prompt",
    generating: "Generating...",
    generatedPrompt: "Generated Prompt",
    readyForGeneration: "Ready for generation",
    aiWillCreate: "AI will create your optimized prompt",
    generatedByAI: "Generated by AI",
    aiGeneratedDesc: "This prompt has been optimized by our AI for better results",
    
    // Multi-step builder
    multiStepTitle: "Multi-Step Builder",
    multiStepDesc: "Create complex prompts step by step",
    step: "Step",
    stepObjective: "Define Objective",
    stepObjectiveDesc: "Clearly describe what you want to accomplish",
    stepContext: "Add Context",
    stepContextDesc: "Provide necessary background information",
    stepConstraints: "Define Constraints",
    stepConstraintsDesc: "Specify limitations and requirements",
    stepOutputFormat: "Output Format",
    stepOutputFormatDesc: "Define how you want the response to be structured",
    stepReview: "Review and Generate",
    stepReviewDesc: "Review and generate your final prompt",
    previous: "Previous",
    next: "Next",
    generate: "Generate",
    finalPrompt: "Final Prompt",
    
    // Improvement section
    improvement: "Improvement",
    improvementTitle: "Prompt Improvement",
    improvementDesc: "Optimize your existing prompts with AI assistance",
    originalPrompt: "Original Prompt",
    originalPromptPlaceholder: "Paste here the prompt you want to improve...",
    improvementObjective: "Improvement Objective",
    improvementObjectivePlaceholder: "Ex: Make more specific, improve clarity, add context...",
    improvePrompt: "Improve Prompt",
    improvingPrompt: "Improving...",
    improvedPrompt: "Improved Prompt",
    improvedPromptDesc: "Optimized version of your prompt",
    improvements: "Applied Improvements",
    improvementSuccess: "Prompt improved successfully",
    improvementSuccessDesc: "Your prompt has been optimized by AI",
    enterOriginalPrompt: "Please enter the original prompt",
    
    // Categories
    textGeneration: "Text Generation",
    textGenerationDesc: "Create quality textual content",
    blogPostGenerator: "Blog post generator",
    imageCreation: "Image Creation",
    imageCreationDesc: "Generate descriptions for image creation",
    interactiveDialogue: "Interactive Dialogue",
    interactiveDialogueDesc: "Create conversations and chatbots",
    customerSupportChatbot: "Customer support chatbot",
    codeGeneration: "Code Generation",
    codeGenerationDesc: "Generate and optimize code",
    reactComponentGenerator: "React component generator",
    dataAnalysis: "Data Analysis",
    dataAnalysisDesc: "Analyze and interpret your data",
    creativeWriting: "Creative Writing",
    creativeWritingDesc: "Stories, poems and creative content",
    
    // Colors
    blue: "Blue",
    green: "Green",
    purple: "Purple",
    orange: "Orange",
    red: "Red",
    indigo: "Indigo",
    
    // Messages
    missingInfo: "Missing information",
    generationError: "Generation error",
    copiedSuccess: "Copied successfully",
    promptCopiedClipboard: "Prompt copied to clipboard",
    validationError: "Validation error",
    nameDescriptionRequired: "Name and description are required",
    categoryCreated: "Category created"
  }
};

export default translations;

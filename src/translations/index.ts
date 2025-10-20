export interface TranslationKey {
  // Navigation et interface générale
  title: string;
  subtitle: string;
  home: string;
  generator: string;
  improvement: string;
  advanced: string;
  library: string;
  categories: string;
  history: string;
  integration: string;
  marketplace: string;
  seller: string;
  
  // Landing page
  landingBadge: string;
  landingSubtitle: string;
  landingCTA: string;
  startFree: string;
  immediateAccess: string;
  usersCount: string;
  allYouNeed: string;
  allYouNeedDesc: string;
  whatUsersSay: string;
  whatUsersSayDesc: string;
  readyRevolution: string;
  readyRevolutionDesc: string;
  startNowFree: string;
  platformPreview: string;
  platformPreviewDesc: string;
  
  // Générateur de prompts
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
  readyForGeneration: string;
  aiWillCreate: string;
  generatedByAI: string;
  aiGeneratedDesc: string;
  
  // Actions communes
  copy: string;
  save: string;
  copyPrompt: string;
  generatePrompt: string;
  generating: string;
  test: string;
  improve: string;
  improving: string;
  
  // Catégories
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
  
  // Sous-catégories
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
  dataAnalysis: string;
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
  
  // Formats de sortie
  bulletList: string;
  structuredParagraph: string;
  table: string;
  numberedSteps: string;
  dialogue: string;
  codeScript: string;
  
  // Tons
  professional: string;
  casual: string;
  technical: string;
  creative: string;
  persuasive: string;
  educational: string;
  friendly: string;
  formal: string;
  
  // Longueurs
  short: string;
  medium: string;
  long: string;
  veryDetailed: string;
  
  // Messages et notifications
  missingInfo: string;
  chooseCategoryDesc: string;
  promptCreatedSuccess: string;
  promptCreatedDesc: string;
  generationError: string;
  copiedSuccess: string;
  promptCopiedClipboard: string;
  
  // Amélioration de prompts
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
  improvementSuccess: string;
  improvementSuccessDesc: string;
  improvements: string;
  enterOriginalPrompt: string;
  
  // Multi-step builder
  multiStepTitle: string;
  multiStepDesc: string;
  multiStepBuilder: string;
  multiStepBuilderDesc: string;
  stepObjectiveTitle: string;
  stepObjectiveDesc: string;
  stepContextTitle: string;
  stepContextDesc: string;
  stepConstraintsTitle: string;
  stepConstraintsDesc: string;
  stepOutputFormatTitle: string;
  stepOutputFormatDesc: string;
  stepReviewTitle: string;
  stepReviewDesc: string;
  
  // Étapes détaillées
  mainObjectiveRequired: string;
  specificTargets: string;
  addTarget: string;
  targetPlaceholder: string;
  noTargetsYet: string;
  successCriteria: string;
  successCriteriaPlaceholder: string;
  contextBackground: string;
  contextBackgroundPlaceholder: string;
  industry: string;
  selectIndustry: string;
  contextConstraints: string;
  addConstraint: string;
  constraintPlaceholder: string;
  noConstraintsYet: string;
  outputStructure: string;
  selectStructure: string;
  requiredSections: string;
  addSection: string;
  sectionPlaceholder: string;
  noSectionsYet: string;
  expectedDeliverables: string;
  addDeliverable: string;
  deliverablePlaceholder: string;
  noDeliverablesYet: string;
  
  // Contraintes et formats
  selectToneConstraint: string;
  selectLength: string;
  selectTechnicalLevel: string;
  selectFormat: string;
  selectStyle: string;
  responseFormat: string;
  writingStyle: string;
  technicalLevel: string;
  
  // Options de contraintes
  brief: string;
  concise: string;
  detailed: string;
  comprehensive: string;
  extensive: string;
  structuredReport: string;
  bulletPoints: string;
  narrative: string;
  stepByStep: string;
  qaFormat: string;
  presentationFormat: string;
  analytical: string;
  descriptive: string;
  comparative: string;
  argumentative: string;
  instructional: string;
  consultative: string;
  beginner: string;
  intermediate: string;
  advancedLevel: string;
  expert: string;
  authoritative: string;
  
  // Structures de sortie
  hierarchical: string;
  sequential: string;
  modular: string;
  matrix: string;
  flowchart: string;
  
  // Industries
  technology: string;
  healthcare: string;
  finance: string;
  education: string;
  retail: string;
  manufacturing: string;
  consulting: string;
  media: string;
  other: string;
  
  // Navigation et progression
  step: string;
  progress: string;
  previous: string;
  next: string;
  generateAdvancedPrompt: string;
  advancedPromptGenerated: string;
  advancedPromptGeneratedDesc: string;
  tryAgainLater: string;
  advancedPromptResult: string;
  
  // Review et validation
  objectiveReview: string;
  contextReview: string;
  requirementsReview: string;
  outputFormatReview: string;
  notSpecified: string;
  readyToGenerate: string;
  almostReady: string;
  allRequiredFieldsCompleted: string;
  someFieldsMissing: string;
  completed: string;
  
  // Conseils et tips
  stepObjectiveTips: string;
  tipObjective1: string;
  tipObjective2: string;
  tipObjective3: string;
  stepContextTips: string;
  tipContext1: string;
  tipContext2: string;
  tipContext3: string;
  stepConstraintsTips: string;
  tipConstraints1: string;
  tipConstraints2: string;
  tipConstraints3: string;
  stepOutputFormatTips: string;
  tipOutputFormat1: string;
  tipOutputFormat2: string;
  tipOutputFormat3: string;
  finalTips: string;
  finalTip1: string;
  finalTip2: string;
  finalTip3: string;
  finalTip4: string;
  
  // Langues
  french: string;
  arabic: string;
  english: string;
  
  // Couleurs
  blue: string;
  green: string;
  purple: string;
  orange: string;
  red: string;
  indigo: string;
  
  // Gestion des catégories
  textGeneration: string;
  textGenerationDesc: string;
  imageCreation: string;
  imageCreationDesc: string;
  interactiveDialogue: string;
  interactiveDialogueDesc: string;
  codeGeneration: string;
  codeGenerationDesc: string;
  creativeWriting: string;
  creativeWritingDesc: string;
  blogPostGenerator: string;
  productImagePrompt: string;
  customerSupportChatbot: string;
  reactComponentGenerator: string;
  dataInsightsGenerator: string;
  storyConceptGenerator: string;
  
  // Gestion des catégories - Actions
  createNewCategory: string;
  editCategory: string;
  categoryName: string;
  categoryDescription: string;
  colorTheme: string;
  exampleUseCases: string;
  create: string;
  update: string;
  cancel: string;
  addCategory: string;
  validationError: string;
  nameDescriptionRequired: string;
  categoryCreated: string;
  categoryUpdated: string;
  categoryDeleted: string;
  
  // Bibliothèque de prompts
  promptTemplateLibrary: string;
  browsePromptTemplates: string;
  searchPrompts: string;
  allCategories: string;
  preview: string;
  close: string;
  copyTemplate: string;
  noPromptsFound: string;
  copied: string;
  promptCopied: string;
  
  // Générateur simple
  simpleGeneratorBadge: string;
  createPrompts: string;
  efficient: string;
  transformIdeas: string;
  promptConfiguration: string;
  promptConfigurationDesc: string;
  whatObjective: string;
  toneStyleOptional: string;
  optimizedPrompt: string;
  promptGeneratedSuccess: string;
  needMoreFeatures: string;
  needMoreFeaturesDesc: string;
  exploreAdvanced: string;
  
  // Mode sombre/clair
  darkMode: string;
  lightMode: string;
  
  // Étapes avancées
  advancedStepObjective: string;
  advancedStepObjectiveDesc: string;
  advancedStepContext: string;
  advancedStepContextDesc: string;
  advancedStepAudience: string;
  advancedStepAudienceDesc: string;
  advancedStepTone: string;
  advancedStepToneDesc: string;
  advancedStepConstraints: string;
  advancedStepConstraintsDesc: string;
  advancedStepOptimization: string;
  advancedStepOptimizationDesc: string;
  
  // Tips pour étapes avancées
  objectiveTip1: string;
  objectiveTip2: string;
  objectiveTip3: string;
  contextTip1: string;
  contextTip2: string;
  contextTip3: string;
  audienceTip1: string;
  audienceTip2: string;
  audienceTip3: string;
  toneTip1: string;
  toneTip2: string;
  toneTip3: string;
  constraintsTip1: string;
  constraintsTip2: string;
  constraintsTip3: string;
  optimizationTip1: string;
  optimizationTip2: string;
  optimizationTip3: string;
  
  // Exemples pour étapes avancées
  objectiveExample1: string;
  objectiveExample2: string;
  objectiveExample3: string;
  contextExample1: string;
  contextExample2: string;
  contextExample3: string;
  audienceExample1: string;
  audienceExample2: string;
  audienceExample3: string;
  
  // Suggestions et aide
  tipsForStep: string;
  inspirationExamples: string;
  upcomingSuggestions: string;
  continueSteps: string;
  aiSuggestions: string;
  quickActions: string;
  addExamples: string;
  addFormat: string;
  addConstraints: string;
  promptQuality: string;
  excellent: string;
  excellent2: string;
  good: string;
  needsImprovement: string;
  criteriaValidated: string;
  
  // Aperçu en temps réel
  livePreview: string;
  realTimeUpdate: string;
  characters: string;
  words: string;
  qualityScore: string;
  
  // Contexte et audience
  contextOptional: string;
  contextPlaceholder: string;
  audiencePlaceholder: string;
  
  // Formats et structures
  paragraphs: string;
  numberedList: string;
  jsonFormat: string;
  
  // Marketplace
  marketplaceTitle: string;
  marketplaceDescription: string;
  search: string;
  searchPlaceholder: string;
  category: string;
  priceRange: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  mostRecent: string;
  cheapest: string;
  mostSold: string;
  license: string;
  allLicenses: string;
  featured: string;
  buy: string;
  reviews: string;
  rating: string;
  salesCount: string;
  marketplaceSales: string;
  noReviewsYet: string;
  buyToSeeComplete: string;
  noContentAvailable: string;
  promptDetails: string;
  promptPreview: string;
  customerReviews: string;
  verifiedPurchase: string;
  
  // Seller Dashboard
  sellerDashboard: string;
  managePrompts: string;
  publishPrompt: string;
  totalEarnings: string;
  totalSales: string;
  publishedPrompts: string;
  averageRating: string;
  commission: string;
  myPrompts: string;
  analytics: string;
  noPromptsPublished: string;
  startPublishing: string;

  // Additional common UI text
  choose: string;
  selectPrompt: string;
  selectLicense: string;
  saving: string;
  quickPromptGenerator: string;
  describeWhatYouWant: string;

  // Credit management
  buyCredits: string;
  recharge: string;
  credits: string;
  credit: string;
  depleted: string;
  low: string;
  good: string;
  creditManagement: string;

  // Tabs and sections
  templates: string;
  security: string;
  apiKeys: string;
}

const translations: Record<'fr' | 'ar' | 'en', TranslationKey> = {
  fr: {
    // Navigation et interface générale
    title: "AutoPrompt",
    subtitle: "Plateforme IA de génération de prompts professionnels",
    home: "Accueil",
    generator: "Générateur",
    improvement: "Amélioration",
    advanced: "Avancé",
    library: "Bibliothèque",
    categories: "Catégories",
    history: "Historique",
    integration: "Intégration",
    marketplace: "Marketplace",
    seller: "Vendeur",
    
    // Landing page
    landingBadge: "🚀 Nouvelle plateforme IA disponible",
    landingSubtitle: "Transformez vos idées en prompts optimisés grâce à notre plateforme alimentée par l'IA. Génération, amélioration et organisation de prompts professionnels.",
    landingCTA: "Commencer gratuitement",
    startFree: "Gratuit sans inscription",
    immediateAccess: "Accès immédiat",
    usersCount: "10K+ utilisateurs",
    allYouNeed: "Tout ce dont vous avez besoin",
    allYouNeedDesc: "Une suite complète d'outils pour créer, améliorer et organiser vos prompts IA",
    whatUsersSay: "Ce que disent nos utilisateurs",
    whatUsersSayDesc: "Découvrez comment AutoPrompt transforme le workflow de nos utilisateurs",
    readyRevolution: "Prêt à révolutionner votre workflow ?",
    readyRevolutionDesc: "Rejoignez des milliers de professionnels qui utilisent AutoPrompt pour optimiser leur productivité avec l'IA",
    startNowFree: "Commencer maintenant - Gratuit",
    platformPreview: "Aperçu de la plateforme",
    platformPreviewDesc: "Découvrez nos outils principaux",
    
    // Générateur de prompts
    promptGeneratorTitle: "Générateur de Prompts IA",
    promptGeneratorDesc: "Créez des prompts optimisés pour tous vos besoins",
    mainCategory: "Catégorie principale",
    required: "*",
    optional: "(optionnel)",
    selectDomain: "Sélectionnez votre domaine",
    subcategory: "Sous-catégorie",
    chooseSpecialization: "Choisissez votre spécialisation",
    taskDescription: "Description de la tâche",
    taskDescriptionPlaceholder: "Décrivez précisément ce que vous voulez accomplir...",
    mainObjective: "Objectif principal",
    mainObjectivePlaceholder: "Quel est votre objectif principal ?",
    targetAudience: "Public cible",
    targetAudiencePlaceholder: "Pour qui est destiné ce prompt ?",
    outputFormat: "Format de sortie",
    chooseFormat: "Choisissez le format de réponse",
    toneStyle: "Ton et style",
    chooseTone: "Choisissez le ton",
    approximateLength: "Longueur approximative",
    chooseLength: "Choisissez la longueur",
    generateWithAI: "Générer avec l'IA",
    generatingWithAI: "Génération avec l'IA...",
    aiGeneratedPrompt: "Prompt généré par l'IA",
    aiGeneratedPromptDesc: "Votre prompt optimisé est prêt à être utilisé",
    readyForGeneration: "Prêt pour la génération",
    aiWillCreate: "L'IA va créer votre prompt optimisé",
    generatedByAI: "Généré par l'IA",
    aiGeneratedDesc: "Ce prompt a été optimisé par notre intelligence artificielle",
    
    // Actions communes
    copy: "Copier",
    save: "Sauvegarder",
    copyPrompt: "Copier le prompt",
    generatePrompt: "Générer le prompt",
    generating: "Génération...",
    test: "Tester",
    improve: "Améliorer",
    improving: "Amélioration...",
    
    // Catégories
    contentCreation: "Création de Contenu",
    contentCreationDesc: "Rédaction, design, vidéo et contenu créatif",
    businessProfessional: "Business & Professionnel",
    businessProfessionalDesc: "Stratégie, communication et gestion d'entreprise",
    educationTraining: "Éducation & Formation",
    educationTrainingDesc: "Cours, évaluation et pédagogie",
    technologyDevelopment: "Technologie & Développement",
    technologyDevelopmentDesc: "Programmation, data science et cybersécurité",
    analysisResearch: "Analyse & Recherche",
    analysisResearchDesc: "Analyse de données et recherche académique",
    problemSolving: "Résolution de Problèmes",
    problemSolvingDesc: "Diagnostic, brainstorming et optimisation",
    communicationRelations: "Communication & Relations",
    communicationRelationsDesc: "Relations client et communication interne",
    
    // Sous-catégories
    writing: "Rédaction",
    artisticCreation: "Création Artistique",
    videoAudio: "Vidéo & Audio",
    marketing: "Marketing",
    literature: "Littérature",
    strategy: "Stratégie",
    communication: "Communication",
    hr: "Ressources Humaines",
    sales: "Vente",
    management: "Management",
    courses: "Cours",
    evaluation: "Évaluation",
    research: "Recherche",
    pedagogy: "Pédagogie",
    professionalTraining: "Formation Professionnelle",
    programming: "Programmation",
    dataScience: "Data Science",
    cybersecurity: "Cybersécurité",
    architecture: "Architecture",
    devops: "DevOps",
    dataAnalysis: "Analyse de Données",
    academicResearch: "Recherche Académique",
    competitiveIntelligence: "Intelligence Concurrentielle",
    auditEvaluation: "Audit & Évaluation",
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
    
    // Formats de sortie
    bulletList: "Liste à puces",
    structuredParagraph: "Paragraphe structuré",
    table: "Tableau",
    numberedSteps: "Étapes numérotées",
    dialogue: "Dialogue",
    codeScript: "Code/Script",
    
    // Tons
    professional: "Professionnel",
    casual: "Décontracté",
    technical: "Technique",
    creative: "Créatif",
    persuasive: "Persuasif",
    educational: "Éducatif",
    friendly: "Amical",
    formal: "Formel",
    
    // Longueurs
    short: "Court",
    medium: "Moyen",
    long: "Long",
    veryDetailed: "Très détaillé",
    
    // Messages et notifications
    missingInfo: "Informations manquantes",
    chooseCategoryDesc: "Veuillez choisir une catégorie et fournir une description",
    promptCreatedSuccess: "Prompt créé avec succès !",
    promptCreatedDesc: "Votre prompt optimisé a été généré.",
    generationError: "Erreur de génération",
    copiedSuccess: "Copié !",
    promptCopiedClipboard: "Le prompt a été copié dans le presse-papiers",
    
    // Amélioration de prompts
    improvementTitle: "Amélioration de Prompts",
    improvementDesc: "Optimisez vos prompts existants avec l'IA",
    originalPrompt: "Prompt original",
    originalPromptPlaceholder: "Collez ici le prompt que vous souhaitez améliorer...",
    improvementObjective: "Objectif d'amélioration",
    improvementObjectivePlaceholder: "Que souhaitez-vous améliorer spécifiquement ?",
    improvePrompt: "Améliorer le prompt",
    improvingPrompt: "Amélioration en cours...",
    improvedPrompt: "Prompt amélioré",
    improvedPromptDesc: "Votre prompt optimisé avec les améliorations suggérées",
    improvementSuccess: "Amélioration réussie !",
    improvementSuccessDesc: "Votre prompt a été optimisé avec succès.",
    improvements: "Améliorations apportées",
    enterOriginalPrompt: "Veuillez entrer un prompt à améliorer",
    
    // Multi-step builder
    multiStepTitle: "Builder Multi-Étapes",
    multiStepDesc: "Créez des prompts complexes étape par étape",
    multiStepBuilder: "Builder Multi-Étapes",
    multiStepBuilderDesc: "Créez des prompts avancés avec notre assistant guidé",
    stepObjectiveTitle: "Définir l'Objectif",
    stepObjectiveDesc: "Précisez votre objectif principal et vos cibles spécifiques",
    stepContextTitle: "Contexte & Audience",
    stepContextDesc: "Définissez le contexte et votre public cible",
    stepConstraintsTitle: "Contraintes & Style",
    stepConstraintsDesc: "Spécifiez le ton, la longueur et le style souhaités",
    stepOutputFormatTitle: "Format de Sortie",
    stepOutputFormatDesc: "Définissez la structure et les livrables attendus",
    stepReviewTitle: "Révision & Génération",
    stepReviewDesc: "Vérifiez votre configuration et générez le prompt final",
    
    // Étapes détaillées
    mainObjectiveRequired: "Objectif principal",
    specificTargets: "Cibles spécifiques",
    addTarget: "Ajouter une cible",
    targetPlaceholder: "Décrivez une cible spécifique...",
    noTargetsYet: "Aucune cible spécifique définie",
    successCriteria: "Critères de succès",
    successCriteriaPlaceholder: "Comment mesurer le succès ?",
    contextBackground: "Contexte et arrière-plan",
    contextBackgroundPlaceholder: "Décrivez le contexte dans lequel ce prompt sera utilisé...",
    industry: "Secteur d'activité",
    selectIndustry: "Sélectionnez votre secteur",
    contextConstraints: "Contraintes contextuelles",
    addConstraint: "Ajouter une contrainte",
    constraintPlaceholder: "Décrivez une contrainte...",
    noConstraintsYet: "Aucune contrainte définie",
    outputStructure: "Structure de sortie",
    selectStructure: "Sélectionnez la structure",
    requiredSections: "Sections requises",
    addSection: "Ajouter une section",
    sectionPlaceholder: "Nom de la section...",
    noSectionsYet: "Aucune section définie",
    expectedDeliverables: "Livrables attendus",
    addDeliverable: "Ajouter un livrable",
    deliverablePlaceholder: "Décrivez un livrable...",
    noDeliverablesYet: "Aucun livrable défini",
    
    // Contraintes et formats
    selectToneConstraint: "Sélectionnez le ton",
    selectLength: "Sélectionnez la longueur",
    selectTechnicalLevel: "Sélectionnez le niveau technique",
    selectFormat: "Sélectionnez le format",
    selectStyle: "Sélectionnez le style",
    responseFormat: "Format de réponse",
    writingStyle: "Style de rédaction",
    technicalLevel: "Niveau technique",
    
    // Options de contraintes
    brief: "Bref",
    concise: "Concis",
    detailed: "Détaillé",
    comprehensive: "Complet",
    extensive: "Extensif",
    structuredReport: "Rapport structuré",
    bulletPoints: "Points clés",
    narrative: "Narratif",
    stepByStep: "Étape par étape",
    qaFormat: "Questions-Réponses",
    presentationFormat: "Présentation",
    analytical: "Analytique",
    descriptive: "Descriptif",
    comparative: "Comparatif",
    argumentative: "Argumentatif",
    instructional: "Instructionnel",
    consultative: "Consultatif",
    beginner: "Débutant",
    intermediate: "Intermédiaire",
    advancedLevel: "Avancé",
    expert: "Expert",
    authoritative: "Autoritaire",
    
    // Structures de sortie
    hierarchical: "Hiérarchique",
    sequential: "Séquentiel",
    modular: "Modulaire",
    matrix: "Matriciel",
    flowchart: "Organigramme",
    
    // Industries
    technology: "Technologie",
    healthcare: "Santé",
    finance: "Finance",
    education: "Éducation",
    retail: "Commerce",
    manufacturing: "Industrie",
    consulting: "Conseil",
    media: "Médias",
    other: "Autre",
    
    // Navigation et progression
    step: "Étape",
    progress: "Progression",
    previous: "Précédent",
    next: "Suivant",
    generateAdvancedPrompt: "Générer le Prompt Avancé",
    advancedPromptGenerated: "Prompt avancé généré !",
    advancedPromptGeneratedDesc: "Votre prompt avancé a été créé avec succès",
    tryAgainLater: "Veuillez réessayer plus tard",
    advancedPromptResult: "Résultat du Prompt Avancé",
    
    // Review et validation
    objectiveReview: "Révision de l'Objectif",
    contextReview: "Révision du Contexte",
    requirementsReview: "Révision des Exigences",
    outputFormatReview: "Révision du Format",
    notSpecified: "Non spécifié",
    readyToGenerate: "Prêt à générer",
    almostReady: "Presque prêt",
    allRequiredFieldsCompleted: "Tous les champs requis sont complétés",
    someFieldsMissing: "Certains champs sont manquants",
    completed: "complété",
    
    // Conseils et tips
    stepObjectiveTips: "Conseils pour l'objectif",
    tipObjective1: "Soyez spécifique et mesurable dans vos objectifs",
    tipObjective2: "Définissez des cibles claires et atteignables",
    tipObjective3: "Incluez des critères de succès quantifiables",
    stepContextTips: "Conseils pour le contexte",
    tipContext1: "Fournissez suffisamment de contexte pour guider l'IA",
    tipContext2: "Précisez l'industrie et l'environnement d'utilisation",
    tipContext3: "Mentionnez les contraintes importantes",
    stepConstraintsTips: "Conseils pour les contraintes",
    tipConstraints1: "Le ton influence grandement la qualité de la réponse",
    tipConstraints2: "Adaptez la longueur à votre usage prévu",
    tipConstraints3: "Le niveau technique doit correspondre à votre audience",
    stepOutputFormatTips: "Conseils pour le format",
    tipOutputFormat1: "Une structure claire améliore la lisibilité",
    tipOutputFormat2: "Définissez des sections logiques et cohérentes",
    tipOutputFormat3: "Spécifiez les livrables attendus",
    finalTips: "Conseils finaux",
    finalTip1: "Vérifiez que tous les éléments sont cohérents",
    finalTip2: "Assurez-vous que l'objectif est clairement défini",
    finalTip3: "Testez votre prompt et ajustez si nécessaire",
    finalTip4: "Sauvegardez vos prompts réussis pour les réutiliser",
    
    // Langues
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Couleurs
    blue: "Bleu",
    green: "Vert",
    purple: "Violet",
    orange: "Orange",
    red: "Rouge",
    indigo: "Indigo",
    
    // Gestion des catégories
    textGeneration: "Génération de Texte",
    textGenerationDesc: "Créez du contenu textuel optimisé",
    imageCreation: "Création d'Images",
    imageCreationDesc: "Générez des prompts pour la création visuelle",
    interactiveDialogue: "Dialogue Interactif",
    interactiveDialogueDesc: "Créez des conversations naturelles",
    codeGeneration: "Génération de Code",
    codeGenerationDesc: "Automatisez la création de code",
    creativeWriting: "Écriture Créative",
    creativeWritingDesc: "Stimulez votre créativité littéraire",
    blogPostGenerator: "Générateur d'articles de blog",
    productImagePrompt: "Prompt d'image produit",
    customerSupportChatbot: "Chatbot de support client",
    reactComponentGenerator: "Générateur de composants React",
    dataInsightsGenerator: "Générateur d'insights de données",
    storyConceptGenerator: "Générateur de concepts d'histoire",
    
    // Gestion des catégories - Actions
    createNewCategory: "Créer une nouvelle catégorie",
    editCategory: "Modifier la catégorie",
    categoryName: "Nom de la catégorie",
    categoryDescription: "Description de la catégorie",
    colorTheme: "Thème de couleur",
    exampleUseCases: "Exemples d'utilisation",
    create: "Créer",
    update: "Mettre à jour",
    cancel: "Annuler",
    addCategory: "Ajouter une catégorie",
    validationError: "Erreur de validation",
    nameDescriptionRequired: "Le nom et la description sont requis",
    categoryCreated: "Catégorie créée",
    categoryUpdated: "Catégorie mise à jour",
    categoryDeleted: "Catégorie supprimée",
    
    // Bibliothèque de prompts
    promptTemplateLibrary: "Bibliothèque de Templates",
    browsePromptTemplates: "Parcourez notre collection de templates de prompts",
    searchPrompts: "Rechercher des prompts...",
    allCategories: "Toutes les catégories",
    preview: "Aperçu",
    close: "Fermer",
    copyTemplate: "Copier le template",
    noPromptsFound: "Aucun prompt trouvé",
    copied: "Copié !",
    promptCopied: "Template copié dans le presse-papiers",
    
    // Générateur simple
    simpleGeneratorBadge: "🎯 Générateur Simple et Efficace",
    createPrompts: "Créez des Prompts",
    efficient: "Efficaces",
    transformIdeas: "Transformez vos idées en prompts optimisés en quelques clics",
    promptConfiguration: "Configuration du Prompt",
    promptConfigurationDesc: "Définissez vos paramètres pour générer le prompt parfait",
    whatObjective: "Quel est votre objectif ?",
    toneStyleOptional: "Ton et style (optionnel)",
    optimizedPrompt: "Prompt Optimisé",
    promptGeneratedSuccess: "Votre prompt a été généré avec succès !",
    needMoreFeatures: "Besoin de fonctionnalités avancées ?",
    needMoreFeaturesDesc: "Découvrez notre mode avancé avec builder multi-étapes, templates et bibliothèque complète",
    exploreAdvanced: "Explorer le Mode Avancé",
    
    // Mode sombre/clair
    darkMode: "Mode sombre",
    lightMode: "Mode clair",
    
    // Étapes avancées
    advancedStepObjective: "Objectif & Mission",
    advancedStepObjectiveDesc: "Définissez clairement votre objectif principal",
    advancedStepContext: "Contexte & Background",
    advancedStepContextDesc: "Fournissez le contexte nécessaire",
    advancedStepAudience: "Public & Audience",
    advancedStepAudienceDesc: "Identifiez votre audience cible",
    advancedStepTone: "Ton & Style",
    advancedStepToneDesc: "Choisissez le ton et le format appropriés",
    advancedStepConstraints: "Contraintes & Spécifications",
    advancedStepConstraintsDesc: "Définissez les contraintes et mots-clés",
    advancedStepOptimization: "Optimisation & Finalisation",
    advancedStepOptimizationDesc: "Optimisez et finalisez votre prompt",
    
    // Tips pour étapes avancées
    objectiveTip1: "Formulez un objectif clair et spécifique",
    objectiveTip2: "Incluez des métriques de succès mesurables",
    objectiveTip3: "Alignez l'objectif avec vos besoins business",
    contextTip1: "Plus de contexte = meilleure précision",
    contextTip2: "Mentionnez l'industrie et l'environnement",
    contextTip3: "Incluez les contraintes importantes",
    audienceTip1: "Définissez précisément votre audience",
    audienceTip2: "Adaptez le niveau de complexité",
    audienceTip3: "Considérez les connaissances préalables",
    toneTip1: "Le ton influence la réception du message",
    toneTip2: "Adaptez le style à votre audience",
    toneTip3: "Restez cohérent dans tout le prompt",
    constraintsTip1: "Les contraintes guident l'IA efficacement",
    constraintsTip2: "Soyez spécifique sur les limitations",
    constraintsTip3: "Incluez des mots-clés pertinents",
    optimizationTip1: "Vérifiez la cohérence globale",
    optimizationTip2: "Testez et itérez si nécessaire",
    optimizationTip3: "Documentez vos prompts réussis",
    
    // Exemples pour étapes avancées
    objectiveExample1: "Créer une stratégie marketing pour lancer un produit",
    objectiveExample2: "Développer un plan de formation pour l'équipe",
    objectiveExample3: "Analyser les performances et proposer des améliorations",
    contextExample1: "Entreprise SaaS B2B en phase de croissance",
    contextExample2: "Startup technologique cherchant à se développer",
    contextExample3: "Organisation traditionnelle en transformation digitale",
    audienceExample1: "Dirigeants et décideurs stratégiques",
    audienceExample2: "Équipes techniques et opérationnelles",
    audienceExample3: "Clients finaux et utilisateurs",
    
    // Suggestions et aide
    tipsForStep: "Conseils pour cette étape",
    inspirationExamples: "Exemples d'inspiration",
    upcomingSuggestions: "Suggestions à venir",
    continueSteps: "Continuez les étapes pour voir des suggestions personnalisées",
    aiSuggestions: "Suggestions IA",
    quickActions: "Actions rapides",
    addExamples: "Ajouter des exemples",
    addFormat: "Ajouter un format",
    addConstraints: "Ajouter des contraintes",
    promptQuality: "Qualité du prompt",
    excellent: "Excellent ! Votre prompt est de haute qualité",
    excellent2: "Excellent",
    good: "Bon",
    needsImprovement: "À améliorer",
    criteriaValidated: "critères validés",
    
    // Aperçu en temps réel
    livePreview: "Aperçu en temps réel",
    realTimeUpdate: "Mise à jour en temps réel",
    characters: "caractères",
    words: "mots",
    qualityScore: "Score de qualité",
    
    // Contexte et audience
    contextOptional: "Contexte (optionnel)",
    contextPlaceholder: "Fournissez le contexte d'utilisation...",
    audiencePlaceholder: "Décrivez votre public cible...",
    
    // Formats et structures
    paragraphs: "Paragraphes",
    numberedList: "Liste numérotée",
    jsonFormat: "Format JSON",
    
    // Marketplace
    marketplaceTitle: "Marketplace de Prompts",
    marketplaceDescription: "Découvrez et achetez des prompts créés par la communauté",
    search: "Rechercher",
    searchPlaceholder: "Rechercher des prompts...",
    category: "Catégorie",
    priceRange: "Gamme de prix",
    minPrice: "Prix min",
    maxPrice: "Prix max",
    sortBy: "Trier par",
    mostRecent: "Plus récent",
    cheapest: "Moins cher",
    mostSold: "Plus vendu",
    license: "Licence",
    allLicenses: "Toutes les licences",
    featured: "En vedette",
    buy: "Acheter",
    reviews: "Avis",
    rating: "Note",
    salesCount: "Nombre de ventes",
    marketplaceSales: "ventes",
    noReviewsYet: "Aucun avis pour le moment",
    buyToSeeComplete: "Achetez pour voir le contenu complet",
    noContentAvailable: "Aucun contenu disponible",
    promptDetails: "Détails du prompt",
    promptPreview: "Aperçu du prompt",
    customerReviews: "Avis clients",
    verifiedPurchase: "Achat vérifié",
    
    // Seller Dashboard
    sellerDashboard: "Tableau de Bord Vendeur",
    managePrompts: "Gérez vos prompts et suivez vos ventes",
    publishPrompt: "Publier un Prompt",
    totalEarnings: "Gains Totaux",
    totalSales: "Ventes Totales",
    publishedPrompts: "Prompts Publiés",
    averageRating: "Note Moyenne",
    commission: "Commission déduite",
    myPrompts: "Mes Prompts",
    analytics: "Analytics",
    noPromptsPublished: "Aucun prompt publié",
    startPublishing: "Commencez à publier vos prompts pour générer des revenus",

    // Additional common UI text
    choose: "Choisir",
    selectPrompt: "Choisir un prompt",
    selectLicense: "Choisir une licence",
    saving: "Sauvegarde...",
    quickPromptGenerator: "Générateur Rapide de Prompts",
    describeWhatYouWant: "Décrivez ce que vous voulez accomplir et obtenez un prompt optimisé instantanément",

    // Credit management
    buyCredits: "Acheter Crédits",
    recharge: "Recharger",
    credits: "crédits",
    credit: "crédit",
    depleted: "Épuisé",
    low: "Faible",
    creditManagement: "Gestion des Crédits",

    // Tabs and sections
    templates: "Templates",
    security: "Sécurité",
    apiKeys: "Clés API"
  },
  
  ar: {
    // Navigation et interface générale
    title: "أوتو برومبت",
    subtitle: "منصة الذكاء الاصطناعي لإنشاء المطالبات المهنية",
    home: "الرئيسية",
    generator: "المولد",
    improvement: "التحسين",
    advanced: "متقدم",
    library: "المكتبة",
    categories: "الفئات",
    history: "التاريخ",
    integration: "التكامل",
    marketplace: "السوق",
    seller: "البائع",
    
    // Landing page
    landingBadge: "🚀 منصة ذكاء اصطناعي جديدة متاحة",
    landingSubtitle: "حوّل أفكارك إلى مطالبات محسّنة باستخدام منصتنا المدعومة بالذكاء الاصطناعي. إنشاء وتحسين وتنظيم المطالبات المهنية.",
    landingCTA: "ابدأ مجاناً",
    startFree: "مجاني بدون تسجيل",
    immediateAccess: "وصول فوري",
    usersCount: "10 آلاف+ مستخدم",
    allYouNeed: "كل ما تحتاجه",
    allYouNeedDesc: "مجموعة كاملة من الأدوات لإنشاء وتحسين وتنظيم مطالبات الذكاء الاصطناعي",
    whatUsersSay: "ما يقوله مستخدمونا",
    whatUsersSayDesc: "اكتشف كيف يحوّل أوتو برومبت سير عمل مستخدمينا",
    readyRevolution: "مستعد لثورة في سير عملك؟",
    readyRevolutionDesc: "انضم إلى آلاف المهنيين الذين يستخدمون أوتو برومبت لتحسين إنتاجيتهم مع الذكاء الاصطناعي",
    startNowFree: "ابدأ الآن - مجاني",
    platformPreview: "معاينة المنصة",
    platformPreviewDesc: "اكتشف أدواتنا الرئيسية",
    
    // Générateur de prompts
    promptGeneratorTitle: "مولد المطالبات بالذكاء الاصطناعي",
    promptGeneratorDesc: "أنشئ مطالبات محسّنة لجميع احتياجاتك",
    mainCategory: "الفئة الرئيسية",
    required: "*",
    optional: "(اختياري)",
    selectDomain: "اختر مجالك",
    subcategory: "الفئة الفرعية",
    chooseSpecialization: "اختر تخصصك",
    taskDescription: "وصف المهمة",
    taskDescriptionPlaceholder: "صف بدقة ما تريد تحقيقه...",
    mainObjective: "الهدف الرئيسي",
    mainObjectivePlaceholder: "ما هو هدفك الرئيسي؟",
    targetAudience: "الجمهور المستهدف",
    targetAudiencePlaceholder: "لمن مخصص هذا المطلب؟",
    outputFormat: "تنسيق الإخراج",
    chooseFormat: "اختر تنسيق الاستجابة",
    toneStyle: "النبرة والأسلوب",
    chooseTone: "اختر النبرة",
    approximateLength: "الطول التقريبي",
    chooseLength: "اختر الطول",
    generateWithAI: "إنشاء بالذكاء الاصطناعي",
    generatingWithAI: "الإنشاء بالذكاء الاصطناعي...",
    aiGeneratedPrompt: "مطلب مُنشأ بالذكاء الاصطناعي",
    aiGeneratedPromptDesc: "مطلبك المحسّن جاهز للاستخدام",
    readyForGeneration: "جاهز للإنشاء",
    aiWillCreate: "سيقوم الذكاء الاصطناعي بإنشاء مطلبك المحسّن",
    generatedByAI: "مُنشأ بالذكاء الاصطناعي",
    aiGeneratedDesc: "تم تحسين هذا المطلب بواسطة ذكائنا الاصطناعي",
    
    // Actions communes
    copy: "نسخ",
    save: "حفظ",
    copyPrompt: "نسخ المطلب",
    generatePrompt: "إنشاء المطلب",
    generating: "جاري الإنشاء...",
    test: "اختبار",
    improve: "تحسين",
    improving: "جاري التحسين...",
    
    // Catégories
    contentCreation: "إنشاء المحتوى",
    contentCreationDesc: "الكتابة والتصميم والفيديو والمحتوى الإبداعي",
    businessProfessional: "الأعمال والمهنية",
    businessProfessionalDesc: "الاستراتيجية والتواصل وإدارة الأعمال",
    educationTraining: "التعليم والتدريب",
    educationTrainingDesc: "الدورات والتقييم والتعليم",
    technologyDevelopment: "التكنولوجيا والتطوير",
    technologyDevelopmentDesc: "البرمجة وعلوم البيانات والأمن السيبراني",
    analysisResearch: "التحليل والبحث",
    analysisResearchDesc: "تحليل البيانات والبحث الأكاديمي",
    problemSolving: "حل المشاكل",
    problemSolvingDesc: "التشخيص والعصف الذهني والتحسين",
    communicationRelations: "التواصل والعلاقات",
    communicationRelationsDesc: "علاقات العملاء والتواصل الداخلي",
    
    // Sous-catégories
    writing: "الكتابة",
    artisticCreation: "الإبداع الفني",
    videoAudio: "الفيديو والصوت",
    marketing: "التسويق",
    literature: "الأدب",
    strategy: "الاستراتيجية",
    communication: "التواصل",
    hr: "الموارد البشرية",
    sales: "المبيعات",
    management: "الإدارة",
    courses: "الدورات",
    evaluation: "التقييم",
    research: "البحث",
    pedagogy: "التعليم",
    professionalTraining: "التدريب المهني",
    programming: "البرمجة",
    dataScience: "علوم البيانات",
    cybersecurity: "الأمن السيبراني",
    architecture: "الهندسة المعمارية",
    devops: "DevOps",
    dataAnalysis: "تحليل البيانات",
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
    
    // Formats de sortie
    bulletList: "قائمة نقطية",
    structuredParagraph: "فقرة منظمة",
    table: "جدول",
    numberedSteps: "خطوات مرقمة",
    dialogue: "حوار",
    codeScript: "كود/سكريبت",
    
    // Tons
    professional: "مهني",
    casual: "غير رسمي",
    technical: "تقني",
    creative: "إبداعي",
    persuasive: "مقنع",
    educational: "تعليمي",
    friendly: "ودود",
    formal: "رسمي",
    
    // Longueurs
    short: "قصير",
    medium: "متوسط",
    long: "طويل",
    veryDetailed: "مفصل جداً",
    
    // Messages et notifications
    missingInfo: "معلومات مفقودة",
    chooseCategoryDesc: "يرجى اختيار فئة وتقديم وصف",
    promptCreatedSuccess: "تم إنشاء المطلب بنجاح!",
    promptCreatedDesc: "تم إنشاء مطلبك المحسّن.",
    generationError: "خطأ في الإنشاء",
    copiedSuccess: "تم النسخ!",
    promptCopiedClipboard: "تم نسخ المطلب إلى الحافظة",
    
    // Amélioration de prompts
    improvementTitle: "تحسين المطالبات",
    improvementDesc: "حسّن مطالباتك الموجودة باستخدام الذكاء الاصطناعي",
    originalPrompt: "المطلب الأصلي",
    originalPromptPlaceholder: "الصق هنا المطلب الذي تريد تحسينه...",
    improvementObjective: "هدف التحسين",
    improvementObjectivePlaceholder: "ما الذي تريد تحسينه تحديداً؟",
    improvePrompt: "تحسين المطلب",
    improvingPrompt: "جاري التحسين...",
    improvedPrompt: "المطلب المحسّن",
    improvedPromptDesc: "مطلبك المحسّن مع الاقتراحات المطبقة",
    improvementSuccess: "تم التحسين بنجاح!",
    improvementSuccessDesc: "تم تحسين مطلبك بنجاح.",
    improvements: "التحسينات المطبقة",
    enterOriginalPrompt: "يرجى إدخال مطلب للتحسين",
    
    // Multi-step builder
    multiStepTitle: "البناء متعدد الخطوات",
    multiStepDesc: "أنشئ مطالبات معقدة خطوة بخطوة",
    multiStepBuilder: "البناء متعدد الخطوات",
    multiStepBuilderDesc: "أنشئ مطالبات متقدمة مع مساعدنا الموجه",
    stepObjectiveTitle: "تحديد الهدف",
    stepObjectiveDesc: "حدد هدفك الرئيسي وأهدافك المحددة",
    stepContextTitle: "السياق والجمهور",
    stepContextDesc: "حدد السياق وجمهورك المستهدف",
    stepConstraintsTitle: "القيود والأسلوب",
    stepConstraintsDesc: "حدد النبرة والطول والأسلوب المطلوب",
    stepOutputFormatTitle: "تنسيق الإخراج",
    stepOutputFormatDesc: "حدد الهيكل والمخرجات المتوقعة",
    stepReviewTitle: "المراجعة والإنشاء",
    stepReviewDesc: "راجع إعدادك وأنشئ المطلب النهائي",
    
    // Étapes détaillées
    mainObjectiveRequired: "الهدف الرئيسي",
    specificTargets: "الأهداف المحددة",
    addTarget: "إضافة هدف",
    targetPlaceholder: "صف هدفاً محدداً...",
    noTargetsYet: "لم يتم تحديد أهداف محددة",
    successCriteria: "معايير النجاح",
    successCriteriaPlaceholder: "كيف تقيس النجاح؟",
    contextBackground: "السياق والخلفية",
    contextBackgroundPlaceholder: "صف السياق الذي سيُستخدم فيه هذا المطلب...",
    industry: "قطاع النشاط",
    selectIndustry: "اختر قطاعك",
    contextConstraints: "القيود السياقية",
    addConstraint: "إضافة قيد",
    constraintPlaceholder: "صف قيداً...",
    noConstraintsYet: "لم يتم تحديد قيود",
    outputStructure: "هيكل الإخراج",
    selectStructure: "اختر الهيكل",
    requiredSections: "الأقسام المطلوبة",
    addSection: "إضافة قسم",
    sectionPlaceholder: "اسم القسم...",
    noSectionsYet: "لم يتم تحديد أقسام",
    expectedDeliverables: "المخرجات المتوقعة",
    addDeliverable: "إضافة مخرج",
    deliverablePlaceholder: "صف مخرجاً...",
    noDeliverablesYet: "لم يتم تحديد مخرجات",
    
    // Contraintes et formats
    selectToneConstraint: "اختر النبرة",
    selectLength: "اختر الطول",
    selectTechnicalLevel: "اختر المستوى التقني",
    selectFormat: "اختر التنسيق",
    selectStyle: "اختر الأسلوب",
    responseFormat: "تنسيق الاستجابة",
    writingStyle: "أسلوب الكتابة",
    technicalLevel: "المستوى التقني",
    
    // Options de contraintes
    brief: "موجز",
    concise: "مختصر",
    detailed: "مفصل",
    comprehensive: "شامل",
    extensive: "موسع",
    structuredReport: "تقرير منظم",
    bulletPoints: "نقاط رئيسية",
    narrative: "سردي",
    stepByStep: "خطوة بخطوة",
    qaFormat: "أسئلة وأجوبة",
    presentationFormat: "عرض تقديمي",
    analytical: "تحليلي",
    descriptive: "وصفي",
    comparative: "مقارن",
    argumentative: "جدلي",
    instructional: "تعليمي",
    consultative: "استشاري",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advancedLevel: "متقدم",
    expert: "خبير",
    authoritative: "موثوق",
    
    // Structures de sortie
    hierarchical: "هرمي",
    sequential: "تسلسلي",
    modular: "نمطي",
    matrix: "مصفوفي",
    flowchart: "مخطط انسيابي",
    
    // Industries
    technology: "التكنولوجيا",
    healthcare: "الصحة",
    finance: "المالية",
    education: "التعليم",
    retail: "التجارة",
    manufacturing: "الصناعة",
    consulting: "الاستشارات",
    media: "الإعلام",
    other: "أخرى",
    
    // Navigation et progression
    step: "خطوة",
    progress: "التقدم",
    previous: "السابق",
    next: "التالي",
    generateAdvancedPrompt: "إنشاء المطلب المتقدم",
    advancedPromptGenerated: "تم إنشاء المطلب المتقدم!",
    advancedPromptGeneratedDesc: "تم إنشاء مطلبك المتقدم بنجاح",
    tryAgainLater: "يرجى المحاولة مرة أخرى لاحقاً",
    advancedPromptResult: "نتيجة المطلب المتقدم",
    
    // Review et validation
    objectiveReview: "مراجعة الهدف",
    contextReview: "مراجعة السياق",
    requirementsReview: "مراجعة المتطلبات",
    outputFormatReview: "مراجعة التنسيق",
    notSpecified: "غير محدد",
    readyToGenerate: "جاهز للإنشاء",
    almostReady: "تقريباً جاهز",
    allRequiredFieldsCompleted: "تم إكمال جميع الحقول المطلوبة",
    someFieldsMissing: "بعض الحقول مفقودة",
    completed: "مكتمل",
    
    // Conseils et tips
    stepObjectiveTips: "نصائح للهدف",
    tipObjective1: "كن محدداً وقابلاً للقياس في أهدافك",
    tipObjective2: "حدد أهدافاً واضحة وقابلة للتحقيق",
    tipObjective3: "اشمل معايير نجاح قابلة للقياس",
    stepContextTips: "نصائح للسياق",
    tipContext1: "قدم سياقاً كافياً لتوجيه الذكاء الاصطناعي",
    tipContext2: "حدد الصناعة وبيئة الاستخدام",
    tipContext3: "اذكر القيود المهمة",
    stepConstraintsTips: "نصائح للقيود",
    tipConstraints1: "النبرة تؤثر بشكل كبير على جودة الاستجابة",
    tipConstraints2: "اجعل الطول مناسباً لاستخدامك المقصود",
    tipConstraints3: "يجب أن يتطابق المستوى التقني مع جمهورك",
    stepOutputFormatTips: "نصائح للتنسيق",
    tipOutputFormat1: "الهيكل الواضح يحسن القابلية للقراءة",
    tipOutputFormat2: "حدد أقساماً منطقية ومتماسكة",
    tipOutputFormat3: "حدد المخرجات المتوقعة",
    finalTips: "النصائح النهائية",
    finalTip1: "تأكد من أن جميع العناصر متماسكة",
    finalTip2: "تأكد من أن الهدف محدد بوضوح",
    finalTip3: "اختبر مطلبك وعدّل إذا لزم الأمر",
    finalTip4: "احفظ مطالباتك الناجحة لإعادة الاستخدام",
    
    // Langues
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Couleurs
    blue: "أزرق",
    green: "أخضر",
    purple: "بنفسجي",
    orange: "برتقالي",
    red: "أحمر",
    indigo: "نيلي",
    
    // Gestion des catégories
    textGeneration: "إنشاء النصوص",
    textGenerationDesc: "أنشئ محتوى نصي محسّن",
    imageCreation: "إنشاء الصور",
    imageCreationDesc: "أنشئ مطالبات للإبداع البصري",
    interactiveDialogue: "الحوار التفاعلي",
    interactiveDialogueDesc: "أنشئ محادثات طبيعية",
    codeGeneration: "إنشاء الكود",
    codeGenerationDesc: "أتمت إنشاء الكود",
    creativeWriting: "الكتابة الإبداعية",
    creativeWritingDesc: "حفز إبداعك الأدبي",
    blogPostGenerator: "مولد مقالات المدونة",
    productImagePrompt: "مطلب صورة المنتج",
    customerSupportChatbot: "روبوت دعم العملاء",
    reactComponentGenerator: "مولد مكونات React",
    dataInsightsGenerator: "مولد رؤى البيانات",
    storyConceptGenerator: "مولد مفاهيم القصص",
    
    // Gestion des catégories - Actions
    createNewCategory: "إنشاء فئة جديدة",
    editCategory: "تعديل الفئة",
    categoryName: "اسم الفئة",
    categoryDescription: "وصف الفئة",
    colorTheme: "موضوع اللون",
    exampleUseCases: "أمثلة الاستخدام",
    create: "إنشاء",
    update: "تحديث",
    cancel: "إلغاء",
    addCategory: "إضافة فئة",
    validationError: "خطأ في التحقق",
    nameDescriptionRequired: "الاسم والوصف مطلوبان",
    categoryCreated: "تم إنشاء الفئة",
    categoryUpdated: "تم تحديث الفئة",
    categoryDeleted: "تم حذف الفئة",
    
    // Bibliothèque de prompts
    promptTemplateLibrary: "مكتبة القوالب",
    browsePromptTemplates: "تصفح مجموعتنا من قوالب المطالبات",
    searchPrompts: "البحث في المطالبات...",
    allCategories: "جميع الفئات",
    preview: "معاينة",
    close: "إغلاق",
    copyTemplate: "نسخ القالب",
    noPromptsFound: "لم يتم العثور على مطالبات",
    copied: "تم النسخ!",
    promptCopied: "تم نسخ القالب إلى الحافظة",
    
    // Générateur simple
    simpleGeneratorBadge: "🎯 مولد بسيط وفعال",
    createPrompts: "أنشئ مطالبات",
    efficient: "فعالة",
    transformIdeas: "حوّل أفكارك إلى مطالبات محسّنة بنقرات قليلة",
    promptConfiguration: "إعداد المطلب",
    promptConfigurationDesc: "حدد معاييرك لإنشاء المطلب المثالي",
    whatObjective: "ما هو هدفك؟",
    toneStyleOptional: "النبرة والأسلوب (اختياري)",
    optimizedPrompt: "المطلب المحسّن",
    promptGeneratedSuccess: "تم إنشاء مطلبك بنجاح!",
    needMoreFeatures: "تحتاج ميزات أكثر تقدماً؟",
    needMoreFeaturesDesc: "اكتشف وضعنا المتقدم مع البناء متعدد الخطوات والقوالب والمكتبة الكاملة",
    exploreAdvanced: "استكشف الوضع المتقدم",
    
    // Mode sombre/clair
    darkMode: "الوضع المظلم",
    lightMode: "الوضع المضيء",
    
    // Étapes avancées
    advancedStepObjective: "الهدف والمهمة",
    advancedStepObjectiveDesc: "حدد هدفك الرئيسي بوضوح",
    advancedStepContext: "السياق والخلفية",
    advancedStepContextDesc: "قدم السياق اللازم",
    advancedStepAudience: "الجمهور والمستمعين",
    advancedStepAudienceDesc: "حدد جمهورك المستهدف",
    advancedStepTone: "النبرة والأسلوب",
    advancedStepToneDesc: "اختر النبرة والتنسيق المناسبين",
    advancedStepConstraints: "القيود والمواصفات",
    advancedStepConstraintsDesc: "حدد القيود والكلمات المفتاحية",
    advancedStepOptimization: "التحسين والإنهاء",
    advancedStepOptimizationDesc: "حسّن وأنه مطلبك",
    
    // Tips pour étapes avancées
    objectiveTip1: "صغ هدفاً واضحاً ومحدداً",
    objectiveTip2: "اشمل مقاييس نجاح قابلة للقياس",
    objectiveTip3: "اربط الهدف باحتياجاتك التجارية",
    contextTip1: "المزيد من السياق = دقة أفضل",
    contextTip2: "اذكر الصناعة والبيئة",
    contextTip3: "اشمل القيود المهمة",
    audienceTip1: "حدد جمهورك بدقة",
    audienceTip2: "اجعل مستوى التعقيد مناسباً",
    audienceTip3: "اعتبر المعرفة المسبقة",
    toneTip1: "النبرة تؤثر على استقبال الرسالة",
    toneTip2: "اجعل الأسلوب مناسباً لجمهورك",
    toneTip3: "حافظ على الاتساق في كامل المطلب",
    constraintsTip1: "القيود توجه الذكاء الاصطناعي بفعالية",
    constraintsTip2: "كن محدداً حول القيود",
    constraintsTip3: "اشمل كلمات مفتاحية ذات صلة",
    optimizationTip1: "تحقق من الاتساق العام",
    optimizationTip2: "اختبر وكرر إذا لزم الأمر",
    optimizationTip3: "وثق مطالباتك الناجحة",
    
    // Exemples pour étapes avancées
    objectiveExample1: "إنشاء استراتيجية تسويقية لإطلاق منتج",
    objectiveExample2: "تطوير خطة تدريب للفريق",
    objectiveExample3: "تحليل الأداء واقتراح تحسينات",
    contextExample1: "شركة SaaS B2B في مرحلة النمو",
    contextExample2: "شركة ناشئة تقنية تسعى للتطور",
    contextExample3: "منظمة تقليدية في تحول رقمي",
    audienceExample1: "القادة وصناع القرار الاستراتيجي",
    audienceExample2: "الفرق التقنية والتشغيلية",
    audienceExample3: "العملاء النهائيون والمستخدمون",
    
    // Suggestions et aide
    tipsForStep: "نصائح لهذه الخطوة",
    inspirationExamples: "أمثلة ملهمة",
    upcomingSuggestions: "اقتراحات قادمة",
    continueSteps: "تابع الخطوات لرؤية اقتراحات مخصصة",
    aiSuggestions: "اقتراحات الذكاء الاصطناعي",
    quickActions: "إجراءات سريعة",
    addExamples: "إضافة أمثلة",
    addFormat: "إضافة تنسيق",
    addConstraints: "إضافة قيود",
    promptQuality: "جودة المطلب",
    excellent: "ممتاز! مطلبك عالي الجودة",
    excellent2: "ممتاز",
    good: "جيد",
    needsImprovement: "يحتاج تحسين",
    criteriaValidated: "معايير مُتحققة",
    
    // Aperçu en temps réel
    livePreview: "معاينة مباشرة",
    realTimeUpdate: "تحديث في الوقت الفعلي",
    characters: "أحرف",
    words: "كلمات",
    qualityScore: "نقاط الجودة",
    
    // Contexte et audience
    contextOptional: "السياق (اختياري)",
    contextPlaceholder: "قدم سياق الاستخدام...",
    audiencePlaceholder: "صف جمهورك المستهدف...",
    
    // Formats et structures
    paragraphs: "فقرات",
    numberedList: "قائمة مرقمة",
    jsonFormat: "تنسيق JSON",
    
    // Marketplace
    marketplaceTitle: "سوق المطالبات",
    marketplaceDescription: "اكتشف واشتر مطالبات أنشأها المجتمع",
    search: "بحث",
    searchPlaceholder: "البحث في المطالبات...",
    category: "الفئة",
    priceRange: "نطاق السعر",
    minPrice: "أدنى سعر",
    maxPrice: "أعلى سعر",
    sortBy: "ترتيب حسب",
    mostRecent: "الأحدث",
    cheapest: "الأرخص",
    mostSold: "الأكثر مبيعاً",
    license: "الرخصة",
    allLicenses: "جميع الرخص",
    featured: "مميز",
    buy: "شراء",
    reviews: "المراجعات",
    rating: "التقييم",
    salesCount: "عدد المبيعات",
    marketplaceSales: "مبيعات",
    noReviewsYet: "لا توجد مراجعات بعد",
    buyToSeeComplete: "اشتر لرؤية المحتوى الكامل",
    noContentAvailable: "لا يوجد محتوى متاح",
    promptDetails: "تفاصيل المطلب",
    promptPreview: "معاينة المطلب",
    customerReviews: "مراجعات العملاء",
    verifiedPurchase: "شراء مُتحقق",
    
    // Seller Dashboard
    sellerDashboard: "لوحة تحكم البائع",
    managePrompts: "أدر مطالباتك وتابع مبيعاتك",
    publishPrompt: "نشر مطلب",
    totalEarnings: "إجمالي الأرباح",
    totalSales: "إجمالي المبيعات",
    publishedPrompts: "المطالبات المنشورة",
    averageRating: "متوسط التقييم",
    commission: "العمولة مخصومة",
    myPrompts: "مطالباتي",
    analytics: "التحليلات",
    noPromptsPublished: "لا توجد مطالبات منشورة",
    startPublishing: "ابدأ بنشر مطالباتك لتحقيق الأرباح",

    // Additional common UI text
    choose: "اختيار",
    selectPrompt: "اختر مطلباً",
    selectLicense: "اختر رخصة",
    saving: "جارٍ الحفظ...",
    quickPromptGenerator: "مولد سريع للمطالبات",
    describeWhatYouWant: "صِف ما تريد تحقيقه واحصل على مطلب محسّن فوراً",

    // Credit management
    buyCredits: "شراء أرصدة",
    recharge: "إعادة شحن",
    credits: "أرصدة",
    credit: "رصيد",
    depleted: "نفد",
    low: "منخفض",
    creditManagement: "إدارة الأرصدة",

    // Tabs and sections
    templates: "القوالب",
    security: "الأمان",
    apiKeys: "مفاتيح API"
  },
  
  en: {
    // Navigation et interface générale
    title: "AutoPrompt",
    subtitle: "AI Platform for Professional Prompt Generation",
    home: "Home",
    generator: "Generator",
    improvement: "Improvement",
    advanced: "Advanced",
    library: "Library",
    categories: "Categories",
    history: "History",
    integration: "Integration",
    marketplace: "Marketplace",
    seller: "Seller",
    
    // Landing page
    landingBadge: "🚀 New AI Platform Available",
    landingSubtitle: "Transform your ideas into optimized prompts with our AI-powered platform. Generate, improve, and organize professional prompts.",
    landingCTA: "Start for Free",
    startFree: "Free without registration",
    immediateAccess: "Immediate access",
    usersCount: "10K+ users",
    allYouNeed: "Everything you need",
    allYouNeedDesc: "A complete suite of tools to create, improve, and organize your AI prompts",
    whatUsersSay: "What our users say",
    whatUsersSayDesc: "Discover how AutoPrompt transforms our users' workflow",
    readyRevolution: "Ready to revolutionize your workflow?",
    readyRevolutionDesc: "Join thousands of professionals using AutoPrompt to optimize their productivity with AI",
    startNowFree: "Start Now - Free",
    platformPreview: "Platform Preview",
    platformPreviewDesc: "Discover our main tools",
    
    // Générateur de prompts
    promptGeneratorTitle: "AI Prompt Generator",
    promptGeneratorDesc: "Create optimized prompts for all your needs",
    mainCategory: "Main Category",
    required: "*",
    optional: "(optional)",
    selectDomain: "Select your domain",
    subcategory: "Subcategory",
    chooseSpecialization: "Choose your specialization",
    taskDescription: "Task Description",
    taskDescriptionPlaceholder: "Describe precisely what you want to accomplish...",
    mainObjective: "Main Objective",
    mainObjectivePlaceholder: "What is your main objective?",
    targetAudience: "Target Audience",
    targetAudiencePlaceholder: "Who is this prompt for?",
    outputFormat: "Output Format",
    chooseFormat: "Choose response format",
    toneStyle: "Tone and Style",
    chooseTone: "Choose tone",
    approximateLength: "Approximate Length",
    chooseLength: "Choose length",
    generateWithAI: "Generate with AI",
    generatingWithAI: "Generating with AI...",
    aiGeneratedPrompt: "AI Generated Prompt",
    aiGeneratedPromptDesc: "Your optimized prompt is ready to use",
    readyForGeneration: "Ready for generation",
    aiWillCreate: "AI will create your optimized prompt",
    generatedByAI: "Generated by AI",
    aiGeneratedDesc: "This prompt has been optimized by our artificial intelligence",
    
    // Actions communes
    copy: "Copy",
    save: "Save",
    copyPrompt: "Copy Prompt",
    generatePrompt: "Generate Prompt",
    generating: "Generating...",
    test: "Test",
    improve: "Improve",
    improving: "Improving...",
    
    // Catégories
    contentCreation: "Content Creation",
    contentCreationDesc: "Writing, design, video, and creative content",
    businessProfessional: "Business & Professional",
    businessProfessionalDesc: "Strategy, communication, and business management",
    educationTraining: "Education & Training",
    educationTrainingDesc: "Courses, evaluation, and pedagogy",
    technologyDevelopment: "Technology & Development",
    technologyDevelopmentDesc: "Programming, data science, and cybersecurity",
    analysisResearch: "Analysis & Research",
    analysisResearchDesc: "Data analysis and academic research",
    problemSolving: "Problem Solving",
    problemSolvingDesc: "Diagnosis, brainstorming, and optimization",
    communicationRelations: "Communication & Relations",
    communicationRelationsDesc: "Customer relations and internal communication",
    
    // Sous-catégories
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
    dataAnalysis: "Data Analysis",
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
    
    // Formats de sortie
    bulletList: "Bullet List",
    structuredParagraph: "Structured Paragraph",
    table: "Table",
    numberedSteps: "Numbered Steps",
    dialogue: "Dialogue",
    codeScript: "Code/Script",
    
    // Tons
    professional: "Professional",
    casual: "Casual",
    technical: "Technical",
    creative: "Creative",
    persuasive: "Persuasive",
    educational: "Educational",
    friendly: "Friendly",
    formal: "Formal",
    
    // Longueurs
    short: "Short",
    medium: "Medium",
    long: "Long",
    veryDetailed: "Very Detailed",
    
    // Messages et notifications
    missingInfo: "Missing Information",
    chooseCategoryDesc: "Please choose a category and provide a description",
    promptCreatedSuccess: "Prompt created successfully!",
    promptCreatedDesc: "Your optimized prompt has been generated.",
    generationError: "Generation Error",
    copiedSuccess: "Copied!",
    promptCopiedClipboard: "Prompt copied to clipboard",
    
    // Amélioration de prompts
    improvementTitle: "Prompt Improvement",
    improvementDesc: "Optimize your existing prompts with AI",
    originalPrompt: "Original Prompt",
    originalPromptPlaceholder: "Paste here the prompt you want to improve...",
    improvementObjective: "Improvement Objective",
    improvementObjectivePlaceholder: "What do you want to improve specifically?",
    improvePrompt: "Improve Prompt",
    improvingPrompt: "Improving...",
    improvedPrompt: "Improved Prompt",
    improvedPromptDesc: "Your optimized prompt with suggested improvements",
    improvementSuccess: "Improvement successful!",
    improvementSuccessDesc: "Your prompt has been optimized successfully.",
    improvements: "Applied Improvements",
    enterOriginalPrompt: "Please enter a prompt to improve",
    
    // Multi-step builder
    multiStepTitle: "Multi-Step Builder",
    multiStepDesc: "Create complex prompts step by step",
    multiStepBuilder: "Multi-Step Builder",
    multiStepBuilderDesc: "Create advanced prompts with our guided assistant",
    stepObjectiveTitle: "Define Objective",
    stepObjectiveDesc: "Specify your main objective and specific targets",
    stepContextTitle: "Context & Audience",
    stepContextDesc: "Define the context and your target audience",
    stepConstraintsTitle: "Constraints & Style",
    stepConstraintsDesc: "Specify tone, length, and desired style",
    stepOutputFormatTitle: "Output Format",
    stepOutputFormatDesc: "Define structure and expected deliverables",
    stepReviewTitle: "Review & Generation",
    stepReviewDesc: "Review your configuration and generate the final prompt",
    
    // Étapes détaillées
    mainObjectiveRequired: "Main Objective",
    specificTargets: "Specific Targets",
    addTarget: "Add Target",
    targetPlaceholder: "Describe a specific target...",
    noTargetsYet: "No specific targets defined",
    successCriteria: "Success Criteria",
    successCriteriaPlaceholder: "How to measure success?",
    contextBackground: "Context and Background",
    contextBackgroundPlaceholder: "Describe the context where this prompt will be used...",
    industry: "Industry Sector",
    selectIndustry: "Select your sector",
    contextConstraints: "Contextual Constraints",
    addConstraint: "Add Constraint",
    constraintPlaceholder: "Describe a constraint...",
    noConstraintsYet: "No constraints defined",
    outputStructure: "Output Structure",
    selectStructure: "Select structure",
    requiredSections: "Required Sections",
    addSection: "Add Section",
    sectionPlaceholder: "Section name...",
    noSectionsYet: "No sections defined",
    expectedDeliverables: "Expected Deliverables",
    addDeliverable: "Add Deliverable",
    deliverablePlaceholder: "Describe a deliverable...",
    noDeliverablesYet: "No deliverables defined",
    
    // Contraintes et formats
    selectToneConstraint: "Select tone",
    selectLength: "Select length",
    selectTechnicalLevel: "Select technical level",
    selectFormat: "Select format",
    selectStyle: "Select style",
    responseFormat: "Response Format",
    writingStyle: "Writing Style",
    technicalLevel: "Technical Level",
    
    // Options de contraintes
    brief: "Brief",
    concise: "Concise",
    detailed: "Detailed",
    comprehensive: "Comprehensive",
    extensive: "Extensive",
    structuredReport: "Structured Report",
    bulletPoints: "Bullet Points",
    narrative: "Narrative",
    stepByStep: "Step by Step",
    qaFormat: "Q&A Format",
    presentationFormat: "Presentation",
    analytical: "Analytical",
    descriptive: "Descriptive",
    comparative: "Comparative",
    argumentative: "Argumentative",
    instructional: "Instructional",
    consultative: "Consultative",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advancedLevel: "Advanced",
    expert: "Expert",
    authoritative: "Authoritative",
    
    // Structures de sortie
    hierarchical: "Hierarchical",
    sequential: "Sequential",
    modular: "Modular",
    matrix: "Matrix",
    flowchart: "Flowchart",
    
    // Industries
    technology: "Technology",
    healthcare: "Healthcare",
    finance: "Finance",
    education: "Education",
    retail: "Retail",
    manufacturing: "Manufacturing",
    consulting: "Consulting",
    media: "Media",
    other: "Other",
    
    // Navigation et progression
    step: "Step",
    progress: "Progress",
    previous: "Previous",
    next: "Next",
    generateAdvancedPrompt: "Generate Advanced Prompt",
    advancedPromptGenerated: "Advanced prompt generated!",
    advancedPromptGeneratedDesc: "Your advanced prompt has been created successfully",
    tryAgainLater: "Please try again later",
    advancedPromptResult: "Advanced Prompt Result",
    
    // Review et validation
    objectiveReview: "Objective Review",
    contextReview: "Context Review",
    requirementsReview: "Requirements Review",
    outputFormatReview: "Format Review",
    notSpecified: "Not specified",
    readyToGenerate: "Ready to generate",
    almostReady: "Almost ready",
    allRequiredFieldsCompleted: "All required fields completed",
    someFieldsMissing: "Some fields are missing",
    completed: "completed",
    
    // Conseils et tips
    stepObjectiveTips: "Objective Tips",
    tipObjective1: "Be specific and measurable in your objectives",
    tipObjective2: "Define clear and achievable targets",
    tipObjective3: "Include quantifiable success criteria",
    stepContextTips: "Context Tips",
    tipContext1: "Provide enough context to guide the AI",
    tipContext2: "Specify industry and usage environment",
    tipContext3: "Mention important constraints",
    stepConstraintsTips: "Constraints Tips",
    tipConstraints1: "Tone greatly influences response quality",
    tipConstraints2: "Adapt length to your intended use",
    tipConstraints3: "Technical level should match your audience",
    stepOutputFormatTips: "Format Tips",
    tipOutputFormat1: "Clear structure improves readability",
    tipOutputFormat2: "Define logical and coherent sections",
    tipOutputFormat3: "Specify expected deliverables",
    finalTips: "Final Tips",
    finalTip1: "Check that all elements are coherent",
    finalTip2: "Ensure the objective is clearly defined",
    finalTip3: "Test your prompt and adjust if necessary",
    finalTip4: "Save your successful prompts for reuse",
    
    // Langues
    french: "Français",
    arabic: "العربية",
    english: "English",
    
    // Couleurs
    blue: "Blue",
    green: "Green",
    purple: "Purple",
    orange: "Orange",
    red: "Red",
    indigo: "Indigo",
    
    // Gestion des catégories
    textGeneration: "Text Generation",
    textGenerationDesc: "Create optimized textual content",
    imageCreation: "Image Creation",
    imageCreationDesc: "Generate prompts for visual creation",
    interactiveDialogue: "Interactive Dialogue",
    interactiveDialogueDesc: "Create natural conversations",
    codeGeneration: "Code Generation",
    codeGenerationDesc: "Automate code creation",
    creativeWriting: "Creative Writing",
    creativeWritingDesc: "Stimulate your literary creativity",
    blogPostGenerator: "Blog Post Generator",
    productImagePrompt: "Product Image Prompt",
    customerSupportChatbot: "Customer Support Chatbot",
    reactComponentGenerator: "React Component Generator",
    dataInsightsGenerator: "Data Insights Generator",
    storyConceptGenerator: "Story Concept Generator",
    
    // Gestion des catégories - Actions
    createNewCategory: "Create New Category",
    editCategory: "Edit Category",
    categoryName: "Category Name",
    categoryDescription: "Category Description",
    colorTheme: "Color Theme",
    exampleUseCases: "Example Use Cases",
    create: "Create",
    update: "Update",
    cancel: "Cancel",
    addCategory: "Add Category",
    validationError: "Validation Error",
    nameDescriptionRequired: "Name and description are required",
    categoryCreated: "Category Created",
    categoryUpdated: "Category Updated",
    categoryDeleted: "Category Deleted",
    
    // Bibliothèque de prompts
    promptTemplateLibrary: "Template Library",
    browsePromptTemplates: "Browse our collection of prompt templates",
    searchPrompts: "Search prompts...",
    allCategories: "All Categories",
    preview: "Preview",
    close: "Close",
    copyTemplate: "Copy Template",
    noPromptsFound: "No prompts found",
    copied: "Copied!",
    promptCopied: "Template copied to clipboard",
    
    // Générateur simple
    simpleGeneratorBadge: "🎯 Simple and Efficient Generator",
    createPrompts: "Create Prompts",
    efficient: "Efficient",
    transformIdeas: "Transform your ideas into optimized prompts with just a few clicks",
    promptConfiguration: "Prompt Configuration",
    promptConfigurationDesc: "Define your parameters to generate the perfect prompt",
    whatObjective: "What is your objective?",
    toneStyleOptional: "Tone and style (optional)",
    optimizedPrompt: "Optimized Prompt",
    promptGeneratedSuccess: "Your prompt has been generated successfully!",
    needMoreFeatures: "Need more advanced features?",
    needMoreFeaturesDesc: "Discover our advanced mode with multi-step builder, templates, and complete library",
    exploreAdvanced: "Explore Advanced Mode",
    
    // Mode sombre/clair
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    
    // Étapes avancées
    advancedStepObjective: "Objective & Mission",
    advancedStepObjectiveDesc: "Clearly define your main objective",
    advancedStepContext: "Context & Background",
    advancedStepContextDesc: "Provide necessary context",
    advancedStepAudience: "Public & Audience",
    advancedStepAudienceDesc: "Identify your target audience",
    advancedStepTone: "Tone & Style",
    advancedStepToneDesc: "Choose appropriate tone and format",
    advancedStepConstraints: "Constraints & Specifications",
    advancedStepConstraintsDesc: "Define constraints and keywords",
    advancedStepOptimization: "Optimization & Finalization",
    advancedStepOptimizationDesc: "Optimize and finalize your prompt",
    
    // Tips pour étapes avancées
    objectiveTip1: "Formulate a clear and specific objective",
    objectiveTip2: "Include measurable success metrics",
    objectiveTip3: "Align objective with your business needs",
    contextTip1: "More context = better precision",
    contextTip2: "Mention industry and environment",
    contextTip3: "Include important constraints",
    audienceTip1: "Define your audience precisely",
    audienceTip2: "Adapt complexity level",
    audienceTip3: "Consider prior knowledge",
    toneTip1: "Tone influences message reception",
    toneTip2: "Adapt style to your audience",
    toneTip3: "Stay consistent throughout the prompt",
    constraintsTip1: "Constraints guide AI effectively",
    constraintsTip2: "Be specific about limitations",
    constraintsTip3: "Include relevant keywords",
    optimizationTip1: "Check overall consistency",
    optimizationTip2: "Test and iterate if necessary",
    optimizationTip3: "Document your successful prompts",
    
    // Exemples pour étapes avancées
    objectiveExample1: "Create marketing strategy to launch a product",
    objectiveExample2: "Develop training plan for the team",
    objectiveExample3: "Analyze performance and suggest improvements",
    contextExample1: "B2B SaaS company in growth phase",
    contextExample2: "Tech startup seeking to develop",
    contextExample3: "Traditional organization in digital transformation",
    audienceExample1: "Leaders and strategic decision makers",
    audienceExample2: "Technical and operational teams",
    audienceExample3: "End customers and users",
    
    // Suggestions et aide
    tipsForStep: "Tips for this step",
    inspirationExamples: "Inspiration Examples",
    upcomingSuggestions: "Upcoming Suggestions",
    continueSteps: "Continue steps to see personalized suggestions",
    aiSuggestions: "AI Suggestions",
    quickActions: "Quick Actions",
    addExamples: "Add Examples",
    addFormat: "Add Format",
    addConstraints: "Add Constraints",
    promptQuality: "Prompt Quality",
    excellent: "Excellent! Your prompt is high quality",
    excellent2: "Excellent",
    good: "Good",
    needsImprovement: "Needs Improvement",
    criteriaValidated: "criteria validated",
    
    // Aperçu en temps réel
    livePreview: "Live Preview",
    realTimeUpdate: "Real-time update",
    characters: "characters",
    words: "words",
    qualityScore: "Quality Score",
    
    // Contexte et audience
    contextOptional: "Context (optional)",
    contextPlaceholder: "Provide usage context...",
    audiencePlaceholder: "Describe your target audience...",
    
    // Formats et structures
    paragraphs: "Paragraphs",
    numberedList: "Numbered List",
    jsonFormat: "JSON Format",
    
    // Marketplace
    marketplaceTitle: "Prompt Marketplace",
    marketplaceDescription: "Discover and buy prompts created by the community",
    search: "Search",
    searchPlaceholder: "Search prompts...",
    category: "Category",
    priceRange: "Price Range",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    sortBy: "Sort By",
    mostRecent: "Most Recent",
    cheapest: "Cheapest",
    mostSold: "Best Selling",
    license: "License",
    allLicenses: "All Licenses",
    featured: "Featured",
    buy: "Buy",
    reviews: "Reviews",
    rating: "Rating",
    salesCount: "Sales Count",
    marketplaceSales: "sales",
    noReviewsYet: "No reviews yet",
    buyToSeeComplete: "Buy to see complete content",
    noContentAvailable: "No content available",
    promptDetails: "Prompt Details",
    promptPreview: "Prompt Preview",
    customerReviews: "Customer Reviews",
    verifiedPurchase: "Verified Purchase",
    
    // Seller Dashboard
    sellerDashboard: "Seller Dashboard",
    managePrompts: "Manage your prompts and track your sales",
    publishPrompt: "Publish Prompt",
    totalEarnings: "Total Earnings",
    totalSales: "Total Sales",
    publishedPrompts: "Published Prompts",
    averageRating: "Average Rating",
    commission: "Commission deducted",
    myPrompts: "My Prompts",
    analytics: "Analytics",
    noPromptsPublished: "No prompts published",
    startPublishing: "Start publishing your prompts to generate revenue",

    // Additional common UI text
    choose: "Choose",
    selectPrompt: "Choose a prompt",
    selectLicense: "Choose a license",
    saving: "Saving...",
    quickPromptGenerator: "Quick Prompt Generator",
    describeWhatYouWant: "Describe what you want to accomplish and get an optimized prompt instantly",

    // Credit management
    buyCredits: "Buy Credits",
    recharge: "Recharge",
    credits: "credits",
    credit: "credit",
    depleted: "Depleted",
    low: "Low",
    creditManagement: "Credit Management",

    // Tabs and sections
    templates: "Templates",
    security: "Security",
    apiKeys: "API Keys"
  }
};

export default translations;
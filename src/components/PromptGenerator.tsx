import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Zap, Copy, Sparkles, Wand as Wand2, Save } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrompts } from "@/hooks/usePrompts";
import { useUserCredits } from "@/hooks/useUserCredits";
import { PromptEvaluationWidget } from "@/components/PromptEvaluationWidget";
import { opikService } from "@/services/opikService";
import { useAuth } from "@/contexts/AuthContext";
import { llmRouter } from "@/services/llmRouter";
import { AdvancedPromptCompressor } from "@/lib/advancedPromptCompressor";
import { iterativePromptOptimizer } from "@/services/iterativePromptOptimizer";
import { detectLanguage } from "@/lib/languageDetector";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/systemPromptBuilder";
import { useLanguage } from "@/contexts/LanguageContext";

const PromptGenerator = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  const { credits, useCredit } = useUserCredits();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    description: '',
    objective: '',
    targetAudience: '',
    format: '',
    tone: '',
    length: ''
  });
  
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTraceId, setCurrentTraceId] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<number | null>(null);
  const [compressionStats, setCompressionStats] = useState<{
    type: string;
    originalTokens: number;
    compressedTokens: number;
    reductionRate: number;
    qualityScore: number;
    techniques: string[];
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  // Nouvelles catégories restructurées
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

  // Sous-catégories pour chaque catégorie principale (correction de dataAnalysisSubcat)
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
      { value: 'data-analysis', label: t('dataAnalysis') }, // Correction ici (dataAnalysisSubcat -> dataAnalysis)
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

  // Options pour les formats de sortie
  const outputFormats = [
    { value: 'bullet-list', label: t('bulletList') },
    { value: 'structured-paragraph', label: t('structuredParagraph') },
    { value: 'table', label: t('table') },
    { value: 'numbered-steps', label: t('numberedSteps') },
    { value: 'dialogue', label: t('dialogue') },
    { value: 'code-script', label: t('codeScript') }
  ];

  // Options pour le ton/style
  const toneOptions = [
    { value: 'professional', label: t('professional') },
    { value: 'casual', label: t('casual') },
    { value: 'technical', label: t('technical') },
    { value: 'creative', label: t('creative') },
    { value: 'persuasive', label: t('persuasive') },
    { value: 'educational', label: t('educational') }
  ];

  // Options pour la longueur
  const lengthOptions = [
    { value: 'short', label: t('short') },
    { value: 'medium', label: t('medium') },
    { value: 'long', label: t('long') },
    { value: 'very-detailed', label: t('veryDetailed') }
  ];

  const getSubcategories = (categoryValue: string) => {
    return subcategories[categoryValue as keyof typeof subcategories] || [];
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
      subcategory: '' // Reset subcategory when category changes
    });
  };

  const generatePromptWithAI = async (formData: any) => {
    try {
      const isAuthenticated = !!user;
      const creditsRemaining = credits?.remaining_credits || 0;
      const userHasCredits = creditsRemaining > 0;
      const mode = creditsRemaining <= 10 ? 'free' : creditsRemaining <= 50 ? 'basic' : 'premium';

      console.log('🚀 Génération de prompt:', {
        isAuthenticated,
        userHasCredits,
        creditsRemaining,
        mode,
        requestedLength: formData.length
      });

      const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || formData.category;
      const subcategoryLabel = formData.subcategory ?
        getSubcategories(formData.category).find(sub => sub.value === formData.subcategory)?.label : '';

      // Détecter la langue de la description de l'utilisateur
      const detectedLanguage = detectLanguage(formData.description);

      // PRIORITÉ: Si la description est dans une langue différente du sélecteur, utiliser la langue détectée
      // Cela permet à un utilisateur arabophone d'écrire en arabe et d'obtenir un prompt en arabe
      // même si l'interface est en français
      const userLanguage = (detectedLanguage && detectedLanguage !== 'fr')
        ? detectedLanguage
        : (language as 'fr' | 'en' | 'ar');

      console.log('🌍 Langue du sélecteur:', language);
      console.log('🔍 Langue détectée dans la description:', detectedLanguage);
      console.log('✅ Langue finale utilisée:', userLanguage);
      console.log('📝 Description:', formData.description.substring(0, 50));

      // Déterminer les contraintes de longueur basées sur le mode premium
      const lengthConstraints = mode === 'premium' && formData.length ? {
        'short': { words: '50-100 mots', tokens: 300, description: 'Direct et efficace avec structure complète' },
        'medium': { words: '150-300 mots', tokens: 800, description: 'Équilibre optimal entre détail et performance' },
        'long': { words: '400-700 mots', tokens: 1800, description: 'Détaillé avec exemples et méthodologie' },
        'very-detailed': { words: '800-1500 mots', tokens: 3500, description: 'Complet avec workflows multi-étapes et exemples variés' }
      }[formData.length] : null;

      // Construire le system prompt dans la langue choisie par l'utilisateur
      const systemPrompt = buildSystemPrompt(userLanguage, mode, lengthConstraints);

      // Construire le user prompt dans la langue choisie par l'utilisateur
      const userPrompt = buildUserPrompt(userLanguage, {
        categoryLabel,
        subcategoryLabel,
        description: formData.description,
        objective: formData.objective,
        targetAudience: formData.targetAudience,
        format: formData.format ? outputFormats.find(f => f.value === formData.format)?.label : undefined,
        tone: formData.tone ? toneOptions.find(t => t.value === formData.tone)?.label : undefined,
        length: formData.length ? lengthOptions.find(l => l.value === formData.length)?.label : undefined
      });

      console.log('📝 System prompt langue:', userLanguage);
      console.log('📝 User prompt:', userPrompt.substring(0, 100));

      // Déterminer les tokens max selon le mode et la longueur demandée
      // MODE PREMIUM: Augmenter très significativement les limites
      const maxTokensByMode = mode === 'free'
        ? 2000  // Assez pour générer un prompt complet de 200-300 mots
        : mode === 'basic'
        ? 3000  // Assez pour générer un prompt complet de 300-400 mots
        : lengthConstraints
        ? Math.max(lengthConstraints.tokens * 3, 6000)  // Triple des tokens demandés, minimum 6000
        : 12000;  // Pour mode premium sans longueur spécifiée, utiliser 12000 tokens

      // MODE GRATUIT: Génération rapide + optimisation en arrière-plan
      let generatedContent = '';
      let llmResponse: any;

      // Toujours générer directement pour être rapide
      {
        llmResponse = await llmRouter.generatePrompt(
          systemPrompt,
          userPrompt,
          {
            isAuthenticated,
            userHasCredits,
            temperature: 0.7,
            maxTokens: maxTokensByMode,
            userId: user?.id
          }
        );

        console.log('✅ Réponse LLM reçue:', {
          provider: llmResponse.provider,
          model: llmResponse.model,
          tokens: llmResponse.usage.total_tokens,
          completion_tokens: llmResponse.usage.completion_tokens,
          maxTokensRequested: maxTokensByMode,
          mode: mode
        });

        generatedContent = llmResponse.content;

        // MODE GRATUIT: Optimiser en arrière-plan après génération
        if (mode === 'free' && user?.id) {
          console.log('🎯 MODE GRATUIT: Planification optimisation Opik en arrière-plan');
          // Retourner le résultat immédiatement, l'optimisation se fera après
          return {
            content: generatedContent,
            usage: llmResponse.usage,
            provider: llmResponse.provider,
            model: llmResponse.model,
            needsOptimization: true, // Flag pour déclencher optimisation après
            detectedLanguage: userLanguage // Passer la langue détectée pour l'optimisation
          };
        }
      }

      // Note: La compression a été remplacée par l'optimisation itérative Opik
      // qui garantit des prompts complets sans troncature en mode gratuit
      setCompressionStats(null);

      return {
        content: generatedContent,
        usage: llmResponse.usage,
        provider: llmResponse.provider,
        model: llmResponse.model,
        detectedLanguage: userLanguage // Toujours retourner la langue détectée
      };
    } catch (error) {
      console.error('Erreur lors de la génération du prompt:', error);
      throw error;
    }
  };

  const generatePrompt = async () => {
    if (!formData.category || !formData.description) {
      toast({
        title: t('missingInfo'),
        description: t('chooseCategoryDesc'),
        variant: "destructive"
      });
      return;
    }

    // Vérifier les crédits AVANT la génération
    const creditsRemaining = credits?.remaining_credits || 0;
    if (creditsRemaining <= 0) {
      toast({
        title: "Crédits épuisés",
        description: "Vous n'avez plus de crédits. Rechargez votre compte pour continuer.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();
    const traceId = opikService.generateTraceId();

    const mode = creditsRemaining <= 10 ? 'free' : creditsRemaining <= 50 ? 'basic' : 'premium';

    try {
      const result = await generatePromptWithAI(formData);
      const endTime = Date.now();
      const latencyMs = endTime - startTime;

      const finalPrompt = result.content;

      // Décompter le crédit après le succès de la génération (non bloquant)
      useCredit().catch(err => {
        console.error('Erreur lors du décompte du crédit:', err);
      });

      // Afficher le prompt (et déclencher optimisation si mode gratuit)
      setGeneratedPrompt(finalPrompt);
      setCurrentTraceId(traceId);
      setUserFeedback(null);

      // Déclencher l'optimisation en arrière-plan pour mode gratuit
      if (result.needsOptimization && user?.id && mode === 'free') {
        setOptimizationApplied(false);
        setIsOptimizing(true);

        // Optimiser en arrière-plan sans bloquer - passer la langue détectée
        optimizePromptInBackground(finalPrompt, traceId, formData, mode, result.detectedLanguage).catch(err => {
          console.error('Erreur optimisation arrière-plan:', err);
          setIsOptimizing(false);
        });
      }

      // Calculate cost (Mistral pricing: ~$0.001 per 1k tokens)
      const estimatedCost = (result.usage.total_tokens / 1000) * 0.001;

      // Track with Opik
      if (user) {
        console.log('📊 Tentative d\'enregistrement de trace Opik pour user:', user.id);
        const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || formData.category;
        const userPromptText = `Crée un prompt expert pour ${categoryLabel}: ${formData.description}`;

        const traceResult = await opikService.createTrace({
          userId: user.id,
          traceId: traceId,
          promptInput: userPromptText,
          promptOutput: finalPrompt,
          model: result.model,
          latencyMs: latencyMs,
          tokensUsed: result.usage.total_tokens,
          cost: estimatedCost,
          tags: {
            provider: result.provider,
            category: formData.category,
            subcategory: formData.subcategory,
            tone: formData.tone,
            mode: mode
          }
        });

        if (traceResult) {
          console.log('✅ Trace Opik enregistrée avec succès:', traceResult);
        } else {
          console.error('❌ Échec d\'enregistrement de la trace Opik');
        }
      } else {
        console.warn('⚠️ Utilisateur non authentifié - trace Opik non enregistrée');
      }
      
      const modeLabel = mode === 'free' ? 'Gratuit (150 tokens)' : mode === 'basic' ? 'Basique (300 tokens)' : 'Premium (600 tokens)';

      const successMessage = `Mode ${modeLabel} - Crédits restants: ${credits?.remaining_credits ? credits.remaining_credits - 1 : 0}`;

      toast({
        title: t('promptCreatedSuccess'),
        description: successMessage,
      });
    } catch (error) {
      console.error('Erreur:', error);
      
      let errorMessage = "Impossible de générer le prompt.";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte Mistral.";
      } else if (error.message.includes('connexion')) {
        errorMessage = "Vérifiez votre connexion internet.";
      }
      
      toast({
        title: t('generationError'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Optimise le prompt en arrière-plan avec Opik Optimizer
   * Sans bloquer l'affichage initial
   */
  const optimizePromptInBackground = async (
    initialPrompt: string,
    traceId: string,
    formData: any,
    mode: string,
    targetLanguage?: 'fr' | 'en' | 'ar'
  ) => {
    try {
      // Utiliser la langue fournie (déjà détectée lors de la génération) ou détecter
      const promptLanguage = targetLanguage || detectLanguage(initialPrompt);
      console.log('🔄 Optimisation Opik en arrière-plan démarrée...');
      console.log('🌍 Langue cible pour optimisation:', promptLanguage);
      console.log('🎯 Langue fournie:', targetLanguage || 'non fournie (détection automatique)');

      // Import dynamique pour ne pas ralentir le chargement initial
      const { opikOptimizer } = await import('@/services/opikOptimizer');

      // Appliquer l'optimisation Opik (rapide, local, pas d'appel LLM)
      // Note: on passe la langue cible pour forcer l'optimisation dans cette langue
      const optimizationResult = await opikOptimizer.optimizePrompt(
        initialPrompt,
        user!.id,
        formData.category,
        promptLanguage // Passer la langue détectée lors de la génération
      );

      console.log('✅ Optimisation Opik terminée:', {
        score: optimizationResult.score,
        improvements: optimizationResult.improvements.length,
        tokensReduced: optimizationResult.tokensReduced || 0
      });

      // Mettre à jour le prompt avec la version optimisée
      setGeneratedPrompt(optimizationResult.optimizedPrompt);
      setOptimizationApplied(true);
      setIsOptimizing(false);

      // Afficher un toast discret avec les améliorations
      toast({
        title: "✨ Prompt optimisé automatiquement",
        description: `${optimizationResult.improvements.length} amélioration(s) appliquée(s) - Score: ${Math.round(optimizationResult.score)}/10`,
      });

      // Mettre à jour la trace Opik avec le prompt optimisé
      if (traceId) {
        await opikService.createTrace({
          userId: user!.id,
          traceId: `${traceId}-optimized`,
          promptInput: initialPrompt,
          promptOutput: optimizationResult.optimizedPrompt,
          model: 'opik-optimizer',
          latencyMs: 0,
          tokensUsed: 0,
          tags: {
            type: 'optimization',
            mode: mode,
            score: optimizationResult.score,
            improvements: optimizationResult.improvements.length
          }
        });
      }
    } catch (error) {
      console.error('❌ Erreur optimisation arrière-plan:', error);
      setIsOptimizing(false);
      // Ne pas afficher d'erreur à l'utilisateur, le prompt initial reste utilisable
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: t('copiedSuccess'),
      description: t('promptCopiedClipboard'),
    });
  };

  const handleFeedback = async (score: number) => {
    console.log('🌟 handleFeedback appelé avec score:', score);
    console.log('🔍 currentTraceId:', currentTraceId);
    console.log('👤 user:', user?.id);

    if (!currentTraceId || !user) {
      console.warn('⚠️ Cannot save feedback: no trace ID or user');
      console.warn('   currentTraceId:', currentTraceId);
      console.warn('   user:', user);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'évaluation (pas de trace ID ou utilisateur non connecté)",
        variant: "destructive"
      });
      return;
    }

    setUserFeedback(score);

    try {
      console.log('📤 Envoi du feedback à Supabase...');
      const { error } = await opikService.updateTraceFeedback(currentTraceId, score);

      if (error) {
        console.error('❌ Error saving feedback:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer votre évaluation",
          variant: "destructive"
        });
      } else {
        console.log('✅ Feedback saved successfully for trace:', currentTraceId, 'with score:', score);
        toast({
          title: "Merci !",
          description: `Votre évaluation (${score}/5) a été enregistrée`,
        });
      }
    } catch (error) {
      console.error('❌ Exception saving feedback:', error);
      toast({
        title: "Erreur",
        description: "Une exception s'est produite",
        variant: "destructive"
      });
    }
  };

  const handleSavePrompt = async () => {
    if (!generatedPrompt) {
      toast({
        title: "Aucun prompt à sauvegarder",
        description: "Générez d'abord un prompt avant de le sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const categoryLabel = categories.find(cat => cat.value === formData.category)?.label || formData.category;
    const subcategoryLabel = formData.subcategory ? 
      getSubcategories(formData.category).find(sub => sub.value === formData.subcategory)?.label : '';

    let title = `Prompt ${categoryLabel}`;
    if (subcategoryLabel) {
      title += ` - ${subcategoryLabel}`;
    }

    await savePrompt({
      title: title,
      content: generatedPrompt,
      description: formData.description,
      category: formData.category,
      tags: [formData.category, formData.subcategory, formData.tone].filter(Boolean)
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulaire */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">{t('promptGeneratorTitle')}</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            {t('promptGeneratorDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Catégorie principale */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('mainCategory')} {t('required')}
            </Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder={t('selectDomain')} />
              </SelectTrigger>
              <SelectContent className="shadow-xl z-50 max-h-80">
                {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="font-medium py-3 px-4 hover:bg-accent cursor-pointer">
                      <div className="flex flex-col">
                        <div className="font-semibold text-foreground">{cat.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{cat.description}</div>
                      </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sous-catégorie */}
          {formData.category && getSubcategories(formData.category).length > 0 && (
            <div className="space-y-3">
              <Label htmlFor="subcategory" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {t('subcategory')} {t('optional')}
              </Label>
              <Select value={formData.subcategory} onValueChange={(value) => setFormData({...formData, subcategory: value})}>
                <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('chooseSpecialization')} />
                </SelectTrigger>
                <SelectContent className="shadow-xl z-50 max-h-80">
                  {getSubcategories(formData.category).map((subcat) => (
                    <SelectItem key={subcat.value} value={subcat.value} className="font-medium py-2 px-4 hover:bg-accent cursor-pointer">
                      <div className="text-foreground">{subcat.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description principale */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('taskDescription')} {t('required')}
            </Label>
            <Textarea
              id="description"
              placeholder={t('taskDescriptionPlaceholder')}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[100px] bg-white dark:bg-gray-800"
              rows={4}
            />
          </div>

          {/* Objectif */}
          <div className="space-y-3">
            <Label htmlFor="objective" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('mainObjective')} {t('optional')}
            </Label>
            <Input
              id="objective"
              placeholder={t('mainObjectivePlaceholder')}
              value={formData.objective}
              onChange={(e) => setFormData({...formData, objective: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Public cible */}
          <div className="space-y-3">
            <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('targetAudience')} {t('optional')}
            </Label>
            <Input
              id="targetAudience"
              placeholder={t('targetAudiencePlaceholder')}
              value={formData.targetAudience}
              onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
            />
          </div>

          {/* Format de sortie */}
          <div className="space-y-3">
            <Label htmlFor="format" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('outputFormat')} {t('optional')}
            </Label>
            <Select value={formData.format} onValueChange={(value) => setFormData({...formData, format: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder={t('chooseFormat')} />
              </SelectTrigger>
              <SelectContent className="shadow-xl z-50">
                {outputFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value} className="font-medium py-2 px-4 hover:bg-accent cursor-pointer">
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ton/Style */}
          <div className="space-y-3">
            <Label htmlFor="tone" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('toneStyle')} {t('optional')}
            </Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder={t('chooseTone')} />
              </SelectTrigger>
              <SelectContent className="shadow-xl z-50">
                {toneOptions.map((tone) => (
                  <SelectItem key={tone.value} value={tone.value} className="font-medium py-2 px-4 hover:bg-accent cursor-pointer">
                    {tone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Longueur */}
          <div className="space-y-3">
            <Label htmlFor="length" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {t('approximateLength')} {t('optional')}
            </Label>
            <Select value={formData.length} onValueChange={(value) => setFormData({...formData, length: value})}>
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder={t('chooseLength')} />
              </SelectTrigger>
              <SelectContent className="shadow-xl z-50">
                {lengthOptions.map((length) => (
                  <SelectItem key={length.value} value={length.value} className="font-medium py-2 px-4 hover:bg-accent cursor-pointer">
                    {length.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {credits && credits.remaining_credits > 50 && formData.length && (
              <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg">
                <span className="font-semibold">Mode Premium: </span>
                {formData.length === 'short' && '30-80 mots - Direct et efficace'}
                {formData.length === 'medium' && '80-200 mots - Équilibre optimal'}
                {formData.length === 'long' && '200-500 mots - Idéal pour briefs créatifs'}
                {formData.length === 'very-detailed' && '500-1000 mots - Workflows complexes'}
              </div>
            )}
          </div>

          <Button 
            onClick={generatePrompt} 
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 hover:from-violet-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                {t('generatingWithAI')}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                {t('generateWithAI')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">{t('aiGeneratedPrompt')}</span>
            {generatedPrompt && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                  <Copy className="h-4 w-4 mr-2" />
                  {t('copy')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSavePrompt} 
                  disabled={isSaving}
                  className="hover-lift glass-card border-white/30"
                >
                  {isSaving ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            {t('aiGeneratedPromptDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="glass-card border-white/30 p-6 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed max-h-96 overflow-y-auto">
                {generatedPrompt}
              </pre>
              {/* Indicateur d'optimisation en cours (mode gratuit) */}
              {isOptimizing && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      ✨ Optimisation automatique en cours avec Opik...
                    </p>
                  </div>
                </div>
              )}

              {/* Badge d'optimisation appliquée */}
              {optimizationApplied && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                    ✅ <strong>Prompt optimisé automatiquement</strong> : Structure améliorée, clarté renforcée, complétude garantie
                  </p>
                </div>
              )}

              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  🤖 <strong>{t('generatedByAI')} :</strong> {t('aiGeneratedDesc')}
                </p>
              </div>

              {/* Statistiques de compression (mode gratuit) */}
              {compressionStats && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-sm font-bold text-purple-900 dark:text-purple-100 mb-2">
                    🗜️ Compression Intelligente Appliquée
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-purple-700 dark:text-purple-300">
                    <div>
                      <span className="font-semibold">Type détecté:</span> {compressionStats.type}
                    </div>
                    <div>
                      <span className="font-semibold">Réduction:</span> {compressionStats.reductionRate}%
                    </div>
                    <div>
                      <span className="font-semibold">Tokens:</span> {compressionStats.originalTokens} → {compressionStats.compressedTokens}
                    </div>
                    <div>
                      <span className="font-semibold">Qualité:</span> {compressionStats.qualityScore}/100 {compressionStats.qualityScore >= 90 ? '✅' : compressionStats.qualityScore >= 70 ? '⚠️' : '❌'}
                    </div>
                  </div>
                  <details className="mt-2">
                    <summary className="text-xs font-semibold text-purple-800 dark:text-purple-200 cursor-pointer">
                      Voir techniques appliquées ({compressionStats.techniques.length})
                    </summary>
                    <ul className="mt-2 space-y-1 text-xs text-purple-600 dark:text-purple-400">
                      {compressionStats.techniques.map((tech, idx) => (
                        <li key={idx}>• {tech}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  💡 <strong>Astuce :</strong> Vous pouvez améliorer ce prompt dans la section <strong>Analytics</strong> pour optimiser sa qualité et ses performances.
                </p>
              </div>

              {/* Feedback avec étoiles */}
              {currentTraceId && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    ⭐ Comment évaluez-vous ce prompt ?
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleFeedback(star)}
                        className={`text-2xl transition-all hover:scale-110 ${
                          userFeedback && star <= userFeedback
                            ? 'text-yellow-500'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    {userFeedback && (
                      <span className="ml-2 text-sm text-blue-700 dark:text-blue-300 self-center">
                        {userFeedback}/5
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Widget d'évaluation intégré */}
              <div className="mt-6">
                <PromptEvaluationWidget
                  promptContent={generatedPrompt}
                  category={formData.category}
                  compact={true}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 rounded-2xl flex items-center justify-center">
                <Zap className="h-8 w-8 text-violet-400" />
              </div>
              <p className="font-medium text-lg mb-2">{t('readyForGeneration')}</p>
              <p className="text-sm">{t('aiWillCreate')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptGenerator;
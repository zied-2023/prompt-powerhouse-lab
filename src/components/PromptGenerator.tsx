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

const PromptGenerator = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  const { credits, useCredit } = useUserCredits();
  const { user } = useAuth();
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

      // Déterminer les contraintes de longueur basées sur le mode premium
      const lengthConstraints = mode === 'premium' && formData.length ? {
        'short': { words: '50-100 mots', tokens: 300, description: 'Direct et efficace avec structure complète' },
        'medium': { words: '150-300 mots', tokens: 800, description: 'Équilibre optimal entre détail et performance' },
        'long': { words: '400-700 mots', tokens: 1800, description: 'Détaillé avec exemples et méthodologie' },
        'very-detailed': { words: '800-1500 mots', tokens: 3500, description: 'Complet avec workflows multi-étapes et exemples variés' }
      }[formData.length] : null;

      const systemPrompt = mode === 'free'
        ? `Tu es expert en création de prompts IA structurés et efficaces.

Structure OBLIGATOIRE:
**RÔLE**: [Expert spécialisé]
**OBJECTIF**: [Précis et mesurable]
**CONTEXTE**: [Situation en 1-2 phrases]
**INSTRUCTIONS**:
- [Points clés directs]
**FORMAT**: [Type sortie]
**CONTRAINTES**: [Ton, style, limites]

RÈGLES CRITIQUES:
- IMPÉRATIF: Tu DOIS terminer COMPLÈTEMENT le prompt avant de t'arrêter
- JAMAIS de prompt tronqué ou incomplet
- Toutes les sections doivent être finies avec ponctuation finale
- Concis mais informatif (150-250 mots)
- Si tu manques d'espace, privilégie un prompt court MAIS COMPLET`
        : mode === 'basic'
        ? `Tu es expert en création de prompts IA structurés.

Structure OBLIGATOIRE:
**RÔLE**: [Expert type]
**OBJECTIF**: [Précis, mesurable]
**INSTRUCTIONS**:
- [Points clés directs]
**FORMAT**: [Type sortie]
**CONTRAINTES**: [Limites et style]

RÈGLES CRITIQUES:
- IMPÉRATIF: Tu DOIS terminer COMPLÈTEMENT le prompt
- JAMAIS de texte tronqué ou incomplet
- Toutes les sections finies avec ponctuation
- 250-350 mots maximum
- Privilégie COMPLET sur LONG`
        : lengthConstraints
        ? `Tu es un expert en création de prompts IA professionnels. Crée un prompt COMPLET et structuré.

Structure OBLIGATOIRE - CHAQUE SECTION DOIT ÊTRE COMPLÈTE:

# RÔLE
[Expert spécialisé - ${lengthConstraints.words.includes('800-1500') ? '2-3' : '1-2'} phrases complètes]

# CONTEXTE
[Situation et enjeux - ${lengthConstraints.words.includes('800-1500') ? '3-4' : lengthConstraints.words.includes('400-700') ? '2-3' : '2'} phrases complètes]

# OBJECTIF
[Objectif mesurable avec critères précis]

# INSTRUCTIONS
${lengthConstraints.words.includes('800-1500') ? '1-8. [6-8 étapes détaillées]' : lengthConstraints.words.includes('400-700') ? '1-6. [4-6 étapes]' : '1-5. [3-5 étapes]'}

# FORMAT DE SORTIE
[Description du format attendu]
${lengthConstraints.words.includes('800-1500') || lengthConstraints.words.includes('400-700') ? '[Si tableau nécessaire: inclure 2-3 lignes de données]' : ''}

# CONTRAINTES
• Longueur: ${lengthConstraints.words}
• [2-3 autres contraintes précises]

${lengthConstraints.words.includes('400-700') || lengthConstraints.words.includes('800-1500') ? '# EXEMPLE\n[1 exemple concret illustrant le format]' : ''}

IMPORTANT: Termine TOUTES les sections avant la limite de tokens.`
        : `Expert prompts IA. Max 600 tokens strict.

Structure OBLIGATOIRE:
**RÔLE**: [Expert spécialisé]
**OBJECTIF**: [Précis et mesurable]
**INSTRUCTIONS**:
- [Étapes avec méthodologie intégrée]
**ÉLÉMENTS REQUIS**: [2-3 éléments clés]
**LIVRABLE**: [Format structuré]

Max 3 styles. ZÉRO exemple long. ZÉRO section méthodologie séparée. Instructions ultra-directes sans justification.`;

      let userPrompt = `Crée un prompt expert pour:
- Domaine: ${categoryLabel}
${subcategoryLabel ? `- Spécialisation: ${subcategoryLabel}` : ''}
- Description: ${formData.description}`;

      if (formData.objective) userPrompt += `\n- Objectif: ${formData.objective}`;
      if (formData.targetAudience) userPrompt += `\n- Public cible: ${formData.targetAudience}`;
      if (formData.format) userPrompt += `\n- Format souhaité: ${outputFormats.find(f => f.value === formData.format)?.label}`;
      if (formData.tone) userPrompt += `\n- Ton: ${toneOptions.find(t => t.value === formData.tone)?.label}`;
      if (formData.length && lengthConstraints) {
        userPrompt += `\n- Longueur demandée: ${lengthConstraints.words} (RESPECTER STRICTEMENT cette contrainte)`;
      } else if (formData.length) {
        userPrompt += `\n- Longueur: ${lengthOptions.find(l => l.value === formData.length)?.label}`;
      }

      // Déterminer les tokens max selon le mode et la longueur demandée
      // MODE PREMIUM: Augmenter très significativement les limites
      const maxTokensByMode = mode === 'free'
        ? 2000  // Assez pour générer un prompt complet de 200-300 mots
        : mode === 'basic'
        ? 3000  // Assez pour générer un prompt complet de 300-400 mots
        : lengthConstraints
        ? Math.max(lengthConstraints.tokens * 3, 6000)  // Triple des tokens demandés, minimum 6000
        : 12000;  // Pour mode premium sans longueur spécifiée, utiliser 12000 tokens

      // Génération rapide directe avec LLM (sans Opik)
      const llmResponse = await llmRouter.generatePrompt(
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

      // Appliquer compression intelligente en mode gratuit (DÉSACTIVÉE pour éviter troncatures)
      let generatedContent = llmResponse.content;

      // TEMPORAIREMENT DÉSACTIVÉ: La compression causait des troncatures
      // TODO: Réactiver après optimisation complète
      const ENABLE_COMPRESSION = false;

      if (mode === 'free' && ENABLE_COMPRESSION) {
        console.log('🗜️ Application compression avancée (mode gratuit)...');
        const compressionResult = AdvancedPromptCompressor.compressFreeMode(generatedContent);
        generatedContent = compressionResult.compressed;

        console.log('✅ Compression terminée:', {
          type: compressionResult.type,
          originalTokens: compressionResult.originalTokens,
          compressedTokens: compressionResult.compressedTokens,
          reduction: `${compressionResult.reductionRate}%`,
          quality: `${compressionResult.qualityScore}/100`,
          techniques: compressionResult.appliedTechniques.length
        });

        // Sauvegarder stats pour affichage
        setCompressionStats({
          type: compressionResult.type,
          originalTokens: compressionResult.originalTokens,
          compressedTokens: compressionResult.compressedTokens,
          reductionRate: compressionResult.reductionRate,
          qualityScore: compressionResult.qualityScore,
          techniques: compressionResult.appliedTechniques
        });
      } else {
        setCompressionStats(null);
      }

      return {
        content: generatedContent,
        usage: llmResponse.usage,
        provider: llmResponse.provider,
        model: llmResponse.model
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

      setGeneratedPrompt(finalPrompt);
      setCurrentTraceId(traceId);
      setUserFeedback(null);

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
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
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
                <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
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
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
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
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
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
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
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
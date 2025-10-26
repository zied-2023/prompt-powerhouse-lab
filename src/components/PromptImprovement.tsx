import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { RefreshCw, Copy, TrendingUp, CircleCheck as CheckCircle, Save } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { usePrompts } from "@/hooks/usePrompts";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useImprovedPrompts } from "@/hooks/useImprovedPrompts";
import { PromptEvaluationWidget } from "@/components/PromptEvaluationWidget";
import { opikService } from "@/services/opikService";
import { useAuth } from "@/contexts/AuthContext";
import { llmRouter } from "@/services/llmRouter";
import { opikOptimizer } from "@/services/opikOptimizer";
import { iterativePromptOptimizer } from "@/services/iterativePromptOptimizer";

const PromptImprovement = () => {
  const { t } = useTranslation();
  const { savePrompt, isSaving } = usePrompts();
  const { credits, useCredit, refetchCredits } = useUserCredits();
  const { saveImprovedPrompt, isSaving: isSavingImprovedPrompt } = useImprovedPrompts();
  const { user } = useAuth();
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [improvementObjective, setImprovementObjective] = useState('');
  const [improvedPrompt, setImprovedPrompt] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [isImproving, setIsImproving] = useState(false);
  const [currentTraceId, setCurrentTraceId] = useState<string | null>(null);
  const [userFeedback, setUserFeedback] = useState<number | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);

  const improvePromptWithAI = async () => {
    if (!originalPrompt.trim()) {
      toast({
        title: t('missingInfo'),
        description: t('enterOriginalPrompt'),
        variant: "destructive"
      });
      return;
    }

    // Vérifier les crédits AVANT l'amélioration
    const creditsRemaining = credits?.remaining_credits || 0;
    if (creditsRemaining <= 0) {
      toast({
        title: "Crédits épuisés",
        description: "Vous n'avez plus de crédits. Rechargez votre compte pour continuer.",
        variant: "destructive"
      });
      return;
    }

    setIsImproving(true);
    const startTime = Date.now();
    const traceId = opikService.generateTraceId();

    const isAuthenticated = !!user;
    const userHasCredits = creditsRemaining > 0;

    console.log('🚀 Amélioration de prompt:', {
      isAuthenticated,
      userHasCredits,
      creditsRemaining
    });

    // Déterminer le mode selon les crédits
    const mode = creditsRemaining <= 10 ? 'free' : creditsRemaining <= 50 ? 'basic' : 'premium';
    const modeLabel = mode === 'free' ? 'Gratuit' : mode === 'basic' ? 'Basique' : 'Premium';

    try {
      const systemPrompt = mode === 'premium'
        ? `Tu es un expert en ingénierie de prompt. RÈGLE ABSOLUE: Le prompt amélioré DOIT être COMPLET avec toutes les sections TERMINÉES.

RÈGLES NON-NÉGOCIABLES:
1. TOUTES les sections doivent être COMPLÈTES avec ponctuation finale
2. JAMAIS de texte tronqué ou coupé au milieu d'une phrase
3. Chaque section DOIT se terminer par un point
4. Le prompt DOIT être autonome et prêt à l'emploi
5. Structure COMPLÈTE obligatoire

Structure OBLIGATOIRE du prompt amélioré - CHAQUE SECTION DOIT ÊTRE COMPLÈTE:

🎯 **CONTEXTE & OBJECTIF**
[2-3 phrases COMPLÈTES avec point final]

🧑‍💻 **RÔLE DE L'IA**
[2 phrases COMPLÈTES définissant le rôle avec point final]

🗂 **STRUCTURE DU LIVRABLE**
[Format exact avec exemples - 2-3 phrases COMPLÈTES avec point final]

📏 **CONTRAINTES**
- Longueur: [spécification COMPLÈTE]
- Ton: [spécification COMPLÈTE]
- Style: [spécification COMPLÈTE]
- Règles spécifiques: [liste COMPLÈTE]

📝 **EXEMPLE DE SORTIE**
[Exemple concret illustrant le format - TERMINÉ avec point final]

---

**AMÉLIORATIONS APPORTÉES:**
• [3-6 améliorations concrètes - chacune COMPLÈTE avec point final]

VÉRIFICATION FINALE OBLIGATOIRE:
- Vérifie que CHAQUE section se termine par un point
- Vérifie qu'AUCUNE phrase n'est coupée
- Si manque d'espace, RÉDUIS le détail mais TERMINE toutes les sections`
        : `Tu es un expert en ingénierie de prompt. Ta mission est de transformer un prompt brut en un prompt structuré, clair et directement utilisable.

Structure OBLIGATOIRE du prompt amélioré:

🎯 **CONTEXTE & OBJECTIF**
[Expliquer en 2 phrases ce que doit produire l'IA et pourquoi]

🧑‍💻 **RÔLE DE L'IA**
[Définir le rôle ou la personnalité que l'IA doit adopter]

🗂 **STRUCTURE DU LIVRABLE**
[Indiquer le format exact attendu : JSON, tableau, plan narratif, sections, etc.]

📏 **CONTRAINTES**
- Longueur: [préciser]
- Ton: [préciser]
- Style: [préciser]
- Règles spécifiques: [préciser]

📝 **EXEMPLE DE SORTIE**
[Fournir un mini-exemple (30 sec ou 2-3 lignes) qui illustre le format attendu]

---

**AMÉLIORATIONS APPORTÉES:**
• [Liste 3-6 améliorations concrètes]

RÈGLES:
- Le prompt doit être autonome et prêt à l'emploi
- Ne jamais mélanger explications et prompt final
- Adapter le ton selon le type de contenu
- Maximum 1000 tokens`;

      let userPrompt = `Améliore ce prompt: "${originalPrompt}"`;
      if (improvementObjective.trim()) {
        userPrompt += `\n\nObjectif d'amélioration spécifique: ${improvementObjective}`;
      }

      let finalPrompt = '';
      let optimizationScore: number | null = null;
      let llmResponse: any;
      let extractedPrompt = '';

      // MODE PREMIUM: Utiliser l'optimisation itérative pour garantir la complétude
      if (mode === 'premium' && user) {
        console.log('🔄 Mode Premium Improvement: Utilisation de l\'optimisation itérative Opik');

        // Utiliser 10000 tokens pour laisser de la place aux tableaux et exemples détaillés
        const iterativeResult = await iterativePromptOptimizer.optimizeUntilComplete(
          systemPrompt,
          userPrompt,
          user.id,
          10000,
          'premium'
        );

        finalPrompt = iterativeResult.finalPrompt;

        console.log('✅ Optimisation itérative Improvement terminée:', {
          iterations: iterativeResult.iterations,
          completenessScore: Math.round(iterativeResult.completenessScore.overall * 100) + '%',
          improvements: iterativeResult.improvements
        });

        // Ajouter les améliorations itératives à la liste
        const improvementsList = iterativeResult.improvements.map(imp => `[Opik Itératif] ${imp}`);
        setImprovements(improvementsList);

        optimizationScore = iterativeResult.completenessScore.overall * 10;

        // Créer un objet llmResponse fictif pour compatibilité
        llmResponse = {
          content: finalPrompt,
          provider: 'opik-iterative',
          model: 'iterative-optimizer',
          usage: { total_tokens: 0, completion_tokens: 0, prompt_tokens: 0 }
        };

        // Afficher notification de succès
        toast({
          title: "✅ Amélioration Premium avec Opik",
          description: `${iterativeResult.iterations} itération(s) - Score: ${Math.round(iterativeResult.completenessScore.overall * 100)}%`,
        });
      } else {
        // Modes FREE et BASIC: Génération standard
        llmResponse = await llmRouter.generatePrompt(
          systemPrompt,
          userPrompt,
          {
            isAuthenticated,
            userHasCredits,
            temperature: 0.7,
            maxTokens: 8000
          }
        );

        console.log('✅ Réponse LLM reçue:', {
          provider: llmResponse.provider,
          model: llmResponse.model,
          tokens: llmResponse.usage.total_tokens
        });

        const content = llmResponse.content;

        const improvedPromptMatch = content.match(/🎯(.*?)---/s);
        const improvementsMatch = content.match(/\*\*AMÉLIORATIONS APPORTÉES:\*\*(.*)/s);

        if (improvedPromptMatch) {
          extractedPrompt = '🎯' + improvedPromptMatch[1].trim();
        } else {
          extractedPrompt = content;
        }

        if (improvementsMatch) {
          const improvementsList = improvementsMatch[1]
            .split('•')
            .filter(item => item.trim())
            .map(item => item.trim());
          setImprovements(improvementsList);
        }

        // Optimisation Opik pour mode gratuit
        if (mode === 'free' && user) {
          console.log(`🎯 Mode ${modeLabel} - Application de l'optimisation Opik`);

          try {
            const optimization = await opikOptimizer.optimizePrompt(
              extractedPrompt,
              user.id,
              'improvement'
            );
            finalPrompt = optimization.optimizedPrompt;
            optimizationScore = optimization.score;

            console.log('✨ Optimisation Opik appliquée (Improvement)');
            console.log(`📊 Score de qualité: ${optimization.score}/10`);

            // Ajouter les améliorations Opik à la liste
            if (optimization.improvements.length > 0) {
              setImprovements(prev => [...prev, ...optimization.improvements.map(imp => `[Opik] ${imp}`)]);
            }
          } catch (error) {
            console.warn(`⚠️ Erreur Opik (${modeLabel}), utilisation du prompt original:`, error);
            finalPrompt = extractedPrompt;
          }
        } else {
          console.log(`🎯 Mode ${modeLabel} - Amélioration sans Opik`);
          finalPrompt = extractedPrompt;
        }
      }

      // Stocker le score de qualité
      if (optimizationScore !== null) {
        setQualityScore(optimizationScore);
      }

      setImprovedPrompt(finalPrompt);

        setCurrentTraceId(traceId);
        setUserFeedback(null);

        const endTime = Date.now();
        const latencyMs = endTime - startTime;

        // Décompter le crédit après le succès (non bloquant)
        useCredit().catch(err => {
          console.error('Erreur lors du décompte du crédit:', err);
        });

        // Calculate cost
        const tokensUsed = llmResponse.usage.total_tokens;
        const estimatedCost = (tokensUsed / 1000) * 0.001;

        // Track with Opik
        if (user) {
          console.log('📊 Enregistrement trace Opik (Improvement) pour user:', user.id);
          const userPromptText = improvementObjective
            ? `Améliore ce prompt: "${originalPrompt}" - Objectif: ${improvementObjective}`
            : `Améliore ce prompt: "${originalPrompt}"`;

          const traceResult = await opikService.createTrace({
            userId: user.id,
            traceId: traceId,
            promptInput: userPromptText,
            promptOutput: finalPrompt,
            model: llmResponse.model,
            latencyMs: latencyMs,
            tokensUsed: tokensUsed,
            cost: estimatedCost,
            tags: {
              provider: llmResponse.provider,
              type: 'improvement',
              has_objective: !!improvementObjective,
              mode: mode,
              opik_optimized: optimizationScore !== null,
              opik_score: optimizationScore
            }
          });

          if (traceResult) {
            console.log('✅ Trace Opik (Improvement) enregistrée:', traceResult);
          } else {
            console.error('❌ Échec trace Opik (Improvement)');
          }
        }

        let successMessage = `${t('improvementSuccessDesc')} Crédits restants: ${credits?.remaining_credits ? credits.remaining_credits - 1 : 0}`;
        if (optimizationScore !== null) {
          successMessage += `\n✨ Optimisé par Opik (Score: ${optimizationScore.toFixed(1)}/10)`;
        }

        toast({
          title: t('improvementSuccess'),
          description: successMessage,
        });
    } catch (error: any) {
      console.error('Erreur lors de l\'amélioration du prompt:', error);
      console.error('Détails de l\'erreur:', {
        message: error?.message,
        name: error?.name,
        stack: error?.stack
      });

      let errorMessage = "Impossible d'améliorer le prompt.";

      if (error?.message) {
        if (error.message.includes('crédits') || error.message.includes('402')) {
          errorMessage = "La clé API n'a plus de crédits. Veuillez contacter l'administrateur.";
        } else if (error.message.includes('Timeout') || error.message.includes('timeout')) {
          errorMessage = "Le délai d'attente a été dépassé. Réessayez avec un prompt plus court.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = "Erreur de connexion réseau. Vérifiez votre connexion internet.";
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = "Erreur d'authentification API. Clé API invalide ou expirée.";
        } else {
          errorMessage = `Erreur: ${error.message}`;
        }
      }

      toast({
        title: t('generationError'),
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(improvedPrompt);
    toast({
      title: t('copiedSuccess'),
      description: t('promptCopiedClipboard'),
    });
  };

  const handleSaveImprovedPrompt = async () => {
    if (!improvedPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Aucun prompt amélioré à sauvegarder",
        variant: "destructive"
      });
      return;
    }

    // Demander un titre pour le prompt
    const title = window.prompt("Titre du prompt amélioré:", "Prompt amélioré");
    if (!title) return;

    try {
      await saveImprovedPrompt({
        originalPrompt: originalPrompt,
        improvedPrompt: improvedPrompt,
        qualityScore: 7.5,
        improvements: improvements,
        title: title,
        opikTraceId: currentTraceId || undefined
      });

      toast({
        title: "Succès",
        description: "Prompt amélioré sauvegardé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le prompt amélioré",
        variant: "destructive"
      });
    }
  };

  const handleFeedback = async (score: number) => {
    console.log('🌟 handleFeedback (Improvement) appelé avec score:', score);
    console.log('🔍 currentTraceId:', currentTraceId);
    console.log('👤 user:', user?.id);

    if (!currentTraceId || !user) {
      console.warn('⚠️ Cannot save feedback: no trace ID or user');
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'évaluation",
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
    if (!improvedPrompt.trim()) {
      toast({
        title: "Erreur",
        description: "Aucun prompt amélioré à sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const promptData = {
      title: `Prompt amélioré - ${new Date().toLocaleDateString()}`,
      content: improvedPrompt,
      description: `Prompt amélioré à partir de: "${originalPrompt.substring(0, 100)}..."`,
      category: "Amélioration",
      tags: ["amélioration", "optimisé"],
      is_public: false
    };

    const result = await savePrompt(promptData);
    if (result) {
      toast({
        title: "Prompt sauvegardé",
        description: "Votre prompt amélioré a été sauvegardé avec succès !",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulaire d'amélioration */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">{t('improvementTitle')}</span>
          </CardTitle>
          <CardDescription className="text-gray-600 font-medium">
            {t('improvementDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt original */}
          <div className="space-y-3">
            <Label htmlFor="originalPrompt" className="text-sm font-semibold text-gray-700">
              {t('originalPrompt')} {t('required')}
            </Label>
            <Textarea
              id="originalPrompt"
              placeholder={t('originalPromptPlaceholder')}
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              className="animated-border hover:shadow-lg transition-all duration-200 font-medium resize-none min-h-[120px] bg-white"
              rows={5}
            />
          </div>

          {/* Objectif d'amélioration */}
          <div className="space-y-3">
            <Label htmlFor="improvementObjective" className="text-sm font-semibold text-gray-700">
              {t('improvementObjective')} {t('optional')}
            </Label>
            <Input
              id="improvementObjective"
              placeholder={t('improvementObjectivePlaceholder')}
              value={improvementObjective}
              onChange={(e) => setImprovementObjective(e.target.value)}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white"
            />
          </div>

          <Button 
            onClick={improvePromptWithAI} 
            disabled={isImproving}
            className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isImproving ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                {t('improvingPrompt')}
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-3" />
                {t('improvePrompt')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Résultat */}
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">{t('improvedPrompt')}</span>
            <div className="flex items-center gap-3">
              {qualityScore !== null && qualityScore > 0 && (
                <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-xs font-bold shadow-lg">
                  Score Opik: {qualityScore.toFixed(1)}/10
                </div>
              )}
              {improvedPrompt && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                    <Copy className="h-4 w-4 mr-2" />
                    {t('copy')}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveImprovedPrompt}
                    disabled={isSavingImprovedPrompt}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg"
                  >
                    {isSavingImprovedPrompt ? (
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            {t('improvedPromptDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {improvedPrompt ? (
            <div className="space-y-6">
              {/* Prompt amélioré */}
              <div className="glass-card border-white/30 p-6 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed max-h-80 overflow-y-auto">
                  {improvedPrompt}
                </pre>
              </div>
              
              {/* Améliorations apportées */}
              {improvements.length > 0 && (
                <div className="glass-card border-white/30 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                    {t('improvements')}
                  </h4>
                  <ul className="space-y-2">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  🤖 <strong>{t('generatedByAI')} :</strong> {t('aiGeneratedDesc')}
                </p>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  💡 <strong>Astuce :</strong> Vous pouvez analyser et optimiser davantage ce prompt dans la section <strong>Analytics</strong> pour suivre ses performances.
                </p>
              </div>

              {/* Feedback avec étoiles */}
              {currentTraceId && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    ⭐ Comment évaluez-vous ce prompt amélioré ?
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

              {/* Widget d'évaluation pour le prompt amélioré */}
              <div className="mt-6">
                <PromptEvaluationWidget
                  promptContent={improvedPrompt}
                  category="improvement"
                  compact={true}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-emerald-400" />
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

export default PromptImprovement;

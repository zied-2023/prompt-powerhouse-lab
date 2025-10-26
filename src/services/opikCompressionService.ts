/**
 * Service de compression intelligente avec Opik
 * Compresse les prompts tout en maintenant la complétude et le format propre
 */

import { llmRouter } from './llmRouter';
import { opikService } from './opikService';
import { iterativePromptOptimizer } from './iterativePromptOptimizer';
import { cleanExcessiveFormatting } from '@/lib/promptFormatter';
import { SEMANTIC_COMPRESSION_STEPS } from '@/lib/semanticCompressionGuide';

export interface CompressionResult {
  originalPrompt: string;
  compressedPrompt: string;
  originalTokens: number;
  compressedTokens: number;
  compressionRate: number;
  isComplete: boolean;
  completenessScore: number;
  techniques: string[];
  traceId?: string;
}

export interface CompressionOptions {
  userId?: string;
  mode: 'free' | 'basic' | 'premium';
  targetReduction?: number; // Pourcentage de réduction cible (ex: 40 pour 40%)
  maintainCompleteness?: boolean; // true par défaut
  cleanFormat?: boolean; // true par défaut - enlever les étoiles excessives
}

class OpikCompressionService {
  /**
   * Estime le nombre de tokens (1 token ≈ 4 caractères)
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Compresse un prompt avec Opik en maintenant la complétude
   */
  async compressPrompt(
    prompt: string,
    options: CompressionOptions
  ): Promise<CompressionResult> {
    const {
      userId,
      mode,
      targetReduction = 40,
      maintainCompleteness = true,
      cleanFormat = true
    } = options;

    const originalTokens = this.estimateTokens(prompt);
    const techniques: string[] = [];

    console.log('🗜️ Compression Opik démarrée:', {
      mode,
      originalTokens,
      targetReduction,
      maintainCompleteness,
      cleanFormat
    });

    // Étape 1: Nettoyer le format si demandé
    let processedPrompt = prompt;
    if (cleanFormat) {
      processedPrompt = cleanExcessiveFormatting(prompt);
      const tokensAfterClean = this.estimateTokens(processedPrompt);
      if (tokensAfterClean < originalTokens) {
        techniques.push(`Format nettoyé (-${originalTokens - tokensAfterClean} tokens)`);
      }
    }

    // Étape 2: Compression intelligente avec LLM
    const systemPrompt = this.buildCompressionSystemPrompt(
      mode,
      targetReduction,
      maintainCompleteness
    );

    const userPrompt = `Compresse ce prompt en réduisant d'environ ${targetReduction}% les tokens tout en maintenant TOUTES les informations essentielles:

${processedPrompt}

IMPORTANT: Le prompt compressé doit rester COMPLET et FONCTIONNEL.`;

    let compressedPrompt: string;
    let completenessScore = 1.0;
    let traceId: string | undefined;

    // MODE PREMIUM: Utiliser l'optimisation itérative pour garantir complétude après compression
    if (mode === 'premium' && userId && maintainCompleteness) {
      console.log('🔄 Mode Premium: Compression avec validation Opik');

      const maxTokens = Math.ceil(originalTokens * (1 - targetReduction / 100) * 1.5);

      const iterativeResult = await iterativePromptOptimizer.optimizeUntilComplete(
        systemPrompt,
        userPrompt,
        userId,
        maxTokens,
        mode
      );

      compressedPrompt = iterativeResult.finalPrompt;
      completenessScore = iterativeResult.completenessScore.overall;
      traceId = iterativeResult.traceId;

      techniques.push(`Compression itérative Opik (${iterativeResult.iterations} itération(s))`);
      techniques.push(...iterativeResult.improvements);
    } else {
      // Modes FREE/BASIC: Compression simple via LLM
      const response = await llmRouter.generatePrompt(
        systemPrompt,
        userPrompt,
        {
          isAuthenticated: !!userId,
          userHasCredits: true,
          temperature: 0.3, // Température basse pour compression fidèle
          maxTokens: Math.ceil(originalTokens * (1 - targetReduction / 100)),
          userId
        }
      );

      compressedPrompt = response.content;
      techniques.push('Compression standard');

      // Logger dans Opik si possible
      if (userId) {
        traceId = opikService.generateTraceId();
        await opikService.createTrace({
          userId,
          traceId,
          promptInput: prompt,
          promptOutput: compressedPrompt,
          model: response.model,
          latencyMs: 0,
          tokensUsed: response.usage.total_tokens,
          feedbackScore: 4,
          tags: {
            type: 'compression',
            mode,
            targetReduction
          }
        });
      }
    }

    // Nettoyer le format final
    if (cleanFormat) {
      compressedPrompt = cleanExcessiveFormatting(compressedPrompt);
    }

    // Calculer les métriques finales
    const compressedTokens = this.estimateTokens(compressedPrompt);
    const compressionRate = ((originalTokens - compressedTokens) / originalTokens) * 100;

    const result: CompressionResult = {
      originalPrompt: prompt,
      compressedPrompt,
      originalTokens,
      compressedTokens,
      compressionRate,
      isComplete: completenessScore >= 0.9,
      completenessScore,
      techniques,
      traceId
    };

    console.log('✅ Compression terminée:', {
      compressionRate: `${Math.round(compressionRate)}%`,
      tokensReduced: originalTokens - compressedTokens,
      completenessScore: `${Math.round(completenessScore * 100)}%`
    });

    return result;
  }

  /**
   * Construit le system prompt pour la compression
   */
  private buildCompressionSystemPrompt(
    mode: 'free' | 'basic' | 'premium',
    targetReduction: number,
    maintainCompleteness: boolean
  ): string {
    const basePrompt = `Tu es un expert en compression de prompts IA. Ta mission est de réduire la longueur tout en préservant l'essence et la fonctionnalité.

${SEMANTIC_COMPRESSION_STEPS}

RÈGLES D'APPLICATION:
• Étape 1: Identifier et garder valeurs essentielles (contraintes, critères)
• Étape 2: Fusionner phrases similaires
• Étape 3: Hiérarchiser en 3 blocs clairs
• Étape 4: Compacter langage ("doit" vs "il faut que")
• Étape 5: Standardiser format (# titres, • listes)
• Étape 6: Exemples courts mais substantiels (min 3 lignes)
• Étape 7: Vérifier contraintes chiffrées, zéro phrase orpheline
• Étape 8: Modulariser sections`;

    if (maintainCompleteness && mode === 'premium') {
      return `${basePrompt}

RÈGLES CRITIQUES DE COMPLÉTUDE:
- JAMAIS couper au milieu d'une section
- Toutes les sections doivent être TERMINÉES
- Chaque liste doit avoir au moins 2-3 éléments
- Chaque tableau doit avoir au moins 2-3 lignes de données
- Contraintes doivent rester chiffrées
- Exemples doivent rester substantiels (≥3 lignes)

OBJECTIF: Réduire d'environ ${targetReduction}% TOUT EN maintenant un prompt COMPLET à 100%.

VÉRIFICATION FINALE:
- Le prompt compressé doit être autonome
- Toutes les informations critiques doivent être présentes
- Format propre et lisible
- Aucune phrase tronquée`;
    }

    return `${basePrompt}

OBJECTIF: Réduire d'environ ${targetReduction}% en gardant les informations essentielles.

FORMAT: Utiliser # pour les titres, • pour les listes. Rester clair et structuré.`;
  }

  /**
   * Compresse et améliore un prompt en une seule opération
   * Idéal pour l'amélioration de prompts
   */
  async compressAndImprove(
    prompt: string,
    improvementObjective: string,
    options: CompressionOptions
  ): Promise<CompressionResult> {
    const {
      userId,
      mode,
      targetReduction = 30, // Réduction plus douce pour l'amélioration
      maintainCompleteness = true,
      cleanFormat = true
    } = options;

    const originalTokens = this.estimateTokens(prompt);
    const techniques: string[] = [];

    console.log('🔄 Compression + Amélioration Opik:', {
      mode,
      originalTokens,
      improvementObjective
    });

    const systemPrompt = `Tu es un expert en optimisation de prompts IA. Ta mission est d'AMÉLIORER et COMPRESSER simultanément.

RÈGLES D'AMÉLIORATION + COMPRESSION:
1. Améliorer la clarté et la précision
2. Ajouter des contraintes manquantes
3. Éliminer redondances et verbosité
4. Format propre avec # (pas trop d'étoiles **)
5. Structure logique et complète

OBJECTIF DOUBLE:
• AMÉLIORER le prompt selon l'objectif fourni
• RÉDUIRE d'environ ${targetReduction}% tout en maintenant complétude

${maintainCompleteness ? `
RÈGLES CRITIQUES DE COMPLÉTUDE:
- Toutes sections TERMINÉES
- Tableaux avec min 2-3 lignes de données
- Contraintes chiffrées
- Exemples substantiels (≥3 lignes)
- Aucune troncation
` : ''}

FORMAT: # pour titres, • pour listes. Clair et professionnel.`;

    const userPrompt = `Améliore ET compresse ce prompt:

PROMPT ORIGINAL:
${prompt}

OBJECTIF D'AMÉLIORATION:
${improvementObjective}

Retourne le prompt optimisé: amélioré MAIS plus concis (environ ${targetReduction}% plus court).`;

    let improvedPrompt: string;
    let completenessScore = 1.0;
    let traceId: string | undefined;

    // MODE PREMIUM: Optimisation itérative
    if (mode === 'premium' && userId && maintainCompleteness) {
      const maxTokens = llmRouter.getRecommendedMaxTokens('premium', 'mistral');

      const iterativeResult = await iterativePromptOptimizer.optimizeUntilComplete(
        systemPrompt,
        userPrompt,
        userId,
        maxTokens,
        mode
      );

      improvedPrompt = iterativeResult.finalPrompt;
      completenessScore = iterativeResult.completenessScore.overall;
      traceId = iterativeResult.traceId;

      techniques.push(`Amélioration + Compression Opik (${iterativeResult.iterations} iter)`);
      techniques.push(...iterativeResult.improvements);
    } else {
      const response = await llmRouter.generatePrompt(
        systemPrompt,
        userPrompt,
        {
          isAuthenticated: !!userId,
          userHasCredits: true,
          temperature: 0.7,
          maxTokens: originalTokens,
          userId
        }
      );

      improvedPrompt = response.content;
      techniques.push('Amélioration + Compression standard');
    }

    // Nettoyer le format
    if (cleanFormat) {
      improvedPrompt = cleanExcessiveFormatting(improvedPrompt);
    }

    const compressedTokens = this.estimateTokens(improvedPrompt);
    const compressionRate = ((originalTokens - compressedTokens) / originalTokens) * 100;

    const result: CompressionResult = {
      originalPrompt: prompt,
      compressedPrompt: improvedPrompt,
      originalTokens,
      compressedTokens,
      compressionRate: Math.max(0, compressionRate), // Peut être négatif si amélioration ajoute du contenu
      isComplete: completenessScore >= 0.9,
      completenessScore,
      techniques,
      traceId
    };

    console.log('✅ Amélioration + Compression terminée:', {
      compressionRate: `${Math.round(compressionRate)}%`,
      completenessScore: `${Math.round(completenessScore * 100)}%`
    });

    return result;
  }
}

export const opikCompressionService = new OpikCompressionService();

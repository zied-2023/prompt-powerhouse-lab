import { llmRouter } from './llmRouter';
import { opikService } from './opikService';

/**
 * Système d'optimisation itérative pour garantir des prompts complets
 * Utilise Opik pour évaluer et améliorer les prompts jusqu'à ce qu'ils soient complets
 */

export interface CompletenessScore {
  overall: number;
  hasAllSections: boolean;
  allSectionsComplete: boolean;
  noTruncation: boolean;
  properEnding: boolean;
  details: {
    missingSections: string[];
    incompleteSections: string[];
    truncationPoint?: number;
  };
}

export interface IterativeOptimizationResult {
  finalPrompt: string;
  iterations: number;
  completenessScore: CompletenessScore;
  improvements: string[];
  traceId: string;
}

class IterativePromptOptimizer {
  private readonly MAX_ITERATIONS = 3;
  private readonly COMPLETENESS_THRESHOLD = 0.9;

  /**
   * Optimise un prompt de manière itérative jusqu'à ce qu'il soit complet
   */
  async optimizeUntilComplete(
    systemPrompt: string,
    userPrompt: string,
    userId: string,
    maxTokens: number,
    mode: 'free' | 'basic' | 'premium'
  ): Promise<IterativeOptimizationResult> {
    console.log('🔄 Démarrage optimisation itérative Opik');
    console.log(`📊 Mode: ${mode}, Max tokens: ${maxTokens}`);

    const traceId = opikService.generateTraceId();
    const improvements: string[] = [];
    let currentPrompt = '';
    let iteration = 0;
    let completenessScore: CompletenessScore;

    // Première génération
    iteration++;
    console.log(`\n🔄 Itération ${iteration}/${this.MAX_ITERATIONS}`);

    const firstResponse = await llmRouter.generatePrompt(
      systemPrompt,
      userPrompt,
      maxTokens,
      {
        userId,
        mode,
        traceId
      }
    );

    currentPrompt = firstResponse.content;
    completenessScore = this.evaluateCompleteness(currentPrompt, mode);

    console.log('📊 Score de complétude initial:', completenessScore.overall);

    // Logger dans Opik
    await opikService.createTrace({
      userId,
      traceId,
      promptInput: userPrompt,
      promptOutput: currentPrompt,
      model: firstResponse.model,
      latencyMs: 0,
      tokensUsed: firstResponse.usage.total_tokens,
      feedbackScore: completenessScore.overall * 5,
      tags: {
        mode,
        iteration,
        completenessScore: completenessScore.overall
      }
    });

    // Si le prompt est déjà complet, retourner
    if (completenessScore.overall >= this.COMPLETENESS_THRESHOLD) {
      console.log('✅ Prompt complet dès la première génération');
      improvements.push(`✓ Prompt généré complet dès la première itération (score: ${Math.round(completenessScore.overall * 100)}%)`);

      return {
        finalPrompt: currentPrompt,
        iterations: iteration,
        completenessScore,
        improvements,
        traceId
      };
    }

    // Itérations d'amélioration
    while (iteration < this.MAX_ITERATIONS && completenessScore.overall < this.COMPLETENESS_THRESHOLD) {
      iteration++;
      console.log(`\n🔄 Itération ${iteration}/${this.MAX_ITERATIONS}`);
      console.log('🔍 Problèmes détectés:', completenessScore.details);

      // Créer un prompt de correction basé sur l'analyse
      const correctionPrompt = this.buildCorrectionPrompt(
        currentPrompt,
        completenessScore,
        mode
      );

      improvements.push(`Itération ${iteration}: ${this.describeIssues(completenessScore)}`);

      // Générer une version améliorée
      const improvedResponse = await llmRouter.generatePrompt(
        correctionPrompt.system,
        correctionPrompt.user,
        maxTokens,
        {
          userId,
          mode,
          traceId: `${traceId}_iter${iteration}`
        }
      );

      currentPrompt = improvedResponse.content;
      completenessScore = this.evaluateCompleteness(currentPrompt, mode);

      console.log(`📊 Score de complétude après itération ${iteration}:`, completenessScore.overall);

      // Logger l'itération dans Opik
      await opikService.createTrace({
        userId,
        traceId: `${traceId}_iter${iteration}`,
        promptInput: correctionPrompt.user,
        promptOutput: currentPrompt,
        model: improvedResponse.model,
        latencyMs: 0,
        tokensUsed: improvedResponse.usage.total_tokens,
        feedbackScore: completenessScore.overall * 5,
        tags: {
          mode,
          iteration,
          completenessScore: completenessScore.overall,
          parentTraceId: traceId
        }
      });

      // Si le score s'améliore peu, arrêter
      if (iteration > 1 && completenessScore.overall >= this.COMPLETENESS_THRESHOLD) {
        console.log('✅ Prompt suffisamment complet');
        break;
      }
    }

    // Résumé des améliorations
    improvements.push(`✓ Score final: ${Math.round(completenessScore.overall * 100)}% après ${iteration} itération(s)`);

    if (completenessScore.overall >= this.COMPLETENESS_THRESHOLD) {
      improvements.push('✓ Prompt entièrement complet avec toutes les sections terminées');
    } else {
      improvements.push('⚠️ Prompt amélioré mais limite d\'itérations atteinte');
    }

    console.log('\n✅ Optimisation itérative terminée');
    console.log(`📊 Score final: ${Math.round(completenessScore.overall * 100)}%`);
    console.log(`🔄 Itérations utilisées: ${iteration}`);

    return {
      finalPrompt: currentPrompt,
      iterations: iteration,
      completenessScore,
      improvements,
      traceId
    };
  }

  /**
   * Évalue la complétude d'un prompt
   */
  private evaluateCompleteness(prompt: string, mode: 'free' | 'basic' | 'premium'): CompletenessScore {
    const sections = this.detectSections(prompt);
    const requiredSections = this.getRequiredSections(mode);

    // Vérifier les sections manquantes
    const missingSections = requiredSections.filter(
      section => !sections[section] || !sections[section].present
    );

    // Vérifier les sections incomplètes
    const incompleteSections = requiredSections.filter(
      section => sections[section]?.present && !sections[section]?.complete
    );

    // Vérifier la troncation
    const truncationCheck = this.checkForTruncation(prompt);

    // Vérifier la fin propre
    const properEnding = this.checkProperEnding(prompt);

    // Calculer le score global
    const hasAllSections = missingSections.length === 0;
    const allSectionsComplete = incompleteSections.length === 0;
    const noTruncation = !truncationCheck.truncated;

    let score = 0;

    // 40% pour avoir toutes les sections
    if (hasAllSections) score += 0.4;
    else score += (1 - missingSections.length / requiredSections.length) * 0.4;

    // 40% pour que toutes les sections soient complètes
    if (allSectionsComplete) score += 0.4;
    else score += (1 - incompleteSections.length / requiredSections.length) * 0.4;

    // 10% pour l'absence de troncation
    if (noTruncation) score += 0.1;

    // 10% pour une fin propre
    if (properEnding) score += 0.1;

    return {
      overall: Math.round(score * 100) / 100,
      hasAllSections,
      allSectionsComplete,
      noTruncation,
      properEnding,
      details: {
        missingSections,
        incompleteSections,
        truncationPoint: truncationCheck.truncated ? truncationCheck.position : undefined
      }
    };
  }

  /**
   * Détecte les sections présentes dans le prompt et leur complétude
   */
  private detectSections(prompt: string): Record<string, { present: boolean; complete: boolean; content: string }> {
    const sections: Record<string, { present: boolean; complete: boolean; content: string }> = {};

    const sectionPatterns = {
      'RÔLE': /\*\*(?:RÔLE|ROLE)\*\*:?\s*([\s\S]*?)(?=\*\*[A-Z]|\n\n\n|$)/i,
      'CONTEXTE': /\*\*(?:CONTEXTE|CONTEXT)\*\*:?\s*([\s\S]*?)(?=\*\*[A-Z]|\n\n\n|$)/i,
      'OBJECTIF': /\*\*(?:OBJECTIF|OBJECTIVE|MISSION)\*\*:?\s*([\s\S]*?)(?=\*\*[A-Z]|\n\n\n|$)/i,
      'INSTRUCTIONS': /\*\*(?:INSTRUCTIONS|TÂCHES|TASKS)\*\*:?\s*([\s\S]*?)(?=\*\*[A-Z]|\n\n\n|$)/i,
      'FORMAT': /\*\*(?:FORMAT|LIVRABLE|OUTPUT)\*\*:?\s*([\s\S]*?)(?=\*\*[A-Z]|\n\n\n|$)/i,
      'CONTRAINTES': /\*\*(?:CONTRAINTES|CONSTRAINTS|RÈGLES)\*\*:?\s*([\s\S]*?)(?=\*\*[A-Z]|\n\n\n|$)/i,
    };

    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        const content = match[1].trim();
        sections[sectionName] = {
          present: true,
          complete: this.isSectionComplete(content),
          content
        };
      } else {
        sections[sectionName] = {
          present: false,
          complete: false,
          content: ''
        };
      }
    }

    return sections;
  }

  /**
   * Vérifie si une section est complète
   */
  private isSectionComplete(content: string): boolean {
    if (!content || content.length < 10) return false;

    // Vérifier que la section ne se termine pas brusquement
    const lastLine = content.trim().split('\n').pop() || '';
    const lastChar = content.trim().slice(-1);

    // Si ça se termine par une ponctuation appropriée ou un point de liste
    if (lastChar.match(/[.!?:]/) || lastLine.match(/^[-•]\s/)) {
      return true;
    }

    // Si c'est une liste, vérifier qu'au moins un élément est complet
    if (content.includes('-') || content.includes('•')) {
      const listItems = content.split('\n').filter(line => line.trim().match(/^[-•]\s/));
      return listItems.length > 0 && listItems.some(item => item.trim().match(/[.!?]$/));
    }

    return false;
  }

  /**
   * Vérifie si le prompt est tronqué
   */
  private checkForTruncation(prompt: string): { truncated: boolean; position?: number } {
    const lines = prompt.split('\n');
    const lastLine = lines[lines.length - 1].trim();
    const lastChar = prompt.trim().slice(-1);

    // Signes de troncation
    const truncationPatterns = [
      /---$/,           // Se termine par ---
      /\.\.\.$/,        // Se termine par ...
      /[,;]\s*$/,       // Se termine par une virgule ou point-virgule
      /\([^)]*$/,       // Parenthèse ouvrante non fermée
      /\[[^\]]*$/,      // Crochet ouvrant non fermé
      /^[-•]\s+\w+\s*$/, // Liste à puce sans ponctuation
    ];

    for (const pattern of truncationPatterns) {
      if (pattern.test(lastLine) || pattern.test(prompt.slice(-50))) {
        return { truncated: true, position: prompt.length - 50 };
      }
    }

    // Si la dernière ligne est très courte et sans ponctuation
    if (lastLine.length < 20 && !lastChar.match(/[.!?:]/)) {
      return { truncated: true, position: prompt.length - lastLine.length };
    }

    return { truncated: false };
  }

  /**
   * Vérifie que le prompt se termine proprement
   */
  private checkProperEnding(prompt: string): boolean {
    const lastLine = prompt.trim().split('\n').pop() || '';
    const lastChar = prompt.trim().slice(-1);

    // Fin acceptable
    return lastChar.match(/[.!?]/) !== null || lastLine.match(/^[-•]\s.*[.!?]$/) !== null;
  }

  /**
   * Retourne les sections requises selon le mode
   */
  private getRequiredSections(mode: 'free' | 'basic' | 'premium'): string[] {
    if (mode === 'premium') {
      return ['RÔLE', 'CONTEXTE', 'OBJECTIF', 'INSTRUCTIONS', 'FORMAT', 'CONTRAINTES'];
    } else if (mode === 'basic') {
      return ['RÔLE', 'OBJECTIF', 'INSTRUCTIONS', 'FORMAT', 'CONTRAINTES'];
    } else {
      return ['RÔLE', 'OBJECTIF', 'INSTRUCTIONS', 'FORMAT'];
    }
  }

  /**
   * Construit un prompt de correction basé sur l'analyse
   */
  private buildCorrectionPrompt(
    currentPrompt: string,
    score: CompletenessScore,
    mode: string
  ): { system: string; user: string } {
    const issues: string[] = [];

    if (score.details.missingSections.length > 0) {
      issues.push(`Sections manquantes: ${score.details.missingSections.join(', ')}`);
    }

    if (score.details.incompleteSections.length > 0) {
      issues.push(`Sections incomplètes: ${score.details.incompleteSections.join(', ')}`);
    }

    if (!score.noTruncation) {
      issues.push('Le prompt est tronqué et doit être complété');
    }

    if (!score.properEnding) {
      issues.push('Le prompt ne se termine pas proprement');
    }

    const systemPrompt = `Tu es un expert en correction et amélioration de prompts IA. Ta mission est de CORRIGER et COMPLÉTER un prompt incomplet.

RÈGLES ABSOLUES:
1. TOUTES les sections doivent être COMPLÈTES avec ponctuation finale
2. JAMAIS de texte tronqué ou coupé au milieu d'une phrase
3. Chaque section DOIT se terminer par un point
4. Si une section manque, l'ajouter
5. Si une section est incomplète, la terminer proprement

PROBLÈMES À CORRIGER:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}`;

    const userPrompt = `Voici le prompt incomplet à corriger:

${currentPrompt}

CORRIGE ET COMPLÈTE ce prompt en résolvant TOUS les problèmes identifiés. Retourne UNIQUEMENT le prompt corrigé, sans commentaire.`;

    return { system: systemPrompt, user: userPrompt };
  }

  /**
   * Décrit les problèmes identifiés
   */
  private describeIssues(score: CompletenessScore): string {
    const issues: string[] = [];

    if (score.details.missingSections.length > 0) {
      issues.push(`ajout sections: ${score.details.missingSections.join(', ')}`);
    }

    if (score.details.incompleteSections.length > 0) {
      issues.push(`complétion sections: ${score.details.incompleteSections.join(', ')}`);
    }

    if (!score.noTruncation) {
      issues.push('correction troncation');
    }

    if (!score.properEnding) {
      issues.push('amélioration fin de prompt');
    }

    return issues.join('; ');
  }
}

export const iterativePromptOptimizer = new IterativePromptOptimizer();

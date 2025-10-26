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
    qualityIssues?: {
      hasOrphanPhrases: boolean;
      hasIncompleteTables: boolean;
      hasIncompleteLists: boolean;
      lacksConcretExample: boolean;
      lacksQuantifiedConstraints: boolean;
    };
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
   * Évalue la complétude d'un prompt selon la CHECKLIST PRE-PUBLICATION
   */
  private evaluateCompleteness(prompt: string, mode: 'free' | 'basic' | 'premium'): CompletenessScore {
    // Si le prompt contient "---", on évalue uniquement la partie avant le séparateur
    // (car après c'est la section AMÉLIORATIONS qui n'est pas le prompt lui-même)
    let promptToEvaluate = prompt;
    if (prompt.includes('---')) {
      const parts = prompt.split('---');
      promptToEvaluate = parts[0].trim();
      console.log('📊 Évaluation de la partie avant "---" uniquement');
    }

    const sections = this.detectSections(promptToEvaluate);
    const requiredSections = this.getRequiredSections(mode);

    console.log('🔍 Sections détectées:', Object.keys(sections).filter(k => sections[k].present));
    console.log('🎯 Sections requises:', requiredSections);

    // CHECKLIST 1: STRUCTURE (sections de base)
    const missingSections = requiredSections.filter(
      section => !sections[section] || !sections[section].present
    );

    const incompleteSections = requiredSections.filter(
      section => sections[section]?.present && !sections[section]?.complete
    );

    // CHECKLIST 2: COMPLÉTUDE (troncation et qualité de fin)
    const truncationCheck = this.checkForTruncation(promptToEvaluate);
    const properEnding = this.checkProperEnding(promptToEvaluate);
    const hasOrphanPhrases = this.detectOrphanPhrases(promptToEvaluate);
    const hasIncompleteTables = this.detectIncompleteTables(promptToEvaluate);
    const hasIncompleteLists = this.detectIncompleteBulletLists(promptToEvaluate);

    // CHECKLIST 3: CONTENU (exemple concret, contraintes chiffrées)
    const hasConcreteExample = this.hasSubstantialExample(sections['EXEMPLE']);
    const hasQuantifiedConstraints = this.hasQuantifiedConstraints(sections['CONTRAINTES']);

    console.log('❌ Sections manquantes:', missingSections);
    console.log('⚠️ Sections incomplètes:', incompleteSections);
    console.log('📋 Checklist complétude:', {
      hasOrphanPhrases,
      hasIncompleteTables,
      hasIncompleteLists,
      hasConcreteExample,
      hasQuantifiedConstraints
    });

    // Calculer le score global selon la CHECKLIST
    const hasAllSections = missingSections.length === 0;
    const allSectionsComplete = incompleteSections.length === 0;
    const noTruncation = !truncationCheck.truncated;
    const noOrphans = !hasOrphanPhrases;
    const noIncompleteTables = !hasIncompleteTables;
    const noIncompleteLists = !hasIncompleteLists;

    let score = 0;

    // 30% pour avoir toutes les sections requises
    if (hasAllSections) score += 0.30;
    else score += (1 - missingSections.length / requiredSections.length) * 0.30;

    // 30% pour que toutes les sections soient complètes
    if (allSectionsComplete) score += 0.30;
    else score += (1 - incompleteSections.length / requiredSections.length) * 0.30;

    // 15% pour l'absence de troncation et fin propre
    if (noTruncation && properEnding) score += 0.15;
    else if (noTruncation || properEnding) score += 0.075;

    // 10% pour l'absence d'éléments orphelins/incomplets
    if (noOrphans && noIncompleteTables && noIncompleteLists) score += 0.10;
    else {
      let subScore = 0;
      if (noOrphans) subScore += 0.033;
      if (noIncompleteTables) subScore += 0.033;
      if (noIncompleteLists) subScore += 0.033;
      score += subScore;
    }

    // 15% pour la qualité du contenu (exemple + contraintes)
    if (hasConcreteExample && hasQuantifiedConstraints) score += 0.15;
    else {
      if (hasConcreteExample) score += 0.10;
      if (hasQuantifiedConstraints) score += 0.05;
    }

    console.log('📊 Score de complétude calculé:', Math.round(score * 100) + '%');

    return {
      overall: Math.round(score * 100) / 100,
      hasAllSections,
      allSectionsComplete,
      noTruncation,
      properEnding,
      details: {
        missingSections,
        incompleteSections,
        truncationPoint: truncationCheck.truncated ? truncationCheck.position : undefined,
        qualityIssues: {
          hasOrphanPhrases,
          hasIncompleteTables,
          hasIncompleteLists,
          lacksConcretExample: !hasConcreteExample,
          lacksQuantifiedConstraints: !hasQuantifiedConstraints
        }
      }
    };
  }

  /**
   * Détecte les sections présentes dans le prompt et leur complétude
   */
  private detectSections(prompt: string): Record<string, { present: boolean; complete: boolean; content: string }> {
    const sections: Record<string, { present: boolean; complete: boolean; content: string }> = {};

    // Patterns pour format standard (avec ou sans émojis)
    const sectionPatterns = {
      'RÔLE': [
        /\*\*(?:RÔLE|ROLE)\*\*:?\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i,
        /🧑‍💻\s*\*\*(?:RÔLE DE L'IA|RÔLE)\*\*\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
      'CONTEXTE': [
        /\*\*(?:CONTEXTE|CONTEXT)\*\*:?\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i,
        /🎯\s*\*\*(?:CONTEXTE & OBJECTIF|CONTEXTE)\*\*\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
      'OBJECTIF': [
        /\*\*(?:OBJECTIF|OBJECTIVE|MISSION)\*\*:?\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i,
        /🎯\s*\*\*(?:CONTEXTE & OBJECTIF|OBJECTIF)\*\*\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
      'INSTRUCTIONS': [
        /\*\*(?:INSTRUCTIONS|TÂCHES|TASKS)\*\*:?\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
      'FORMAT': [
        /\*\*(?:FORMAT|LIVRABLE|OUTPUT)\*\*:?\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i,
        /🗂\s*\*\*(?:STRUCTURE DU LIVRABLE|FORMAT)\*\*\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
      'CONTRAINTES': [
        /\*\*(?:CONTRAINTES|CONSTRAINTS|RÈGLES)\*\*:?\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i,
        /📏\s*\*\*(?:CONTRAINTES)\*\*\s*([\s\S]*?)(?=(?:🎯|🧑‍💻|🗂|📏|📝|\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
      'EXEMPLE': [
        /\*\*(?:EXEMPLE|EXAMPLE)\*\*:?\s*([\s\S]*?)(?=(?:\*\*[A-Z]|---|\n\n\n)|$)/i,
        /📝\s*\*\*(?:EXEMPLE DE SORTIE|EXEMPLE)\*\*\s*([\s\S]*?)(?=(?:\*\*[A-Z]|---|\n\n\n)|$)/i
      ],
    };

    for (const [sectionName, patterns] of Object.entries(sectionPatterns)) {
      let found = false;

      // Essayer chaque pattern pour cette section
      for (const pattern of patterns) {
        const match = prompt.match(pattern);
        if (match && match[1]) {
          const content = match[1].trim();
          sections[sectionName] = {
            present: true,
            complete: this.isSectionComplete(content, sectionName),
            content
          };
          found = true;
          break;
        }
      }

      if (!found) {
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
  private isSectionComplete(content: string, sectionName?: string): boolean {
    if (!content || content.length < 10) return false;

    // RÈGLE SPÉCIALE pour la section EXEMPLE: elle doit être plus substantielle
    if (sectionName === 'EXEMPLE') {
      // Un exemple doit avoir au moins 50 caractères et 2 lignes
      const lines = content.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2 || content.length < 50) {
        console.log(`⚠️ Section EXEMPLE incomplète: ${lines.length} lignes, ${content.length} caractères`);
        return false;
      }
    }

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

    // Exception: Si le prompt se termine par "---" suivi d'une section AMÉLIORATIONS
    // ce n'est PAS une troncation mais un séparateur intentionnel
    if (prompt.includes('---') && prompt.includes('AMÉLIORATIONS APPORTÉES')) {
      // Vérifier si le texte après --- est complet
      const afterSeparator = prompt.split('---')[1];
      if (afterSeparator && afterSeparator.trim().length > 20) {
        // Il y a du contenu après ---, donc pas de troncation
        return { truncated: false };
      }
    }

    // Signes de troncation
    const truncationPatterns = [
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

    // Si la dernière ligne est très courte et sans ponctuation (sauf si c'est juste après ---)
    if (lastLine.length < 20 && !lastChar.match(/[.!?:]/) && !prompt.trim().endsWith('---')) {
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
   * Note: Pour la section amélioration, CONTEXTE et OBJECTIF peuvent être fusionnés
   */
  private getRequiredSections(mode: 'free' | 'basic' | 'premium'): string[] {
    if (mode === 'premium') {
      // CONTEXTE et OBJECTIF sont essentiels (même s'ils peuvent être fusionnés dans le format amélioration)
      // EXEMPLE est critique car souvent tronqué
      return ['RÔLE', 'CONTEXTE', 'FORMAT', 'CONTRAINTES', 'EXEMPLE'];
    } else if (mode === 'basic') {
      return ['RÔLE', 'CONTEXTE', 'FORMAT', 'CONTRAINTES'];
    } else {
      return ['RÔLE', 'CONTEXTE', 'FORMAT'];
    }
  }

  /**
   * CHECKLIST: Détecte les phrases orphelines (ex: "Code snippets :" seul)
   */
  private detectOrphanPhrases(prompt: string): boolean {
    const lines = prompt.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Une phrase orpheline se termine par ":" sans contenu après
      if (line.endsWith(':') && line.length < 50) {
        // Vérifier si la ligne suivante existe et contient du contenu
        const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

        // Si c'est la dernière ligne ou si la suivante est vide/courte, c'est orphelin
        if (!nextLine || nextLine.length < 10) {
          console.log('🚨 Phrase orpheline détectée:', line);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * CHECKLIST: Détecte les tableaux incomplets (header sans ligne d'exemple)
   */
  private detectIncompleteTables(prompt: string): boolean {
    const lines = prompt.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Détecte un header de tableau markdown (avec |)
      if (line.includes('|') && line.split('|').length > 2) {
        // Vérifier s'il y a une ligne de séparation après (|---|---|)
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
        const hasSeperator = nextLine.includes('---') && nextLine.includes('|');

        if (hasSeperator) {
          // Vérifier s'il y a au moins une ligne de données après le séparateur
          const dataLine = i < lines.length - 2 ? lines[i + 2].trim() : '';

          if (!dataLine || !dataLine.includes('|')) {
            console.log('🚨 Tableau incomplet détecté (header sans données)');
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * CHECKLIST: Détecte les listes à puces incomplètes
   */
  private detectIncompleteBulletLists(prompt: string): boolean {
    const lines = prompt.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Détecte une puce (-, •, *)
      if (line.match(/^[-•*]\s/)) {
        // Vérifier si la ligne de puce est trop courte ou sans contenu
        const content = line.replace(/^[-•*]\s/, '').trim();

        if (content.length < 5 || content.endsWith(':')) {
          console.log('🚨 Liste à puce incomplète:', line);
          return true;
        }
      }
    }

    return false;
  }

  /**
   * CHECKLIST: Vérifie si la section EXEMPLE a un contenu substantiel et concret
   */
  private hasSubstantialExample(exempleSection: { present: boolean; complete: boolean; content: string } | undefined): boolean {
    if (!exempleSection || !exempleSection.present || !exempleSection.content) {
      return false;
    }

    const content = exempleSection.content.trim();

    // Un exemple substantiel doit avoir:
    // - Au moins 100 caractères (pas juste un titre)
    // - Au moins 3 lignes
    // - Du contenu concret (pas juste des placeholders)

    const lines = content.split('\n').filter(l => l.trim().length > 0);
    const hasMinLength = content.length >= 100;
    const hasMinLines = lines.length >= 3;
    const hasConcreteContent = !content.includes('[à compléter]') &&
                               !content.includes('[example]') &&
                               !content.includes('[...]');

    const isSubstantial = hasMinLength && hasMinLines && hasConcreteContent;

    if (!isSubstantial) {
      console.log('⚠️ Exemple non substantiel:', { hasMinLength, hasMinLines, hasConcreteContent });
    }

    return isSubstantial;
  }

  /**
   * CHECKLIST: Vérifie si les contraintes contiennent des chiffres/mesures concrètes
   */
  private hasQuantifiedConstraints(contraintesSection: { present: boolean; complete: boolean; content: string } | undefined): boolean {
    if (!contraintesSection || !contraintesSection.present || !contraintesSection.content) {
      return false;
    }

    const content = contraintesSection.content;

    // Cherche des patterns de quantification:
    // - Nombres (100, 200-250, <2, >5)
    // - Unités (mots, caractères, secondes, tokens, ko, mo)
    // - Pourcentages (80%, 90%)

    const quantificationPatterns = [
      /\d+\s*-\s*\d+/,           // Range: 200-250
      /[<>≤≥]\s*\d+/,            // Comparaison: <2, >5
      /\d+\s*(mots?|caractères?|secondes?|minutes?|tokens?|ko|mo|go)/i,
      /\d+%/,                     // Pourcentages: 80%
      /\d+\s*lignes?/i,          // Lignes: 10 lignes
    ];

    const hasQuantification = quantificationPatterns.some(pattern => pattern.test(content));

    if (!hasQuantification) {
      console.log('⚠️ Contraintes sans quantification détectée');
    }

    return hasQuantification;
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

    // CHECKLIST STRUCTURE
    if (score.details.missingSections.length > 0) {
      issues.push(`Sections manquantes: ${score.details.missingSections.join(', ')}`);
    }

    if (score.details.incompleteSections.length > 0) {
      issues.push(`Sections incomplètes: ${score.details.incompleteSections.join(', ')}`);
    }

    // CHECKLIST COMPLÉTUDE
    if (!score.noTruncation) {
      issues.push('Le prompt est tronqué et doit être complété');
    }

    if (!score.properEnding) {
      issues.push('Le prompt ne se termine pas proprement');
    }

    // CHECKLIST QUALITÉ
    const qualityIssues = score.details.qualityIssues;
    if (qualityIssues) {
      if (qualityIssues.hasOrphanPhrases) {
        issues.push('Phrases orphelines détectées (ex: "Code snippets :" sans suite) - À compléter');
      }
      if (qualityIssues.hasIncompleteTables) {
        issues.push('Tableaux incomplets (header sans ligne d\'exemple) - Ajouter au moins 1 ligne');
      }
      if (qualityIssues.hasIncompleteLists) {
        issues.push('Listes à puces incomplètes - Compléter chaque élément');
      }
      if (qualityIssues.lacksConcretExample) {
        issues.push('Section EXEMPLE manquante ou non substantielle - Ajouter un exemple concret de 3-5 lignes minimum');
      }
      if (qualityIssues.lacksQuantifiedConstraints) {
        issues.push('Contraintes sans chiffres - Ajouter des mesures concrètes (ex: 200-250 mots, <2s, 80%)');
      }
    }

    // Détecter si c'est un format avec émojis (format amélioration)
    const hasEmojiFormat = currentPrompt.includes('🎯') || currentPrompt.includes('🧑‍💻') || currentPrompt.includes('🗂');

    const systemPrompt = hasEmojiFormat
      ? `Tu es un expert en correction de prompts selon la CHECKLIST PRE-PUBLICATION professionnelle.

📋 CHECKLIST À RESPECTER:

**STRUCTURE** (obligatoire):
✓ Introduction claire (contexte + objectif)
✓ Rôle de l'IA défini précisément
✓ Livrables attendus explicités
✓ Section Contraintes présente
✓ Section Exemples présente

**COMPLÉTUDE** (critique):
✓ Le prompt ne s'arrête PAS brutalement
✓ Dernière section COMPLÈTE (lire jusqu'à la fin)
✓ ZÉRO phrases orphelines (ex: "Code snippets :" seul)
✓ Tableaux commencés = tableaux terminés (min 1 ligne de données)
✓ Listes complètes (pas de bullet point vide)

**CONTENU** (qualité):
✓ Exemple de sortie CONCRET (min 3-5 lignes, pas de placeholder)
✓ Contraintes CHIFFRÉES (200-250 mots, <2s, 80%, etc.)
✓ Ton cohérent du début à la fin

FORMAT SPÉCIFIQUE avec émojis:
🎯 **CONTEXTE & OBJECTIF** → 2-3 phrases COMPLÈTES
🧑‍💻 **RÔLE DE L'IA** → 2 phrases COMPLÈTES
🗂 **STRUCTURE DU LIVRABLE** → Liste ou description COMPLÈTE
📏 **CONTRAINTES** → Contraintes CHIFFRÉES (avec nombres/unités)
📝 **EXEMPLE DE SORTIE** → Exemple CONCRET de 5+ lignes (pas [à compléter])

🚨 PROBLÈMES DÉTECTÉS À CORRIGER:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

RÈGLE D'OR: Ne retourne le prompt QUE si tu peux cocher TOUS les points de la checklist.`
      : `Tu es un expert en correction de prompts selon la CHECKLIST PRE-PUBLICATION professionnelle.

📋 CHECKLIST À RESPECTER:

**STRUCTURE** (obligatoire):
✓ Introduction claire (contexte + objectif)
✓ Rôle de l'IA défini précisément
✓ Livrables attendus explicités
✓ Section Contraintes présente
✓ Section Exemples présente

**COMPLÉTUDE** (critique):
✓ Le prompt ne s'arrête PAS brutalement
✓ Dernière section COMPLÈTE (lire jusqu'à la fin)
✓ ZÉRO phrases orphelines (ex: "Code snippets :" seul)
✓ Tableaux commencés = tableaux terminés (min 1 ligne de données)
✓ Listes complètes (pas de bullet point vide)

**CONTENU** (qualité):
✓ Exemple de sortie CONCRET (min 3-5 lignes, pas de placeholder)
✓ Contraintes CHIFFRÉES (200-250 mots, <2s, 80%, etc.)
✓ Ton cohérent du début à la fin

🚨 PROBLÈMES DÉTECTÉS À CORRIGER:
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

RÈGLE D'OR: Ne retourne le prompt QUE si tu peux cocher TOUS les points de la checklist.`;

    // Construire des instructions spécifiques selon les problèmes détectés
    const specificInstructions: string[] = [];

    if (qualityIssues?.hasIncompleteTables) {
      specificInstructions.push(`
⚠️ TABLEAU INCOMPLET DÉTECTÉ:
Si tu vois un tableau avec seulement le header (exemple: | Col1 | Col2 |), tu DOIS ajouter AU MINIMUM 2-3 lignes de données concrètes.

Exemple INCORRECT:
| Temps | Action |
|-------|--------|

Exemple CORRECT:
| Temps | Action |
|-------|--------|
| 0-2s  | Gros plan sur visage |
| 2-5s  | Plan large de la scène |
| 5-10s | Zoom sur l'objet clé |`);
    }

    if (hasEmojiFormat && qualityIssues?.lacksConcretExample) {
      specificInstructions.push(`
⚠️ EXEMPLE MANQUANT/INCOMPLET:
La section 📝 **EXEMPLE DE SORTIE** doit contenir un exemple RÉEL et CONCRET (minimum 5 lignes).
Ne mets PAS de placeholder comme [à compléter] ou [example].
Génère un exemple complet qui montre exactement à quoi doit ressembler le résultat final.`);
    }

    if (qualityIssues?.lacksQuantifiedConstraints) {
      specificInstructions.push(`
⚠️ CONTRAINTES SANS CHIFFRES:
Toutes les contraintes doivent être QUANTIFIÉES avec des nombres précis.
Exemple: Remplace "Longueur: Courte" par "Longueur: 200-250 mots"
         Remplace "Rapide" par "< 2 secondes"
         Remplace "La plupart" par "80% minimum"`);
    }

    const userPrompt = `Voici le prompt incomplet à corriger:

${currentPrompt}

${specificInstructions.length > 0 ? specificInstructions.join('\n') : ''}

🎯 MISSION: CORRIGE ET COMPLÈTE ce prompt en résolvant TOUS les problèmes identifiés ci-dessus.

RÈGLES STRICTES:
- Si un tableau a seulement un header, AJOUTE au moins 2-3 lignes de données
- Si une phrase se termine par ":", AJOUTE le contenu qui suit
- Si une section "EXEMPLE" est vide, GÉNÈRE un exemple concret de 5+ lignes
- Si des contraintes manquent de chiffres, AJOUTE des valeurs numériques précises

Retourne UNIQUEMENT le prompt corrigé COMPLET, sans commentaire ni explication.`;

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

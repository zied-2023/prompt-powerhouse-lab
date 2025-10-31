import { supabase } from '@/integrations/supabase/client';
import { detectLanguage } from '@/lib/languageDetector';

type Language = 'fr' | 'en' | 'ar';

export interface OptimizationResult {
  optimizedPrompt: string;
  improvements: string[];
  score: number;
  tokensReduced?: number;
  clarityImproved?: boolean;
}

class OpikOptimizer {
  private targetLanguage?: Language; // Langue cible pour forcer l'optimisation

  /**
   * Optimise un prompt pour le mode PREMIUM sans compression
   * Garantit un prompt complet selon la longueur demandée
   */
  async optimizePromptPremium(
    originalPrompt: string,
    userId: string,
    category?: string,
    targetLength?: 'short' | 'medium' | 'long' | 'very_long'
  ): Promise<OptimizationResult> {
    try {
      console.log('🚀 Opik Premium Optimization démarré');
      console.log('📝 Prompt original longueur:', originalPrompt.length);
      console.log('🎯 Longueur cible:', targetLength);

      // Analyser le prompt
      const analysis = this.analyzePrompt(originalPrompt);

      // Mode Premium: Améliorer sans résumer
      let optimizedPrompt = originalPrompt;

      // ÉTAPE 1: Compléter les prompts incomplets
      optimizedPrompt = this.completeIncompletePrompt(optimizedPrompt);

      // ÉTAPE 2: Garantir structure complète
      optimizedPrompt = this.ensureCompleteStructure(optimizedPrompt);

      // ÉTAPE 3: Améliorer la qualité sans réduire la longueur
      if (analysis.structure < 7) {
        optimizedPrompt = this.enhanceStructure(optimizedPrompt);
      }

      if (analysis.clarity < 7) {
        optimizedPrompt = this.enhanceClarity(optimizedPrompt);
      }

      // ÉTAPE 4: Enrichir si nécessaire selon la longueur cible
      if (targetLength === 'very_long' || targetLength === 'long') {
        optimizedPrompt = this.enrichPromptForLength(optimizedPrompt, targetLength);
      }

      // ÉTAPE 5: Ajouter sections manquantes essentielles
      if (!analysis.hasRole) {
        optimizedPrompt = this.addRoleSection(optimizedPrompt);
      }

      if (!analysis.hasFormat) {
        optimizedPrompt = this.addFormatSection(optimizedPrompt);
      }

      if (!analysis.hasConstraints) {
        optimizedPrompt = this.addConstraintsSection(optimizedPrompt);
      }

      // Calculer les améliorations
      const improvements = this.calculatePremiumImprovements(originalPrompt, optimizedPrompt, analysis);

      // Calculer un score de qualité
      const score = this.calculateQualityScore(optimizedPrompt, this.analyzePrompt(optimizedPrompt));

      // Logger l'optimisation
      await this.logOptimization(userId, originalPrompt, optimizedPrompt, score, category);

      console.log('✅ Optimisation Premium terminée');
      console.log('📊 Score de qualité:', score);
      console.log('📏 Longueur finale:', optimizedPrompt.length, 'caractères');

      return {
        optimizedPrompt,
        improvements,
        score,
        clarityImproved: score > 7.5
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'optimisation Premium:', error);
      return {
        optimizedPrompt: originalPrompt,
        improvements: ['Prompt original conservé'],
        score: 6
      };
    }
  }

  /**
   * Optimise automatiquement un prompt pour les utilisateurs premium
   */
  async optimizePrompt(
    originalPrompt: string,
    userId: string,
    category?: string,
    targetLanguage?: Language
  ): Promise<OptimizationResult> {
    try {
      console.log('🚀 Opik Auto-Optimization démarré pour mode premium');
      console.log('📝 Prompt original longueur:', originalPrompt.length);
      console.log('🌍 Langue cible forcée:', targetLanguage || 'détection automatique');

      // Forcer la langue cible si fournie
      this.targetLanguage = targetLanguage;

      // Analyser le prompt pour identifier les améliorations possibles
      const analysis = this.analyzePrompt(originalPrompt);

      // Appliquer les optimisations Opik
      const optimizedPrompt = await this.applyOptimizations(originalPrompt, analysis);

      // Réinitialiser la langue cible après optimisation
      this.targetLanguage = undefined;

      // Calculer les améliorations
      const improvements = this.calculateImprovements(originalPrompt, optimizedPrompt, analysis);

      // Calculer un score de qualité
      const score = this.calculateQualityScore(optimizedPrompt, analysis);

      // Logger l'optimisation dans Supabase
      await this.logOptimization(userId, originalPrompt, optimizedPrompt, score, category);

      console.log('✅ Optimisation Opik terminée avec succès');
      console.log('📊 Score de qualité:', score);
      console.log('🎯 Améliorations appliquées:', improvements.length);

      return {
        optimizedPrompt,
        improvements,
        score,
        tokensReduced: this.estimateTokens(originalPrompt) - this.estimateTokens(optimizedPrompt),
        clarityImproved: score > 7.5
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'optimisation Opik:', error);
      // En cas d'erreur, retourner le prompt original
      return {
        optimizedPrompt: originalPrompt,
        improvements: ['Optimisation non disponible - prompt original conservé'],
        score: 5
      };
    }
  }

  /**
   * Analyse un prompt pour identifier les opportunités d'amélioration
   */
  private analyzePrompt(prompt: string): {
    hasRole: boolean;
    hasContext: boolean;
    hasConstraints: boolean;
    hasFormat: boolean;
    hasExamples: boolean;
    clarity: number;
    structure: number;
    specificity: number;
  } {
    const lowerPrompt = prompt.toLowerCase();

    return {
      hasRole: /\*\*rôle\*\*|tu es|you are|role:|expert|specialist/i.test(prompt),
      hasContext: /\*\*contexte\*\*|context:|background:|situation/i.test(prompt),
      hasConstraints: /\*\*contraintes\*\*|constraints:|limites|requirements/i.test(prompt),
      hasFormat: /\*\*format\*\*|format:|structure:|output/i.test(prompt),
      hasExamples: /exemple|example|par exemple|for example/i.test(prompt),
      clarity: this.assessClarity(prompt),
      structure: this.assessStructure(prompt),
      specificity: this.assessSpecificity(prompt)
    };
  }

  /**
   * Évalue la clarté d'un prompt (score 0-10)
   */
  private assessClarity(prompt: string): number {
    let score = 5;

    // Points positifs
    if (prompt.includes('**')) score += 1; // Formatage
    if (prompt.split('\n').length > 3) score += 1; // Structure multi-lignes
    if (prompt.length > 100) score += 0.5; // Suffisamment détaillé
    if (/objectif|goal|purpose/i.test(prompt)) score += 1; // Objectif clair

    // Points négatifs
    if (prompt.length < 50) score -= 2; // Trop court
    if (!/\*\*/.test(prompt)) score -= 1; // Pas de formatage

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Évalue la structure d'un prompt (score 0-10)
   */
  private assessStructure(prompt: string): number {
    let score = 5;

    const sections = prompt.match(/\*\*[^*]+\*\*/g) || [];
    score += Math.min(sections.length * 0.5, 3); // Sections structurées

    if (prompt.includes('-') || prompt.includes('•')) score += 1; // Listes à puces
    if (prompt.includes('\n\n')) score += 0.5; // Paragraphes séparés

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Évalue la spécificité d'un prompt (score 0-10)
   */
  private assessSpecificity(prompt: string): number {
    let score = 5;

    // Mots-clés de spécificité
    const specificKeywords = ['précis', 'exact', 'spécifique', 'détaillé', 'mesurable', 'concret'];
    specificKeywords.forEach(keyword => {
      if (new RegExp(keyword, 'i').test(prompt)) score += 0.5;
    });

    // Chiffres et données quantifiables
    if (/\d+/.test(prompt)) score += 1;

    // Exemples fournis
    if (/exemple|example/i.test(prompt)) score += 1;

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Applique les optimisations basées sur l'analyse
   */
  private async applyOptimizations(prompt: string, analysis: any): Promise<string> {
    let optimized = prompt;

    // ÉTAPE 1: Compléter les prompts tronqués ou incomplets
    optimized = this.completeIncompletePrompt(optimized);

    // ÉTAPE 2: Si le prompt est trop long, le résumer intelligemment
    const estimatedTokens = this.estimateTokens(optimized);
    if (estimatedTokens > 800) {
      console.log(`⚠️ Prompt trop long (${estimatedTokens} tokens), résumé intelligent...`);
      optimized = this.smartSummarize(optimized);
    }

    // ÉTAPE 3: Garantir une structure complète et cohérente
    optimized = this.ensureCompleteStructure(optimized);

    // ÉTAPE 4: Si le prompt manque de structure, l'améliorer
    if (analysis.structure < 5) {
      optimized = this.improveStructure(optimized);
    }

    // ÉTAPE 5: Si le prompt manque de clarté, l'améliorer
    if (analysis.clarity < 6) {
      optimized = this.improveClarity(optimized);
    }

    // ÉTAPE 6: Si le prompt manque de spécificité, l'améliorer
    if (analysis.specificity < 6) {
      optimized = this.improveSpecificity(optimized);
    }

    // ÉTAPE 7: Ajouter des sections manquantes essentielles
    if (!analysis.hasRole) {
      optimized = this.addRoleSection(optimized);
    }

    if (!analysis.hasFormat) {
      optimized = this.addFormatSection(optimized);
    }

    if (!analysis.hasConstraints) {
      optimized = this.addConstraintsSection(optimized);
    }

    return optimized;
  }

  /**
   * Résume intelligemment un prompt trop long tout en préservant l'essence
   */
  private smartSummarize(prompt: string): string {
    console.log('📝 Résumé intelligent du prompt...');
    const lang = this.getPromptLanguage(prompt);

    // Extraire les sections principales
    const sections = this.extractSections(prompt);

    // Construire un prompt résumé mais complet
    let summarized = '';

    // RÔLE (garder concis)
    if (sections.role) {
      const roleText = sections.role.split('\n')[0].substring(0, 100);
      if (lang === 'en') {
        summarized += `**ROLE**: ${roleText}\n\n`;
      } else if (lang === 'ar') {
        summarized += `**الدور**: ${roleText}\n\n`;
      } else {
        summarized += `**RÔLE**: ${roleText}\n\n`;
      }
    }

    // OBJECTIF (garder l'essentiel)
    if (sections.objective) {
      const objectiveText = sections.objective.split('\n').slice(0, 2).join(' ').substring(0, 150);
      if (lang === 'en') {
        summarized += `**OBJECTIVE**: ${objectiveText}\n\n`;
      } else if (lang === 'ar') {
        summarized += `**الهدف**: ${objectiveText}\n\n`;
      } else {
        summarized += `**OBJECTIF**: ${objectiveText}\n\n`;
      }
    }

    // CONTEXTE (résumer si trop long)
    if (sections.context) {
      const contextText = sections.context.split('\n').slice(0, 2).join(' ').substring(0, 120);
      if (lang === 'en') {
        summarized += `**CONTEXT**: ${contextText}\n\n`;
      } else if (lang === 'ar') {
        summarized += `**السياق**: ${contextText}\n\n`;
      } else {
        summarized += `**CONTEXTE**: ${contextText}\n\n`;
      }
    }

    // INSTRUCTIONS (garder les points clés)
    if (sections.instructions) {
      const instructionsList = sections.instructions
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .slice(0, 5);  // Max 5 instructions

      if (instructionsList.length > 0) {
        if (lang === 'en') {
          summarized += `**INSTRUCTIONS**:\n${instructionsList.join('\n')}\n\n`;
        } else if (lang === 'ar') {
          summarized += `**التعليمات**:\n${instructionsList.join('\n')}\n\n`;
        } else {
          summarized += `**INSTRUCTIONS**:\n${instructionsList.join('\n')}\n\n`;
        }
      }
    }

    // FORMAT (garder concis)
    if (sections.format) {
      const formatText = sections.format.split('\n').slice(0, 2).join(' ').substring(0, 100);
      if (lang === 'en') {
        summarized += `**FORMAT**: ${formatText}\n\n`;
      } else if (lang === 'ar') {
        summarized += `**الشكل**: ${formatText}\n\n`;
      } else {
        summarized += `**FORMAT**: ${formatText}\n\n`;
      }
    }

    // CONTRAINTES (garder l'essentiel)
    if (sections.constraints) {
      const constraintsList = sections.constraints
        .split('\n')
        .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .slice(0, 3);  // Max 3 contraintes

      if (constraintsList.length > 0) {
        if (lang === 'en') {
          summarized += `**CONSTRAINTS**:\n${constraintsList.join('\n')}`;
        } else if (lang === 'ar') {
          summarized += `**القيود**:\n${constraintsList.join('\n')}`;
        } else {
          summarized += `**CONTRAINTES**:\n${constraintsList.join('\n')}`;
        }
      }
    }

    console.log(`✅ Prompt résumé: ${this.estimateTokens(prompt)} → ${this.estimateTokens(summarized)} tokens`);
    return summarized.trim();
  }

  /**
   * Extrait les sections d'un prompt structuré
   */
  private extractSections(prompt: string): {
    role?: string;
    objective?: string;
    context?: string;
    instructions?: string;
    format?: string;
    constraints?: string;
  } {
    const sections: any = {};

    // Patterns pour détecter les sections
    const patterns = {
      role: /\*\*(?:RÔLE|ROLE)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i,
      objective: /\*\*(?:OBJECTIF|OBJECTIVE|MISSION)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i,
      context: /\*\*(?:CONTEXTE|CONTEXT)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i,
      instructions: /\*\*(?:INSTRUCTIONS|TÂCHES|TASKS)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i,
      format: /\*\*(?:FORMAT|LIVRABLE|OUTPUT)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i,
      constraints: /\*\*(?:CONTRAINTES|CONSTRAINTS|RÈGLES)\*\*:?\s*([\s\S]*?)(?=\*\*|$)/i,
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        sections[key] = match[1].trim();
      }
    }

    return sections;
  }

  /**
   * Garantit que le prompt a une structure complète et cohérente
   */
  private ensureCompleteStructure(prompt: string): string {
    console.log('🔍 Vérification structure complète...');
    const lang = this.getPromptLanguage(prompt);

    // Vérifier que toutes les sections se terminent proprement
    const lines = prompt.split('\n');
    const fixedLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i < lines.length - 1 ? lines[i + 1] : null;

      fixedLines.push(line);

      // Si une section commence mais la suivante aussi (section vide)
      if (line.match(/\*\*[A-Z]+\*\*:?\s*$/) && nextLine?.match(/\*\*/)) {
        // Ajouter un contenu par défaut selon la langue
        if (line.includes('RÔLE') || line.includes('ROLE') || line.includes('الدور')) {
          if (lang === 'en') {
            fixedLines.push('Expert AI assistant');
          } else if (lang === 'ar') {
            fixedLines.push('مساعد الذكاء الاصطناعي الخبير');
          } else {
            fixedLines.push('Expert assistant IA spécialisé');
          }
        } else if (line.includes('OBJECTIF') || line.includes('OBJECTIVE') || line.includes('الهدف')) {
          if (lang === 'en') {
            fixedLines.push('Accomplish the requested task with precision');
          } else if (lang === 'ar') {
            fixedLines.push('إنجاز المهمة المطلوبة بدقة');
          } else {
            fixedLines.push('Accomplir la tâche demandée avec précision');
          }
        } else if (line.includes('FORMAT') || line.includes('الشكل')) {
          if (lang === 'en') {
            fixedLines.push('Structured and clear response');
          } else if (lang === 'ar') {
            fixedLines.push('استجابة منظمة وواضحة');
          } else {
            fixedLines.push('Réponse structurée et claire');
          }
        }
      }
    }

    let complete = fixedLines.join('\n');

    // S'assurer que le prompt se termine correctement
    const lastLine = complete.trim().split('\n').pop() || '';
    if (lastLine && !lastLine.match(/[.!?]$/)) {
      complete += '.';
    }

    console.log('✅ Structure complète vérifiée');
    return complete;
  }

  /**
   * Complète les prompts incomplets ou tronqués
   */
  private completeIncompletePrompt(prompt: string): string {
    const lang = this.getPromptLanguage(prompt);

    // Détecter si le prompt se termine de manière incomplète
    const lastLine = prompt.trim().split('\n').pop() || '';
    const lastChar = prompt.trim().slice(-1);

    console.log('🔍 Vérification complétude du prompt:', {
      longueur: prompt.length,
      langue: lang,
      derniereLigne: lastLine.substring(0, 50),
      dernierCaractère: lastChar
    });

    // Si le prompt se termine au milieu d'un mot ou sans ponctuation
    if (lastChar && !lastChar.match(/[.!?:\n]/)) {
      console.log('⚠️ Prompt incomplet détecté, complétion en cours...');

      // Si c'est une liste à puces incomplète
      if (lastLine.startsWith('-') || lastLine.startsWith('•')) {
        if (lang === 'en') {
          prompt += '\n- Respect constraints and requested format';
        } else if (lang === 'ar') {
          prompt += '\n- احترام القيود والصيغة المطلوبة';
        } else {
          prompt += '\n- Respect des contraintes et format demandé';
        }
      }
      // Si c'est une section en cours
      else if (lastLine.includes('**')) {
        if (lang === 'en') {
          prompt += ': Clear and precise instructions';
        } else if (lang === 'ar') {
          prompt += ': تعليمات واضحة ودقيقة';
        } else {
          prompt += ': Instructions claires et précises';
        }
      }
      // Si ça se termine au milieu d'une phrase (pas de ponctuation)
      else if (lastLine.length > 0 && !lastLine.match(/[.!?]$/)) {
        // Essayer de terminer la phrase intelligemment
        if (lastLine.includes('libre de') || lastLine.includes('libre d')) {
          prompt += ' droits';
        } else if (lastLine.includes('free of') || lastLine.includes('free from')) {
          prompt += ' rights';
        } else {
          prompt += '.';
        }
      }
      // Sinon, terminer proprement
      else {
        prompt += '.';
      }

      console.log('✅ Prompt complété');
    }

    // Vérifier si des sections essentielles sont incomplètes
    const sectionPatterns = [
      { fr: 'RÔLE', en: 'ROLE', ar: 'الدور' },
      { fr: 'OBJECTIF', en: 'OBJECTIVE', ar: 'الهدف' },
      { fr: 'INSTRUCTIONS', en: 'INSTRUCTIONS', ar: 'التعليمات' },
      { fr: 'FORMAT', en: 'FORMAT', ar: 'الشكل' },
      { fr: 'CONTRAINTES', en: 'CONSTRAINTS', ar: 'القيود' }
    ];

    for (const pattern of sectionPatterns) {
      const sectionRegex = new RegExp(`\\*\\*(${pattern.fr}|${pattern.en}|${pattern.ar})\\*\\*:?\\s*$`, 'im');
      if (sectionRegex.test(prompt)) {
        // Section présente mais vide, ajouter du contenu par défaut
        const sectionType = pattern.fr;

        if (lang === 'en') {
          switch (sectionType) {
            case 'RÔLE':
              prompt += ' Expert AI assistant';
              break;
            case 'OBJECTIF':
              prompt += ' Provide precise and structured response';
              break;
            case 'INSTRUCTIONS':
              prompt += '\n- Analyze request carefully\n- Structure response clearly\n- Respect requested format';
              break;
            case 'FORMAT':
              prompt += ' Structured and professional response';
              break;
            case 'CONTRAINTES':
              prompt += '\n- Professional and precise tone\n- Complete and detailed response';
              break;
          }
        } else if (lang === 'ar') {
          switch (sectionType) {
            case 'RÔLE':
              prompt += ' مساعد الذكاء الاصطناعي الخبير';
              break;
            case 'OBJECTIF':
              prompt += ' تقديم استجابة دقيقة ومنظمة';
              break;
            case 'INSTRUCTIONS':
              prompt += '\n- تحليل الطلب بعناية\n- هيكلة الاستجابة بوضوح\n- احترام الصيغة المطلوبة';
              break;
            case 'FORMAT':
              prompt += ' استجابة منظمة ومهنية';
              break;
            case 'CONTRAINTES':
              prompt += '\n- أسلوب محترف ودقيق\n- استجابة كاملة ومفصلة';
              break;
          }
        } else {
          switch (sectionType) {
            case 'RÔLE':
              prompt += ' Expert assistant IA spécialisé';
              break;
            case 'OBJECTIF':
              prompt += ' Fournir une réponse précise et structurée';
              break;
            case 'INSTRUCTIONS':
              prompt += '\n- Analyser la demande attentivement\n- Structurer la réponse de manière claire\n- Respecter le format demandé';
              break;
            case 'FORMAT':
              prompt += ' Réponse structurée et professionnelle';
              break;
            case 'CONTRAINTES':
              prompt += '\n- Ton professionnel et précis\n- Réponse complète et détaillée';
              break;
          }
        }
      }
    }

    return prompt.trim();
  }

  /**
   * Améliore la structure d'un prompt
   */
  private improveStructure(prompt: string): string {
    // Ajouter du formatage si manquant
    if (!prompt.includes('**')) {
      const lines = prompt.split('\n');
      if (lines.length > 0 && lines[0].length < 100) {
        lines[0] = `**OBJECTIF**\n${lines[0]}`;
      }
      return lines.join('\n');
    }
    return prompt;
  }

  /**
   * Améliore la clarté d'un prompt
   */
  private improveClarity(prompt: string): string {
    // Ajouter des sauts de ligne pour séparer les sections
    let improved = prompt.replace(/(\*\*[^*]+\*\*:)/g, '\n$1\n');

    // Ajouter des listes à puces si liste détectée
    improved = improved.replace(/(\d+\.\s)/g, '- ');

    return improved.trim();
  }

  /**
   * Améliore la spécificité d'un prompt
   */
  private improveSpecificity(prompt: string): string {
    const lang = this.getPromptLanguage(prompt);

    // Si le prompt est trop vague, ajouter une note de spécificité
    const hasSpecificityKeywords = /précis|precise|exact|detailed|دقيق|مفصل/i.test(prompt);

    if (prompt.length < 100 && !hasSpecificityKeywords) {
      if (lang === 'en') {
        return `${prompt}\n\n**NOTE**: Be precise and detailed in your response.`;
      } else if (lang === 'ar') {
        return `${prompt}\n\n**ملاحظة**: كن دقيقاً ومفصلاً في إجابتك.`;
      } else {
        return `${prompt}\n\n**NOTE**: Sois précis et détaillé dans ta réponse.`;
      }
    }
    return prompt;
  }

  /**
   * Détecte la langue du prompt pour adaptation
   * Si targetLanguage est défini, l'utilise en priorité
   */
  private getPromptLanguage(prompt: string): Language {
    // Si une langue cible est forcée, l'utiliser
    if (this.targetLanguage) {
      console.log('✅ Utilisation de la langue cible forcée:', this.targetLanguage);
      return this.targetLanguage;
    }

    // Sinon, détecter automatiquement
    const detected = detectLanguage(prompt);
    console.log('🔍 Langue détectée automatiquement:', detected);
    return detected;
  }

  /**
   * Ajoute une section rôle si manquante
   */
  private addRoleSection(prompt: string): string {
    const lang = this.getPromptLanguage(prompt);

    if (lang === 'en') {
      return `**ROLE**: Expert AI assistant\n\n${prompt}`;
    } else if (lang === 'ar') {
      return `**الدور**: مساعد الذكاء الاصطناعي الخبير\n\n${prompt}`;
    }
    return `**RÔLE**: Expert assistant IA\n\n${prompt}`;
  }

  /**
   * Ajoute une section format si manquante
   */
  private addFormatSection(prompt: string): string {
    const lang = this.getPromptLanguage(prompt);

    if (lang === 'en') {
      return `${prompt}\n\n**FORMAT**: Structured and clear response`;
    } else if (lang === 'ar') {
      return `${prompt}\n\n**الشكل**: استجابة منظمة وواضحة`;
    }
    return `${prompt}\n\n**FORMAT**: Réponse structurée et claire`;
  }

  /**
   * Ajoute une section contraintes si manquante
   */
  private addConstraintsSection(prompt: string): string {
    const lang = this.getPromptLanguage(prompt);

    if (lang === 'en') {
      return `${prompt}\n\n**CONSTRAINTS**:\n- Professional and precise tone\n- Complete and structured response`;
    } else if (lang === 'ar') {
      return `${prompt}\n\n**القيود**:\n- أسلوب محترف ودقيق\n- استجابة كاملة ومنظمة`;
    }
    return `${prompt}\n\n**CONTRAINTES**:\n- Ton professionnel et précis\n- Réponse complète et structurée`;
  }

  /**
   * Calcule les améliorations apportées
   */
  private calculateImprovements(original: string, optimized: string, analysis: any): string[] {
    const improvements: string[] = [];

    // Détecter si le prompt original était incomplet
    const lastChar = original.trim().slice(-1);
    if (!lastChar.match(/[.!?:]/)) {
      improvements.push('Complétion du prompt tronqué');
    }

    // Détecter si un résumé intelligent a été appliqué
    const originalTokens = this.estimateTokens(original);
    const optimizedTokens = this.estimateTokens(optimized);

    if (originalTokens > 800 && optimizedTokens < originalTokens * 0.7) {
      improvements.push('Résumé intelligent appliqué (prompt trop long)');
      improvements.push(`Optimisation: ${originalTokens} → ${optimizedTokens} tokens (-${Math.round((1 - optimizedTokens/originalTokens) * 100)}%)`);
    }

    if (!analysis.hasRole && optimized.includes('**RÔLE**')) {
      improvements.push('Ajout d\'une définition de rôle claire');
    }

    if (!analysis.hasFormat && optimized.includes('**FORMAT**')) {
      improvements.push('Spécification du format de sortie');
    }

    if (!analysis.hasConstraints && optimized.includes('**CONTRAINTES**')) {
      improvements.push('Ajout des contraintes et règles');
    }

    if (analysis.structure < 5) {
      improvements.push('Amélioration de la structure et du formatage');
    }

    if (analysis.clarity < 6) {
      improvements.push('Amélioration de la clarté et de la lisibilité');
    }

    if (analysis.specificity < 6) {
      improvements.push('Augmentation de la spécificité et de la précision');
    }

    // Détecter si la structure a été complétée
    if (optimized.includes('**RÔLE**') && optimized.includes('**OBJECTIF**') &&
        optimized.includes('**FORMAT**') && optimized.includes('**CONTRAINTES**')) {
      improvements.push('Structure complète garantie (Rôle, Objectif, Format, Contraintes)');
    }

    return improvements.length > 0 ? improvements : ['Prompt déjà optimisé'];
  }

  /**
   * Calcule un score de qualité pour le prompt optimisé
   */
  private calculateQualityScore(prompt: string, analysis: any): number {
    let score = 5;

    // Critères de qualité
    score += analysis.clarity * 0.3;
    score += analysis.structure * 0.3;
    score += analysis.specificity * 0.2;

    if (analysis.hasRole) score += 0.5;
    if (analysis.hasContext) score += 0.5;
    if (analysis.hasConstraints) score += 0.5;
    if (analysis.hasFormat) score += 0.5;
    if (analysis.hasExamples) score += 0.5;

    return Math.min(10, Math.max(0, score));
  }

  /**
   * Estime le nombre de tokens dans un prompt
   */
  private estimateTokens(text: string): number {
    // Estimation approximative : ~0.75 token par mot
    return Math.ceil(text.split(/\s+/).length * 0.75);
  }

  /**
   * Log l'optimisation dans Supabase pour tracking
   */
  private async logOptimization(
    userId: string,
    originalPrompt: string,
    optimizedPrompt: string,
    score: number,
    category?: string
  ): Promise<void> {
    try {
      console.log('📝 Logging optimization (skipped - table removed)');
    } catch (error) {
      console.error('Exception lors du logging:', error);
    }
  }

  /**
   * Enrichit un prompt selon la longueur cible demandée
   */
  private enrichPromptForLength(prompt: string, targetLength: 'long' | 'very_long'): string {
    console.log(`🎯 Enrichissement du prompt pour longueur: ${targetLength}`);
    const lang = this.getPromptLanguage(prompt);

    const sections = this.extractSections(prompt);
    let enriched = prompt;

    // Pour les prompts longs et très longs, ajouter du contenu si les sections sont trop courtes
    if (targetLength === 'very_long') {
      // Ajouter section EXEMPLES si manquante
      const hasExamples = /\*\*(EXEMPLES|EXAMPLES|أمثلة)\*\*/i.test(enriched);
      if (!hasExamples) {
        if (lang === 'en') {
          enriched += `\n\n**EXAMPLES**:\n1. [Concrete example illustrating the application]\n2. [Specific use case with context]\n3. [Detailed scenario showing steps]`;
        } else if (lang === 'ar') {
          enriched += `\n\n**أمثلة**:\n1. [مثال ملموس يوضح التطبيق]\n2. [حالة استخدام محددة مع السياق]\n3. [سيناريو مفصل يوضح الخطوات]`;
        } else {
          enriched += `\n\n**EXEMPLES**:\n1. [Exemple concret illustrant l'application]\n2. [Cas d'usage spécifique avec contexte]\n3. [Scénario détaillé montrant les étapes]`;
        }
      }

      // Ajouter section WORKFLOW si manquante
      const hasWorkflow = /\*\*(WORKFLOW|PROCESSUS|PROCESS|سير العمل)\*\*/i.test(enriched);
      if (!hasWorkflow) {
        if (lang === 'en') {
          enriched += `\n\n**WORKFLOW**:\n1. Preparation and analysis phase\n2. Methodical execution phase\n3. Review and validation phase\n4. Delivery and documentation phase`;
        } else if (lang === 'ar') {
          enriched += `\n\n**سير العمل**:\n1. مرحلة التحضير والتحليل\n2. مرحلة التنفيذ المنهجي\n3. مرحلة المراجعة والتحقق\n4. مرحلة التسليم والتوثيق`;
        } else {
          enriched += `\n\n**WORKFLOW**:\n1. Phase de préparation et analyse\n2. Phase d'exécution méthodique\n3. Phase de révision et validation\n4. Phase de livraison et documentation`;
        }
      }

      // Ajouter section CONSIDÉRATIONS si manquante
      const hasConsiderations = /\*\*(CONSIDÉRATIONS|CONSIDERATIONS|اعتبارات)\*\*/i.test(enriched);
      if (!hasConsiderations) {
        if (lang === 'en') {
          enriched += `\n\n**CONSIDERATIONS**:\n- Technical aspects to consider\n- Business and regulatory constraints\n- Best practices and recommendations\n- Particular points of attention`;
        } else if (lang === 'ar') {
          enriched += `\n\n**اعتبارات**:\n- الجوانب التقنية التي يجب مراعاتها\n- القيود التجارية والتنظيمية\n- أفضل الممارسات والتوصيات\n- نقاط الاهتمام الخاصة`;
        } else {
          enriched += `\n\n**CONSIDÉRATIONS**:\n- Aspects techniques à prendre en compte\n- Contraintes métier et réglementaires\n- Bonnes pratiques et recommandations\n- Points d'attention particuliers`;
        }
      }
    } else if (targetLength === 'long') {
      // Pour les prompts longs, ajouter section MÉTHODOLOGIE si manquante
      const hasMethodology = /\*\*(MÉTHODOLOGIE|METHODOLOGY|APPROCHE|APPROACH|المنهجية)\*\*/i.test(enriched);
      if (!hasMethodology) {
        if (lang === 'en') {
          enriched += `\n\n**METHODOLOGY**:\n- Structured and iterative approach\n- Validation at each key step\n- Documentation and traceability`;
        } else if (lang === 'ar') {
          enriched += `\n\n**المنهجية**:\n- نهج منظم ومتكرر\n- التحقق في كل خطوة رئيسية\n- التوثيق والتتبع`;
        } else {
          enriched += `\n\n**MÉTHODOLOGIE**:\n- Approche structurée et itérative\n- Validation à chaque étape clé\n- Documentation et traçabilité`;
        }
      }
    }

    return enriched;
  }

  /**
   * Améliore la structure d'un prompt sans le compresser
   */
  private enhanceStructure(prompt: string): string {
    console.log('📐 Amélioration de la structure...');

    // S'assurer que les sections sont bien séparées
    let enhanced = prompt.replace(/(\*\*[A-Z][^*]+\*\*:)/g, '\n\n$1');

    // Ajouter des sauts de ligne entre les listes
    enhanced = enhanced.replace(/(-\s[^\n]+)(\n)(-\s)/g, '$1\n$2$3');

    // Nettoyer les sauts de ligne multiples (max 2)
    enhanced = enhanced.replace(/\n{3,}/g, '\n\n');

    return enhanced.trim();
  }

  /**
   * Améliore la clarté d'un prompt sans le compresser
   */
  private enhanceClarity(prompt: string): string {
    console.log('✨ Amélioration de la clarté...');
    const lang = this.getPromptLanguage(prompt);

    let enhanced = prompt;

    // S'assurer que chaque section a une description claire
    const sections = this.extractSections(enhanced);

    // Si OBJECTIF est trop court, l'enrichir
    if (sections.objective && sections.objective.length < 50) {
      if (lang === 'en') {
        enhanced = enhanced.replace(
          /(\*\*(OBJECTIF|OBJECTIVE)\*\*:?\s*)([^\n*]+)/i,
          '$1$3 in a precise and measurable manner, respecting expected quality criteria'
        );
      } else if (lang === 'ar') {
        enhanced = enhanced.replace(
          /(\*\*(OBJECTIF|OBJECTIVE|الهدف)\*\*:?\s*)([^\n*]+)/i,
          '$1$3 بطريقة دقيقة وقابلة للقياس، مع احترام معايير الجودة المتوقعة'
        );
      } else {
        enhanced = enhanced.replace(
          /(\*\*OBJECTIF\*\*:?\s*)([^\n*]+)/i,
          '$1$2 de manière précise et mesurable, en respectant les critères de qualité attendus'
        );
      }
    }

    return enhanced;
  }

  /**
   * Calcule les améliorations pour le mode premium (sans compression)
   */
  private calculatePremiumImprovements(original: string, optimized: string, analysis: any): string[] {
    const improvements: string[] = [];

    // Détecter si le prompt était incomplet
    const lastChar = original.trim().slice(-1);
    if (!lastChar.match(/[.!?:]/)) {
      improvements.push('✓ Complétion du prompt tronqué');
    }

    if (!analysis.hasRole && optimized.includes('**RÔLE**')) {
      improvements.push('✓ Ajout d\'une définition de rôle professionnelle');
    }

    if (!analysis.hasFormat && optimized.includes('**FORMAT**')) {
      improvements.push('✓ Spécification du format de sortie attendu');
    }

    if (!analysis.hasConstraints && optimized.includes('**CONTRAINTES**')) {
      improvements.push('✓ Ajout des contraintes et règles métier');
    }

    if (analysis.structure < 7) {
      improvements.push('✓ Amélioration de la structure et du formatage');
    }

    if (analysis.clarity < 7) {
      improvements.push('✓ Amélioration de la clarté et de la lisibilité');
    }

    // Détecter les enrichissements premium
    if (optimized.includes('**EXEMPLES**')) {
      improvements.push('✓ Ajout d\'exemples concrets et détaillés');
    }

    if (optimized.includes('**WORKFLOW**') || optimized.includes('**PROCESSUS**')) {
      improvements.push('✓ Ajout d\'un workflow structuré multi-étapes');
    }

    if (optimized.includes('**MÉTHODOLOGIE**') || optimized.includes('**APPROCHE**')) {
      improvements.push('✓ Ajout d\'une méthodologie professionnelle');
    }

    if (optimized.includes('**CONSIDÉRATIONS**')) {
      improvements.push('✓ Ajout de considérations techniques et métier');
    }

    // Analyser la complétude
    const originalTokens = this.estimateTokens(original);
    const optimizedTokens = this.estimateTokens(optimized);

    if (optimizedTokens > originalTokens) {
      improvements.push(`✓ Enrichissement: ${originalTokens} → ${optimizedTokens} tokens (+${Math.round((optimizedTokens/originalTokens - 1) * 100)}%)`);
    } else if (optimizedTokens === originalTokens) {
      improvements.push('✓ Structure optimisée sans perte de contenu');
    }

    improvements.push('✓ Mode Premium: Prompt complet préservé sans compression');

    return improvements.length > 0 ? improvements : ['✓ Prompt premium optimisé'];
  }
}

export const opikOptimizer = new OpikOptimizer();

import { supabase } from '@/integrations/supabase/client';

export interface OptimizationResult {
  optimizedPrompt: string;
  improvements: string[];
  score: number;
  tokensReduced?: number;
  clarityImproved?: boolean;
}

class OpikOptimizer {
  /**
   * Optimise automatiquement un prompt pour les utilisateurs premium
   */
  async optimizePrompt(
    originalPrompt: string,
    userId: string,
    category?: string
  ): Promise<OptimizationResult> {
    try {
      console.log('🚀 Opik Auto-Optimization démarré pour mode premium');
      console.log('📝 Prompt original longueur:', originalPrompt.length);

      // Analyser le prompt pour identifier les améliorations possibles
      const analysis = this.analyzePrompt(originalPrompt);

      // Appliquer les optimisations Opik
      const optimizedPrompt = await this.applyOptimizations(originalPrompt, analysis);

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

    // Compléter les prompts tronqués ou incomplets
    optimized = this.completeIncompletePrompt(optimized);

    // Si le prompt manque de structure, l'améliorer
    if (analysis.structure < 5) {
      optimized = this.improveStructure(optimized);
    }

    // Si le prompt manque de clarté, l'améliorer
    if (analysis.clarity < 6) {
      optimized = this.improveClarity(optimized);
    }

    // Si le prompt manque de spécificité, l'améliorer
    if (analysis.specificity < 6) {
      optimized = this.improveSpecificity(optimized);
    }

    // Ajouter des sections manquantes essentielles
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
   * Complète les prompts incomplets ou tronqués
   */
  private completeIncompletePrompt(prompt: string): string {
    // Détecter si le prompt se termine de manière incomplète
    const lastLine = prompt.trim().split('\n').pop() || '';
    const lastChar = prompt.trim().slice(-1);

    // Si le prompt ne se termine pas par une ponctuation appropriée
    if (lastChar && !lastChar.match(/[.!?:]/)) {
      // Si c'est une liste à puces incomplète
      if (lastLine.startsWith('-') || lastLine.startsWith('•')) {
        prompt += '\n- Respect des contraintes et format demandé';
      }
      // Si c'est une section en cours
      else if (lastLine.includes('**')) {
        prompt += ': Instructions claires et précises';
      }
      // Sinon, terminer proprement la phrase
      else {
        prompt += '.';
      }
    }

    // Vérifier si des sections essentielles sont incomplètes
    const sections = ['RÔLE', 'OBJECTIF', 'INSTRUCTIONS', 'FORMAT', 'CONTRAINTES'];
    for (const section of sections) {
      const sectionRegex = new RegExp(`\\*\\*${section}\\*\\*:?\\s*$`, 'im');
      if (sectionRegex.test(prompt)) {
        // Section présente mais vide, ajouter du contenu par défaut
        switch (section) {
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
    // Si le prompt est trop vague, ajouter une note de spécificité
    if (prompt.length < 100 && !prompt.includes('précis')) {
      return `${prompt}\n\n**NOTE**: Sois précis et détaillé dans ta réponse.`;
    }
    return prompt;
  }

  /**
   * Ajoute une section rôle si manquante
   */
  private addRoleSection(prompt: string): string {
    return `**RÔLE**: Expert assistant IA\n\n${prompt}`;
  }

  /**
   * Ajoute une section format si manquante
   */
  private addFormatSection(prompt: string): string {
    return `${prompt}\n\n**FORMAT**: Réponse structurée et claire`;
  }

  /**
   * Ajoute une section contraintes si manquante
   */
  private addConstraintsSection(prompt: string): string {
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

    const originalTokens = this.estimateTokens(original);
    const optimizedTokens = this.estimateTokens(optimized);
    if (originalTokens > optimizedTokens) {
      improvements.push(`Réduction de ${originalTokens - optimizedTokens} tokens`);
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
}

export const opikOptimizer = new OpikOptimizer();

/**
 * Système de compression intelligent de prompts
 * Compresse les prompts pour le mode gratuit tout en préservant l'efficacité
 */

export interface CompressionResult {
  compressed: string;
  originalLength: number;
  compressedLength: number;
  compressionRate: number;
  techniques: string[];
}

export class PromptCompressor {
  /**
   * Compresse un prompt en mode gratuit (réduction ~40-60%)
   */
  static compressFree(prompt: string): CompressionResult {
    const original = prompt;
    const originalLength = prompt.length;
    const techniques: string[] = [];

    // 1. Supprimer les redondances et phrases d'introduction
    prompt = this.removeRedundancy(prompt);
    if (prompt.length < originalLength) techniques.push("Suppression des redondances");

    // 2. Conversion en format compact (listes, mots-clés)
    prompt = this.convertToCompactFormat(prompt);
    techniques.push("Format compact structuré");

    // 3. Réduction des explications verboses
    prompt = this.simplifyExplanations(prompt);
    techniques.push("Simplification des explications");

    // 4. Utilisation de mots-clés au lieu de phrases
    prompt = this.useKeywords(prompt);
    techniques.push("Conversion en mots-clés");

    const compressedLength = prompt.length;
    const compressionRate = ((originalLength - compressedLength) / originalLength) * 100;

    return {
      compressed: prompt,
      originalLength,
      compressedLength,
      compressionRate: Math.round(compressionRate),
      techniques
    };
  }

  /**
   * Format premium - prompt détaillé et structuré
   */
  static formatPremium(prompt: string): string {
    // En mode premium, on enrichit le prompt avec plus de structure
    const sections: string[] = [];

    // Analyse du prompt pour identifier les sections
    const hasRole = /\*\*RÔLE\*\*/i.test(prompt);
    const hasMission = /\*\*MISSION\*\*/i.test(prompt);
    const hasContext = /\*\*CONTEXTE\*\*/i.test(prompt);

    // Si déjà bien structuré, on garde tel quel
    if (hasRole && hasMission) {
      return prompt;
    }

    // Sinon, on ajoute une structure premium
    return `**RÔLE**: Expert spécialisé

**MISSION**: ${prompt}

**MÉTHODOLOGIE**: 
- Analyse approfondie des besoins
- Structuration détaillée
- Exemples et illustrations
- Validation et optimisation

**LIVRABLES**: Résultat détaillé et actionnable

**QUALITÉ**: Niveau expert avec justifications`;
  }

  /**
   * Supprime les redondances et répétitions
   */
  private static removeRedundancy(text: string): string {
    // Supprimer les formules de politesse et introductions
    text = text.replace(/^(bonjour|salut|hello|hi)[,\s]*/gi, '');
    text = text.replace(/^(s'il vous plaît|s'il te plaît|please)[,\s]*/gi, '');
    text = text.replace(/^(je voudrais|je veux|j'aimerais|i want|i would like)[,\s]*/gi, '');
    
    // Supprimer les phrases d'introduction génériques
    text = text.replace(/^(créez|génère|crée|create|generate)[,\s]*/gi, '');
    
    // Supprimer les répétitions de mots consécutifs
    text = text.replace(/\b(\w+)\s+\1\b/gi, '$1');
    
    return text.trim();
  }

  /**
   * Convertit en format compact avec sections clés
   */
  private static convertToCompactFormat(text: string): string {
    // Si le texte contient déjà des sections structurées, le simplifier
    if (text.includes('**') || text.includes('##')) {
      // Garder seulement les sections essentielles
      text = text.replace(/\*\*CONTEXTE\*\*:?[^\*]*/gi, '');
      text = text.replace(/\*\*MÉTHODOLOGIE\*\*:?[^\*]*/gi, '');
      text = text.replace(/\*\*CONSEILS\*\*:?[^\*]*/gi, '');
    }
    
    return text;
  }

  /**
   * Simplifie les explications verboses
   */
  private static simplifyExplanations(text: string): string {
    // Remplacer les phrases longues par des formulations courtes
    const replacements: [RegExp, string][] = [
      [/en tenant compte de/gi, 'avec'],
      [/il est important de/gi, ''],
      [/assurez-vous de/gi, ''],
      [/veuillez/gi, ''],
      [/vous devez/gi, ''],
      [/il faut/gi, ''],
      [/c'est-à-dire/gi, ':'],
      [/par exemple/gi, 'ex:'],
      [/notamment/gi, ':'],
      [/ainsi que/gi, '+'],
      [/de manière à/gi, 'pour'],
      [/afin de/gi, 'pour'],
      [/dans le but de/gi, 'pour'],
    ];

    for (const [pattern, replacement] of replacements) {
      text = text.replace(pattern, replacement);
    }

    // Supprimer les doubles espaces
    text = text.replace(/\s{2,}/g, ' ');
    
    return text.trim();
  }

  /**
   * Convertit les phrases en mots-clés quand possible
   */
  private static useKeywords(text: string): string {
    // Identifier et convertir les listes en format compact
    const lines = text.split('\n');
    const compressed = lines.map(line => {
      // Si c'est une liste détaillée, la compresser
      if (line.match(/^[\-\*\•]/)) {
        return line
          .replace(/^[\-\*\•]\s*/, '• ')
          .replace(/\b(qui|que|dont|où)\b/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
      }
      return line;
    });

    return compressed.join('\n');
  }

  /**
   * Détermine si on doit utiliser le mode compressé
   */
  static shouldCompress(userHasCredits: boolean, creditsRemaining: number): boolean {
    // Mode gratuit : toujours compresser si crédits limités
    if (creditsRemaining <= 10) return true;
    
    // Mode premium : ne pas compresser
    return false;
  }

  /**
   * Génère un prompt selon le mode (gratuit ou premium)
   */
  static generatePromptByMode(
    basePrompt: string, 
    isPremium: boolean
  ): { prompt: string; info: string } {
    if (isPremium) {
      const enhanced = this.formatPremium(basePrompt);
      return {
        prompt: enhanced,
        info: `Mode Premium : Prompt détaillé (${enhanced.length} caractères)`
      };
    } else {
      const result = this.compressFree(basePrompt);
      return {
        prompt: result.compressed,
        info: `Mode Gratuit : Prompt optimisé (${result.compressedLength} car., compression ${result.compressionRate}%)`
      };
    }
  }
}

/**
 * Système de compression intelligent de prompts
 * 3 modes : Gratuit (150 tokens), Basique (300 tokens), Premium (600 tokens)
 */

export interface CompressionResult {
  compressed: string;
  originalLength: number;
  compressedLength: number;
  compressionRate: number;
  estimatedTokens: number;
  techniques: string[];
}

export type PromptMode = 'free' | 'basic' | 'premium';

const TOKEN_LIMITS = {
  free: 150,
  basic: 300,
  premium: 600
};

export class PromptCompressor {
  /**
   * Estime le nombre de tokens (approximation : 1 token ≈ 4 caractères)
   */
  private static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Compresse pour respecter une limite de tokens stricte
   */
  private static compressToLimit(prompt: string, maxTokens: number, mode: PromptMode): CompressionResult {
    const original = prompt;
    const originalLength = prompt.length;
    const techniques: string[] = [];

    // Nettoyer et simplifier progressivement
    prompt = this.removeRedundancy(prompt);
    techniques.push("Nettoyage");

    prompt = this.eliminateCommonErrors(prompt, mode);
    techniques.push("Élimination erreurs");

    prompt = this.convertToCompactFormat(prompt);
    prompt = this.simplifyExplanations(prompt);
    prompt = this.useKeywords(prompt);
    
    // Réduire agressivement si nécessaire
    let tokens = this.estimateTokens(prompt);
    if (tokens > maxTokens) {
      prompt = this.aggressiveCompress(prompt, maxTokens);
      techniques.push("Compression agressive");
      tokens = this.estimateTokens(prompt);
    }

    const compressedLength = prompt.length;
    const compressionRate = ((originalLength - compressedLength) / originalLength) * 100;

    return {
      compressed: prompt.trim(),
      originalLength,
      compressedLength,
      compressionRate: Math.round(compressionRate),
      estimatedTokens: tokens,
      techniques
    };
  }

  /**
   * Élimine les erreurs courantes listées
   */
  private static eliminateCommonErrors(text: string, mode: PromptMode): string {
    // ❌ Supprimer TOUS les exemples en mode gratuit, longs (>30 mots) en mode basic
    const exampleThreshold = mode === 'free' ? 10 : 30;
    text = text.replace(new RegExp(`exemple\\s*:[\\s\\S]{${exampleThreshold},}`, 'gi'), '');
    text = text.replace(new RegExp(`par exemple[\\s\\S]{${exampleThreshold},}`, 'gi'), '');
    text = text.replace(/\*\*exemple\*\*[\s\S]*?(?=\*\*|$)/gi, '');
    text = text.replace(/\*\*format exemple\*\*[\s\S]*?(?=\*\*|$)/gi, '');
    text = text.replace(/\*\*exemple de sortie\*\*[\s\S]*?(?=\*\*|$)/gi, '');

    // ❌ Supprimer les explications du "pourquoi" et justifications
    text = text.replace(/\b(car|parce que|afin de|dans le but de|de manière à|en effet|c'est-à-dire)[\s\S]{30,}?\./gi, '.');
    text = text.replace(/\*\*pourquoi\*\*[\s\S]*?(?=\*\*|$)/gi, '');
    text = text.replace(/\(ceci permet[^)]+\)/gi, '');
    text = text.replace(/\(afin de[^)]+\)/gi, '');

    // ❌ Limiter drastiquement les références artistiques/styles
    const maxStyles = mode === 'free' ? 1 : mode === 'basic' ? 2 : 3;
    const stylePatterns = [
      /style[s]?\s*:([^\.\n]+)/gi,
      /référence[s]?\s*:([^\.\n]+)/gi,
      /inspiré de\s*:([^\.\n]+)/gi,
      /ton[s]?\s*:([^\.\n]+)/gi
    ];

    for (const pattern of stylePatterns) {
      text = text.replace(pattern, (match, content) => {
        const items = content.split(/[,;]/).slice(0, maxStyles);
        return match.split(':')[0] + ': ' + items.join(',').trim();
      });
    }

    // ❌ En mode gratuit: supprimer emojis et icônes
    if (mode === 'free') {
      text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
      text = text.replace(/🎯|📝|🧑‍💻|🗂|📏|✅|❌|⚠️|💡/g, '');
    }

    // ❌ Supprimer sections méthodologie/approche séparées
    text = text.replace(/\*\*méthodologie\*\*[\s\S]*?(?=\*\*[A-ZÉ]|$)/gi, '');
    text = text.replace(/\*\*approche\*\*[\s\S]*?(?=\*\*[A-ZÉ]|$)/gi, '');
    text = text.replace(/\*\*méthode\*\*[\s\S]*?(?=\*\*[A-ZÉ]|$)/gi, '');

    // ❌ Garder UN SEUL format (supprimer doublons format/livrable)
    const formatMatches = text.match(/\*\*(format|livrable)[\s\S]*?(?=\*\*[A-ZÉ]|$)/gi);
    if (formatMatches && formatMatches.length > 1) {
      // Garder seulement le premier
      const firstMatch = formatMatches[0];
      text = text.replace(/\*\*(format|livrable)[\s\S]*?(?=\*\*[A-ZÉ]|$)/gi, '');
      text += '\n' + firstMatch;
    }

    return text;
  }

  /**
   * Compression agressive pour respecter limite tokens
   */
  private static aggressiveCompress(text: string, maxTokens: number): string {
    const targetLength = maxTokens * 3.5; // Approximation plus stricte

    if (text.length <= targetLength) return text;

    // Garder uniquement l'essentiel
    const lines = text.split('\n').filter(l => l.trim());
    const essential: string[] = [];
    let currentLength = 0;

    // Priorité 1: Titre de section (OBJECTIF, INSTRUCTIONS, etc.)
    // Priorité 2: Points d'action directs
    for (const line of lines) {
      const isSectionHeader = line.match(/^\*\*[A-ZÉ]+\*\*/);
      const isActionItem = line.match(/^[\-\•\*]\s*/);
      const isNumberedStep = line.match(/^\d+\./);

      if (isSectionHeader || isActionItem || isNumberedStep) {
        const compressed = line
          .replace(/\s+/g, ' ')
          .replace(/\b(qui|que|dont|où|ainsi que|de manière à|afin de)\b/gi, '')
          .trim();

        if (currentLength + compressed.length < targetLength) {
          essential.push(compressed);
          currentLength += compressed.length;
        }
      }
    }

    return essential.join('\n').slice(0, targetLength);
  }

  /**
   * Mode GRATUIT : 150 tokens max
   */
  static compressFree(prompt: string): CompressionResult {
    return this.compressToLimit(prompt, TOKEN_LIMITS.free, 'free');
  }

  /**
   * Mode BASIQUE : 300 tokens max
   */
  static compressBasic(prompt: string): CompressionResult {
    return this.compressToLimit(prompt, TOKEN_LIMITS.basic, 'basic');
  }

  /**
   * Mode PREMIUM : 600 tokens max - Structure optimale
   */
  static formatPremium(prompt: string): string {
    // Structure premium concise mais complète
    const clean = this.eliminateCommonErrors(prompt, 'premium');

    // Si déjà structuré, optimiser
    if (clean.includes('**')) {
      const optimized = this.compressToLimit(clean, TOKEN_LIMITS.premium, 'premium');
      return optimized.compressed;
    }

    // Structure premium efficace (max 600 tokens)
    // Note: PAS d'exemple complet, instructions intégrées
    const structured = `**RÔLE**: Expert spécialisé

**MISSION**: ${clean}

**ÉLÉMENTS REQUIS**:
- Précision et structure
- Instructions directes
- Max 2-3 références

**LIVRABLE**: Format structuré actionnable`;

    const result = this.compressToLimit(structured, TOKEN_LIMITS.premium, 'premium');
    return result.compressed;
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
   * Génère un prompt selon le mode et les crédits
   */
  static generatePromptByMode(
    basePrompt: string, 
    creditsRemaining: number
  ): { prompt: string; info: string; mode: PromptMode } {
    let mode: PromptMode;
    let result: CompressionResult;
    
    if (creditsRemaining <= 10) {
      mode = 'free';
      result = this.compressFree(basePrompt);
      return {
        prompt: result.compressed,
        info: `Mode Gratuit: ${result.estimatedTokens}/${TOKEN_LIMITS.free} tokens`,
        mode
      };
    } else if (creditsRemaining <= 50) {
      mode = 'basic';
      result = this.compressBasic(basePrompt);
      return {
        prompt: result.compressed,
        info: `Mode Basique: ${result.estimatedTokens}/${TOKEN_LIMITS.basic} tokens`,
        mode
      };
    } else {
      mode = 'premium';
      const enhanced = this.formatPremium(basePrompt);
      const tokens = this.estimateTokens(enhanced);
      return {
        prompt: enhanced,
        info: `Mode Premium: ${tokens}/${TOKEN_LIMITS.premium} tokens`,
        mode
      };
    }
  }
}

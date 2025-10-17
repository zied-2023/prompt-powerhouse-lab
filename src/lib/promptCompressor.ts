/**
 * Système de compression intelligent de prompts
 * Modes : Gratuit / Premium avec gestion de longueur (court, moyen, long, très long)
 */

import { UltraCompressor } from './ultraCompressor';

export interface CompressionResult {
  compressed: string;
  originalLength: number;
  compressedLength: number;
  compressionRate: number;
  estimatedTokens: number;
  techniques: string[];
}

export type PromptMode = 'free' | 'basic' | 'premium';
export type PromptLength = 'short' | 'medium' | 'long' | 'very_long';

const TOKEN_LIMITS = {
  free: {
    short: 100,
    medium: 150,
    long: 200,
    very_long: 250
  },
  basic: {
    short: 800,
    medium: 1500,
    long: 2500,
    very_long: 3500
  },
  premium: {
    short: 1200,
    medium: 2500,
    long: 4000,
    very_long: 6000
  }
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
  private static compressToLimit(
    prompt: string,
    maxTokens: number,
    mode: PromptMode,
    length: PromptLength = 'medium'
  ): CompressionResult {
    const original = prompt;
    const originalLength = prompt.length;
    const techniques: string[] = [];

    prompt = this.removeRedundancy(prompt);
    techniques.push("Suppression redondances");

    prompt = this.eliminateRepetitions(prompt);
    techniques.push("Élimination répétitions");

    prompt = this.removeUselessExamples(prompt, mode, length);
    techniques.push("Suppression exemples inutiles");

    prompt = this.eliminateCommonErrors(prompt, mode);
    techniques.push("Nettoyage erreurs");

    prompt = this.convertToCompactFormat(prompt);
    prompt = this.simplifyExplanations(prompt);
    prompt = this.useKeywords(prompt);

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
   * Élimine les répétitions de phrases et concepts
   */
  private static eliminateRepetitions(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const sentence of sentences) {
      const normalized = sentence.toLowerCase().trim().replace(/\s+/g, ' ');
      const fingerprint = normalized.slice(0, 50);

      if (!seen.has(fingerprint)) {
        seen.add(fingerprint);
        unique.push(sentence.trim());
      }
    }

    return unique.join('. ') + '.';
  }

  /**
   * Supprime les exemples inutiles selon le mode et la longueur
   */
  private static removeUselessExamples(text: string, mode: PromptMode, length: PromptLength): string {
    const maxExamples = mode === 'free'
      ? (length === 'short' ? 0 : length === 'medium' ? 1 : 2)
      : mode === 'basic'
      ? (length === 'short' ? 1 : length === 'medium' ? 2 : 3)
      : (length === 'short' ? 2 : length === 'medium' ? 3 : 5);

    const examplePatterns = [
      /exemple\s*\d*\s*:[\s\S]*?(?=\n\n|exemple|$)/gi,
      /par exemple\s*:[\s\S]*?(?=\n\n|$)/gi,
      /\*\*exemple\*\*[\s\S]*?(?=\*\*|$)/gi,
      /```[\s\S]*?```/g
    ];

    let exampleCount = 0;
    for (const pattern of examplePatterns) {
      text = text.replace(pattern, (match) => {
        exampleCount++;
        return exampleCount <= maxExamples ? match : '';
      });
    }

    const minExampleLength = mode === 'free' ? 200 : mode === 'basic' ? 150 : 100;
    text = text.replace(new RegExp(`exemple[\\s\\S]{${minExampleLength},}`, 'gi'), (match) => {
      if (mode === 'free' && length === 'short') return '';
      return match.length > minExampleLength * 2 ? '' : match;
    });

    return text;
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
        } else {
          // Si on dépasse, ajouter autant que possible de cette ligne
          const remaining = targetLength - currentLength;
          if (remaining > 20) { // Au moins 20 caractères pour avoir du sens
            const words = compressed.split(/\s+/);
            const truncated: string[] = [];
            let truncatedLength = 0;

            for (const word of words) {
              if (truncatedLength + word.length + 1 < remaining) {
                truncated.push(word);
                truncatedLength += word.length + 1;
              } else {
                break;
              }
            }

            let finalLine = truncated.join(' ');
            // S'assurer que la ligne se termine correctement
            if (finalLine && !finalLine.match(/[.!?:]$/)) {
              finalLine += '.';
            }
            essential.push(finalLine);
          }
          break;
        }
      }
    }

    let result = essential.join('\n').trim();

    // S'assurer que le prompt se termine correctement
    if (result && !result.match(/[.!?]$/)) {
      result += '.';
    }

    return result;
  }

  /**
   * Compression avec gestion de la longueur
   */
  static compressWithLength(
    prompt: string,
    mode: PromptMode,
    length: PromptLength
  ): CompressionResult {
    const maxTokens = TOKEN_LIMITS[mode][length];
    return this.compressToLimit(prompt, maxTokens, mode, length);
  }

  /**
   * Mode GRATUIT avec longueur - Utilise UltraCompressor
   */
  static compressFree(prompt: string, length: PromptLength = 'medium'): CompressionResult {
    const ultraResult = UltraCompressor.compress(prompt);

    return {
      compressed: ultraResult.compressed,
      originalLength: prompt.length,
      compressedLength: ultraResult.compressed.length,
      compressionRate: ultraResult.reductionRate,
      estimatedTokens: Math.ceil(ultraResult.compressedWords / 0.75),
      techniques: ultraResult.techniques
    };
  }

  /**
   * Mode BASIQUE avec longueur
   */
  static compressBasic(prompt: string, length: PromptLength = 'medium'): CompressionResult {
    return this.compressWithLength(prompt, 'basic', length);
  }

  /**
   * Mode PREMIUM avec longueur - Structure optimale
   */
  static formatPremium(prompt: string, length: PromptLength = 'medium'): string {
    const maxTokens = TOKEN_LIMITS.premium[length];
    const clean = this.eliminateCommonErrors(prompt, 'premium');

    if (clean.includes('**')) {
      const optimized = this.compressToLimit(clean, maxTokens, 'premium', length);
      return optimized.compressed;
    }

    const structured = `**RÔLE**: Expert spécialisé

**MISSION**: ${clean}

**ÉLÉMENTS REQUIS**:
- Précision et structure
- Instructions directes
${length === 'very_long' ? '- Exemples pertinents' : '- Max 2-3 références'}

**LIVRABLE**: Format structuré actionnable`;

    const result = this.compressToLimit(structured, maxTokens, 'premium', length);
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
   * Convertit les valeurs de longueur du formulaire en PromptLength
   */
  static mapLengthFromForm(lengthValue?: string): PromptLength {
    switch(lengthValue) {
      case 'short': return 'short';
      case 'medium': return 'medium';
      case 'long': return 'long';
      case 'very-detailed':
      case 'very_long': return 'very_long';
      default: return 'medium';
    }
  }

  /**
   * Génère un prompt selon le mode, les crédits et la longueur
   */
  static generatePromptByMode(
    basePrompt: string,
    creditsRemaining: number,
    length: PromptLength = 'medium'
  ): { prompt: string; info: string; mode: PromptMode; maxTokens: number } {
    let mode: PromptMode;
    let result: CompressionResult;

    if (creditsRemaining <= 10) {
      mode = 'free';
      result = this.compressFree(basePrompt, length);
      return {
        prompt: result.compressed,
        info: `Mode Gratuit (${this.getLengthLabel(length)}): ${result.estimatedTokens}/${TOKEN_LIMITS.free[length]} tokens`,
        mode,
        maxTokens: TOKEN_LIMITS.free[length]
      };
    } else if (creditsRemaining <= 50) {
      mode = 'basic';
      result = this.compressBasic(basePrompt, length);
      return {
        prompt: result.compressed,
        info: `Mode Basique (${this.getLengthLabel(length)}): ${result.estimatedTokens}/${TOKEN_LIMITS.basic[length]} tokens`,
        mode,
        maxTokens: TOKEN_LIMITS.basic[length]
      };
    } else {
      mode = 'premium';
      const enhanced = this.formatPremium(basePrompt, length);
      const tokens = this.estimateTokens(enhanced);
      return {
        prompt: enhanced,
        info: `Mode Premium (${this.getLengthLabel(length)}): ${tokens}/${TOKEN_LIMITS.premium[length]} tokens`,
        mode,
        maxTokens: TOKEN_LIMITS.premium[length]
      };
    }
  }

  /**
   * Obtient le label de longueur en français
   */
  private static getLengthLabel(length: PromptLength): string {
    switch(length) {
      case 'short': return 'Court';
      case 'medium': return 'Moyen';
      case 'long': return 'Long';
      case 'very_long': return 'Très long';
      default: return 'Moyen';
    }
  }
}

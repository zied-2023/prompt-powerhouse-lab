/**
 * Système de compression ultra-efficace pour prompts gratuits
 * Applique les règles ABSOLUES de compression sans perte de qualité
 * Max 150 mots - Format bullet points obligatoire
 */

export interface UltraCompressionResult {
  compressed: string;
  originalWords: number;
  compressedWords: number;
  reductionRate: number;
  validationScore: number;
  techniques: string[];
}

export class UltraCompressor {
  private static readonly MAX_WORDS = 150;
  private static readonly MAX_LINES = 20;
  private static readonly MAX_EXAMPLE_WORDS = 15;
  private static readonly REQUIRED_SCORE = 85;

  private static countWords(text: string): number {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  private static countLines(text: string): number {
    return text.split('\n').filter(l => l.trim()).length;
  }

  static compress(prompt: string): UltraCompressionResult {
    const originalWords = this.countWords(prompt);
    const techniques: string[] = [];

    let compressed = prompt;

    compressed = this.applyR1Structure(compressed);
    techniques.push("R1: Structure optimale");

    compressed = this.applyR2Syntax(compressed);
    techniques.push("R2: Compression syntaxique");

    compressed = this.applyR3Elimination(compressed);
    techniques.push("R3: Élimination impitoyable");

    compressed = this.applyR4BulletPoints(compressed);
    techniques.push("R4: Format bullet points");

    compressed = this.applyR5Examples(compressed);
    techniques.push("R5: Exemples ultra-courts");

    const compressedWords = this.countWords(compressed);

    if (compressedWords > this.MAX_WORDS) {
      compressed = this.applyR6Counting(compressed);
      techniques.push("R6: Réduction forcée");
    }

    compressed = this.applyR7Prioritization(compressed);
    techniques.push("R7: Priorisation stricte");

    const finalWords = this.countWords(compressed);
    const reductionRate = ((originalWords - finalWords) / originalWords) * 100;
    const validationScore = this.calculateScore(compressed);

    if (validationScore < this.REQUIRED_SCORE) {
      compressed = this.regenerate(compressed);
      techniques.push("Régénération auto");
    }

    return {
      compressed: compressed.trim(),
      originalWords,
      compressedWords: finalWords,
      reductionRate: Math.round(reductionRate),
      validationScore,
      techniques
    };
  }

  private static applyR1Structure(text: string): string {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const sections = {
      role: '',
      objective: '',
      context: '',
      deliverable: '',
      constraints: [] as string[]
    };

    for (const line of lines) {
      const lower = line.toLowerCase();

      if (lower.includes('rôle') || lower.includes('role') || lower.includes('expert')) {
        sections.role = this.extractContent(line, 5);
      } else if (lower.includes('objectif') || lower.includes('mission') || lower.includes('tâche')) {
        sections.objective = this.extractContent(line, 15);
      } else if (lower.includes('contexte') || lower.includes('context') || lower.includes('secteur')) {
        sections.context = this.extractContent(line, 12);
      } else if (lower.includes('livrable') || lower.includes('format') || lower.includes('sortie')) {
        sections.deliverable = this.extractContent(line, 10);
      } else if (lower.includes('contrainte') || lower.includes('règle') || lower.includes('ton') || lower.includes('style')) {
        sections.constraints.push(this.extractContent(line, 8));
      }
    }

    if (!sections.role) {
      sections.role = 'expert spécialisé';
    }

    if (!sections.objective && lines.length > 0) {
      sections.objective = this.extractContent(lines[0], 15);
    }

    const result: string[] = [];

    result.push(`[Rôle IA]: Tu es un(e) ${sections.role}.`);

    if (sections.objective) {
      result.push(`[Objectif]: Ta mission est de ${sections.objective}.`);
    }

    if (sections.context) {
      result.push(`[Contexte]: ${sections.context}.`);
    }

    if (sections.deliverable) {
      result.push(`[Livrable attendu]: Fournis ${sections.deliverable}.`);
    }

    const constraintText = sections.constraints.slice(0, 2).join(', ');
    const toneMatch = text.match(/ton[:\s]+([^\.,\n]+)/i);
    const tone = toneMatch ? toneMatch[1].trim() : 'professionnel';

    if (constraintText) {
      result.push(`[Contraintes]: ≤150 mots, ton ${tone}, ${constraintText}.`);
    } else {
      result.push(`[Contraintes]: ≤150 mots, ton ${tone}.`);
    }

    return result.join('\n');
  }

  private static extractContent(line: string, maxWords: number): string {
    let content = line.replace(/^\*\*.*?\*\*\s*:?\s*/i, '');
    content = content.replace(/^[A-ZÉÈ\s]+:\s*/i, '');

    const words = content.split(/\s+/).slice(0, maxWords);
    return words.join(' ');
  }

  private static applyR2Syntax(text: string): string {
    text = text.replace(/\bet\b/gi, '-');
    text = text.replace(/\bou\b/gi, '/');

    text = text.replace(/\bobligatoire\b/gi, '⚠️');
    text = text.replace(/\brecommandé\b/gi, '✓');
    text = text.replace(/\binterdit\b/gi, '❌');
    text = text.replace(/\bmaximum\b/gi, 'max');

    text = text.replace(/\bexemple\b/gi, 'ex');
    text = text.replace(/\bc'est-à-dire\b/gi, 'i.e.');
    text = text.replace(/\bpar\b(?=\s+\w+:)/gi, '/');

    text = text.replace(/trois/gi, '3');
    text = text.replace(/quatre/gi, '4');
    text = text.replace(/cinq/gi, '5');

    text = text.replace(/option\s+([A-Z])[,\s]+option\s+([A-Z])[,\s]+option\s+([A-Z])/gi, 'opt/$1/$2/$3');

    return text;
  }

  private static applyR3Elimination(text: string): string {
    const introPatterns = [
      /^(Tu vas devoir|Il faut que|Vous devez|Je voudrais que)[^\n.]*/gim,
      /^(Créez|Génère|Crée|Create|Generate)\s+/gim,
      /^(Bonjour|Salut|Hello)[,\s]*/gim,
      /^(S'il vous plaît|S'il te plaît|Please)[,\s]*/gim
    ];

    for (const pattern of introPatterns) {
      text = text.replace(pattern, '');
    }

    const adverbs = /\b(très|vraiment|beaucoup|assez|plutôt|extrêmement)\s+/gi;
    text = text.replace(adverbs, '');

    text = text.replace(/\b(\w+)\s+\1\b/gi, '$1');

    const politePatterns = [
      /s'il te plaît[,\s]*/gi,
      /merci de[,\s]*/gi,
      /veuillez[,\s]*/gi
    ];

    for (const pattern of politePatterns) {
      text = text.replace(pattern, '');
    }

    text = text.replace(/(car|parce que|afin de|dans le but de)[^.]*\./gi, '.');

    return text;
  }

  private static applyR4BulletPoints(text: string): string {
    return text;
  }

  private static splitIntoChunks(text: string, maxWords: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += maxWords) {
      chunks.push(words.slice(i, i + maxWords).join(' '));
    }

    return chunks;
  }

  private static applyR5Examples(text: string): string {
    const examplePattern = /(ex|exemple|example)\s*:([^→\n]*)(→([^\n]*))?/gi;

    text = text.replace(examplePattern, (match, prefix, input, arrow, output) => {
      const inputWords = (input || '').trim().split(/\s+/);
      const outputWords = (output || '').trim().split(/\s+/);

      const shortInput = inputWords.slice(0, 5).join(' ');
      const shortOutput = outputWords.slice(0, 8).join(' ');

      if (output) {
        return `EX: ${shortInput} → ${shortOutput}`;
      } else {
        return `EX: ${shortInput}`;
      }
    });

    return text;
  }

  private static applyR6Counting(text: string): string {
    let words = this.countWords(text);
    let lines = this.countLines(text);

    if (words <= this.MAX_WORDS && lines <= this.MAX_LINES) {
      return text;
    }

    const sections = text.split(/\n\n+/);
    if (sections.length > 5) {
      const essential = sections.slice(0, 5);
      text = essential.join('\n\n');
    }

    words = this.countWords(text);
    if (words > this.MAX_WORDS) {
      const allLines = text.split('\n');
      const kept = allLines.slice(0, this.MAX_LINES);
      text = kept.join('\n');
    }

    words = this.countWords(text);
    if (words > this.MAX_WORDS) {
      const truncated = text.split(/\s+/).slice(0, this.MAX_WORDS).join(' ');
      text = truncated;
    }

    return text;
  }

  private static applyR7Prioritization(text: string): string {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const prioritized: { line: string; priority: number }[] = [];

    for (const line of lines) {
      let priority = 0;

      if (line.match(/^(RÔLE|TÂCHE|FORMAT|CONTRAINTES|TON|EX):/)) {
        priority = 10;
      }

      if (line.includes('⚠️') || line.includes('obligatoire') || line.toLowerCase().includes('max')) {
        priority += 5;
      }

      if (line.includes('✓') || line.includes('recommandé') || line.includes('ton:') || line.includes('style:')) {
        priority += 3;
      }

      if (line.includes('EX:') || line.includes('→')) {
        priority += 2;
      }

      if (line.match(/^-\s+/)) {
        priority += 1;
      }

      prioritized.push({ line, priority });
    }

    prioritized.sort((a, b) => b.priority - a.priority);

    const kept = prioritized.slice(0, this.MAX_LINES);

    return kept.map(item => item.line).join('\n');
  }

  private static calculateScore(text: string): number {
    let score = 0;
    const words = this.countWords(text);

    if (words <= this.MAX_WORDS) {
      score += 40;
    } else {
      score += Math.max(0, 40 - (words - this.MAX_WORDS) * 2);
    }

    const hasTemplate = text.includes('[Rôle IA]') && text.includes('[Objectif]') && text.includes('[Contraintes]');
    if (hasTemplate) {
      score += 30;
    }

    const hasDeliverable = text.includes('[Livrable attendu]');
    if (hasDeliverable) {
      score += 15;
    }

    const hasConstraint = text.includes('≤150 mots');
    if (hasConstraint) {
      score += 15;
    }

    return Math.min(100, score);
  }

  private static countRepetitions(text: string): number {
    const words = text.toLowerCase().split(/\s+/);
    const freq = new Map<string, number>();

    for (const word of words) {
      if (word.length < 4) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }

    let repetitions = 0;
    for (const count of freq.values()) {
      if (count > 2) {
        repetitions += (count - 2);
      }
    }

    return repetitions;
  }

  private static regenerate(text: string): string {
    let regenerated = text;

    regenerated = this.applyR3Elimination(regenerated);
    regenerated = this.applyR6Counting(regenerated);
    regenerated = this.applyR7Prioritization(regenerated);

    return regenerated;
  }

  static formatForDisplay(result: UltraCompressionResult): string {
    return `${result.compressed}

---
📊 Stats: ${result.compressedWords}/${this.MAX_WORDS} mots | -${result.reductionRate}% | Score: ${result.validationScore}/100
✅ Techniques: ${result.techniques.join(', ')}`;
  }

  static validate(text: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const words = this.countWords(text);
    if (words > this.MAX_WORDS) {
      errors.push(`Trop long: ${words} mots (max ${this.MAX_WORDS})`);
    }

    const hasTemplate = text.includes('[Rôle IA]') && text.includes('[Objectif]');
    if (!hasTemplate) {
      errors.push('Template standardisé manquant');
    }

    const hasConstraints = text.includes('[Contraintes]');
    if (!hasConstraints) {
      warnings.push('Section contraintes manquante');
    }

    const score = this.calculateScore(text);
    if (score < this.REQUIRED_SCORE) {
      warnings.push(`Score insuffisant: ${score} (min ${this.REQUIRED_SCORE})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

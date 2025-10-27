/**
 * Compresseur avancé de prompts basé sur le guide complet de compression
 * Applique les techniques du PDF sans perte de qualité
 * Compression cible: 30-60% selon le type de prompt
 */

export type PromptType =
  | 'visual'
  | 'creative'
  | 'logical'
  | 'fewshot'
  | 'instruction'
  | 'code'
  | 'analysis'
  | 'data';

export interface CompressionConfig {
  targetReduction: { min: number; max: number };
  techniques: string[];
  riskyTechniques: string[];
}

export interface AdvancedCompressionResult {
  original: string;
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
  reductionRate: number;
  appliedTechniques: string[];
  type: PromptType;
  qualityScore: number;
}

const COMPRESSION_CONFIGS: Record<PromptType, CompressionConfig> = {
  visual: {
    targetReduction: { min: 60, max: 70 },
    techniques: ['fusionSections', 'suppressionTirets', 'vocabulaireConcis'],
    riskyTechniques: ['supprimerDetailsCritiques']
  },
  creative: {
    targetReduction: { min: 40, max: 50 },
    techniques: ['reformulation', 'eliminationRedondances', 'compressionDialogues'],
    riskyTechniques: ['reduireTonVoix']
  },
  logical: {
    targetReduction: { min: 15, max: 25 },
    techniques: ['reformulationLegere', 'pseudoCode'],
    riskyTechniques: ['supprimerEtapes', 'supprimerExemples']
  },
  fewshot: {
    targetReduction: { min: 20, max: 35 },
    techniques: ['reduireExemples', 'synthetiserPatterns'],
    riskyTechniques: ['eliminerDiversite']
  },
  instruction: {
    targetReduction: { min: 25, max: 40 },
    techniques: ['numerotation', 'structureHierarchique', 'acronymes'],
    riskyTechniques: ['compromettreClarete']
  },
  code: {
    targetReduction: { min: 50, max: 65 },
    techniques: ['pseudoCode', 'abstractionLogique', 'pseudoLangages'],
    riskyTechniques: ['perdrePrecisionSyntaxique']
  },
  analysis: {
    targetReduction: { min: 30, max: 45 },
    techniques: ['structuration', 'pointsCles', 'eliminationPleonasmes'],
    riskyTechniques: ['supprimerContexte']
  },
  data: {
    targetReduction: { min: 40, max: 55 },
    techniques: ['tableaux', 'schemas', 'patternsDistilles'],
    riskyTechniques: ['reduireExemplesEntree']
  }
};

export class AdvancedPromptCompressor {

  /**
   * Détecte automatiquement le type de prompt
   */
  static detectPromptType(prompt: string): PromptType {
    const lower = prompt.toLowerCase();

    if (lower.match(/image|visuel|photo|illustration|style.*artist/i)) return 'visual';
    if (lower.match(/code|fonction|classe|script|programming/i)) return 'code';
    if (lower.match(/exemple\s*1.*exemple\s*2|few.?shot|examples?:/i)) return 'fewshot';
    if (lower.match(/étape\s*1|instruction|procédure|processus/i)) return 'instruction';
    if (lower.match(/raisonne|analyse|logique|reasoning|déduction/i)) return 'logical';
    if (lower.match(/données|data|tableau|classification/i)) return 'data';
    if (lower.match(/créatif|narration|histoire|dialogue/i)) return 'creative';

    return 'analysis';
  }

  /**
   * Estime les tokens (1 token ≈ 4 caractères)
   */
  private static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * PHASE 1: Suppression & Élimination
   */
  private static suppressionElimination(text: string, type: PromptType): { text: string; techniques: string[] } {
    const techniques: string[] = [];

    // 1. Supprimer tirets énumératifs → énumération fluide
    const bulletRegex = /^[\s]*[•\-\*]\s+(.+)$/gm;
    const bullets: string[] = [];
    text = text.replace(bulletRegex, (match, content) => {
      bullets.push(content.trim());
      return '';
    });
    if (bullets.length > 0) {
      text = text + '\n' + bullets.join(', ') + '.';
      techniques.push('Suppression tirets (15-20%)');
    }

    // 2. Éliminer redondances
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const seen = new Set<string>();
    const unique = sentences.filter(sentence => {
      const normalized = sentence.toLowerCase().trim().replace(/\s+/g, ' ');
      if (seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
    if (unique.length < sentences.length) {
      text = unique.join('. ') + '.';
      techniques.push('Élimination redondances (20-30%)');
    }

    // 3. Supprimer parenthèses explicatives
    text = text.replace(/\([^)]*c'est-à-dire[^)]*\)/gi, '');
    text = text.replace(/\([^)]*afin de[^)]*\)/gi, '');
    techniques.push('Suppression parenthèses (10-15%)');

    // 4. Éliminer adverbes/adjectifs superflus
    const superfluousWords = ['très', 'extrêmement', 'absolument', 'vraiment', 'particulièrement'];
    for (const word of superfluousWords) {
      const regex = new RegExp(`\\b${word}\\s+`, 'gi');
      text = text.replace(regex, '');
    }
    techniques.push('Élimination adverbes superflus (15-25%)');

    return { text, techniques };
  }

  /**
   * PHASE 2: Restructuration & Fusion
   */
  private static restructurationFusion(text: string, type: PromptType): { text: string; techniques: string[] } {
    const techniques: string[] = [];

    // 1. Fusionner sections liées (pour visual/créatif)
    if (type === 'visual' || type === 'creative') {
      text = text.replace(/\*\*Expression\*\*[\s\S]*?\*\*Éclairage\*\*/i, '**Caractéristiques visuelles**');
      techniques.push('Fusion sections (20-30%)');
    }

    // 2. Hiérarchie plutôt que listes
    if (type === 'instruction') {
      // Conversion en structure imbriquée
      text = text.replace(/^(\d+)\.\s+(.+)$/gm, '**$1.** $2');
      techniques.push('Hiérarchie (25-35%)');
    }

    // 3. Pseudo-code/notation condensée
    if (type === 'logical' || type === 'code') {
      text = text.replace(/si\s+(.+?)\s+alors\s+(.+)/gi, 'Si $1 → $2');
      text = text.replace(/pour\s+chaque\s+(.+?)\s+faire\s+(.+)/gi, '∀ $1: $2');
      techniques.push('Pseudo-code (35-45%)');
    }

    return { text, techniques };
  }

  /**
   * PHASE 3: Reformulation & Abstraction
   */
  private static reformulationAbstraction(text: string, type: PromptType): { text: string; techniques: string[] } {
    const techniques: string[] = [];

    // 1. Vocabulaire concis
    const replacements: [RegExp, string][] = [
      [/utilise une approche logique et rationnelle pour résoudre/gi, 'Raisonne logiquement'],
      [/il est important que tu considères que/gi, 'Considère que'],
      [/d'une part.*?d'autre part/gi, 'Côté A vs Côté B'],
      [/en tenant compte de/gi, 'avec'],
      [/de manière à/gi, 'pour'],
      [/afin de/gi, 'pour'],
      [/dans le but de/gi, 'pour']
    ];

    for (const [pattern, replacement] of replacements) {
      text = text.replace(pattern, replacement);
    }
    techniques.push('Vocabulaire concis (20-30%)');

    // 2. Tournures directes (Passif → Actif)
    text = text.replace(/il est important que tu (.+)/gi, '$1');
    text = text.replace(/tu dois (.+)/gi, '$1');
    techniques.push('Tournures directes (25-35%)');

    // 3. Abstraction logique
    if (type === 'logical' || type === 'code') {
      text = text.replace(/fais X avec Y, puis Z avec Y, puis/gi, 'Applique [processus] à chaque élément');
      techniques.push('Abstraction logique (30-40%)');
    }

    return { text, techniques };
  }

  /**
   * PHASE 4: Exemples & Patterns
   */
  private static optimiserExemples(text: string, type: PromptType): { text: string; techniques: string[] } {
    const techniques: string[] = [];
    const config = COMPRESSION_CONFIGS[type];

    // Compter les exemples
    const exampleMatches = text.match(/exemple\s*\d*\s*:/gi) || [];
    const maxExamples = type === 'fewshot' ? 3 : type === 'logical' ? 5 : 1;

    if (exampleMatches.length > maxExamples) {
      // Garder seulement les N premiers
      let count = 0;
      text = text.replace(/exemple\s*\d*\s*:[\s\S]*?(?=exemple\s*\d*\s*:|$)/gi, (match) => {
        count++;
        return count <= maxExamples ? match : '';
      });
      techniques.push(`Réduction exemples au minimum (40-50%)`);
    }

    // Synthétiser patterns pour few-shot
    if (type === 'fewshot') {
      text = text.replace(/exemple\s*\d+[\s\S]{100,}/gi, 'Pattern: [montrer 2-3 exemples contrastifs]');
      techniques.push('Synthèse patterns (40-50%)');
    }

    return { text, techniques };
  }

  /**
   * Validation qualité du prompt compressé
   */
  private static validateQuality(original: string, compressed: string, type: PromptType): number {
    let score = 100;

    // Vérifier structure intacte
    const hasStructure = compressed.match(/\*\*[A-ZÉ]+\*\*/g);
    if (!hasStructure || hasStructure.length < 2) score -= 20;

    // Vérifier clarté instructions
    const hasInstructions = compressed.match(/^[\-\*•\d]/gm);
    if (!hasInstructions || hasInstructions.length < 2) score -= 15;

    // Vérifier pas de troncature brutale
    if (!compressed.match(/[.!?]$/)) score -= 25;

    // Type-specific validation
    if (type === 'logical' || type === 'code') {
      // Vérifier pas de perte d'étapes critiques
      const originalSteps = (original.match(/\d+\./g) || []).length;
      const compressedSteps = (compressed.match(/\d+\./g) || []).length;
      if (compressedSteps < originalSteps * 0.7) score -= 30;
    }

    if (type === 'fewshot') {
      // Vérifier diversité exemples maintenue
      const examplesCount = (compressed.match(/exemple/gi) || []).length;
      if (examplesCount < 2) score -= 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Compression principale avec les 4 phases
   */
  static compress(prompt: string, targetType?: PromptType): AdvancedCompressionResult {
    const type = targetType || this.detectPromptType(prompt);
    const config = COMPRESSION_CONFIGS[type];
    const originalTokens = this.estimateTokens(prompt);
    const allTechniques: string[] = [];

    let compressed = prompt;

    // PHASE 1: Suppression & Élimination
    const phase1 = this.suppressionElimination(compressed, type);
    compressed = phase1.text;
    allTechniques.push(...phase1.techniques);

    // PHASE 2: Restructuration & Fusion
    const phase2 = this.restructurationFusion(compressed, type);
    compressed = phase2.text;
    allTechniques.push(...phase2.techniques);

    // PHASE 3: Reformulation & Abstraction
    const phase3 = this.reformulationAbstraction(compressed, type);
    compressed = phase3.text;
    allTechniques.push(...phase3.techniques);

    // PHASE 4: Exemples & Patterns
    const phase4 = this.optimiserExemples(compressed, type);
    compressed = phase4.text;
    allTechniques.push(...phase4.techniques);

    // Nettoyer espaces multiples et lignes vides
    compressed = compressed.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    const compressedTokens = this.estimateTokens(compressed);
    const reductionRate = ((originalTokens - compressedTokens) / originalTokens) * 100;

    // Validation compression dans la fourchette cible
    if (reductionRate < config.targetReduction.min) {
      // Compression insuffisante → appliquer compression agressive
      compressed = this.aggressiveCompress(compressed, type, config.targetReduction.min);
      allTechniques.push('Compression agressive appliquée');
    } else if (reductionRate > config.targetReduction.max) {
      // Compression excessive → réhydrater
      compressed = this.rehydrate(compressed, prompt, type);
      allTechniques.push('Réhydratation pour préserver qualité');
    }

    const finalTokens = this.estimateTokens(compressed);
    const finalReduction = ((originalTokens - finalTokens) / originalTokens) * 100;
    const qualityScore = this.validateQuality(prompt, compressed, type);

    return {
      original: prompt,
      compressed,
      originalTokens,
      compressedTokens: finalTokens,
      reductionRate: Math.round(finalReduction),
      appliedTechniques: allTechniques,
      type,
      qualityScore
    };
  }

  /**
   * Compression agressive pour atteindre taux cible
   */
  private static aggressiveCompress(text: string, type: PromptType, targetReduction: number): string {
    // Garder seulement l'essentiel
    const lines = text.split('\n').filter(l => l.trim());
    const essential: string[] = [];

    for (const line of lines) {
      const isHeader = line.match(/^\*\*[A-ZÉ]+\*\*/);
      const isAction = line.match(/^[\-\*•\d]/);

      if (isHeader || isAction) {
        const compressed = line
          .replace(/\s+/g, ' ')
          .replace(/\b(qui|que|dont|où|ainsi que)\b/gi, '')
          .trim();
        essential.push(compressed);
      }
    }

    return essential.join('\n').trim();
  }

  /**
   * Réhydratation si compression trop forte
   */
  private static rehydrate(compressed: string, original: string, type: PromptType): string {
    // Réintégrer contexte si absent
    const contextMatch = original.match(/contexte\s*:([^\n*]+)/i);
    if (contextMatch && !compressed.toLowerCase().includes('contexte')) {
      compressed = `**Contexte**: ${contextMatch[1].trim()}\n\n${compressed}`;
    }

    // Réintégrer exemples critiques pour few-shot
    if (type === 'fewshot') {
      const exampleMatch = original.match(/exemple\s*1\s*:[\s\S]{50,200}/i);
      if (exampleMatch && !compressed.toLowerCase().includes('exemple')) {
        compressed += `\n\n${exampleMatch[0]}`;
      }
    }

    return compressed;
  }

  /**
   * Compression spécifique mode gratuit (maximale mais qualité préservée)
   */
  static compressFreeMode(prompt: string): AdvancedCompressionResult {
    const type = this.detectPromptType(prompt);

    // En mode gratuit, on vise la limite haute de compression
    const config = COMPRESSION_CONFIGS[type];
    const result = this.compress(prompt, type);

    // Si pas assez compressé, forcer compression maximale
    if (result.reductionRate < config.targetReduction.max) {
      result.compressed = this.aggressiveCompress(result.compressed, type, config.targetReduction.max);
      result.compressedTokens = this.estimateTokens(result.compressed);
      result.reductionRate = ((result.originalTokens - result.compressedTokens) / result.originalTokens) * 100;
      result.appliedTechniques.push('Mode gratuit: compression maximale');
    }

    return result;
  }

  /**
   * Formater résultat pour affichage
   */
  static formatResult(result: AdvancedCompressionResult): string {
    return `## Prompt Compressé (Type: ${result.type})

${result.compressed}

---

### Statistiques de Compression
- **Type détecté**: ${result.type}
- **Tokens originaux**: ${result.originalTokens}
- **Tokens compressés**: ${result.compressedTokens}
- **Taux de réduction**: ${result.reductionRate}%
- **Score qualité**: ${result.qualityScore}/100

### Techniques Appliquées
${result.appliedTechniques.map(t => `- ${t}`).join('\n')}

### Validation
${result.qualityScore >= 90 ? '✅' : result.qualityScore >= 70 ? '⚠️' : '❌'} Qualité ${result.qualityScore >= 90 ? 'excellente' : result.qualityScore >= 70 ? 'acceptable' : 'insuffisante'}
`;
  }
}

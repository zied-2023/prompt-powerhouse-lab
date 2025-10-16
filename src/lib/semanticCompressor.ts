/**
 * Expert en compression sémantique de prompts IA
 * Réduit 40-60% sans altérer structure/précision/impact
 * Optimisé pour Mistral Large Latest
 */

export interface SemanticCompressionResult {
  original: string;
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
  reductionRate: number;
  validation: {
    structureIntact: boolean;
    precisionPreserved: boolean;
    readabilityMaintained: boolean;
  };
  techniques: string[];
}

export class SemanticCompressor {
  private static readonly TARGET_REDUCTION = { min: 40, max: 60 };

  /**
   * Estime tokens (1 token ≈ 4 chars)
   */
  private static countTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Compression sémantique principale
   */
  static compress(prompt: string): SemanticCompressionResult {
    const original = prompt;
    const originalTokens = this.countTokens(prompt);
    const techniques: string[] = [];

    // Extraction structure
    const structure = this.extractStructure(prompt);

    // 1. ÉLIMINATION
    prompt = this.removeRedundancies(prompt);
    techniques.push("Redondances éliminées");

    prompt = this.removeFluff(prompt);
    techniques.push("Formulations creuses supprimées");

    prompt = this.pruneExamples(prompt, structure);
    techniques.push("Exemples non critiques filtrés");

    // 2. CONSERVATION
    const constraints = this.extractConstraints(prompt);
    const successCriteria = this.extractSuccessCriteria(prompt);
    const imperatives = this.extractImperatives(prompt);

    // 3. OPTIMISATION
    prompt = this.optimizeSyntax(prompt);
    techniques.push("Syntaxe optimisée");

    prompt = this.optimizeSemantics(prompt);
    techniques.push("Sémantique affinée");

    // Reconstruction avec éléments essentiels
    prompt = this.reconstructPrompt(
      prompt,
      structure,
      constraints,
      successCriteria,
      imperatives
    );

    // Validation réduction 40-60%
    const compressedTokens = this.countTokens(prompt);
    const reductionRate = ((originalTokens - compressedTokens) / originalTokens) * 100;

    // Si réduction insuffisante, compression agressive
    if (reductionRate < this.TARGET_REDUCTION.min) {
      prompt = this.aggressiveCompress(prompt, originalTokens);
      techniques.push("Compression agressive appliquée");
    }

    // Si réduction excessive, réintroduction détails critiques
    if (reductionRate > this.TARGET_REDUCTION.max) {
      prompt = this.rehydrate(prompt, structure, constraints);
      techniques.push("Détails critiques réintégrés");
    }

    return {
      original,
      compressed: prompt.trim(),
      originalTokens,
      compressedTokens: this.countTokens(prompt),
      reductionRate: Math.round(reductionRate),
      validation: this.validate(prompt, structure, constraints),
      techniques
    };
  }

  /**
   * Extrait structure du prompt (rôle/contexte/objectif/instructions)
   */
  private static extractStructure(text: string): {
    role?: string;
    context?: string;
    objective?: string;
    instructions?: string;
  } {
    const structure: any = {};

    const roleMatch = text.match(/(?:\*\*)?(?:rôle|role)(?:\*\*)?[\s:]+([^\n*]+)/i);
    if (roleMatch) structure.role = roleMatch[1].trim();

    const contextMatch = text.match(/(?:\*\*)?(?:contexte|context)(?:\*\*)?[\s:]+([^\n*]+)/i);
    if (contextMatch) structure.context = contextMatch[1].trim();

    const objectiveMatch = text.match(/(?:\*\*)?(?:objectif|objective|mission)(?:\*\*)?[\s:]+([^\n*]+)/i);
    if (objectiveMatch) structure.objective = objectiveMatch[1].trim();

    const instructionsMatch = text.match(/(?:\*\*)?(?:instructions|étapes)(?:\*\*)?[\s:]*\n([\s\S]+?)(?=\*\*|##|$)/i);
    if (instructionsMatch) structure.instructions = instructionsMatch[1].trim();

    return structure;
  }

  /**
   * Supprime redondances
   */
  private static removeRedundancies(text: string): string {
    // Phrases répétées
    const sentences = text.split(/\.\s+/);
    const uniqueSentences = new Set<string>();
    const filtered = sentences.filter(s => {
      const normalized = s.toLowerCase().trim();
      if (uniqueSentences.has(normalized)) return false;
      uniqueSentences.add(normalized);
      return true;
    });

    return filtered.join('. ');
  }

  /**
   * Élimine formulations creuses
   */
  private static removeFluff(text: string): string {
    const fluff = [
      /il est important de\s+/gi,
      /veillez à\s+/gi,
      /assurez-vous de\s+/gi,
      /pensez à\s+/gi,
      /n'oubliez pas de\s+/gi,
      /il convient de\s+/gi,
      /vous devriez\s+/gi,
      /il serait souhaitable de\s+/gi,
      /\(note\s*:.*?\)/gi,
      /\(rappel\s*:.*?\)/gi,
    ];

    for (const pattern of fluff) {
      text = text.replace(pattern, '');
    }

    return text;
  }

  /**
   * Filtre exemples non critiques
   */
  private static pruneExamples(text: string, structure: any): string {
    // Garder max 1 exemple critique
    const exampleBlocks = text.match(/(?:exemple|example)[\s\S]*?(?=\n\n|$)/gi) || [];

    if (exampleBlocks.length > 1) {
      // Garder seulement le premier
      const firstExample = exampleBlocks[0];
      text = text.replace(/(?:exemple|example)[\s\S]*?(?=\n\n|$)/gi, '');

      // Réinsérer si critique (contient contraintes techniques)
      if (firstExample.match(/tokens?|modèle|latence|score|métrique/i)) {
        text += '\n' + firstExample;
      }
    }

    return text;
  }

  /**
   * Extrait contraintes techniques
   */
  private static extractConstraints(text: string): string[] {
    const constraints: string[] = [];

    // Tokens
    const tokensMatch = text.match(/(\d+)\s*tokens?/gi);
    if (tokensMatch) constraints.push(...tokensMatch);

    // Modèle
    const modelMatch = text.match(/modèle[\s:]+([^\n.]+)/i);
    if (modelMatch) constraints.push(modelMatch[0]);

    // Latence/temps
    const latencyMatch = text.match(/(?:latence|délai|temps)[\s:]+([^\n.]+)/i);
    if (latencyMatch) constraints.push(latencyMatch[0]);

    return constraints;
  }

  /**
   * Extrait critères de succès
   */
  private static extractSuccessCriteria(text: string): string[] {
    const criteria: string[] = [];

    // Scores
    const scoreMatches = text.match(/score[\s:]+([^\n.]+)/gi) || [];
    criteria.push(...scoreMatches);

    // Métriques
    const metricMatches = text.match(/métrique[s]?[\s:]+([^\n.]+)/gi) || [];
    criteria.push(...metricMatches);

    // Validation checkboxes
    const checkboxes = text.match(/\[\s*\]\s*([^\n]+)/g) || [];
    criteria.push(...checkboxes);

    return criteria;
  }

  /**
   * Extrait instructions impératives
   */
  private static extractImperatives(text: string): string[] {
    const imperatives: string[] = [];

    // Verbes d'action au début de ligne
    const actionLines = text.match(/^[\-\*•]\s*[A-ZÉÈÊ][^\n]+/gm) || [];
    imperatives.push(...actionLines);

    // Phrases avec verbes impératifs
    const imperativeVerbs = [
      'générer', 'créer', 'produire', 'éliminer', 'conserver',
      'optimiser', 'structurer', 'analyser', 'valider', 'exclure'
    ];

    const regex = new RegExp(`(${imperativeVerbs.join('|')})\\s+([^\\.]+)`, 'gi');
    const matches = text.match(regex) || [];
    imperatives.push(...matches);

    return imperatives;
  }

  /**
   * Optimise syntaxe (phrases courtes, verbes action, listes)
   */
  private static optimizeSyntax(text: string): string {
    // Phrases courtes (< 20 mots)
    text = text.replace(/([^.!?]+[.!?])/g, (sentence) => {
      const words = sentence.trim().split(/\s+/);
      if (words.length > 20) {
        // Diviser en sous-phrases
        const mid = Math.floor(words.length / 2);
        return words.slice(0, mid).join(' ') + '. ' + words.slice(mid).join(' ');
      }
      return sentence;
    });

    // Conversion en liste à puces si énumération
    text = text.replace(/(\d+\.\s+[^\n]+\n?)+/g, (match) => {
      return match.replace(/\d+\.\s+/g, '- ');
    });

    // Verbes d'action (forme active)
    const passiveToActive = [
      [/doit être ([a-zé]+é)/gi, (_, verb) => verb.replace(/é$/, 'er')],
      [/il faut ([a-zé]+er)/gi, (_, verb) => verb],
      [/sont à ([a-zé]+er)/gi, (_, verb) => verb],
    ];

    for (const [pattern, replacement] of passiveToActive) {
      text = text.replace(pattern, replacement as any);
    }

    return text;
  }

  /**
   * Optimise sémantique (mots-clés précis > termes génériques)
   */
  private static optimizeSemantics(text: string): string {
    const genericToSpecific: [RegExp, string][] = [
      [/de manière efficace/gi, 'efficacement'],
      [/de façon optimale/gi, 'optimalement'],
      [/qui sont/gi, ''],
      [/en ce qui concerne/gi, 'pour'],
      [/au niveau de/gi, 'dans'],
      [/par rapport à/gi, 'vs'],
      [/dans le cadre de/gi, 'pour'],
      [/en fonction de/gi, 'selon'],
      [/permettant de/gi, 'pour'],
      [/ayant pour but de/gi, 'pour'],
    ];

    for (const [generic, specific] of genericToSpecific) {
      text = text.replace(generic, specific);
    }

    return text;
  }

  /**
   * Reconstruit prompt avec structure optimale
   */
  private static reconstructPrompt(
    baseText: string,
    structure: any,
    constraints: string[],
    criteria: string[],
    imperatives: string[]
  ): string {
    const sections: string[] = [];

    // Rôle (1 ligne)
    if (structure.role) {
      sections.push(`**Rôle**: ${structure.role}`);
    }

    // Contexte (max 2 lignes)
    if (structure.context) {
      const contextLines = structure.context.split(/[.!?]+/).slice(0, 2);
      sections.push(`**Contexte**: ${contextLines.join('. ')}`);
    }

    // Objectif (1-3 points)
    if (structure.objective) {
      sections.push(`**Objectif**:\n${structure.objective}`);
    }

    // Instructions (liste à puces)
    if (imperatives.length > 0) {
      const topImperatives = imperatives.slice(0, 5);
      sections.push(`**Instructions**:\n${topImperatives.join('\n')}`);
    }

    // Contraintes techniques (toutes)
    if (constraints.length > 0) {
      sections.push(`**Contraintes**: ${constraints.join(' | ')}`);
    }

    // Critères succès (top 3)
    if (criteria.length > 0) {
      const topCriteria = criteria.slice(0, 3);
      sections.push(`**Succès**: ${topCriteria.join('; ')}`);
    }

    return sections.join('\n\n');
  }

  /**
   * Compression agressive si réduction < 40%
   */
  private static aggressiveCompress(text: string, originalTokens: number): string {
    const targetTokens = Math.floor(originalTokens * 0.5); // 50% de réduction
    const targetLength = targetTokens * 4;

    // Garder seulement sections essentielles
    const essential = text
      .split('\n')
      .filter(line => {
        // Garder en-têtes et points d'action
        return line.match(/^\*\*|^[\-\*•]\s*\w+/);
      })
      .join('\n');

    return essential.slice(0, targetLength);
  }

  /**
   * Réhydratation si réduction > 60%
   */
  private static rehydrate(
    text: string,
    structure: any,
    constraints: string[]
  ): string {
    // Réintroduire détails critiques supprimés
    if (structure.context && !text.includes(structure.context)) {
      text = `**Contexte**: ${structure.context}\n\n${text}`;
    }

    // Vérifier contraintes présentes
    for (const constraint of constraints) {
      if (!text.includes(constraint)) {
        text += `\n- ${constraint}`;
      }
    }

    return text;
  }

  /**
   * Validation finale
   */
  private static validate(
    compressed: string,
    structure: any,
    constraints: string[]
  ): {
    structureIntact: boolean;
    precisionPreserved: boolean;
    readabilityMaintained: boolean;
  } {
    // Structure intacte (présence sections clés)
    const hasRole = structure.role ? compressed.includes('Rôle') : true;
    const hasObjective = structure.objective ? compressed.includes('Objectif') : true;
    const structureIntact = hasRole && hasObjective;

    // Précision préservée (contraintes présentes)
    const precisionPreserved = constraints.every(c =>
      compressed.toLowerCase().includes(c.toLowerCase().slice(0, 10))
    );

    // Lisibilité (pas de jargon excessif, logique claire)
    const hasStructuredSections = compressed.match(/\*\*/g)?.length >= 2;
    const hasActionableItems = compressed.match(/^[\-\*•]/gm)?.length >= 2;
    const readabilityMaintained = hasStructuredSections && hasActionableItems;

    return {
      structureIntact,
      precisionPreserved,
      readabilityMaintained
    };
  }

  /**
   * Formatage Markdown final
   */
  static formatMarkdown(result: SemanticCompressionResult): string {
    return `## Prompt Compressé (${result.reductionRate}% réduction)

${result.compressed}

---

### Statistiques
- **Tokens originaux**: ${result.originalTokens}
- **Tokens compressés**: ${result.compressedTokens}
- **Réduction**: ${result.reductionRate}%
- **Techniques**: ${result.techniques.join(', ')}

### Validation
- [${result.validation.structureIntact ? 'x' : ' '}] Structure intacte
- [${result.validation.precisionPreserved ? 'x' : ' '}] Précision préservée
- [${result.validation.readabilityMaintained ? 'x' : ' '}] Lisibilité maintenue`;
  }
}

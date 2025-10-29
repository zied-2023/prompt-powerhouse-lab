/**
 * Compresseur Intelligent de Prompts
 * Basé sur l'algorithme de compression sémantique avec métadonnées standardisées
 * Objectif: Réduction de 40±10% des tokens tout en préservant l'intention
 */

export interface IntelligentCompressionResult {
  compressed: string;
  originalTokens: number;
  compressedTokens: number;
  reductionRate: number;
  metadata: string[];
  preservedElements: string[];
}

type MetadataLang = 'Python' | 'Bash' | 'SQL' | 'JavaScript' | 'Rust' | 'Java' | 'TypeScript' | 'Go';
type MetadataStyle = 'Robust' | 'Modular' | 'Commented' | 'Concise' | 'Pro' | 'Clean';
type MetadataFormat = 'JSON' | 'Markdown' | 'XML' | 'CSV' | 'YAML' | 'HTML';
type MetadataFeature = 'ErrorHandling' | 'Logs' | 'Tests' | 'Docs' | 'Validation';

export class IntelligentCompressor {
  /**
   * Estimation tokens (1 token ≈ 4 chars pour modèles GPT)
   */
  private static estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Extrait les métadonnées du prompt pour standardisation
   */
  private static extractMetadata(prompt: string): {
    lang?: MetadataLang;
    styles: MetadataStyle[];
    format?: MetadataFormat;
    features: MetadataFeature[];
  } {
    const lower = prompt.toLowerCase();
    const metadata: {
      lang?: MetadataLang;
      styles: MetadataStyle[];
      format?: MetadataFormat;
      features: MetadataFeature[];
    } = {
      styles: [],
      features: []
    };

    // Détection du langage
    const langPatterns: [RegExp, MetadataLang][] = [
      [/\b(python|py)\b/i, 'Python'],
      [/\b(bash|shell|sh)\b/i, 'Bash'],
      [/\b(sql|mysql|postgres)\b/i, 'SQL'],
      [/\b(javascript|js|node)\b/i, 'JavaScript'],
      [/\b(typescript|ts)\b/i, 'TypeScript'],
      [/\b(rust|rs)\b/i, 'Rust'],
      [/\b(java)\b/i, 'Java'],
      [/\b(golang|go)\b/i, 'Go']
    ];

    for (const [pattern, lang] of langPatterns) {
      if (pattern.test(lower)) {
        metadata.lang = lang;
        break;
      }
    }

    // Détection des styles
    if (/\b(robust|robuste|solide|fiable)\b/i.test(lower)) {
      metadata.styles.push('Robust');
    }
    if (/\b(modulaire?|modular|module|function)\b/i.test(lower)) {
      metadata.styles.push('Modular');
    }
    if (/\b(commenté|comment|documented)\b/i.test(lower)) {
      metadata.styles.push('Commented');
    }
    if (/\b(concis|compact|minimal|simple)\b/i.test(lower)) {
      metadata.styles.push('Concise');
    }
    if (/\b(professionnel|pro|enterprise|production)\b/i.test(lower)) {
      metadata.styles.push('Pro');
    }
    if (/\b(clean|propre|readable|lisible)\b/i.test(lower)) {
      metadata.styles.push('Clean');
    }

    // Détection du format
    const formatPatterns: [RegExp, MetadataFormat][] = [
      [/\b(json)\b/i, 'JSON'],
      [/\b(markdown|md)\b/i, 'Markdown'],
      [/\b(xml)\b/i, 'XML'],
      [/\b(csv)\b/i, 'CSV'],
      [/\b(yaml|yml)\b/i, 'YAML'],
      [/\b(html)\b/i, 'HTML']
    ];

    for (const [pattern, format] of formatPatterns) {
      if (pattern.test(lower)) {
        metadata.format = format;
        break;
      }
    }

    // Détection des features
    if (/\b(error|erreur|exception|gestion.{0,20}erreur)\b/i.test(lower)) {
      metadata.features.push('ErrorHandling');
    }
    if (/\b(log|logging|trace|journal)\b/i.test(lower)) {
      metadata.features.push('Logs');
    }
    if (/\b(test|testing|unit|integration)\b/i.test(lower)) {
      metadata.features.push('Tests');
    }
    if (/\b(doc|documentation|readme|guide)\b/i.test(lower)) {
      metadata.features.push('Docs');
    }
    if (/\b(valid|validation|check|verify)\b/i.test(lower)) {
      metadata.features.push('Validation');
    }

    return metadata;
  }

  /**
   * Fusionne les redondances en utilisant les métadonnées
   */
  private static fuseRedundancies(prompt: string): string {
    // Supprimer les adverbes de modalité (softeners)
    const softeners = [
      /\b(si possible|idéalement|de préférence|si tu peux|si vous pouvez)\b/gi,
      /\b(peut-être|probablement|éventuellement)\b/gi,
      /\b(s'il te plaît|s'il vous plaît|please)\b/gi
    ];

    for (const pattern of softeners) {
      prompt = prompt.replace(pattern, '');
    }

    // Fusionner les listes d'adjectifs similaires
    // "professionnel et technique" → "Pro+Tech"
    prompt = prompt.replace(/\b(professionnel|pro)\s+et\s+(technique|tech)\b/gi, 'Pro+Tech');
    prompt = prompt.replace(/\b(robuste|solid)\s+et\s+(modulaire|modular)\b/gi, 'Robust+Modular');
    prompt = prompt.replace(/\b(clair|clean)\s+et\s+(lisible|readable)\b/gi, 'Clean');

    // Réduire les répétitions de verbes d'action
    prompt = prompt.replace(/\b(créer|créez|génère|générer)\b/gi, 'Génère');
    prompt = prompt.replace(/\b(analyser|analyse|évalue|évaluer)\b/gi, 'Analyse');
    prompt = prompt.replace(/\b(construire|construis|développer|développe)\b/gi, 'Développe');

    return prompt.trim();
  }

  /**
   * Construit le prompt compressé avec métadonnées
   */
  private static buildCompressedPrompt(
    corePrompt: string,
    metadata: {
      lang?: MetadataLang;
      styles: MetadataStyle[];
      format?: MetadataFormat;
      features: MetadataFeature[];
    }
  ): string {
    const tags: string[] = [];

    // Ajouter les tags de métadonnées
    if (metadata.lang) {
      tags.push(`[LANG:${metadata.lang}]`);
    }
    if (metadata.styles.length > 0) {
      tags.push(`[STYLE:${metadata.styles.slice(0, 3).join('+')}]`);
    }
    if (metadata.format) {
      tags.push(`[FORMAT:${metadata.format}]`);
    }
    if (metadata.features.length > 0) {
      tags.push(`[FEAT:${metadata.features.slice(0, 3).join('+')}]`);
    }

    // Assembler le prompt final
    const metadataPrefix = tags.length > 0 ? tags.join('') + ' ' : '';
    return metadataPrefix + corePrompt;
  }

  /**
   * Extrait le coeur du prompt (l'action principale)
   */
  private static extractCore(prompt: string): string {
    // Supprimer les introductions verboses
    let core = prompt
      .replace(/^(bonjour|salut|hello|hi)[,\s]*/gi, '')
      .replace(/^(je voudrais|je veux|j'aimerais|peux-tu|pourrais-tu)[,\s]*/gi, '')
      .replace(/^(veuillez|merci de)[,\s]*/gi, '');

    // Identifier le verbe d'action principal
    const actionVerbs = /\b(génère|crée|développe|analyse|écris|traduis|optimise|construis|implémente|conçois)/i;
    const match = core.match(actionVerbs);

    if (match) {
      // Extraire à partir du verbe d'action
      const index = core.indexOf(match[0]);
      core = core.substring(index);
    }

    // Supprimer les explications du "pourquoi"
    core = core.replace(/\b(car|parce que|afin de|dans le but de|en effet).{20,}?\./gi, '.');
    core = core.replace(/\(ceci permet[^)]+\)/gi, '');
    core = core.replace(/\(afin de[^)]+\)/gi, '');

    // Supprimer les sections de méthodologie séparées
    core = core.replace(/\*\*méthodologie\*\*[\s\S]*?(?=\*\*|$)/gi, '');
    core = core.replace(/\*\*approche\*\*[\s\S]*?(?=\*\*|$)/gi, '');

    // Simplifier les formulations
    const simplifications: [RegExp, string][] = [
      [/en tenant compte de/gi, 'avec'],
      [/de manière à/gi, 'pour'],
      [/afin de/gi, 'pour'],
      [/ainsi que/gi, '+'],
      [/c'est-à-dire/gi, ':'],
      [/par exemple/gi, 'ex:'],
      [/il est important de/gi, ''],
      [/assurez-vous de/gi, ''],
      [/vous devez/gi, ''],
    ];

    for (const [pattern, replacement] of simplifications) {
      core = core.replace(pattern, replacement);
    }

    // Nettoyer les espaces multiples
    core = core.replace(/\s{2,}/g, ' ').trim();

    return core;
  }

  /**
   * Préserve les contraintes numériques et verbes principaux
   */
  private static preserveConstraints(prompt: string): {
    constraints: string[];
    cleanedPrompt: string;
  } {
    const constraints: string[] = [];
    let cleanedPrompt = prompt;

    // Extraire et préserver les nombres (max, min, limites)
    const numberPatterns = [
      /\b(max|maximum|min|minimum|limite de?)\s*:?\s*(\d+)\s*(mots|tokens|lignes|caractères|chars)?\b/gi,
      /\b(\d+)\s*(mots|tokens|lignes|caractères|chars)\s*(max|maximum|min|minimum)?\b/gi
    ];

    for (const pattern of numberPatterns) {
      const matches = prompt.match(pattern);
      if (matches) {
        constraints.push(...matches);
      }
    }

    // Extraire les formats spécifiques qui doivent être préservés
    const formatPatterns = [
      /\b(format|structure)\s*:?\s*[^\.\n]{5,50}/gi,
      /\b(sortie|output|résultat)\s+en\s+[A-Z]+/gi
    ];

    for (const pattern of formatPatterns) {
      const matches = prompt.match(pattern);
      if (matches) {
        constraints.push(...matches);
      }
    }

    return { constraints, cleanedPrompt };
  }

  /**
   * Compression principale intelligente
   */
  static compress(prompt: string): IntelligentCompressionResult {
    const originalTokens = this.estimateTokens(prompt);

    // 1. ANALYSE: Extraire métadonnées
    const metadata = this.extractMetadata(prompt);

    // 2. PRÉSERVATION: Identifier contraintes critiques
    const { constraints } = this.preserveConstraints(prompt);

    // 3. FUSION: Éliminer redondances
    let compressed = this.fuseRedundancies(prompt);

    // 4. EXTRACTION: Obtenir le coeur du prompt
    compressed = this.extractCore(compressed);

    // 5. CONSTRUCTION: Assembler avec métadonnées
    compressed = this.buildCompressedPrompt(compressed, metadata);

    // 6. RÉINTÉGRATION: Ajouter contraintes critiques à la fin
    if (constraints.length > 0) {
      // Limiter à 2 contraintes les plus importantes
      const topConstraints = constraints.slice(0, 2).join('. ');
      compressed += ' ' + topConstraints + '.';
    }

    const compressedTokens = this.estimateTokens(compressed);
    const reductionRate = Math.round(((originalTokens - compressedTokens) / originalTokens) * 100);

    // Construire la liste des métadonnées utilisées
    const metadataList: string[] = [];
    if (metadata.lang) metadataList.push(`LANG:${metadata.lang}`);
    if (metadata.styles.length > 0) metadataList.push(`STYLE:${metadata.styles.join('+')}`);
    if (metadata.format) metadataList.push(`FORMAT:${metadata.format}`);
    if (metadata.features.length > 0) metadataList.push(`FEAT:${metadata.features.join('+')}`);

    return {
      compressed: compressed.trim(),
      originalTokens,
      compressedTokens,
      reductionRate,
      metadata: metadataList,
      preservedElements: constraints
    };
  }

  /**
   * Compression adaptative selon la longueur cible
   */
  static compressToTarget(prompt: string, targetTokens: number): IntelligentCompressionResult {
    let result = this.compress(prompt);

    // Si on est encore au-dessus de la cible, compression agressive
    if (result.compressedTokens > targetTokens) {
      // Compression additionnelle: garder seulement verbe d'action + métadonnées + contraintes
      const actionMatch = result.compressed.match(/\b(génère|crée|développe|analyse|écris|traduis|optimise).{10,80}/i);

      if (actionMatch) {
        const core = actionMatch[0];
        const metadata = result.compressed.match(/\[.*?\]/g)?.join('') || '';
        const constraint = result.preservedElements[0] || '';

        result.compressed = `${metadata} ${core}. ${constraint}`.trim();
        result.compressedTokens = this.estimateTokens(result.compressed);
        result.reductionRate = Math.round(((result.originalTokens - result.compressedTokens) / result.originalTokens) * 100);
      }
    }

    return result;
  }

  /**
   * Validation de la compression (pour monitoring)
   */
  static validateCompression(result: IntelligentCompressionResult): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

    // Vérifier que la réduction est dans la plage attendue (30-50%)
    if (result.reductionRate < 30) {
      issues.push(`Réduction insuffisante: ${result.reductionRate}% < 30%`);
    }
    if (result.reductionRate > 60) {
      issues.push(`Réduction excessive: ${result.reductionRate}% > 60% - Risque de perte sémantique`);
    }

    // Vérifier que le prompt compressé a un sens minimal
    if (result.compressedTokens < 10) {
      issues.push('Prompt trop court: risque de manque de contexte');
    }

    // Vérifier la présence d'un verbe d'action
    const hasActionVerb = /\b(génère|crée|développe|analyse|écris|traduis|optimise|construis|implémente)/i.test(result.compressed);
    if (!hasActionVerb) {
      issues.push('Aucun verbe d\'action identifié dans le prompt compressé');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

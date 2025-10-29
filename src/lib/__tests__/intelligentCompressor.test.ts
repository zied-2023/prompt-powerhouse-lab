import { IntelligentCompressor } from '../intelligentCompressor';

describe('IntelligentCompressor', () => {
  describe('compress', () => {
    it('should compress a Bash script prompt with metadata extraction', () => {
      const prompt = `Génère un script Bash robuste et commenté pour automatiser des sauvegardes
      en respectant les bonnes pratiques (logs, erreurs gérées). Le code doit être lisible
      et utiliser des fonctions modulaires.`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed).toContain('[LANG:Bash]');
      expect(result.compressed).toContain('[STYLE:');
      expect(result.compressed).toContain('[FEAT:');
      expect(result.reductionRate).toBeGreaterThan(30);
      expect(result.reductionRate).toBeLessThan(60);
      expect(result.metadata.length).toBeGreaterThan(0);
    });

    it('should compress a JavaScript API prompt', () => {
      const prompt = `Crée une API REST en JavaScript avec Node.js qui soit professionnelle,
      robuste et bien documentée. Elle doit inclure la validation des données,
      la gestion des erreurs et des tests unitaires.`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed).toContain('[LANG:JavaScript]');
      expect(result.compressed).toContain('Validation');
      expect(result.compressed).toContain('ErrorHandling');
      expect(result.reductionRate).toBeGreaterThan(30);
    });

    it('should preserve numeric constraints', () => {
      const prompt = `Génère un résumé de maximum 200 mots en format JSON
      avec au minimum 5 points clés.`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.preservedElements.length).toBeGreaterThan(0);
      expect(result.compressed).toContain('200');
    });

    it('should extract and use format metadata', () => {
      const prompt = `Analyse les données et génère un rapport en format JSON
      avec les métriques principales.`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed).toContain('[FORMAT:JSON]');
      expect(result.metadata).toContain('FORMAT:JSON');
    });

    it('should remove softeners and redundancies', () => {
      const prompt = `Si possible, pourriez-vous créer un script qui soit
      idéalement robuste et si possible modulaire, s'il vous plaît ?`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed).not.toContain('si possible');
      expect(result.compressed).not.toContain('pourriez-vous');
      expect(result.compressed).not.toContain('idéalement');
      expect(result.compressed).not.toContain('s\'il vous plaît');
    });

    it('should detect multiple styles', () => {
      const prompt = `Crée un code Python robuste, modulaire, commenté et professionnel
      avec gestion des logs et des erreurs.`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed).toContain('[LANG:Python]');
      expect(result.compressed).toContain('[STYLE:');
      expect(result.metadata.some(m => m.includes('STYLE'))).toBe(true);
    });
  });

  describe('compressToTarget', () => {
    it('should compress to target token count', () => {
      const prompt = `Génère un script Bash robuste et commenté pour automatiser des
      sauvegardes en respectant les bonnes pratiques (logs, erreurs gérées).
      Le code doit être lisible et utiliser des fonctions modulaires avec des
      exemples concrets et des tests unitaires complets.`;

      const targetTokens = 50;
      const result = IntelligentCompressor.compressToTarget(prompt, targetTokens);

      expect(result.compressedTokens).toBeLessThanOrEqual(targetTokens);
      expect(result.reductionRate).toBeGreaterThan(30);
    });

    it('should apply aggressive compression when needed', () => {
      const longPrompt = `Crée une application web complète et professionnelle
      avec React et TypeScript qui soit modulaire, testable, documentée, robuste,
      avec gestion des erreurs, logging, validation, authentification, et qui
      utilise les meilleures pratiques de développement moderne. L'application
      doit inclure des tests unitaires, des tests d'intégration, de la documentation
      technique complète et un README détaillé.`;

      const targetTokens = 40;
      const result = IntelligentCompressor.compressToTarget(longPrompt, targetTokens);

      expect(result.compressedTokens).toBeLessThanOrEqual(targetTokens + 10);
      expect(result.compressed.length).toBeLessThan(longPrompt.length / 2);
    });
  });

  describe('validateCompression', () => {
    it('should validate a good compression', () => {
      const result = {
        compressed: '[LANG:Python][STYLE:Pro] Génère script automatisation tests.',
        originalTokens: 100,
        compressedTokens: 60,
        reductionRate: 40,
        metadata: ['LANG:Python', 'STYLE:Pro'],
        preservedElements: []
      };

      const validation = IntelligentCompressor.validateCompression(result);

      expect(validation.isValid).toBe(true);
      expect(validation.issues.length).toBe(0);
    });

    it('should detect insufficient reduction', () => {
      const result = {
        compressed: 'Génère un script',
        originalTokens: 100,
        compressedTokens: 80,
        reductionRate: 20,
        metadata: [],
        preservedElements: []
      };

      const validation = IntelligentCompressor.validateCompression(result);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('Réduction insuffisante'))).toBe(true);
    });

    it('should detect excessive reduction', () => {
      const result = {
        compressed: 'Script',
        originalTokens: 100,
        compressedTokens: 35,
        reductionRate: 65,
        metadata: [],
        preservedElements: []
      };

      const validation = IntelligentCompressor.validateCompression(result);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('Réduction excessive'))).toBe(true);
    });

    it('should detect missing action verb', () => {
      const result = {
        compressed: '[LANG:Python] Un script bien fait',
        originalTokens: 100,
        compressedTokens: 60,
        reductionRate: 40,
        metadata: ['LANG:Python'],
        preservedElements: []
      };

      const validation = IntelligentCompressor.validateCompression(result);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('verbe d\'action'))).toBe(true);
    });

    it('should detect too short prompts', () => {
      const result = {
        compressed: 'Code',
        originalTokens: 100,
        compressedTokens: 5,
        reductionRate: 95,
        metadata: [],
        preservedElements: []
      };

      const validation = IntelligentCompressor.validateCompression(result);

      expect(validation.isValid).toBe(false);
      expect(validation.issues.some(i => i.includes('trop court'))).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle prompts without detectable metadata', () => {
      const prompt = 'Fais quelque chose d\'intéressant.';

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed.length).toBeGreaterThan(0);
      expect(result.reductionRate).toBeGreaterThanOrEqual(0);
    });

    it('should handle very short prompts', () => {
      const prompt = 'Génère code.';

      const result = IntelligentCompressor.compress(prompt);

      expect(result.compressed.length).toBeGreaterThan(0);
    });

    it('should preserve multiple numeric constraints', () => {
      const prompt = `Crée un résumé de 200 mots maximum avec au minimum 5 points
      et exactement 3 sections.`;

      const result = IntelligentCompressor.compress(prompt);

      expect(result.preservedElements.length).toBeGreaterThan(0);
    });

    it('should handle prompts with multiple languages mentioned', () => {
      const prompt = `Crée un script qui utilise Python pour le backend et
      JavaScript pour le frontend.`;

      const result = IntelligentCompressor.compress(prompt);

      // Should pick the first language detected
      expect(result.compressed).toContain('[LANG:');
    });
  });
});

/**
 * Tests unitaires pour le compresseur avancé de prompts
 */

import { AdvancedPromptCompressor } from '../advancedPromptCompressor';

describe('AdvancedPromptCompressor', () => {
  describe('detectPromptType', () => {
    it('détecte prompt visuel', () => {
      const prompt = 'Génère une image ultra-réaliste d\'un lion avec style artistique';
      const type = AdvancedPromptCompressor.detectPromptType(prompt);
      expect(type).toBe('visual');
    });

    it('détecte prompt code', () => {
      const prompt = 'Écris une fonction Python qui calcule la somme';
      const type = AdvancedPromptCompressor.detectPromptType(prompt);
      expect(type).toBe('code');
    });

    it('détecte prompt few-shot', () => {
      const prompt = 'Exemple 1: ... Exemple 2: ... Few-shot learning';
      const type = AdvancedPromptCompressor.detectPromptType(prompt);
      expect(type).toBe('fewshot');
    });

    it('détecte prompt instruction', () => {
      const prompt = 'Étape 1: Faire ceci. Étape 2: Faire cela. Procédure complète';
      const type = AdvancedPromptCompressor.detectPromptType(prompt);
      expect(type).toBe('instruction');
    });
  });

  describe('compress', () => {
    it('réduit la taille du prompt', () => {
      const prompt = `
        • Point 1
        • Point 2
        • Point 3
        Il est important que tu considères que le résultat soit absolument très précis.
        Il est important que tu considères que le résultat soit précis.
      `;
      const result = AdvancedPromptCompressor.compress(prompt);

      expect(result.compressedTokens).toBeLessThan(result.originalTokens);
      expect(result.reductionRate).toBeGreaterThan(0);
    });

    it('préserve la qualité avec score >= 70', () => {
      const prompt = `
        **RÔLE**: Expert en IA
        **OBJECTIF**: Créer un système performant
        **INSTRUCTIONS**:
        - Analyser les données
        - Optimiser le modèle
        - Valider les résultats
      `;
      const result = AdvancedPromptCompressor.compress(prompt);

      expect(result.qualityScore).toBeGreaterThanOrEqual(70);
    });

    it('applique les techniques appropriées selon le type', () => {
      const visualPrompt = 'Génère une image d\'un paysage avec style artistique';
      const result = AdvancedPromptCompressor.compress(visualPrompt);

      expect(result.type).toBe('visual');
      expect(result.appliedTechniques.length).toBeGreaterThan(0);
    });

    it('respecte les taux de compression cibles', () => {
      const prompt = `
        Voici un prompt très long avec beaucoup de détails inutiles.
        • Première chose
        • Deuxième chose
        • Troisième chose
        • Quatrième chose
        • Cinquième chose
        Il est absolument très important de faire ceci.
        Il faut vraiment que tu sois extrêmement précis.
      `;
      const result = AdvancedPromptCompressor.compressFreeMode(prompt);

      // En mode gratuit, réduction doit être substantielle
      expect(result.reductionRate).toBeGreaterThanOrEqual(30);
    });
  });

  describe('compressFreeMode', () => {
    it('applique compression maximale', () => {
      const prompt = 'Prompt avec beaucoup de contenu répété. Contenu répété. Encore répété.';
      const result = AdvancedPromptCompressor.compressFreeMode(prompt);

      expect(result.reductionRate).toBeGreaterThan(0);
      expect(result.compressed.length).toBeLessThan(prompt.length);
    });
  });

  describe('validateQuality', () => {
    it('donne score élevé pour prompt bien structuré', () => {
      const prompt = `
        **RÔLE**: Expert
        **OBJECTIF**: Objectif clair
        **INSTRUCTIONS**:
        - Action 1
        - Action 2
      `;
      const result = AdvancedPromptCompressor.compress(prompt);

      expect(result.qualityScore).toBeGreaterThanOrEqual(80);
    });
  });

  describe('exemples réels', () => {
    it('compresse prompt visuel comme dans le guide', () => {
      const prompt = `
        Génère une image ultra-réaliste et détaillée d'un lion adulte en haute résolution (8K).
        • Pose : Vue en trois-quarts avant
        • Corps légèrement tourné vers la gauche
        • Regard intense et majestueux
        • Éclairage golden hour avec ombres douces
        • Style animalier réaliste type National Geographic
      `;
      const result = AdvancedPromptCompressor.compress(prompt, 'visual');

      expect(result.type).toBe('visual');
      expect(result.reductionRate).toBeGreaterThanOrEqual(40);
      expect(result.qualityScore).toBeGreaterThanOrEqual(70);
    });

    it('compresse prompt logique avec prudence', () => {
      const prompt = `
        Résous ce problème étape par étape.
        D'abord, tu dois identifier les variables clés.
        Ensuite, tu dois formuler une hypothèse.
        Après cela, tu dois tester l'hypothèse.
        Finalement, analyse les résultats.
      `;
      const result = AdvancedPromptCompressor.compress(prompt, 'logical');

      expect(result.type).toBe('logical');
      expect(result.reductionRate).toBeLessThanOrEqual(25); // Pas trop de compression
      expect(result.qualityScore).toBeGreaterThanOrEqual(80);
    });
  });
});

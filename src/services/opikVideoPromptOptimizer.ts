import { opikOptimizer } from './opikOptimizer';
import { Wan2VideoConfig } from '@/types/wan2Motion';

export interface VideoPromptOptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  score: number;
  optimizationTime: number;
}

class OpikVideoPromptOptimizer {
  /**
   * Optimise un prompt vidéo généré avec Opik
   */
  async optimizeGeneratedVideoPrompt(
    config: Wan2VideoConfig,
    userId: string
  ): Promise<VideoPromptOptimizationResult> {
    const startTime = Date.now();

    try {
      console.log('🎬 Opik Video Prompt Post-Generation Optimization');
      
      const plainPrompt = this.generatePlainPrompt(config);
      console.log('📝 Generated Prompt:', plainPrompt);

      // Utiliser opikOptimizer pour optimiser le prompt en mode premium
      const optimizationResult = await opikOptimizer.optimizePromptPremium(
        plainPrompt,
        userId,
        'wan2-video',
        'medium'
      );

      // Enrichir avec des améliorations spécifiques aux prompts vidéo
      const videoSpecificImprovements = this.identifyVideoSpecificImprovements(
        plainPrompt,
        optimizationResult.optimizedPrompt,
        config
      );

      const allImprovements = [
        ...optimizationResult.improvements,
        ...videoSpecificImprovements
      ];

      const optimizationTime = Date.now() - startTime;

      console.log('✅ Video Prompt Optimization Complete:', {
        score: optimizationResult.score,
        improvements: allImprovements.length,
        time: `${optimizationTime}ms`
      });

      return {
        originalPrompt: plainPrompt,
        optimizedPrompt: optimizationResult.optimizedPrompt,
        improvements: allImprovements,
        score: optimizationResult.score,
        optimizationTime
      };
    } catch (error) {
      console.error('❌ Video Prompt Optimization Error:', error);
      
      const plainPrompt = this.generatePlainPrompt(config);
      return {
        originalPrompt: plainPrompt,
        optimizedPrompt: plainPrompt,
        improvements: ['Optimization unavailable - original prompt returned'],
        score: 7.5,
        optimizationTime: Date.now() - startTime
      };
    }
  }

  private generatePlainPrompt(config: Wan2VideoConfig): string {
    const parts = [];

    if (config.sceneDescription && config.sceneDescription.trim()) {
      parts.push(`SCENE CONTEXT:\n${config.sceneDescription}\n`);
    }

    parts.push(`Character: ${config.character || 'unspecified'}`);
    parts.push(`Item: ${config.item || 'none'}`);
    parts.push(`Expression: ${config.sign || 'neutral'}`);
    parts.push(`Place: ${config.place || 'generic location'}`);
    parts.push(`Time: ${config.time || 'day'} (${config.kelvin}K)`);

    if (config.motion.length > 0) {
      parts.push('\nMotion Timeline:');
      config.motion.forEach((kf) => {
        parts.push(
          `  ${kf.pct}% (${kf.duration}s): ${kf.action} | Camera: ${kf.camera}${
            kf.fx && kf.fx !== 'none' ? ` | FX: ${kf.fx}` : ''
          }`
        );
      });
    }

    parts.push(
      `\nCamera: ${config.cameraPreset} (shake: ${config.shakeIntensity}%, ${config.shakeFreq}Hz)`
    );
    parts.push(
      `Atmosphere: dust ${config.dust}%, haze ${config.haze}%${
        config.lensRain ? ', lens rain' : ''
      }${config.neonFlicker ? ', neon flicker' : ''}`
    );

    if (config.negative) {
      parts.push(`\nNegative: ${config.negative}`);
    }

    parts.push(`\nSeeds: ${config.seed}-${config.seedEnd} (variation: ${config.varyStrength})`);

    return parts.join('\n');
  }

  private identifyVideoSpecificImprovements(
    original: string,
    optimized: string,
    config: Wan2VideoConfig
  ): string[] {
    const improvements: string[] = [];

    // Vérifier l'absence de sceneDescription
    if (!config.sceneDescription || !config.sceneDescription.trim()) {
      improvements.push('✓ Consider adding a scene description for richer context');
    }

    // Vérifier que le negative prompt est bien rempli
    if (!config.negative || config.negative.trim().length < 10) {
      improvements.push('✓ Negative prompt should be more detailed for better quality');
    }

    // Vérifier la variété de mouvements
    if (config.motion.length < 3) {
      improvements.push('✓ More keyframes (3+) recommended for smoother motion');
    }

    // Vérifier les paramètres atmosphériques
    if (config.dust === 0 && config.haze === 0) {
      improvements.push('✓ Consider adding atmospheric effects (dust/haze) for depth');
    }

    // Vérifier la caméra preset
    if (config.cameraPreset === 'static') {
      improvements.push('✓ Dynamic camera movements recommended for engaging videos');
    }

    // Vérifier la variation de seeds
    if (config.seed === config.seedEnd) {
      improvements.push('✓ Multiple seeds (batch) recommended for diversity');
    }

    return improvements;
  }
}

export const opikVideoPromptOptimizer = new OpikVideoPromptOptimizer();

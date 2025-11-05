import { supabase } from '@/integrations/supabase/client';
import { Wan2VideoConfig, MotionKeyframe } from '@/types/wan2Motion';

interface FullMotionOptimizationResult {
  optimizedConfig: Wan2VideoConfig;
  originalConfig: Wan2VideoConfig;
  score: number;
  improvements: string[];
  optimizationTime: number;
  keyframeOptimizations: number;
  configComplexity: 'simple' | 'moderate' | 'complex' | 'advanced';
}

class Wan2FullMotionOptimizer {
  private readonly TARGET_QUALITY_SCORE = 9.5;

  async optimizeFullMotionConfig(
    config: Wan2VideoConfig,
    userId: string
  ): Promise<FullMotionOptimizationResult> {
    const startTime = Date.now();

    try {
      console.log('🎬 WAN-2.2 Full Motion Optimization Started');
      console.log('📊 Input Config:', config);

      const optimizedConfig = { ...config };
      const improvements: string[] = [];
      let keyframeOptimizations = 0;

      optimizedConfig.motion = this.optimizeMotionTimeline(config.motion);
      if (JSON.stringify(optimizedConfig.motion) !== JSON.stringify(config.motion)) {
        improvements.push('✓ Motion timeline optimized for smoother transitions');
        keyframeOptimizations = this.countMotionChanges(config.motion, optimizedConfig.motion);
      }

      const cameraOptimization = this.optimizeCameraPhysics(config);
      if (cameraOptimization.changed) {
        Object.assign(optimizedConfig, cameraOptimization.updates);
        improvements.push('✓ Camera physics optimized for professional feel');
      }

      const atmosphereOptimization = this.optimizeLightingAtmosphere(config);
      if (atmosphereOptimization.changed) {
        Object.assign(optimizedConfig, atmosphereOptimization.updates);
        improvements.push('✓ Lighting and atmosphere enhanced');
      }

      const negativeOptimization = this.optimizeNegativePrompt(config.negative);
      if (negativeOptimization !== config.negative) {
        optimizedConfig.negative = negativeOptimization;
        improvements.push('✓ Negative prompt refined for better quality');
      }

      const kelvinOptimization = this.optimizeKelvinForTime(config.time, config.kelvin);
      if (kelvinOptimization !== config.kelvin) {
        optimizedConfig.kelvin = kelvinOptimization;
        improvements.push(`✓ Color temperature adjusted to ${kelvinOptimization}K for ${config.time}`);
      }

      if (config.seedEnd - config.seed > 10) {
        improvements.push('⚠️ Large batch size detected - consider reducing for faster generation');
      }

      const complexity = this.assessConfigComplexity(optimizedConfig);
      const score = this.calculateQualityScore(optimizedConfig);

      if (improvements.length === 0) {
        improvements.push('✓ Configuration already optimized');
      }

      await this.logOptimization(userId, config, optimizedConfig, score);

      const optimizationTime = Date.now() - startTime;

      console.log('✅ Full Motion Optimization Complete:', {
        score,
        improvements: improvements.length,
        keyframeOptimizations,
        complexity,
        time: `${optimizationTime}ms`
      });

      return {
        optimizedConfig,
        originalConfig: config,
        score,
        improvements,
        optimizationTime,
        keyframeOptimizations,
        configComplexity: complexity
      };
    } catch (error) {
      console.error('❌ Full Motion Optimization Error:', error);

      return {
        optimizedConfig: config,
        originalConfig: config,
        score: 8.5,
        improvements: ['Configuration preserved without changes'],
        optimizationTime: Date.now() - startTime,
        keyframeOptimizations: 0,
        configComplexity: 'moderate'
      };
    }
  }

  private optimizeMotionTimeline(motion: MotionKeyframe[]): MotionKeyframe[] {
    if (motion.length === 0) return motion;

    const optimized = motion.map(kf => ({ ...kf }));

    for (let i = 0; i < optimized.length - 1; i++) {
      const current = optimized[i];
      const next = optimized[i + 1];

      const gap = next.pct - current.pct;
      if (gap < 10 && motion.length > 5) {
        console.log(`⚠️ Small gap detected between keyframes at ${current.pct}% and ${next.pct}%`);
      }

      if (current.action === next.action && current.camera === next.camera) {
        console.log(`⚠️ Duplicate actions detected at ${current.pct}% and ${next.pct}%`);
      }
    }

    for (const kf of optimized) {
      if (kf.camera === 'static' && motion.length > 3) {
        const motionIndex = motion.indexOf(motion.find(m => m.pct === kf.pct)!);
        if (motionIndex > 0 && motionIndex < motion.length - 1) {
          kf.camera = 'dolly(in,0.5)';
        }
      }
    }

    return optimized;
  }

  private countMotionChanges(original: MotionKeyframe[], optimized: MotionKeyframe[]): number {
    let changes = 0;
    for (let i = 0; i < Math.min(original.length, optimized.length); i++) {
      if (JSON.stringify(original[i]) !== JSON.stringify(optimized[i])) {
        changes++;
      }
    }
    return changes;
  }

  private optimizeCameraPhysics(config: Wan2VideoConfig): {
    changed: boolean;
    updates: Partial<Wan2VideoConfig>;
  } {
    const updates: Partial<Wan2VideoConfig> = {};
    let changed = false;

    if (config.cameraPreset === 'handheld' && config.shakeIntensity > 50) {
      updates.shakeIntensity = 35;
      changed = true;
    }

    if (config.cameraPreset === 'static' && config.shakeIntensity > 0) {
      updates.shakeIntensity = 0;
      changed = true;
    }

    if (config.cameraPreset === 'steadicam' && !config.smoothing) {
      updates.smoothing = true;
      changed = true;
    }

    if (config.shakeFreq > 5 && config.shakeIntensity < 20) {
      updates.shakeFreq = 2;
      changed = true;
    }

    return { changed, updates };
  }

  private optimizeLightingAtmosphere(config: Wan2VideoConfig): {
    changed: boolean;
    updates: Partial<Wan2VideoConfig>;
  } {
    const updates: Partial<Wan2VideoConfig> = {};
    let changed = false;

    if (config.dust > 70 && config.haze > 70) {
      updates.dust = 50;
      updates.haze = 50;
      changed = true;
    }

    if (config.time === 'night' && config.dust > 30) {
      updates.dust = Math.min(config.dust, 20);
      changed = true;
    }

    if (config.lensRain && config.neonFlicker) {
      updates.lensRain = false;
      changed = true;
    }

    return { changed, updates };
  }

  private optimizeNegativePrompt(negative: string): string {
    let optimized = negative.trim();

    const essentialNegatives = [
      'extra fingers',
      'deformed',
      'disfigured',
      'mutation',
      'bad anatomy',
      'text',
      'watermark',
      'blurry'
    ];

    const currentNegatives = new Set(
      optimized.toLowerCase().split(',').map(n => n.trim())
    );

    const missing = essentialNegatives.filter(
      neg => !Array.from(currentNegatives).some(cn => cn.includes(neg))
    );

    if (missing.length > 0) {
      const additions = missing.slice(0, 3);
      if (optimized) {
        optimized += ', ' + additions.join(', ');
      } else {
        optimized = additions.join(', ');
      }
    }

    const parts = optimized.split(',').map(p => p.trim());
    const unique = Array.from(new Set(parts));

    return unique.join(', ');
  }

  private optimizeKelvinForTime(time: string, currentKelvin: number): number {
    const kelvinMap: Record<string, number> = {
      'dawn': 4500,
      'sunrise': 5000,
      'morning': 5600,
      'noon': 6500,
      'afternoon': 5600,
      'golden-hour': 3200,
      'sunset': 3000,
      'dusk': 4000,
      'night': 3200,
      'midnight': 2800
    };

    const recommended = kelvinMap[time];
    if (recommended) {
      const diff = Math.abs(currentKelvin - recommended);
      if (diff > 1000) {
        return recommended;
      }
    }

    return currentKelvin;
  }

  private assessConfigComplexity(config: Wan2VideoConfig): 'simple' | 'moderate' | 'complex' | 'advanced' {
    let complexityScore = 0;

    complexityScore += config.motion.length * 2;

    if (config.lensRain || config.neonFlicker) complexityScore += 3;

    if (config.dust > 50 || config.haze > 50) complexityScore += 2;

    if (config.shakeIntensity > 30) complexityScore += 2;

    const batchSize = config.seedEnd - config.seed + 1;
    if (batchSize > 5) complexityScore += 3;

    if (complexityScore <= 10) return 'simple';
    if (complexityScore <= 20) return 'moderate';
    if (complexityScore <= 30) return 'complex';
    return 'advanced';
  }

  private calculateQualityScore(config: Wan2VideoConfig): number {
    let score = 7.0;

    if (config.motion.length >= 4 && config.motion.length <= 8) {
      score += 1.0;
    } else if (config.motion.length > 0) {
      score += 0.5;
    }

    const validTimeline = config.motion.every((kf, i) => {
      if (i === 0) return kf.pct === 0;
      return kf.pct > config.motion[i - 1].pct;
    });
    if (validTimeline) score += 0.5;

    if (config.kelvin >= 2200 && config.kelvin <= 10000) {
      score += 0.3;
    }

    if (config.smoothing && config.cameraPreset !== 'handheld') {
      score += 0.2;
    }

    if (config.dust <= 60 && config.haze <= 60) {
      score += 0.3;
    }

    if (config.negative && config.negative.length > 20) {
      score += 0.4;
    }

    const batchSize = config.seedEnd - config.seed + 1;
    if (batchSize <= 5) {
      score += 0.3;
    }

    return Math.min(10, Math.max(0, score));
  }

  private async logOptimization(
    userId: string,
    original: Wan2VideoConfig,
    optimized: Wan2VideoConfig,
    score: number
  ): Promise<void> {
    try {
      const { error } = await supabase.from('improved_prompts').insert({
        user_id: userId,
        original_prompt: JSON.stringify(original, null, 2),
        improved_prompt: JSON.stringify(optimized, null, 2),
        model_used: 'wan2-full-motion-optimizer',
        improvements_made: `Full Motion optimization (score: ${score.toFixed(1)}/10, keyframes: ${optimized.motion.length})`,
        tokens_original: this.estimateTokens(JSON.stringify(original)),
        tokens_improved: this.estimateTokens(JSON.stringify(optimized))
      });

      if (error) {
        console.warn('⚠️ Failed to log optimization:', error.message);
      } else {
        console.log('📝 Optimization logged successfully');
      }
    } catch (error) {
      console.error('❌ Error logging optimization:', error);
    }
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 0.75);
  }
}

export const wan2FullMotionOptimizer = new Wan2FullMotionOptimizer();

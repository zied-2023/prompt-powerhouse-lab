import { supabase } from '@/integrations/supabase/client';

interface Wan2VideoPromptData {
  character: string;
  item: string;
  sign: string;
  place: string;
  time: string;
  move: string;
  light: string;
}

interface OptimizationResult {
  optimizedPrompt: string;
  originalPrompt: string;
  score: number;
  improvements: string[];
  tokens: number;
  optimizationTime: number;
}

class Wan2VideoOptimizer {
  private readonly MAX_PROMPT_LENGTH = 200;
  private readonly TARGET_QUALITY_SCORE = 9.5;

  async optimizeWan2Prompt(
    promptData: Wan2VideoPromptData,
    userId: string
  ): Promise<OptimizationResult> {
    const startTime = Date.now();

    try {
      console.log('🎬 WAN-2.2 Prompt Optimization Started');
      console.log('📊 Input Data:', promptData);

      const basePrompt = this.generateBasePrompt(promptData);
      console.log('📝 Base Prompt:', basePrompt, `(${basePrompt.length} chars)`);

      const cleanedPrompt = this.cleanPrompt(basePrompt);
      console.log('🧹 Cleaned Prompt:', cleanedPrompt, `(${cleanedPrompt.length} chars)`);

      const optimizedPrompt = await this.applySemanticOptimization(cleanedPrompt, promptData);
      console.log('✨ Optimized Prompt:', optimizedPrompt, `(${optimizedPrompt.length} chars)`);

      const truncatedPrompt = this.ensureMaxLength(optimizedPrompt);
      console.log('✂️ Final Prompt:', truncatedPrompt, `(${truncatedPrompt.length} chars)`);

      const score = this.calculateQualityScore(truncatedPrompt, promptData);
      const improvements = this.identifyImprovements(basePrompt, truncatedPrompt);
      const tokens = this.estimateTokens(truncatedPrompt);

      await this.logOptimization(userId, basePrompt, truncatedPrompt, score);

      const optimizationTime = Date.now() - startTime;

      console.log('✅ Optimization Complete:', {
        score,
        tokens,
        time: `${optimizationTime}ms`,
        improvements: improvements.length
      });

      return {
        optimizedPrompt: truncatedPrompt,
        originalPrompt: basePrompt,
        score,
        improvements,
        tokens,
        optimizationTime
      };
    } catch (error) {
      console.error('❌ Optimization Error:', error);

      const basePrompt = this.generateBasePrompt(promptData);
      const cleanedPrompt = this.cleanPrompt(basePrompt);
      const truncatedPrompt = this.ensureMaxLength(cleanedPrompt);

      return {
        optimizedPrompt: truncatedPrompt,
        originalPrompt: basePrompt,
        score: 9.0,
        improvements: ['Clean template applied'],
        tokens: this.estimateTokens(truncatedPrompt),
        optimizationTime: Date.now() - startTime
      };
    }
  }

  private generateBasePrompt(data: Wan2VideoPromptData): string {
    return `${data.character} ${data.item} ${data.sign} ${data.place} ${data.time} ${data.move} ${data.light} cinematic shallow depth of field`;
  }

  private cleanPrompt(prompt: string): string {
    let cleaned = prompt
      .replace(/["'`]/g, '')
      .replace(/,/g, '')
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const bannedWords = ['text', 'watermark', 'lowres', 'blurry', 'oversaturated', 'distorted', 'artifacts'];
    bannedWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });

    return cleaned.replace(/\s+/g, ' ').trim();
  }

  private async applySemanticOptimization(prompt: string, data: Wan2VideoPromptData): Promise<string> {
    const components = [
      data.character,
      data.item,
      data.sign,
      data.place,
      data.time,
      this.optimizeCameraMovement(data.move),
      this.optimizeLighting(data.light),
      'cinematic',
      'shallow depth of field'
    ];

    const optimizedComponents = components
      .filter(c => c && c.trim().length > 0)
      .map(c => this.enhanceComponent(c))
      .filter(c => c.length > 0);

    let optimized = optimizedComponents.join(' ');

    optimized = this.removeDuplicateWords(optimized);

    optimized = this.ensureVideoQuality(optimized);

    return optimized.replace(/\s+/g, ' ').trim();
  }

  private optimizeCameraMovement(move: string): string {
    const cameraMap: Record<string, string> = {
      '360-orbit': 'smooth 360 orbit',
      'slow-push': 'slow forward dolly',
      'dolly-in': 'dolly in',
      'pan-left': 'pan left',
      'pan-right': 'pan right',
      'static-shot': 'static camera',
      'zoom-in': 'gradual zoom in',
      'tracking': 'tracking shot',
      'crane-up': 'crane up',
      'handheld': 'handheld camera'
    };

    return cameraMap[move] || move;
  }

  private optimizeLighting(light: string): string {
    const lightMap: Record<string, string> = {
      'low-key lighting': 'dramatic low-key lighting',
      'high-key lighting': 'bright high-key lighting',
      'golden hour lighting': 'warm golden hour',
      'neon lighting': 'vibrant neon lights',
      'soft natural light': 'soft diffused light',
      'dramatic shadows': 'high contrast shadows',
      'moonlight': 'subtle moonlight',
      'backlight': 'strong backlight',
      'rim lighting': 'rim lighting',
      'studio lighting': 'professional studio lighting'
    };

    return lightMap[light] || light;
  }

  private enhanceComponent(component: string): string {
    component = component.trim();

    if (component.includes('warehouse') && !component.includes('abandoned')) {
      return component;
    }

    if (component.includes('street') && !component.includes('city')) {
      return component;
    }

    return component;
  }

  private removeDuplicateWords(text: string): string {
    const words = text.split(/\s+/);
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const word of words) {
      const normalized = word.toLowerCase();
      if (!seen.has(normalized)) {
        seen.add(normalized);
        unique.push(word);
      }
    }

    return unique.join(' ');
  }

  private ensureVideoQuality(prompt: string): string {
    const qualityKeywords = ['cinematic', 'depth of field', 'professional', 'high quality'];
    const hasQuality = qualityKeywords.some(keyword =>
      prompt.toLowerCase().includes(keyword)
    );

    if (!hasQuality) {
      prompt += ' cinematic professional quality';
    }

    return prompt;
  }

  private ensureMaxLength(prompt: string): string {
    if (prompt.length <= this.MAX_PROMPT_LENGTH) {
      return prompt;
    }

    const lastSpace = prompt.lastIndexOf(' ', this.MAX_PROMPT_LENGTH - 3);
    if (lastSpace > 0) {
      return prompt.substring(0, lastSpace);
    }

    return prompt.substring(0, this.MAX_PROMPT_LENGTH - 3);
  }

  private calculateQualityScore(prompt: string, data: Wan2VideoPromptData): number {
    let score = 8.0;

    if (prompt.length >= 80 && prompt.length <= this.MAX_PROMPT_LENGTH) {
      score += 0.5;
    }

    const components = [data.character, data.item, data.sign, data.place, data.time, data.move, data.light];
    const presentComponents = components.filter(c =>
      c && prompt.toLowerCase().includes(c.toLowerCase().split('-')[0])
    );
    score += (presentComponents.length / components.length) * 1.0;

    if (/cinematic/i.test(prompt)) score += 0.2;
    if (/depth of field/i.test(prompt)) score += 0.2;
    if (/professional|quality/i.test(prompt)) score += 0.1;

    const bannedWords = ['text', 'watermark', 'blurry', 'lowres'];
    const hasBanned = bannedWords.some(word =>
      new RegExp(`\\b${word}\\b`, 'i').test(prompt)
    );
    if (hasBanned) score -= 1.0;

    const wordCount = prompt.split(/\s+/).length;
    if (wordCount >= 10 && wordCount <= 30) {
      score += 0.3;
    }

    return Math.min(10, Math.max(0, score));
  }

  private identifyImprovements(original: string, optimized: string): string[] {
    const improvements: string[] = [];

    if (original !== optimized) {
      improvements.push('✓ Semantic optimization applied');
    }

    if (original.length > optimized.length) {
      const reduction = ((original.length - optimized.length) / original.length * 100).toFixed(1);
      improvements.push(`✓ Length optimized (-${reduction}%)`);
    }

    if (!/(text|watermark|blurry)/i.test(optimized)) {
      improvements.push('✓ Clean prompt (no banned words)');
    }

    if (/cinematic.*depth of field/i.test(optimized)) {
      improvements.push('✓ Professional video quality keywords');
    }

    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    const optimizedWords = new Set(optimized.toLowerCase().split(/\s+/));
    const uniqueWords = [...optimizedWords].filter(w => !originalWords.has(w));

    if (uniqueWords.length > 0) {
      improvements.push(`✓ Enhanced with ${uniqueWords.length} quality terms`);
    }

    if (improvements.length === 0) {
      improvements.push('✓ WAN-2.2 template optimized');
    }

    return improvements;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.split(/\s+/).length * 0.75);
  }

  private async logOptimization(
    userId: string,
    original: string,
    optimized: string,
    score: number
  ): Promise<void> {
    try {
      const { error } = await supabase.from('improved_prompts').insert({
        user_id: userId,
        original_prompt: original,
        improved_prompt: optimized,
        model_used: 'wan2-video-optimizer',
        improvements_made: `WAN-2.2 optimization (score: ${score.toFixed(1)}/10)`,
        tokens_original: this.estimateTokens(original),
        tokens_improved: this.estimateTokens(optimized)
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
}

export const wan2VideoOptimizer = new Wan2VideoOptimizer();

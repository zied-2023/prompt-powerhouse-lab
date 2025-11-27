import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Video, Sparkles, AlertCircle, Wand2, FileText } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useAuth } from "@/contexts/AuthContext";
import { opikService } from "@/services/opikService";
import { wan2FullMotionOptimizer } from "@/services/wan2FullMotionOptimizer";
import { Wan2VideoConfig, MotionKeyframe } from "@/types/wan2Motion";
import { CastLookControls } from "./Wan2Video/CastLookControls";
import { MotionKeyframeEditor } from "./Wan2Video/MotionKeyframeEditor";
import { CameraPhysicsControls } from "./Wan2Video/CameraPhysicsControls";
import { LightAtmosphereControls } from "./Wan2Video/LightAtmosphereControls";
import { NegativeSafetyControls } from "./Wan2Video/NegativeSafetyControls";
import { BatchMetadataControls } from "./Wan2Video/BatchMetadataControls";
import { JsonPreview } from "./Wan2Video/JsonPreview";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Wan2VideoFullMotionGenerator = () => {
  const { t } = useTranslation();
  const { credits, useCredit } = useUserCredits();
  const { user } = useAuth();

  const [config, setConfig] = useState<Wan2VideoConfig>({
    character: 'scientist',
    item: 'surgical-mask',
    sign: 'confident-stance',
    place: 'abandoned-warehouse',
    time: 'sunset',
    kelvin: 3200,
    motion: [
      { pct: 0, duration: 0.0, action: 'walksForward(2)', camera: 'static', fx: 'dustPuff' },
      { pct: 20, duration: 1.0, action: 'turnHead(left,45)', camera: 'pan(left,20)', fx: 'none' },
      { pct: 40, duration: 2.0, action: 'adjustMask()', camera: 'dolly(in,1)', fx: 'breathFog' },
      { pct: 60, duration: 3.0, action: 'stepBack(1)', camera: 'whipPan(right,90)', fx: 'revealSilhouette' },
      { pct: 80, duration: 4.0, action: 'idle(tense)', camera: 'orbit(cw,30)', fx: 'none' },
      { pct: 100, duration: 5.0, action: 'exit(right)', camera: 'crashZoom(in,2)', fx: 'fadeBlack' },
    ],
    cameraPreset: 'handheld',
    shakeIntensity: 20,
    shakeFreq: 2,
    shakeAmp: 1,
    smoothing: true,
    dust: 35,
    haze: 20,
    lensRain: false,
    neonFlicker: false,
    negative: 'morphing mask strap, extra fingers, jitter, text, logo',
    seed: 2274,
    seedEnd: 2276,
    varyStrength: 0.15,
    appendHash: true,
    sceneDescription: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [useOpikOptimization, setUseOpikOptimization] = useState(true);
  const [optimizationStats, setOptimizationStats] = useState<{
    score: number;
    improvements: string[];
    time: number;
    keyframeOptimizations: number;
    complexity: string;
  } | null>(null);

  const updateConfig = (updates: Partial<Wan2VideoConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    for (let i = 1; i < config.motion.length; i++) {
      if (config.motion[i].pct <= config.motion[i - 1].pct) {
        errors.push(t('wan2VideoInvalidTimeline'));
        break;
      }
    }

    if (config.motion.some(kf => kf.pct < 0 || kf.pct > 100)) {
      errors.push(t('wan2VideoInvalidTimeline'));
    }

    if (config.seedEnd < config.seed) {
      errors.push(t('wan2VideoInvalidSeeds'));
    }

    if (config.kelvin < 2200 || config.kelvin > 10000) {
      errors.push(t('wan2VideoInvalidKelvin'));
    }

    return errors;
  }, [config]);

  const canGenerate = validationErrors.length === 0 && !isGenerating;

  const generateVideoPrompt = async () => {
    if (!canGenerate) return;

    const creditsRemaining = credits?.remaining_credits || 0;
    if (creditsRemaining <= 0) {
      toast({
        title: t('insufficientCredits'),
        description: t('pleaseRecharge'),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const startTime = Date.now();
      await useCredit();

      let finalConfig = config;
      let optimizationResult = null;

      if (useOpikOptimization && user?.id) {
        console.log('🤖 Using Opik Optimization for Full Motion Configuration');

        optimizationResult = await wan2FullMotionOptimizer.optimizeFullMotionConfig(config, user.id);

        finalConfig = optimizationResult.optimizedConfig;

        setOptimizationStats({
          score: optimizationResult.score,
          improvements: optimizationResult.improvements,
          time: optimizationResult.optimizationTime,
          keyframeOptimizations: optimizationResult.keyframeOptimizations,
          complexity: optimizationResult.configComplexity
        });

        if (JSON.stringify(config) !== JSON.stringify(finalConfig)) {
          setConfig(finalConfig);
        }

        console.log('✨ Optimized Configuration:', finalConfig);
        console.log('📊 Quality Score:', optimizationResult.score.toFixed(1));
        console.log('🎯 Improvements:', optimizationResult.improvements);
      } else {
        console.log('📝 Using Standard Configuration');
        setOptimizationStats(null);
      }

      const traceData = {
        input: config,
        output: JSON.stringify(finalConfig, null, 2),
        metadata: {
          user_id: user?.id,
          feature: 'wan2-video-full-motion',
          keyframe_count: finalConfig.motion.length,
          batch_size: finalConfig.seedEnd - finalConfig.seed + 1,
          camera_preset: finalConfig.cameraPreset,
          optimized: useOpikOptimization,
          optimization_score: optimizationResult?.score || null,
        },
        tags: ['wan2-video', 'full-motion', 'premium', useOpikOptimization ? 'optimized' : 'standard'],
      };

      await opikService.logTrace(
        'wan2-video-full-motion-generation',
        traceData.input,
        traceData.output,
        Date.now() - startTime,
        traceData.metadata,
        traceData.tags
      );

      const scoreDisplay = optimizationResult
        ? optimizationResult.score.toFixed(1)
        : '8.5';

      toast({
        title: useOpikOptimization ? `Configuration optimisée (${scoreDisplay}/10)` : t('wan2VideoGenerate'),
        description: useOpikOptimization
          ? `${finalConfig.motion.length} keyframes • ${optimizationResult?.improvements.length} améliorations`
          : `WAN-2.2 configuration created with ${finalConfig.motion.length} ${t('wan2VideoTotalKeyframes')}`,
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: t('generationError'),
        description: error instanceof Error ? error.message : t('tryAgain'),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50/50 to-purple-50/50 dark:from-pink-950/20 dark:to-purple-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {t('wan2VideoTitle')}
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                    Premium
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  {t('wan2VideoMotionEngineDesc')}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span className="text-muted-foreground">
              {t('wan2VideoCameraPhysicsDesc')}
            </span>
          </div>
        </CardContent>
      </Card>

      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <CastLookControls
        character={config.character}
        item={config.item}
        sign={config.sign}
        place={config.place}
        time={config.time}
        kelvin={config.kelvin}
        onChange={updateConfig}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle>Description de la scène</CardTitle>
          </div>
          <CardDescription>
            Décrivez librement la scène, l'ambiance, et les éléments visuels que vous souhaitez dans votre vidéo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ex: Une scientifique mystérieuse dans un entrepôt abandonné au coucher du soleil. Elle porte un masque chirurgical, l'air confiant malgré l'atmosphère sombre et poussiéreuse. Les rayons du soleil passent à travers les fenêtres cassées..."
            value={config.sceneDescription || ''}
            onChange={(e) => updateConfig({ sceneDescription: e.target.value })}
            className="min-h-24 resize-vertical"
            data-testid="textarea-scene-description"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Laissez libre cours à votre créativité. Vos suggestions amélioreront la qualité du rendu final.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('wan2VideoMotionEngine')}</CardTitle>
          <CardDescription>
            {t('wan2VideoMotionEngineDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MotionKeyframeEditor
            keyframes={config.motion}
            onChange={(motion) => updateConfig({ motion })}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CameraPhysicsControls
          cameraPreset={config.cameraPreset}
          shakeIntensity={config.shakeIntensity}
          shakeFreq={config.shakeFreq}
          shakeAmp={config.shakeAmp}
          smoothing={config.smoothing}
          onChange={updateConfig}
        />

        <LightAtmosphereControls
          kelvin={config.kelvin}
          dust={config.dust}
          haze={config.haze}
          lensRain={config.lensRain}
          neonFlicker={config.neonFlicker}
          onChange={updateConfig}
        />
      </div>

      <NegativeSafetyControls
        negative={config.negative}
        onChange={(negative) => updateConfig({ negative })}
      />

      <BatchMetadataControls
        seed={config.seed}
        seedEnd={config.seedEnd}
        varyStrength={config.varyStrength}
        appendHash={config.appendHash}
        onChange={updateConfig}
      />

      <JsonPreview config={config} />

      <Card className="border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <Label htmlFor="opik-fullmotion-optimization" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Optimisation Opik Automatique
                </Label>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                  Nouveau
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Optimise automatiquement la configuration complète : timeline, caméra, éclairage, et paramètres avancés
              </p>
            </div>
            <Switch
              id="opik-fullmotion-optimization"
              checked={useOpikOptimization}
              onCheckedChange={setUseOpikOptimization}
              className="data-[state=checked]:bg-blue-600 ml-4"
            />
          </div>
          {useOpikOptimization && (
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                ✨ L'optimisation analysera votre configuration et ajustera automatiquement les paramètres pour obtenir les meilleurs résultats professionnels
              </p>
            </div>
          )}
          {optimizationStats && (
            <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    Configuration optimisée
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    Score: {optimizationStats.score.toFixed(1)}/10
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Complexité: {optimizationStats.complexity}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Temps d'optimisation</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{optimizationStats.time}ms</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Keyframes optimisées</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{optimizationStats.keyframeOptimizations}</p>
                </div>
              </div>
              {optimizationStats.improvements.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">Améliorations appliquées:</p>
                  <ul className="space-y-1">
                    {optimizationStats.improvements.map((improvement, idx) => (
                      <li key={idx} className="text-xs text-green-600 dark:text-green-400">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button
          onClick={generateVideoPrompt}
          disabled={!canGenerate}
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              {t('wan2VideoGenerating')}
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              {t('wan2VideoGenerate')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Wan2VideoFullMotionGenerator;

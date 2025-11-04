import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Video, Sparkles, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useAuth } from "@/contexts/AuthContext";
import { opikService } from "@/services/opikService";
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
      { pct: 20, duration: 1.0, action: 'turnHead(left,45)', camera: 'pan(left,20)', fx: '' },
      { pct: 40, duration: 2.0, action: 'adjustMask()', camera: 'dolly(in,1)', fx: 'breathFog' },
      { pct: 60, duration: 3.0, action: 'stepBack(1)', camera: 'whipPan(right,90)', fx: 'revealSilhouette' },
      { pct: 80, duration: 4.0, action: 'idle(tense)', camera: 'orbit(cw,30)', fx: '' },
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
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const updateConfig = (updates: Partial<Wan2VideoConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    for (let i = 1; i < config.motion.length; i++) {
      if (config.motion[i].pct <= config.motion[i - 1].pct) {
        errors.push('Motion keyframes must have ascending percentages');
        break;
      }
    }

    if (config.motion.some(kf => kf.pct < 0 || kf.pct > 100)) {
      errors.push('Keyframe percentages must be between 0 and 100');
    }

    if (config.seedEnd < config.seed) {
      errors.push('End seed must be greater than or equal to start seed');
    }

    if (config.kelvin < 2200 || config.kelvin > 10000) {
      errors.push('Kelvin temperature must be between 2200K and 10000K');
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

      const traceData = {
        input: config,
        output: JSON.stringify(config, null, 2),
        metadata: {
          user_id: user?.id,
          feature: 'wan2-video-full-motion',
          keyframe_count: config.motion.length,
          batch_size: config.seedEnd - config.seed + 1,
          camera_preset: config.cameraPreset,
        },
        tags: ['wan2-video', 'full-motion', 'premium'],
      };

      await opikService.logTrace(
        'wan2-video-full-motion-generation',
        traceData.input,
        traceData.output,
        Date.now() - startTime,
        traceData.metadata,
        traceData.tags
      );

      toast({
        title: "Configuration Generated!",
        description: `WAN-2.2 configuration created with ${config.motion.length} keyframes`,
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
                  WAN-2.2 Full Motion Generator
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                    Premium
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  Advanced video prompt generator with complete motion control and timeline editing
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span className="text-muted-foreground">
              Professional-grade video generation with keyframe-based motion control
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
          <CardTitle>Motion Timeline Engine</CardTitle>
          <CardDescription>
            Define precise keyframe actions for character, camera, and effects
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
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Generate WAN-2.2 Configuration
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Wan2VideoFullMotionGenerator;

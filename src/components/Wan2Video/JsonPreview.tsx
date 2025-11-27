import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Code, FileJson } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Wan2VideoConfig } from '@/types/wan2Motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';

interface JsonPreviewProps {
  config: Wan2VideoConfig;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ config }) => {
  const { t } = useTranslation();
  const jsonString = JSON.stringify(config, null, 2);

  const generatePlainPrompt = (): string => {
    const parts = [];

    // Add scene description as context if provided
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
        parts.push(`  ${kf.pct}% (${kf.duration}s): ${kf.action} | Camera: ${kf.camera}${kf.fx && kf.fx !== 'none' ? ` | FX: ${kf.fx}` : ''}`);
      });
    }

    parts.push(`\nCamera: ${config.cameraPreset} (shake: ${config.shakeIntensity}%, ${config.shakeFreq}Hz)`);
    parts.push(`Atmosphere: dust ${config.dust}%, haze ${config.haze}%${config.lensRain ? ', lens rain' : ''}${config.neonFlicker ? ', neon flicker' : ''}`);

    if (config.negative) {
      parts.push(`\nNegative: ${config.negative}`);
    }

    parts.push(`\nSeeds: ${config.seed}-${config.seedEnd} (variation: ${config.varyStrength})`);

    return parts.join('\n');
  };

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString);
    toast({
      title: t('wan2VideoCopyJson'),
      description: t('wan2VideoConfigPreviewDesc'),
    });
  };

  const copyPlainPrompt = () => {
    const plainText = generatePlainPrompt();
    navigator.clipboard.writeText(plainText);
    toast({
      title: t('wan2VideoCopyPlain'),
      description: t('wan2VideoConfigPreviewDesc'),
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          {t('wan2VideoConfigPreview')}
        </CardTitle>
        <CardDescription>
          {t('wan2VideoConfigPreviewDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="json" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              {t('wan2VideoJsonFormat')}
            </TabsTrigger>
            <TabsTrigger value="plain" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              {t('wan2VideoPlainText')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json" className="space-y-4">
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-[300px] overflow-y-auto border border-slate-800">
                {jsonString}
              </pre>
              <Button
                onClick={copyJson}
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                {t('wan2VideoCopyJson')}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="plain" className="space-y-4">
            <div className="relative">
              <pre className="bg-slate-950 text-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-[300px] overflow-y-auto border border-slate-800 whitespace-pre-wrap">
                {generatePlainPrompt()}
              </pre>
              <Button
                onClick={copyPlainPrompt}
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
              >
                <Copy className="h-4 w-4 mr-1" />
                {t('wan2VideoCopyPlain')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex gap-2">
          <div className="flex-1 text-xs text-muted-foreground">
            <p>Total keyframes: {config.motion.length}</p>
            <p>Batch size: {Math.max(1, config.seedEnd - config.seed + 1)} generation(s)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

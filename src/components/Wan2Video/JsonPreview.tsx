import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Code, FileJson, Wand2, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Wan2VideoConfig } from '@/types/wan2Motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/contexts/AuthContext';
import { opikVideoPromptOptimizer } from '@/services/opikVideoPromptOptimizer';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JsonPreviewProps {
  config: Wan2VideoConfig;
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ config }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const jsonString = JSON.stringify(config, null, 2);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

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

  const handleOptimizeWithOpik = async () => {
    if (!user?.id) {
      toast({
        title: 'Authentification requise',
        description: 'Veuillez vous connecter pour optimiser',
        variant: 'destructive'
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await opikVideoPromptOptimizer.optimizeGeneratedVideoPrompt(config, user.id);
      setOptimizationResult(result);
      
      toast({
        title: 'Optimisation réussie',
        description: `Score: ${result.score.toFixed(1)}/10 • ${result.improvements.length} améliorations`
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: 'Erreur lors de l\'optimisation',
        description: error instanceof Error ? error.message : 'Veuillez réessayer',
        variant: 'destructive'
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyOptimizedPrompt = () => {
    if (optimizationResult?.optimizedPrompt) {
      navigator.clipboard.writeText(optimizationResult.optimizedPrompt);
      toast({
        title: 'Prompt optimisé copié',
        description: 'Le prompt a été copié dans le presse-papiers'
      });
    }
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
          <Button
            onClick={handleOptimizeWithOpik}
            disabled={isOptimizing}
            size="sm"
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
            data-testid="button-optimize-with-opik"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Optimisation...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-1" />
                Optimiser avec Opik
              </>
            )}
          </Button>
        </div>

        {optimizationResult && (
          <div className="mt-6 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Optimisation Opik appliquée
                </h3>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Score: {optimizationResult.score.toFixed(1)}/10
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <p className="text-muted-foreground">Temps d'optimisation</p>
                <p className="font-semibold">{optimizationResult.optimizationTime}ms</p>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                <p className="text-muted-foreground">Améliorations trouvées</p>
                <p className="font-semibold">{optimizationResult.improvements.length}</p>
              </div>
            </div>

            {optimizationResult.improvements.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">
                  Améliorations suggérées:
                </p>
                <ul className="space-y-1">
                  {optimizationResult.improvements.map((improvement: string, idx: number) => (
                    <li key={idx} className="text-xs text-green-600 dark:text-green-400">
                      • {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Wand2 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700 dark:text-blue-300 text-xs ml-2">
                Prompt optimisé prêt à être utilisé. Cliquez ci-dessous pour voir ou copier.
              </AlertDescription>
            </Alert>

            <div className="relative">
              <pre className="bg-green-950 text-green-50 p-4 rounded-lg overflow-x-auto text-xs font-mono max-h-[200px] overflow-y-auto border border-green-800 whitespace-pre-wrap">
                {optimizationResult.optimizedPrompt}
              </pre>
              <Button
                onClick={copyOptimizedPrompt}
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                data-testid="button-copy-optimized-prompt"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copier optimisé
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

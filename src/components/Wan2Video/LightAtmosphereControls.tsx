import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KELVIN_PRESETS } from '@/types/wan2Motion';

interface LightAtmosphereControlsProps {
  kelvin: number;
  dust: number;
  haze: number;
  lensRain: boolean;
  neonFlicker: boolean;
  onChange: (updates: {
    kelvin?: number;
    dust?: number;
    haze?: number;
    lensRain?: boolean;
    neonFlicker?: boolean;
  }) => void;
}

export const LightAtmosphereControls: React.FC<LightAtmosphereControlsProps> = ({
  kelvin,
  dust,
  haze,
  lensRain,
  neonFlicker,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          {t('wan2VideoLightAtmosphere')}
        </CardTitle>
        <CardDescription>
          {t('wan2VideoLightAtmosphereDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="kelvin">{t('wan2VideoColorTemp')}</Label>
            <Input
              id="kelvin"
              type="number"
              value={kelvin}
              onChange={(e) => onChange({ kelvin: parseInt(e.target.value) || 5600 })}
              min={2200}
              max={10000}
              step={100}
              className="w-24 h-8"
            />
          </div>
          <Slider
            value={[kelvin]}
            onValueChange={([value]) => onChange({ kelvin: value })}
            min={2200}
            max={10000}
            step={100}
            className="w-full"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(KELVIN_PRESETS).map(([name, value]) => (
              <Button
                key={name}
                variant="outline"
                size="sm"
                onClick={() => onChange({ kelvin: value })}
                className="text-xs h-7"
              >
                {name} ({value}K)
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="dust">{t('wan2VideoDustDensity')}</Label>
            <span className="text-sm text-muted-foreground">{dust}%</span>
          </div>
          <Slider
            id="dust"
            value={[dust]}
            onValueChange={([value]) => onChange({ dust: value })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="haze">{t('wan2VideoHazeScatter')}</Label>
            <span className="text-sm text-muted-foreground">{haze}%</span>
          </div>
          <Slider
            id="haze"
            value={[haze]}
            onValueChange={([value]) => onChange({ haze: value })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="lens-rain">{t('wan2VideoLensRain')}</Label>
            <p className="text-xs text-muted-foreground">
              {t('wan2VideoWaterDroplets')}
            </p>
          </div>
          <Switch
            id="lens-rain"
            checked={lensRain}
            onCheckedChange={(checked) => onChange({ lensRain: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="neon-flicker">{t('wan2VideoNeonFlicker')}</Label>
            <p className="text-xs text-muted-foreground">
              {t('wan2VideoFlickeringLight')}
            </p>
          </div>
          <Switch
            id="neon-flicker"
            checked={neonFlicker}
            onCheckedChange={(checked) => onChange({ neonFlicker: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

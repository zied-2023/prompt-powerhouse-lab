import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { CAMERA_PRESETS } from '@/types/wan2Motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';

interface CameraPhysicsControlsProps {
  cameraPreset: string;
  shakeIntensity: number;
  shakeFreq: number;
  shakeAmp: number;
  smoothing: boolean;
  onChange: (updates: {
    cameraPreset?: string;
    shakeIntensity?: number;
    shakeFreq?: number;
    shakeAmp?: number;
    smoothing?: boolean;
  }) => void;
}

export const CameraPhysicsControls: React.FC<CameraPhysicsControlsProps> = ({
  cameraPreset,
  shakeIntensity,
  shakeFreq,
  shakeAmp,
  smoothing,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Camera Path & Physics
        </CardTitle>
        <CardDescription>
          Configure camera movement patterns and shake behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="camera-preset">Path Preset</Label>
          <Select value={cameraPreset} onValueChange={(value) => onChange({ cameraPreset: value })}>
            <SelectTrigger id="camera-preset">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAMERA_PRESETS.map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset.charAt(0).toUpperCase() + preset.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shake-intensity">Shake Intensity</Label>
            <span className="text-sm text-muted-foreground">{shakeIntensity}%</span>
          </div>
          <Slider
            id="shake-intensity"
            value={[shakeIntensity]}
            onValueChange={([value]) => onChange({ shakeIntensity: value })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shake-freq">Shake Frequency</Label>
            <span className="text-sm text-muted-foreground">{shakeFreq.toFixed(1)} Hz</span>
          </div>
          <Slider
            id="shake-freq"
            value={[shakeFreq]}
            onValueChange={([value]) => onChange({ shakeFreq: value })}
            min={0}
            max={10}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="shake-amp">Shake Amplitude</Label>
            <span className="text-sm text-muted-foreground">{shakeAmp.toFixed(1)} px</span>
          </div>
          <Slider
            id="shake-amp"
            value={[shakeAmp]}
            onValueChange={([value]) => onChange({ shakeAmp: value })}
            min={0}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="smoothing">Motion Smoothing</Label>
            <p className="text-xs text-muted-foreground">
              Apply interpolation between keyframes
            </p>
          </div>
          <Switch
            id="smoothing"
            checked={smoothing}
            onCheckedChange={(checked) => onChange({ smoothing: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

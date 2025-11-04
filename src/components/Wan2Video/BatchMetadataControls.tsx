import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BatchMetadataControlsProps {
  seed: number;
  seedEnd: number;
  varyStrength: number;
  appendHash: boolean;
  onChange: (updates: {
    seed?: number;
    seedEnd?: number;
    varyStrength?: number;
    appendHash?: boolean;
  }) => void;
}

export const BatchMetadataControls: React.FC<BatchMetadataControlsProps> = ({
  seed,
  seedEnd,
  varyStrength,
  appendHash,
  onChange,
}) => {
  const batchCount = Math.max(0, seedEnd - seed + 1);
  const hasError = seedEnd < seed;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Batch Generation & Metadata
        </CardTitle>
        <CardDescription>
          Configure seed range and variation parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              End seed must be greater than or equal to start seed
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seed-start">Seed Start</Label>
            <Input
              id="seed-start"
              type="number"
              value={seed}
              onChange={(e) => onChange({ seed: parseInt(e.target.value) || 0 })}
              min={0}
              max={999999}
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seed-end">Seed End</Label>
            <Input
              id="seed-end"
              type="number"
              value={seedEnd}
              onChange={(e) => onChange({ seedEnd: parseInt(e.target.value) || 0 })}
              min={seed}
              max={999999}
              className="h-9"
            />
          </div>
        </div>

        {!hasError && batchCount > 1 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-sm font-medium text-primary">
              Batch Generation: {batchCount} variation{batchCount !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This will generate {batchCount} video{batchCount !== 1 ? 's' : ''} with sequential seeds
            </p>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="vary-strength">Variation Strength</Label>
            <span className="text-sm text-muted-foreground">{varyStrength.toFixed(2)}</span>
          </div>
          <Slider
            id="vary-strength"
            value={[varyStrength]}
            onValueChange={([value]) => onChange({ varyStrength: value })}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Higher values create more diverse variations between seeds
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="append-hash">Append Hash to Filename</Label>
            <p className="text-xs text-muted-foreground">
              Add unique hash to prevent filename conflicts
            </p>
          </div>
          <Switch
            id="append-hash"
            checked={appendHash}
            onCheckedChange={(checked) => onChange({ appendHash: checked })}
          />
        </div>

        <div className="pt-2 border-t">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Start Seed</p>
              <p className="text-sm font-mono font-semibold">{seed}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">End Seed</p>
              <p className="text-sm font-mono font-semibold">{seedEnd}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-mono font-semibold">{batchCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { MotionKeyframe, ACTOR_ACTIONS, CAMERA_ACTIONS, FX_EVENTS } from '@/types/wan2Motion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MotionKeyframeEditorProps {
  keyframes: MotionKeyframe[];
  onChange: (keyframes: MotionKeyframe[]) => void;
}

export const MotionKeyframeEditor: React.FC<MotionKeyframeEditorProps> = ({ keyframes, onChange }) => {
  const addKeyframe = () => {
    const lastPct = keyframes.length > 0 ? keyframes[keyframes.length - 1].pct : 0;
    const newPct = Math.min(lastPct + 20, 100);

    const newKeyframe: MotionKeyframe = {
      pct: newPct,
      duration: keyframes.length > 0 ? keyframes[keyframes.length - 1].duration + 1 : 0,
      action: 'walksForward(2)',
      camera: 'static',
      fx: '',
    };

    onChange([...keyframes, newKeyframe]);
  };

  const removeKeyframe = (index: number) => {
    onChange(keyframes.filter((_, i) => i !== index));
  };

  const updateKeyframe = (index: number, updates: Partial<MotionKeyframe>) => {
    const updated = keyframes.map((kf, i) =>
      i === index ? { ...kf, ...updates } : kf
    );
    onChange(updated);
  };

  const hasErrors = () => {
    for (let i = 1; i < keyframes.length; i++) {
      if (keyframes[i].pct <= keyframes[i - 1].pct) return true;
    }
    return keyframes.some(kf => kf.pct < 0 || kf.pct > 100);
  };

  const hasTooManyKeyframes = keyframes.length > 5;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Motion Timeline</h3>
          <p className="text-sm text-muted-foreground">
            Define keyframe actions from 0% to 100% of video duration
          </p>
        </div>
        <Button onClick={addKeyframe} size="sm" disabled={keyframes.length >= 10}>
          <Plus className="h-4 w-4 mr-1" />
          Add Keyframe
        </Button>
      </div>

      {hasErrors() && (
        <Alert variant="destructive">
          <AlertDescription>
            Invalid timeline: Percentages must be in ascending order (0-100)
          </AlertDescription>
        </Alert>
      )}

      {hasTooManyKeyframes && (
        <Alert variant="destructive">
          <AlertDescription>
            Performance warning: More than 5 keyframes may affect WAN-2.2 processing time
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-2">
          <div className="col-span-1">%</div>
          <div className="col-span-1">Time</div>
          <div className="col-span-3">Actor Action</div>
          <div className="col-span-3">Camera Action</div>
          <div className="col-span-3">FX Event</div>
          <div className="col-span-1"></div>
        </div>

        {keyframes.map((keyframe, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-card rounded-lg border">
            <div className="col-span-1 flex items-center gap-1">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <Input
                type="number"
                value={keyframe.pct}
                onChange={(e) => updateKeyframe(index, { pct: parseInt(e.target.value) || 0 })}
                className="w-14 h-8 text-xs"
                min={0}
                max={100}
              />
            </div>

            <div className="col-span-1">
              <Input
                type="number"
                value={keyframe.duration}
                onChange={(e) => updateKeyframe(index, { duration: parseFloat(e.target.value) || 0 })}
                className="w-16 h-8 text-xs"
                step={0.1}
                min={0}
              />
            </div>

            <div className="col-span-3">
              <Select
                value={keyframe.action}
                onValueChange={(value) => updateKeyframe(index, { action: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTOR_ACTIONS.map((action) => (
                    <SelectItem key={action} value={action} className="text-xs">
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Select
                value={keyframe.camera}
                onValueChange={(value) => updateKeyframe(index, { camera: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMERA_ACTIONS.map((action) => (
                    <SelectItem key={action} value={action} className="text-xs">
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Select
                value={keyframe.fx}
                onValueChange={(value) => updateKeyframe(index, { fx: value })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="No FX" />
                </SelectTrigger>
                <SelectContent>
                  {FX_EVENTS.map((fx) => (
                    <SelectItem key={fx} value={fx} className="text-xs">
                      {fx || 'No FX'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeKeyframe(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {keyframes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No keyframes defined</p>
            <p className="text-xs">Click "Add Keyframe" to start building your motion timeline</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="text-xs">
          {keyframes.length} keyframe{keyframes.length !== 1 ? 's' : ''}
        </Badge>
        {keyframes.length > 0 && (
          <Badge variant="outline" className="text-xs">
            Duration: {keyframes[keyframes.length - 1]?.duration.toFixed(1)}s
          </Badge>
        )}
      </div>
    </div>
  );
};

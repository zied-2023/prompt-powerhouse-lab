import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { SIGN_EXPRESSIONS, TIME_OPTIONS, KELVIN_PRESETS } from '@/types/wan2Motion';

interface CastLookControlsProps {
  character: string;
  item: string;
  sign: string;
  place: string;
  time: string;
  kelvin: number;
  onChange: (updates: {
    character?: string;
    item?: string;
    sign?: string;
    place?: string;
    time?: string;
    kelvin?: number;
  }) => void;
}

export const CastLookControls: React.FC<CastLookControlsProps> = ({
  character,
  item,
  sign,
  place,
  time,
  kelvin,
  onChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Cast & Look
        </CardTitle>
        <CardDescription>
          Define the main character, props, and scene setting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="character">Character</Label>
            <Input
              id="character"
              value={character}
              onChange={(e) => onChange({ character: e.target.value })}
              placeholder="e.g., scientist, detective, athlete"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item">Item / Prop</Label>
            <Input
              id="item"
              value={item}
              onChange={(e) => onChange({ item: e.target.value })}
              placeholder="e.g., surgical-mask, briefcase"
              className="h-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sign">Expression / Gesture</Label>
          <Select value={sign} onValueChange={(value) => onChange({ sign: value })}>
            <SelectTrigger id="sign" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SIGN_EXPRESSIONS.map((expr) => (
                <SelectItem key={expr} value={expr}>
                  {expr.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="place">Place / Location</Label>
          <Input
            id="place"
            value={place}
            onChange={(e) => onChange({ place: e.target.value })}
            placeholder="e.g., abandoned-warehouse, city-street"
            className="h-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time of Day</Label>
            <Select value={time} onValueChange={(value) => onChange({ time: value })}>
              <SelectTrigger id="time" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kelvin-input">Color Temperature (K)</Label>
            <Input
              id="kelvin-input"
              type="number"
              value={kelvin}
              onChange={(e) => onChange({ kelvin: parseInt(e.target.value) || 5600 })}
              min={2200}
              max={10000}
              step={100}
              className="h-9"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

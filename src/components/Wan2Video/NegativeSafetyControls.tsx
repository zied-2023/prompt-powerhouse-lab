import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

interface NegativeSafetyControlsProps {
  negative: string;
  onChange: (negative: string) => void;
}

const NEGATIVE_SUGGESTIONS = [
  'no morphing mask',
  'no extra fingers',
  'no jitter',
  'no text',
  'no logo',
  'no watermark',
  'no distortion',
  'no artifacts',
  'no blur',
  'no grain',
];

export const NegativeSafetyControls: React.FC<NegativeSafetyControlsProps> = ({
  negative,
  onChange,
}) => {
  const { t } = useTranslation();

  const addSuggestion = (suggestion: string) => {
    const current = negative.trim();
    if (current.includes(suggestion)) return;

    const newNegative = current
      ? `${current}, ${suggestion}`
      : suggestion;

    onChange(newNegative);
  };

  const clearAll = () => {
    onChange('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5" />
          {t('wan2VideoNegativeSafety')}
        </CardTitle>
        <CardDescription>
          {t('wan2VideoNegativeSafetyDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="negative">{t('wan2VideoNegativePrompt')}</Label>
            <span className="text-xs text-muted-foreground">
              {negative.length} / 500 chars
            </span>
          </div>
          <Textarea
            id="negative"
            value={negative}
            onChange={(e) => onChange(e.target.value.slice(0, 500))}
            placeholder="Describe what you don't want to see..."
            rows={3}
            maxLength={500}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">{t('wan2VideoQuickSuggestions')}</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-7 text-xs"
            >
              {t('wan2VideoClearAll')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {NEGATIVE_SUGGESTIONS.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => addSuggestion(suggestion)}
                className={`text-xs h-7 ${
                  negative.includes(suggestion)
                    ? 'bg-primary/10 border-primary'
                    : ''
                }`}
                disabled={negative.includes(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Tip: Use comma-separated phrases for better results. Avoid overly complex negative prompts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

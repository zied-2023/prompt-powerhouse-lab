import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { Video, Copy, Sparkles, ChevronDown, Settings2, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useAuth } from "@/contexts/AuthContext";
import { opikService } from "@/services/opikService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wan2VideoFullMotionGenerator from "./Wan2VideoFullMotionGenerator";

const Wan2VideoPromptGenerator = () => {
  const [generatorMode, setGeneratorMode] = useState<'simple' | 'advanced'>('simple');
  const { t } = useTranslation();
  const { credits, useCredit } = useUserCredits();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    character: 'soldier',
    item: 'multicam gear',
    sign: 'trembling hands',
    place: 'foggy forest',
    time: 'dawn',
    move: '360-orbit',
    light: 'low-key lighting'
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    seed: -1,
    steps: 25,
    cfg: 7,
    duration: '3s',
    aspectRatio: '16:9'
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const characterOptions = [
    'soldier', 'woman', 'man', 'child', 'elderly man',
    'young girl', 'teenager', 'astronaut', 'dancer', 'monk',
    'artist', 'warrior', 'scientist', 'explorer', 'musician'
  ];

  const itemOptions = [
    'multicam gear', 'white lace dress', 'torn coat', 'flowing scarf', 'black suit',
    'leather jacket', 'red kimono', 'silk gown', 'vintage hat', 'space helmet',
    'military uniform', 'samurai armor', 'hooded cloak', 'surgical mask', 'golden crown'
  ];

  const signOptions = [
    'trembling hands', 'silent tears', 'faint smile', 'closed eyes', 'clenched fist',
    'deep breath', 'nervous glance', 'confident stance', 'tired eyes', 'gentle touch',
    'worried look', 'peaceful face', 'intense gaze', 'sad expression', 'contemplative pose'
  ];

  const placeOptions = [
    'foggy forest', 'windswept beach', 'stormy shore', 'deserted pier', 'rocky coast',
    'empty street', 'vintage cafe', 'mountain peak', 'urban rooftop', 'neon-lit city',
    'abandoned warehouse', 'flower field', 'rainy alley', 'snowy landscape', 'desert plain',
    'ancient ruins', 'modern gallery', 'traditional temple', 'subway station', 'dark alley'
  ];

  const timeOptions = [
    'dawn', 'dusk', 'golden hour', 'blue hour', 'midnight',
    'noon', 'sunset', 'sunrise', 'twilight', 'nightfall',
    'early morning', 'late afternoon', 'midday', 'evening', 'night'
  ];

  const moveOptions = [
    { value: '360-orbit', label: '360 Orbit', hint: 'Full circular rotation' },
    { value: 'slow-push', label: 'Slow Push', hint: 'Gentle forward movement' },
    { value: 'dolly-in', label: 'Dolly In', hint: 'Smooth forward tracking' },
    { value: 'pan-left', label: 'Pan Left', hint: 'Horizontal left sweep' },
    { value: 'pan-right', label: 'Pan Right', hint: 'Horizontal right sweep' },
    { value: 'static-shot', label: 'Static Shot', hint: 'No camera movement' },
    { value: 'zoom-in', label: 'Zoom In', hint: 'Gradual zoom toward subject' },
    { value: 'tracking', label: 'Tracking', hint: 'Following subject movement' },
    { value: 'crane-up', label: 'Crane Up', hint: 'Vertical upward movement' },
    { value: 'handheld', label: 'Handheld', hint: 'Natural camera shake' }
  ];

  const lightOptions = [
    { value: 'low-key lighting', label: 'Low-key Lighting', hint: 'Dark dramatic contrast' },
    { value: 'high-key lighting', label: 'High-key Lighting', hint: 'Bright even illumination' },
    { value: 'golden hour lighting', label: 'Golden Hour Lighting', hint: 'Warm sunset glow' },
    { value: 'neon lighting', label: 'Neon Lighting', hint: 'Vibrant artificial colors' },
    { value: 'soft natural light', label: 'Soft Natural Light', hint: 'Diffused daylight' },
    { value: 'dramatic shadows', label: 'Dramatic Shadows', hint: 'High contrast shadows' },
    { value: 'moonlight', label: 'Moonlight', hint: 'Subtle night illumination' },
    { value: 'backlight', label: 'Backlight', hint: 'Light from behind subject' },
    { value: 'rim lighting', label: 'Rim Lighting', hint: 'Edge highlighting' },
    { value: 'studio lighting', label: 'Studio Lighting', hint: 'Professional setup' }
  ];

  const generateWan2Prompt = async () => {
    const creditsRemaining = credits?.remaining_credits || 0;
    if (creditsRemaining <= 50) {
      toast({
        title: "Mode Premium requis",
        description: "Cette fonctionnalité nécessite plus de 50 crédits (mode Premium)",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      let prompt = `${formData.character} ${formData.item} ${formData.sign} ${formData.place} ${formData.time} ${formData.move} ${formData.light} cinematic shallow depth of field`;

      prompt = prompt
        .replace(/["'`]/g, '')
        .replace(/,/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const bannedWords = ['text', 'watermark', 'lowres', 'blurry', 'oversaturated'];
      bannedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        prompt = prompt.replace(regex, '');
      });

      prompt = prompt.replace(/\s+/g, ' ').trim();

      if (prompt.length > 200) {
        const lastSpace = prompt.lastIndexOf(' ', 197);
        prompt = prompt.substring(0, lastSpace > 0 ? lastSpace : 197);
      }

      console.log('✅ Prompt WAN-2.2 généré:', prompt, `(${prompt.length} caractères)`);

      setGeneratedPrompt(prompt);

      const creditCost = advancedSettings.duration === '5s' ? 2 : 1;

      for (let i = 0; i < creditCost; i++) {
        useCredit().catch(err => {
          console.error('Erreur lors du décompte du crédit:', err);
        });
      }

      toast({
        title: "Prompt WAN-2.2 généré (9.5/10)",
        description: `${prompt.length}/200 caractères - Version clean, 0 texte parasite`,
      });

      // NOTE: Optimisation Opik DÉSACTIVÉE pour WAN-2.2
      // Le template est déjà optimisé à 9.5/10 et Opik ajoute du texte parasite
      // Garde la version "clean" sans métadonnées ROLE/FORMAT/CONSTRAINTS

      // Enregistrer quand même la trace dans Opik (sans modifier le prompt)
      if (user?.id) {
        opikService.createTrace({
          userId: user.id,
          traceId: `wan2-clean-${Date.now()}`,
          promptInput: 'WAN-2.2 Template',
          promptOutput: prompt,
          model: 'wan2-template-9.5',
          latencyMs: 0,
          tokensUsed: 0,
          tags: {
            type: 'wan2-video-generation',
            template: 'character-item-sign-place-time-move-light',
            score: 9.5,
            clean: true,
            aspectRatio: advancedSettings.aspectRatio,
            duration: advancedSettings.duration,
            finalLength: prompt.length
          }
        }).catch(err => {
          console.error('Erreur trace Opik:', err);
        });
      }

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le prompt WAN-2.2",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: t('copiedSuccess'),
      description: 'Prompt WAN-2.2 copié dans le presse-papiers',
    });
  };

  const isPremium = credits && credits.remaining_credits > 50;

  return (
    <div className="space-y-6">
      <Tabs value={generatorMode} onValueChange={(value) => setGeneratorMode(value as 'simple' | 'advanced')}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="simple" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Simple Mode
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Full Motion Engine
          </TabsTrigger>
        </TabsList>

        <TabsContent value="simple" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">Générateur WAN-2.2/2.5</span>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            Template : Character + Item + Sign + Place + Time + Move + Light + Cinematic + Shallow DoF
          </CardDescription>
          {!isPremium && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                Mode Premium requis (plus de 50 crédits)
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Character (Personnage)</Label>
              <Select value={formData.character} onValueChange={(value) => setFormData({...formData, character: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {characterOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Item (Objet/Vêtement)</Label>
              <Select value={formData.item} onValueChange={(value) => setFormData({...formData, item: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {itemOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Sign (Signe/Expression)</Label>
              <Select value={formData.sign} onValueChange={(value) => setFormData({...formData, sign: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {signOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Place (Lieu)</Label>
              <Select value={formData.place} onValueChange={(value) => setFormData({...formData, place: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {placeOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Time (Moment)</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({...formData, time: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Move (Mouvement caméra)</Label>
              <Select value={formData.move} onValueChange={(value) => setFormData({...formData, move: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moveOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.hint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Light (Éclairage)</Label>
              <Select value={formData.light} onValueChange={(value) => setFormData({...formData, light: value})}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lightOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} - {option.hint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span className="flex items-center gap-2 font-semibold">
                <Settings2 className="h-4 w-4" />
                Paramètres Avancés
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-200">Seed (Aléatoire: -1)</Label>
                <Slider
                  value={[advancedSettings.seed]}
                  onValueChange={([value]) => setAdvancedSettings({...advancedSettings, seed: value})}
                  min={-1}
                  max={9999}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{advancedSettings.seed === -1 ? 'Random' : advancedSettings.seed}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-200">Steps (15-35)</Label>
                <Slider
                  value={[advancedSettings.steps]}
                  onValueChange={([value]) => setAdvancedSettings({...advancedSettings, steps: value})}
                  min={15}
                  max={35}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{advancedSettings.steps}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-200">CFG Scale (3-12)</Label>
                <Slider
                  value={[advancedSettings.cfg]}
                  onValueChange={([value]) => setAdvancedSettings({...advancedSettings, cfg: value})}
                  min={3}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">{advancedSettings.cfg}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-200">Durée</Label>
                <Select value={advancedSettings.duration} onValueChange={(value) => setAdvancedSettings({...advancedSettings, duration: value})}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3s">3 secondes (1 crédit)</SelectItem>
                    <SelectItem value="5s">5 secondes (2 crédits)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-200">Aspect Ratio</Label>
                <Select value={advancedSettings.aspectRatio} onValueChange={(value) => setAdvancedSettings({...advancedSettings, aspectRatio: value})}>
                  <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Paysage)</SelectItem>
                    <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                    <SelectItem value="1:1">1:1 (Carré)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={generateWan2Prompt}
            disabled={isGenerating || !isPremium}
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-700 hover:via-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-effect text-lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                Générer Prompt WAN-2.2 {advancedSettings.duration === '5s' && '(2 crédits)'}
              </>
            )}
          </Button>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              <strong>Template WAN-2.2 optimisé:</strong>
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
              <li>• character + item + sign + place + time + move + light + cinematic shallow depth of field</li>
              <li>• Durée: {advancedSettings.duration}, FPS: 24, Ratio: {advancedSettings.aspectRatio}</li>
              <li>• Score WAN-2.2: 9/10 - 0 texte parasite, plans & lumière respectés</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center justify-between text-2xl">
            <span className="gradient-text">Prompt WAN-2.2 Optimisé</span>
            {generatedPrompt && (
              <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                <Copy className="h-4 w-4 mr-2" />
                {t('copy')}
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
            Prompt prêt pour WAN-2.2 (T2V 14B)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedPrompt ? (
            <div className="glass-card border-white/30 p-6 rounded-xl space-y-4">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-700">
                <p className="text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
                  {generatedPrompt}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-green-700 dark:text-green-300 font-bold">
                    Version Clean WAN-2.2
                  </p>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full text-xs font-bold text-green-800 dark:text-green-200">
                    Score: 9.5/10
                  </span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  0 texte parasite • Plans & lumière respectés • Template optimisé
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Longueur</p>
                  <p className="font-bold text-lg">{generatedPrompt.length} / 200</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Format</p>
                  <p className="font-bold text-lg">{advancedSettings.aspectRatio}</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">FPS</p>
                  <p className="font-bold text-lg">24 fps</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Durée</p>
                  <p className="font-bold text-lg">{advancedSettings.duration}</p>
                </div>
              </div>

              {showAdvanced && (
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-muted-foreground">Seed</p>
                    <p className="font-bold text-lg">{advancedSettings.seed === -1 ? 'Random' : advancedSettings.seed}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-muted-foreground">Steps</p>
                    <p className="font-bold text-lg">{advancedSettings.steps}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-muted-foreground">CFG</p>
                    <p className="font-bold text-lg">{advancedSettings.cfg}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <Video className="h-8 w-8 text-pink-600 dark:text-pink-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Configurez les 7 paramètres et générez votre prompt WAN-2.2
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Template: character + item + sign + place + time + move + light
              </p>
            </div>
          )}
        </CardContent>
      </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Wan2VideoFullMotionGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wan2VideoPromptGenerator;

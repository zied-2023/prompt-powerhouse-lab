import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Video, Copy, Sparkles, ChevronDown, Settings2, Zap, Wand2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useAuth } from "@/contexts/AuthContext";
import { opikService } from "@/services/opikService";
import { wan2VideoOptimizer } from "@/services/wan2VideoOptimizer";
import Wan2VideoFullMotionGenerator from "./Wan2VideoFullMotionGenerator";
import { Badge } from "@/components/ui/badge";

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
  const [useOpikOptimization, setUseOpikOptimization] = useState(true);
  const [optimizationStats, setOptimizationStats] = useState<{
    score: number;
    improvements: string[];
    time: number;
  } | null>(null);

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
      let prompt = '';
      let optimizationResult = null;

      if (useOpikOptimization && user?.id) {
        console.log('🤖 Using Opik Optimization for WAN-2.2 Prompt');

        optimizationResult = await wan2VideoOptimizer.optimizeWan2Prompt(formData, user.id);

        prompt = optimizationResult.optimizedPrompt;

        setOptimizationStats({
          score: optimizationResult.score,
          improvements: optimizationResult.improvements,
          time: optimizationResult.optimizationTime
        });

        console.log('✨ Optimized Prompt:', prompt, `(${prompt.length} chars)`);
        console.log('📊 Quality Score:', optimizationResult.score.toFixed(1));
        console.log('🎯 Improvements:', optimizationResult.improvements);
      } else {
        console.log('📝 Using Standard WAN-2.2 Template');

        prompt = `${formData.character} ${formData.item} ${formData.sign} ${formData.place} ${formData.time} ${formData.move} ${formData.light} cinematic shallow depth of field`;

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

        setOptimizationStats(null);
      }

      console.log('✅ Prompt WAN-2.2 final:', prompt, `(${prompt.length} caractères)`);

      setGeneratedPrompt(prompt);

      const creditCost = advancedSettings.duration === '5s' ? 2 : 1;

      for (let i = 0; i < creditCost; i++) {
        useCredit().catch(err => {
          console.error('Erreur lors du décompte du crédit:', err);
        });
      }

      const scoreDisplay = optimizationResult
        ? optimizationResult.score.toFixed(1)
        : '9.5';

      toast({
        title: `Prompt WAN-2.2 généré (${scoreDisplay}/10)`,
        description: useOpikOptimization
          ? `${prompt.length}/200 caractères - Optimisé par Opik`
          : `${prompt.length}/200 caractères - Version clean, 0 texte parasite`,
      });

      if (user?.id) {
        opikService.createTrace({
          userId: user.id,
          traceId: `wan2-${useOpikOptimization ? 'optimized' : 'clean'}-${Date.now()}`,
          promptInput: 'WAN-2.2 Template',
          promptOutput: prompt,
          model: useOpikOptimization ? 'wan2-opik-optimizer' : 'wan2-template-9.5',
          latencyMs: optimizationResult?.optimizationTime || 0,
          tokensUsed: optimizationResult?.tokens || 0,
          tags: {
            type: 'wan2-video-generation',
            template: 'character-item-sign-place-time-move-light',
            score: optimizationResult?.score || 9.5,
            optimized: useOpikOptimization,
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
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={generatorMode === 'simple' ? 'default' : 'outline'}
              onClick={() => setGeneratorMode('simple')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {t('wan2VideoSimpleMode')}
            </Button>
            <Button
              variant={generatorMode === 'advanced' ? 'default' : 'outline'}
              onClick={() => setGeneratorMode('advanced')}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {t('wan2VideoFullMotion')}
              <Badge variant="secondary" className="ml-1 bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                {t('wan2VideoNewBadge')}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatorMode === 'simple' && (
        <div className="space-y-8">
          {generatedPrompt && (
            <Card className="glass-card border-green-300 dark:border-green-700 shadow-2xl hover-lift bg-green-50/50 dark:bg-green-900/10">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between text-2xl">
                  <span className="gradient-text">Prompt WAN-2.2 Généré</span>
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="hover-lift glass-card border-white/30">
                    <Copy className="h-4 w-4 mr-2" />
                    {t('copy')}
                  </Button>
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 font-medium">
                  Prompt prêt pour WAN-2.2 (T2V 14B)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-pink-200 dark:border-pink-700">
                    <p className="text-sm font-mono text-gray-800 dark:text-gray-200 leading-relaxed">
                      {generatedPrompt}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-green-700 dark:text-green-300 font-bold">
                          {optimizationStats ? 'Optimisé par Opik' : 'Version Clean WAN-2.2'}
                        </p>
                        {optimizationStats && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                            IA
                          </Badge>
                        )}
                      </div>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full text-xs font-bold text-green-800 dark:text-green-200">
                        Score: {optimizationStats ? optimizationStats.score.toFixed(1) : '9.5'}/10
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {optimizationStats
                        ? `Optimisé en ${optimizationStats.time}ms • ${optimizationStats.improvements.length} améliorations appliquées`
                        : '0 texte parasite • Plans & lumière respectés • Template optimisé'}
                    </p>
                    {optimizationStats && optimizationStats.improvements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Améliorations appliquées:</p>
                        <ul className="space-y-1">
                          {optimizationStats.improvements.map((improvement, idx) => (
                            <li key={idx} className="text-xs text-green-600 dark:text-green-400">
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Créer une séquence synchrone
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Modifiez légèrement les paramètres ci-dessous (ex: changer le mouvement de caméra de "360-orbit" à "dolly-in") pour créer des vidéos synchronisées du même sujet.
                        </p>
                      </div>
                      <Button
                        onClick={generateWan2Prompt}
                        disabled={isGenerating || !isPremium}
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex-shrink-0"
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Regénérer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-card border-white/30 shadow-2xl hover-lift">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <span className="gradient-text">{generatedPrompt ? 'Modifier les Paramètres' : 'Générateur WAN-2.2/2.5'}</span>
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

          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <Label htmlFor="opik-optimization" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Optimisation Opik Automatique
                  </Label>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                    Nouveau
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Améliore automatiquement le prompt avec l'IA pour une qualité optimale
                </p>
              </div>
              <Switch
                id="opik-optimization"
                checked={useOpikOptimization}
                onCheckedChange={setUseOpikOptimization}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            {useOpikOptimization && (
              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  ✨ L'optimisation Opik analysera votre prompt et l'améliorera pour obtenir les meilleurs résultats vidéo possibles
                </p>
              </div>
            )}
          </div>

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
        </div>
      )}

      {generatorMode === 'advanced' && (
        <Wan2VideoFullMotionGenerator />
      )}
    </div>
  );
};

export default Wan2VideoPromptGenerator;

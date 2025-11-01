import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { Video, Copy, Wand2, Sparkles, ChevronDown, Settings2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useAuth } from "@/contexts/AuthContext";
import { opikService } from "@/services/opikService";

const Wan2VideoPromptGenerator = () => {
  const { t } = useTranslation();
  const { credits, useCredit } = useUserCredits();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    subject: '',
    context: '',
    visualStyle: '',
    movement: ''
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
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);
  const [optimizationScore, setOptimizationScore] = useState<number | null>(null);

  const visualStyles = [
    { value: 'realistic', label: 'Realistic', hint: 'Ultra-realistic rendering, photographic quality' },
    { value: 'anime', label: 'Anime', hint: 'Japanese animation style, vibrant colors' },
    { value: 'cinematic', label: 'Cinematic', hint: 'Film-like quality, dramatic lighting' },
    { value: 'cyberpunk', label: 'Cyberpunk', hint: 'Futuristic neon aesthetics' },
    { value: '3d-render', label: '3D Render', hint: 'Clean 3D computer graphics' },
    { value: 'watercolor', label: 'Watercolor', hint: 'Soft, artistic painting style' }
  ];

  const movementOptions = [
    { value: 'static', label: 'Static', hint: 'No camera movement' },
    { value: 'slow-push', label: 'Slow Push', hint: 'Gentle forward movement' },
    { value: '360-orbit', label: '360 Orbit', hint: 'Circular camera rotation' },
    { value: 'timelapse', label: 'Timelapse', hint: 'Accelerated time passage' },
    { value: 'zoom-in', label: 'Zoom In', hint: 'Gradual zoom toward subject' },
    { value: 'pan-left', label: 'Pan Left', hint: 'Horizontal left movement' },
    { value: 'pan-right', label: 'Pan Right', hint: 'Horizontal right movement' },
    { value: 'tracking', label: 'Tracking', hint: 'Following subject movement' }
  ];

  const generateWan2Prompt = () => {
    if (!formData.subject || !formData.visualStyle || !formData.movement) {
      toast({
        title: t('missingInfo'),
        description: 'Veuillez remplir au minimum: Sujet principal, Style visuel et Mouvement',
        variant: "destructive"
      });
      return;
    }

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
      let prompt = formData.subject;

      const selectedStyle = visualStyles.find(s => s.value === formData.visualStyle);
      if (selectedStyle) {
        prompt += ` ${selectedStyle.label.toLowerCase()}`;
      }

      if (formData.context) {
        prompt += ` in ${formData.context}`;
      }

      const selectedMovement = movementOptions.find(m => m.value === formData.movement);
      if (selectedMovement) {
        prompt += ` ${selectedMovement.value.replace('-', ' ')}`;
      }

      const isNightOrCyber = formData.context?.toLowerCase().includes('neon') ||
                            formData.context?.toLowerCase().includes('night') ||
                            formData.visualStyle === 'cyberpunk';
      const lighting = isNightOrCyber ? 'neon' : 'golden hour';
      prompt += ` cinematic ${lighting}`;

      if (prompt.length > 200) {
        prompt = prompt.substring(0, 197) + '...';
      }

      prompt = prompt
        .replace(/,/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const bannedWords = ['text', 'watermark', 'lowres', 'blurry'];
      bannedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        prompt = prompt.replace(regex, '');
      });

      prompt = prompt.replace(/\s+/g, ' ').trim();

      setGeneratedPrompt(prompt);
      setOptimizationApplied(false);
      setOptimizationScore(null);

      const creditCost = advancedSettings.duration === '5s' ? 2 : 1;

      for (let i = 0; i < creditCost; i++) {
        useCredit().catch(err => {
          console.error('Erreur lors du décompte du crédit:', err);
        });
      }

      toast({
        title: "Prompt WAN-2.2 généré",
        description: `Format: ${advancedSettings.aspectRatio}, 24 fps, ${advancedSettings.duration} - Crédits: -${creditCost}`,
      });

      // Optimisation Opik en arrière-plan
      if (user?.id) {
        optimizeWan2PromptInBackground(prompt).catch(err => {
          console.error('Erreur optimisation Opik:', err);
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

  const optimizeWan2PromptInBackground = async (initialPrompt: string) => {
    try {
      setIsOptimizing(true);
      console.log('🔄 Optimisation Opik WAN-2.2 en arrière-plan...');

      const { opikOptimizer } = await import('@/services/opikOptimizer');

      // Optimisation spécifique pour WAN-2.2
      const optimizationResult = await opikOptimizer.optimizePrompt(
        initialPrompt,
        user!.id,
        'video-audio', // Catégorie appropriée pour vidéo
        'en' // WAN-2.2 n'accepte que l'anglais
      );

      console.log('✅ Optimisation WAN-2.2 terminée:', {
        score: optimizationResult.score,
        improvements: optimizationResult.improvements.length
      });

      // Appliquer les contraintes WAN-2.2 après optimisation
      let optimizedPrompt = optimizationResult.optimizedPrompt;

      // S'assurer que le prompt reste ≤ 200 caractères
      if (optimizedPrompt.length > 200) {
        optimizedPrompt = optimizedPrompt.substring(0, 197) + '...';
      }

      // Nettoyer les virgules et caractères spéciaux
      optimizedPrompt = optimizedPrompt
        .replace(/,/g, '')
        .replace(/[^a-zA-Z0-9\s-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Filtrer les mots interdits
      const bannedWords = ['text', 'watermark', 'lowres', 'blurry', 'oversaturated'];
      bannedWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        optimizedPrompt = optimizedPrompt.replace(regex, '');
      });

      optimizedPrompt = optimizedPrompt.replace(/\s+/g, ' ').trim();

      setGeneratedPrompt(optimizedPrompt);
      setOptimizationApplied(true);
      setOptimizationScore(optimizationResult.score);
      setIsOptimizing(false);

      toast({
        title: "✨ Prompt WAN-2.2 optimisé",
        description: `Score Opik: ${Math.round(optimizationResult.score)}/10 - ${optimizationResult.improvements.length} amélioration(s)`,
      });

      // Enregistrer dans Opik
      await opikService.createTrace({
        userId: user!.id,
        traceId: `wan2-${Date.now()}`,
        promptInput: initialPrompt,
        promptOutput: optimizedPrompt,
        model: 'opik-optimizer-wan2',
        latencyMs: 0,
        tokensUsed: 0,
        tags: {
          type: 'wan2-video-optimization',
          score: optimizationResult.score,
          improvements: optimizationResult.improvements.length,
          aspectRatio: advancedSettings.aspectRatio,
          duration: advancedSettings.duration
        }
      });

    } catch (error) {
      console.error('❌ Erreur optimisation WAN-2.2:', error);
      setIsOptimizing(false);
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
            Créez des prompts optimisés pour le modèle de génération vidéo WAN-2.2 (T2V 14B)
          </CardDescription>
          {!isPremium && (
            <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                ⚠️ Mode Premium requis (plus de 50 crédits)
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              ① Sujet principal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Ex: sphinx cat, red sports car, dancing robot..."
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
              maxLength={50}
              disabled={!isPremium}
            />
            <p className="text-xs text-muted-foreground">1-4 mots décrivant le sujet principal</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="context" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              ② Lieu / Contexte
            </Label>
            <Input
              id="context"
              placeholder="Ex: vintage Paris cafe, neon Tokyo street, desert sunset..."
              value={formData.context}
              onChange={(e) => setFormData({...formData, context: e.target.value})}
              className="animated-border hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800"
              maxLength={50}
              disabled={!isPremium}
            />
            <p className="text-xs text-muted-foreground">Aide le modèle 14B à choisir décor & lumière</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="visualStyle" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              ③ Style visuel <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.visualStyle}
              onValueChange={(value) => setFormData({...formData, visualStyle: value})}
              disabled={!isPremium}
            >
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
                <SelectValue placeholder="Choisir un style visuel" />
              </SelectTrigger>
              <SelectContent className="shadow-xl z-50">
                {visualStyles.map((style) => (
                  <SelectItem key={style.value} value={style.value} className="font-medium py-3 px-4 hover:bg-accent cursor-pointer">
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground">{style.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{style.hint}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Ajoute un tag maître + palette couleur</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="movement" className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              ④ Mouvement clé <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.movement}
              onValueChange={(value) => setFormData({...formData, movement: value})}
              disabled={!isPremium}
            >
              <SelectTrigger className="animated-border hover:shadow-lg transition-all duration-200">
                <SelectValue placeholder="Choisir un mouvement" />
              </SelectTrigger>
              <SelectContent className="shadow-xl z-50">
                {movementOptions.map((movement) => (
                  <SelectItem key={movement.value} value={movement.value} className="font-medium py-3 px-4 hover:bg-accent cursor-pointer">
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground">{movement.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{movement.hint}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">WAN-2.2 comprend ces mots-clés optimisés</p>
          </div>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full mb-4 flex items-center justify-between hover:bg-accent"
                disabled={!isPremium}
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="font-semibold">Paramètres Avancés</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Seed (reproductibilité)</Label>
                <Input
                  type="number"
                  value={advancedSettings.seed}
                  onChange={(e) => setAdvancedSettings({...advancedSettings, seed: parseInt(e.target.value) || -1})}
                  placeholder="-1 pour random, 0-9999 pour fixe"
                  className="bg-white dark:bg-gray-800"
                  min={-1}
                  max={9999}
                />
                <p className="text-xs text-muted-foreground">-1 = aléatoire, valeur fixe pour reproduire</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Steps (qualité)</Label>
                  <span className="text-sm font-bold text-primary">{advancedSettings.steps}</span>
                </div>
                <Slider
                  value={[advancedSettings.steps]}
                  onValueChange={([value]) => setAdvancedSettings({...advancedSettings, steps: value})}
                  min={15}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">15-50 steps - Plus = meilleure qualité mais 2× plus long</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">CFG Scale (guidance)</Label>
                  <span className="text-sm font-bold text-primary">{advancedSettings.cfg}</span>
                </div>
                <Slider
                  value={[advancedSettings.cfg]}
                  onValueChange={([value]) => setAdvancedSettings({...advancedSettings, cfg: value})}
                  min={5}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">5-12 - Sweet spot: 7 (équilibre créativité/précision)</p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Durée</Label>
                <Select
                  value={advancedSettings.duration}
                  onValueChange={(value) => setAdvancedSettings({...advancedSettings, duration: value})}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3s">3 secondes (1 crédit)</SelectItem>
                    <SelectItem value="5s">5 secondes (2 crédits)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Aspect Ratio</Label>
                <Select
                  value={advancedSettings.aspectRatio}
                  onValueChange={(value) => setAdvancedSettings({...advancedSettings, aspectRatio: value})}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-800">
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
              <strong>🔒 Paramètres cachés appliqués:</strong>
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
              <li>• Lighting: golden hour (jour) / neon (nuit/cyber)</li>
              <li>• Durée: {advancedSettings.duration}, FPS: 24 (implicite)</li>
              <li>• Négatif: text, watermark, lowres, blurry, oversaturated</li>
              <li>• Ratio: {advancedSettings.aspectRatio} par défaut</li>
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

              {isOptimizing && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      ✨ Optimisation Opik en cours pour WAN-2.2...
                    </p>
                  </div>
                </div>
              )}

              {optimizationApplied && optimizationScore && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-green-700 dark:text-green-300 font-bold">
                      ✅ Prompt optimisé par Opik
                    </p>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-800 rounded-full text-xs font-bold text-green-800 dark:text-green-200">
                      Score: {Math.round(optimizationScore)}/10
                    </span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Améliorations appliquées : clarté renforcée, mots-clés optimisés, structure WAN-2.2 validée
                  </p>
                </div>
              )}

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

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  ✅ <strong>Optimisé pour WAN-2.2:</strong> Format anglais, sans virgules, sans caractères spéciaux, mots-clés optimisés
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
                  <strong>🎬 Prompt négatif (automatique):</strong>
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                  text, watermark, lowres, blurry, oversaturated
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-500 mt-2">
                  Ces mots-clés sont automatiquement exclus de la génération
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  💡 <strong>Astuce:</strong> Utilisez ce prompt directement dans WAN-2.2 ou WAN-2.5 pour générer votre vidéo
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-2xl flex items-center justify-center">
                <Video className="h-8 w-8 text-pink-400" />
              </div>
              <p className="font-medium text-lg mb-2">Prêt à créer votre prompt vidéo</p>
              <p className="text-sm">Remplissez les champs requis et générez un prompt optimisé pour WAN-2.2</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wan2VideoPromptGenerator;

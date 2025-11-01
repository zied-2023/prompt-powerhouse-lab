import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Video, Copy, Wand2, Sparkles } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCredits } from "@/hooks/useUserCredits";

const Wan2VideoPromptGenerator = () => {
  const { t } = useTranslation();
  const { credits, useCredit } = useUserCredits();

  const [formData, setFormData] = useState({
    subject: '',
    context: '',
    visualStyle: '',
    movement: ''
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

      prompt += ' cinematic lighting';

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

      useCredit().catch(err => {
        console.error('Erreur lors du décompte du crédit:', err);
      });

      toast({
        title: "Prompt WAN-2.2 généré",
        description: `Format: 16:9, 24 fps, 3s - Crédits restants: ${creditsRemaining - 1}`,
      });

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
                Générer Prompt WAN-2.2
              </>
            )}
          </Button>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              <strong>Format automatique:</strong> 16:9 aspect ratio, 24 fps, 3s duration
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              <strong>Règles appliquées:</strong> 1 phrase, ≤200 caractères, anglais, sans virgules, sans caractères spéciaux
            </p>
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

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Longueur</p>
                  <p className="font-bold text-lg">{generatedPrompt.length} / 200</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Format</p>
                  <p className="font-bold text-lg">16:9</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">FPS</p>
                  <p className="font-bold text-lg">24 fps</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-muted-foreground">Durée</p>
                  <p className="font-bold text-lg">3 sec</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  ✅ <strong>Optimisé pour WAN-2.2:</strong> Format anglais, sans virgules, sans caractères spéciaux, mots-clés optimisés
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-2">
                  <strong>🎬 Mots-clés interdits filtrés:</strong>
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  text, watermark, lowres, blurry - automatiquement supprimés
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

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Copy, CheckCircle, Save, ArrowLeft, Sparkles, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import ThemeSelector from '@/components/ThemeSelector';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { AuthButtons } from '@/components/auth/AuthButtons';
import { usePrompts } from '@/hooks/usePrompts';
import { useUserCredits } from '@/hooks/useUserCredits';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

// Configuration API - Mistral
const API_CONFIG = {
  endpoint: 'https://api.mistral.ai/v1/chat/completions',
  key: '9rLgitb0iaYKdmdRzrkQhuAOBLldeJrj',
  model: 'mistral-large-latest'
};

const SimplePromptGenerator = () => {
  const [objective, setObjective] = useState('');
  const [tone, setTone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const { savePrompt, isSaving } = usePrompts();
  const { credits, useCredit, isLoading: creditsLoading } = useUserCredits();
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toneOptions = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'casual', label: 'Décontracté' },
    { value: 'friendly', label: 'Amical' },
    { value: 'formal', label: 'Formel' },
    { value: 'creative', label: 'Créatif' },
    { value: 'persuasive', label: 'Persuasif' },
    { value: 'technical', label: 'Technique' },
    { value: 'educational', label: 'Éducatif' }
  ];

  const generatePrompt = async () => {
    if (!objective.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner votre objectif",
        variant: "destructive"
      });
      return;
    }

    // Le générateur est maintenant libre d'utilisation
    // Pas de vérification d'authentification ou de crédits requise

    setIsLoading(true);
    
    try {
      // Construction du prompt pour l'API Mistral
      let userPrompt = `Je veux créer un prompt optimisé pour atteindre cet objectif: "${objective}"`;
      
      if (tone) {
        const selectedTone = toneOptions.find(t => t.value === tone);
        userPrompt += `\n\nTon souhaité: ${selectedTone?.label}`;
      }
      
      userPrompt += `\n\nVeuillez créer un prompt clair, précis et efficace qui m'aidera à atteindre cet objectif. Le prompt doit être directement utilisable.`;

      const response = await fetch(API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en création de prompts. Tu dois créer des prompts clairs, précis et efficaces. Réponds directement avec le prompt optimisé, sans préambule ni explication supplémentaire.'
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 402) {
          throw new Error('La clé API n\'a plus de crédits disponibles. Veuillez recharger votre compte Mistral.');
        }
        
        throw new Error(`Erreur API: ${response.status} - ${errorData.error?.message || errorData.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        setResult(data.choices[0].message.content);
        toast({
          title: "Succès",
          description: "Prompt généré avec succès !",
          variant: "default"
        });
      } else {
        throw new Error('Réponse API invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      
      let errorMessage = "Une erreur est survenue lors de la génération";
      if (error.message.includes('crédits')) {
        errorMessage = "La clé API n'a plus de crédits. Rechargez votre compte Mistral.";
      } else if (error.message.includes('connexion')) {
        errorMessage = "Vérifiez votre connexion internet.";
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copié",
        description: "Le prompt a été copié dans le presse-papiers",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive"
      });
    }
  };

  const handleSavePrompt = async () => {
    if (!result) {
      toast({
        title: "Aucun prompt à sauvegarder",
        description: "Générez d'abord un prompt avant de le sauvegarder",
        variant: "destructive"
      });
      return;
    }

    const selectedTone = toneOptions.find(t => t.value === tone);
    let title = "Prompt Simple";
    if (selectedTone) {
      title += ` - ${selectedTone.label}`;
    }

    await savePrompt({
      title: title,
      content: result,
      description: objective,
      category: 'simple-generation',
      tags: [tone].filter(Boolean)
    });
  };

  return (
    <>
      <SEOHead 
        title="Générateur de Prompts IA Simple - AutoPrompt"
        description="Créez des prompts IA optimisés rapidement avec notre générateur simple. Interface intuitive, différents tons disponibles, sauvegarde et copie facile."
        keywords="générateur prompt, IA simple, création prompt rapide, optimisation prompt, assistant IA, générateur contenu"
      />
      <div className={`min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header professionnel */}
        <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <Link to="/" className={`flex items-center hover:opacity-80 transition-opacity ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <img 
                    src="/lovable-uploads/4bfcbfae-c46b-471e-8938-d07bd52b4db2.png" 
                    alt="AutoPrompt Logo" 
                    className="h-10 w-10 object-contain"
                  />
                  <span className="text-xl font-display font-bold gradient-text">AutoPrompt</span>
                </Link>
              </div>
              
              <nav className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
                <Link to="/" className="text-sm font-bold text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent border border-border">
                  {t('home')}
                </Link>
              </nav>
              
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <ThemeSelector />
                <LanguageSelector />
                <AuthButtons />
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span>•</span>
              <span className="text-foreground">Générateur Simple</span>
            </nav>

            {/* Hero Section */}
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-full border border-violet-200 dark:border-violet-700 mb-4">
                <Sparkles className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-300" />
                <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                  {t('simpleGeneratorBadge')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text leading-tight">
                {t('createPrompts')}
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  {t('efficient')}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('transformIdeas')}
              </p>
            </div>

            {/* Formulaire de génération */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-xl animate-fade-in">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-display font-bold text-foreground">{t('promptConfiguration')}</CardTitle>
                <CardDescription className="text-base">
                  {t('promptConfigurationDesc')}
                </CardDescription>
              </CardHeader>
          <CardContent className="space-y-4">
            {/* Zone objectif */}
            <div className="space-y-2">
              <Label htmlFor="objective" className="text-sm font-medium text-foreground">
                {t('whatObjective')} *
              </Label>
              <Textarea
                id="objective"
                placeholder="Décrivez ce que vous souhaitez accomplir avec ce prompt..."
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="min-h-[120px] bg-input text-foreground border-border"
                disabled={isLoading}
              />
            </div>

            {/* Sélecteur de ton/style */}
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-sm font-medium text-foreground">
                {t('toneStyleOptional')}
              </Label>
              <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                <SelectTrigger className="bg-input text-foreground border-border">
                  <SelectValue placeholder={t('selectTone')} />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section libre d'utilisation */}
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                {t('freeGenerator')}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                {t('noConnectionRequired')}
              </div>
            </div>

            {/* Bouton générer */}
            <Button 
              onClick={generatePrompt}
              disabled={isLoading || !objective.trim()}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                t('generatePrompt')
              )}
            </Button>
          </CardContent>
        </Card>

            {/* Zone de résultat */}
            {(result || isLoading) && (
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 shadow-xl animate-scale-in">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl font-display font-bold text-foreground">
                    {result && <CheckCircle className="h-6 w-6 text-green-500" />}
                    {t('optimizedPrompt')}
                  </CardTitle>
                  {result && (
                    <CardDescription>
                      {t('promptGeneratedSuccess')}
                    </CardDescription>
                  )}
                </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-muted-foreground">Génération de votre prompt personnalisé...</span>
                  </div>
                </div>
                ) : result ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-xl border border-violet-200/50 dark:border-violet-700/50">
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-foreground font-mono leading-relaxed text-base bg-transparent border-none p-0 m-0">
                          {result}
                        </pre>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline" 
                        size="lg"
                        className="flex items-center gap-2 border-violet-200 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                      >
                        <Copy className="h-4 w-4" />
                        {t('copyPrompt')}
                      </Button>
                    </div>
                  </div>
              ) : null}
              </CardContent>
            </Card>
          )}

          {/* Section d'aide */}
          <Card className="bg-gradient-to-r from-violet-600/10 to-blue-600/10 backdrop-blur-sm border-violet-200/50 dark:border-violet-700/50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">{t('needMoreFeatures')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('needMoreFeaturesDesc')}
              </p>
              <Button 
                variant="outline" 
                disabled 
                className="border-muted-foreground/20 text-muted-foreground cursor-not-allowed opacity-50"
                onClick={() => toast({
                  title: "Fonctionnalité non disponible",
                  description: "Le mode avancé n'est pas accessible depuis cette interface",
                  variant: "destructive"
                })}
              >
                <Lock className="h-4 w-4 mr-2" />
                {t('exploreAdvanced')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-8 animate-float">
        <div className="w-12 h-12 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
      </div>
      <div className="fixed bottom-1/4 right-12 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  </>
  );
};

export default SimplePromptGenerator;
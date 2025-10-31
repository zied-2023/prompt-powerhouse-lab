import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader as Loader2, Copy, CircleCheck as CheckCircle, Save, ArrowLeft, Sparkles, Lock } from 'lucide-react';
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
import { detectLanguage } from '@/lib/languageDetector';

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
  const [dailyUsage, setDailyUsage] = useState(0);
  const { toast } = useToast();
  const { savePrompt, isSaving } = usePrompts();
  const { credits, useCredit, isLoading: creditsLoading } = useUserCredits();
  const { language, isRTL } = useLanguage();
  const { t } = useTranslation();

  const DAILY_LIMIT = 5;

  // Fonction pour gérer la limite quotidienne
  const checkDailyLimit = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('autoprompt_daily_usage');
    
    if (storedData) {
      const { date, count } = JSON.parse(storedData);
      if (date === today) {
        return count;
      }
    }
    
    // Nouveau jour, réinitialiser le compteur
    localStorage.setItem('autoprompt_daily_usage', JSON.stringify({ date: today, count: 0 }));
    return 0;
  };

  const incrementDailyUsage = () => {
    const today = new Date().toDateString();
    const currentCount = checkDailyLimit();
    const newCount = currentCount + 1;
    localStorage.setItem('autoprompt_daily_usage', JSON.stringify({ date: today, count: newCount }));
    setDailyUsage(newCount);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        setUser(session?.user ?? null);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    initializeAuth();
    setDailyUsage(checkDailyLimit());

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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

    // Vérifier la limite quotidienne pour les utilisateurs non connectés
    if (!user) {
      const currentUsage = checkDailyLimit();
      if (currentUsage >= DAILY_LIMIT) {
        toast({
          title: "Limite quotidienne atteinte",
          description: `Vous avez atteint la limite de ${DAILY_LIMIT} prompts par jour. Connectez-vous pour un accès illimité.`,
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Détecter d'abord la langue de l'objectif (ce que l'utilisateur a écrit)
      const detectedLanguage = detectLanguage(objective);

      // PRIORITÉ: Si l'objectif est dans une langue différente du français, utiliser la langue détectée
      // Cela permet à un utilisateur anglophone/arabophone d'écrire dans sa langue et d'obtenir un prompt dans cette langue
      // même si l'interface est en français
      const effectiveLanguage = (detectedLanguage && detectedLanguage !== 'fr')
        ? detectedLanguage
        : language;

      console.log('🌍 Langue du sélecteur:', language);
      console.log('🔍 Langue détectée dans l\'objectif:', detectedLanguage);
      console.log('✅ Langue finale utilisée:', effectiveLanguage);
      console.log('📝 Objectif:', objective.substring(0, 50));

      // Construction du prompt pour l'API Mistral DANS LA LANGUE DÉTECTÉE
      let userPrompt = '';

      if (effectiveLanguage === 'fr') {
        userPrompt = `Je veux créer un prompt optimisé pour atteindre cet objectif: "${objective}"`;
        if (tone) {
          const selectedTone = toneOptions.find(t => t.value === tone);
          userPrompt += `\n\nTon souhaité: ${selectedTone?.label}`;
        }
        userPrompt += `\n\nVeuillez créer un prompt clair, précis et efficace qui m'aidera à atteindre cet objectif. Le prompt doit être directement utilisable.`;
      } else if (effectiveLanguage === 'ar') {
        userPrompt = `أريد إنشاء مطالبة محسّنة لتحقيق هذا الهدف: "${objective}"`;
        if (tone) {
          const selectedTone = toneOptions.find(t => t.value === tone);
          userPrompt += `\n\nالأسلوب المطلوب: ${selectedTone?.label}`;
        }
        userPrompt += `\n\nالرجاء إنشاء مطالبة واضحة ودقيقة وفعالة تساعدني على تحقيق هذا الهدف. يجب أن تكون المطالبة قابلة للاستخدام مباشرة.`;
      } else {
        userPrompt = `I want to create an optimized prompt to achieve this objective: "${objective}"`;
        if (tone) {
          const selectedTone = toneOptions.find(t => t.value === tone);
          userPrompt += `\n\nDesired tone: ${selectedTone?.label}`;
        }
        userPrompt += `\n\nPlease create a clear, precise and effective prompt that will help me achieve this objective. The prompt must be directly usable.`;
      }

      const systemPromptContent = effectiveLanguage === 'fr'
        ? 'Tu es un expert en création de prompts. Tu dois créer des prompts clairs, précis et efficaces. Réponds directement avec le prompt optimisé, sans préambule ni explication supplémentaire.'
        : effectiveLanguage === 'ar'
        ? 'أنت خبير في إنشاء المطالبات. يجب عليك إنشاء مطالبات واضحة ودقيقة وفعالة. رد مباشرة بالمطالبة المحسّنة، بدون مقدمة أو شرح إضافي.'
        : 'You are an expert in creating prompts. You must create clear, precise and effective prompts. Respond directly with the optimized prompt, without preamble or additional explanation.';

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
              content: systemPromptContent
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
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
        
        // Incrémenter le compteur uniquement pour les utilisateurs non connectés
        if (!user) {
          incrementDailyUsage();
        }
        
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
        title={`${t('promptGeneratorTitle')} - AutoPrompt`}
        description={t('promptGeneratorDesc')}
        keywords="générateur prompt, IA simple, création prompt rapide, optimisation prompt, assistant IA, générateur contenu"
      />
      <div className={`min-h-screen bg-[#1a1a2e] ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header professionnel */}
        <header className="bg-[#16213e]/90 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className={`flex items-center justify-between`}>
              {/* Logo et titre à gauche */}
              <Link to="/" className={`flex items-center hover:opacity-80 transition-opacity ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <img 
                  src="/logo.png" 
                  alt="AutoPrompt Logo" 
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-display font-bold text-white">AutoPrompt</span>
              </Link>
              
              {/* Navigation et contrôles à droite */}
              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                <nav className={`flex items-center ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
                  <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-800">
                    {t('generator')}
                  </Link>
                  <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-800">
                    Templates
                  </Link>
                  <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-800">
                    {t('library')}
                  </Link>
                  <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-gray-800">
                    {t('marketplace')}
                  </Link>
                </nav>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span>Crédit: {credits?.remaining_credits || 15}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-500">😊</span>
                    <span>1600M 2</span>
                  </span>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium">
                  Upgrade Pro
                </Button>
                <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <span className="text-sm">Francai²</span>
                </button>
                <button className="text-gray-300 hover:text-white">
                  <span className="text-xl">⚙️</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                {t('promptGeneratorTitle')}
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {t('promptGeneratorDesc')}
              </p>
            </div>

            {/* Layout à 2 colonnes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formulaire à gauche */}
              <Card className="bg-[#16213e]/60 backdrop-blur-sm border-gray-800 shadow-xl">
                <CardContent className="space-y-4 pt-6">
                  {/* Mode express + Générer un exemple */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mode" className="text-sm font-medium text-gray-300">
                        Mode express:
                      </Label>
                      <Input
                        id="mode"
                        value=""
                        placeholder=""
                        className="bg-[#0f1627] text-white border-gray-700"
                        disabled
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" className="w-full bg-[#0f1627] text-gray-300 border-gray-700 hover:bg-gray-800">
                        ✨ Générer un exemple
                      </Button>
                    </div>
                  </div>

                  {/* Categorie */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-300">
                      Categorie:
                    </Label>
                    <Select value="marketing" disabled>
                      <SelectTrigger className="bg-[#0f1627] text-white border-gray-700">
                        <SelectValue placeholder="Markéting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marketing">Markéting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Objectif */}
                  <div className="space-y-2">
                    <Label htmlFor="objective" className="text-sm font-medium text-gray-300">
                      Objectif:
                    </Label>
                    <Input
                      id="objective"
                      placeholder="Rédigez un pitch pour une startup d'IA"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      className="bg-[#0f1627] text-white border-gray-700"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Public cible */}
                  <div className="space-y-2">
                    <Label htmlFor="audience" className="text-sm font-medium text-gray-300">
                      Public cible:
                    </Label>
                    <Input
                      id="audience"
                      placeholder="Investisseurs"
                      value="Investisseurs"
                      className="bg-[#0f1627] text-white border-gray-700"
                      disabled
                    />
                  </div>

                  {/* Format */}
                  <div className="space-y-2">
                    <Label htmlFor="format" className="text-sm font-medium text-gray-300">
                      Format:
                    </Label>
                    <Select value={tone} onValueChange={setTone} disabled={isLoading}>
                      <SelectTrigger className="bg-[#0f1627] text-white border-gray-700">
                        <SelectValue placeholder="Bullét póints" />
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

                  {/* Tonalité */}
                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-sm font-medium text-gray-300">
                      Tonalité:
                    </Label>
                    <Select value="professional" disabled>
                      <SelectTrigger className="bg-[#0f1627] text-white border-gray-700">
                        <SelectValue placeholder="Professionnel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professionnel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Bouton générer */}
                  <Button
                    onClick={generatePrompt}
                    disabled={isLoading || !objective.trim() || (!user && dailyUsage >= DAILY_LIMIT)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Génération en cours...
                      </>
                    ) : (
                      "Générer avec l'IA"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Zone de résultat à droite */}
              <Card className="bg-[#16213e]/60 backdrop-blur-sm border-gray-800 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-white">
                    Prompt généré par l'IA
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Votre prompt optimisé est prêt à être utilisé
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                        <span className="text-gray-400">Génération de votre prompt personnalisé...</span>
                      </div>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      {/* Badge optimisation */}
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                        <span className="text-yellow-400">⚡</span>
                        <span className="text-sm text-gray-300">Optimisé pour GPT-5 | Claude</span>
                      </div>

                      {/* Contenu du prompt */}
                      <div className="bg-[#0f1627] rounded-lg border border-gray-800 p-6 space-y-4">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed text-sm bg-transparent border-none p-0 m-0">
                            {result}
                          </pre>
                        </div>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex gap-3">
                        <Button
                          onClick={copyToClipboard}
                          variant="outline"
                          className="flex-1 bg-[#0f1627] text-gray-300 border-gray-700 hover:bg-gray-800"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copier
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 bg-[#0f1627] text-gray-300 border-gray-700 hover:bg-gray-800"
                        >
                          Tester dans GPT-5
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl flex items-center justify-center border border-gray-800">
                        <Sparkles className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="font-medium text-lg mb-2 text-gray-300">Prêt pour la génération</p>
                      <p className="text-sm text-gray-500">L'IA créera un prompt optimisé pour vous</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
      </main>

    </div>
  </>
  );
};

export default SimplePromptGenerator;

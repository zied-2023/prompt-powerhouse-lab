// hooks/useTranslation.ts - Hook de traduction corrigé
import { useState, useEffect, createContext, useContext } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Créer le contexte de traduction
export const TranslationContext = createContext<TranslationContextType | null>(null);

// Provider de traduction
export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('fr'); // Défaut français

  const t = (key: string): string => {
    const translation = translations[language];
    if (!translation) return key;
    return (translation as any)[key] || key;
  };

  // Sauvegarder la langue dans localStorage (si supporté)
  useEffect(() => {
    const savedLang = localStorage.getItem('app-language');
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Hook useTranslation corrigé
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Ton fichier translations.ts reste le même
const translations = {
  fr: {
    multiStepTitle: "Constructeur de Prompt Multi-Étapes",
    multiStepDesc: "Créer des prompts complexes avec des étapes guidées",
    // ... reste de tes traductions françaises
  },
  en: {
    multiStepTitle: "Multi-Step Prompt Builder",
    multiStepDesc: "Create complex prompts with guided steps",
    // ... reste de tes traductions anglaises
  },
  ar: {
    multiStepTitle: "منشئ النص التوجيهي متعدد الخطوات",
    multiStepDesc: "إنشاء نصوص توجيهية معقدة بخطوات موجهة",
    // ... reste de tes traductions arabes
  }
};

// AdvancedPromptBuilder.tsx - Version corrigée
import React, { useState } from 'react';
import { useTranslation } from "@/hooks/useTranslation";
// ... autres imports

const AdvancedPromptBuilder = () => {
  const { t, language } = useTranslation(); // Ajouter 'language' pour forcer le re-render
  
  // ... reste de ton code

  return (
    <div className="space-y-8">
      {/* En-tête avec traduction dynamique */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30 bg-gradient-to-r from-violet-50/50 to-purple-50/50 dark:from-violet-900/20 dark:to-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                {/* Key: utiliser les clés exactes du fichier translations */}
                <CardTitle className="text-xl gradient-text">
                  {t('multiStepTitle')}
                </CardTitle>
                <CardDescription>
                  {t('multiStepDesc')}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              <Sparkles className="h-3 w-3 mr-1" />
              {language === 'fr' ? 'Avancé' : language === 'en' ? 'Advanced' : 'متقدم'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Onglets avec traductions */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="templates">
            <Layers className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Templates' : language === 'en' ? 'Templates' : 'قوالب'}
          </TabsTrigger>
          <TabsTrigger value="builder">
            <Target className="h-4 w-4 mr-2" />
            {language === 'fr' ? 'Constructeur' : language === 'en' ? 'Builder' : 'منشئ'}
          </TabsTrigger>
          {/* ... autres onglets */}
        </TabsList>

        {/* Contenu des onglets reste identique */}
      </Tabs>
    </div>
  );
};

export default AdvancedPromptBuilder;

// App.tsx - Wrapper principal avec le provider
import { TranslationProvider } from '@/hooks/useTranslation';

function App() {
  return (
    <TranslationProvider>
      {/* Ton app ici */}
      <AdvancedPromptBuilder />
    </TranslationProvider>
  );
}

// Composant sélecteur de langue
export const LanguageSelector = () => {
  const { language, setLanguage, t } = useTranslation();
  
  return (
    <div className="flex gap-2">
      <Button 
        variant={language === 'fr' ? 'default' : 'outline'}
        onClick={() => setLanguage('fr')}
        size="sm"
      >
        🇫🇷 {t('french')}
      </Button>
      <Button 
        variant={language === 'en' ? 'default' : 'outline'}
        onClick={() => setLanguage('en')}
        size="sm"
      >
        🇬🇧 {t('english')}
      </Button>
      <Button 
        variant={language === 'ar' ? 'default' : 'outline'}
        onClick={() => setLanguage('ar')}
        size="sm"
      >
        🇸🇦 {t('arabic')}
      </Button>
    </div>
  );
};
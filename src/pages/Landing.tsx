import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Génération Intelligente",
      description: "Créez des prompts optimisés avec l'IA"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Multi-étapes Avancé",
      description: "Construisez des workflows complexes"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Bibliothèque Complète",
      description: "Accédez à des milliers de templates"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Amélioration Continue",
      description: "Optimisez vos résultats automatiquement"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-violet-600 to-blue-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">PromptCraft</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeSelector />
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-full border border-violet-200 dark:border-violet-700 mb-8">
              <Sparkles className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-300" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                Plateforme de Génération de Prompts IA
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 gradient-text leading-tight">
              Créez des Prompts
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Parfaits
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Transformez vos idées en prompts optimisés grâce à notre plateforme alimentée par l'IA. 
              Générez, améliorez et organisez vos prompts comme jamais auparavant.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              onClick={() => navigate('/generator')}
              className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
            >
              Commencer Maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            {/* Secondary CTA */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                Aucune inscription requise • Accès immédiat à tous les outils
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 mt-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 gradient-text">
              Tout ce dont vous avez besoin
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-2"
                >
                  <div className="p-3 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-violet-600 dark:text-violet-300">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="container mx-auto px-4 mt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-8 bg-card/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg w-fit">
                    <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">Génération Simple</h4>
                  <p className="text-sm text-muted-foreground">Interface intuitive pour créer rapidement</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg w-fit">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">Mode Avancé</h4>
                  <p className="text-sm text-muted-foreground">Workflows complexes multi-étapes</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-lg w-fit">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">Bibliothèque</h4>
                  <p className="text-sm text-muted-foreground">Organisez et réutilisez vos créations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-8 animate-float">
        <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
      </div>
      <div className="fixed top-1/2 right-12 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full opacity-20 blur-xl"></div>
      </div>
      <div className="fixed bottom-1/4 left-16 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
};

export default Landing;
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, BookOpen, Star, Users, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import ThemeSelector from "@/components/ThemeSelector";
import LanguageSelector from "@/components/LanguageSelector";
import { AuthButtons } from "@/components/auth/AuthButtons";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();

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

  const stats = [
    { number: "10K+", label: "Prompts générés" },
    { number: "500+", label: "Utilisateurs actifs" },
    { number: "98%", label: "Satisfaction client" },
    { number: "24/7", label: "Support disponible" }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Créatrice de contenu",
      content: "AutoPrompt a révolutionné ma façon de créer du contenu. Les prompts générés sont d'une qualité exceptionnelle.",
      rating: 5
    },
    {
      name: "Pierre Martin",
      role: "Consultant en IA",
      content: "L'interface est intuitive et les résultats sont impressionnants. Un outil indispensable pour tout professionnel de l'IA.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Responsable Marketing",
      content: "Grâce à AutoPrompt, notre équipe a gagné 70% de temps dans la création de contenus marketing ciblés.",
      rating: 5
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AutoPrompt",
    "description": "Plateforme professionnelle de génération de prompts IA pour optimiser votre productivité",
    "url": "https://yoursite.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "author": {
      "@type": "Organization",
      "name": "AutoPrompt"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500"
    }
  };

  return (
    <>
      <SEOHead 
        title="AutoPrompt - Plateforme IA de Génération de Prompts Professionnels"
        description="Transformez vos idées en prompts optimisés grâce à notre plateforme alimentée par l'IA. Génération, amélioration et organisation de prompts professionnels. Gratuit et sans inscription."
        keywords="prompt generator, IA, intelligence artificielle, automatisation, productivité, génération de contenu, ChatGPT, prompts optimisés, workflow, création de contenu"
        structuredData={structuredData}
      />
      <div className={`min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex items-center ${language === 'ar' ? 'justify-between' : 'justify-between'}`}>
            {language === 'ar' ? (
              <>
                {/* Espace vide à gauche en mode arabe */}
                <div className="flex-1"></div>
                
                {/* Logo et titre au centre en mode arabe */}
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <img 
                    src="/logo.png" 
                    alt="AutoPrompt - Plateforme IA de génération de prompts professionnels" 
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-xl font-display font-bold gradient-text">AutoPrompt</span>
                </div>
                
                {/* Contrôles à droite en mode arabe */}
                <div className={`flex items-center flex-1 justify-end ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <ThemeSelector />
                  <LanguageSelector />
                  <AuthButtons />
                </div>
              </>
            ) : (
              <>
                {/* Organisation normale pour français/anglais */}
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <img 
                    src="/logo.png" 
                    alt="AutoPrompt - Plateforme IA de génération de prompts professionnels" 
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-xl font-display font-bold gradient-text">AutoPrompt</span>
                </div>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
                  <ThemeSelector />
                  <LanguageSelector />
                  <AuthButtons />
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-full border border-violet-200 dark:border-violet-700 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-300" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                {t('landingBadge')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 gradient-text leading-tight animate-fade-in">
              {t('title')}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Parfaits
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              {t('landingSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex justify-center items-center mb-8 animate-fade-in">
              <Button 
                size="lg" 
                onClick={() => navigate('/generator')}
                className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
              >
                {t('landingCTA')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>{t('startFree')}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{t('immediateAccess')}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-violet-500" />
                <span>{t('usersCount')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">
                Tout ce dont vous avez besoin
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Des outils puissants et intuitifs pour créer des prompts d'exception
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <article 
                  key={index}
                  className="group p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-violet-200 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
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
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 mt-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">
                Ce que disent nos utilisateurs
              </h2>
              <p className="text-lg text-muted-foreground">
                Rejoignez des milliers de professionnels qui font confiance à AutoPrompt
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="border-t border-border/50 pt-4">
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mt-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-12 bg-gradient-to-r from-violet-600/10 to-blue-600/10 backdrop-blur-sm rounded-3xl border border-violet-200/50 dark:border-violet-700/50">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 gradient-text">
                Prêt à révolutionner vos prompts ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers d'utilisateurs qui créent déjà des prompts exceptionnels avec AutoPrompt.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/generator')}
                className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
              >
                Commencer Maintenant - C'est Gratuit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="container mx-auto px-4 mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 bg-card/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-display font-bold mb-2 gradient-text">
                  Aperçu de la plateforme
                </h3>
                <p className="text-muted-foreground">
                  Découvrez nos différents modes de génération
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg w-fit">
                    <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">Génération Simple</h4>
                  <p className="text-sm text-muted-foreground">Interface intuitive pour créer rapidement des prompts optimisés</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg w-fit">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">Mode Avancé</h4>
                  <p className="text-sm text-muted-foreground">Workflows complexes multi-étapes avec logique conditionnelle</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-lg w-fit">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">Bibliothèque</h4>
                  <p className="text-sm text-muted-foreground">Organisez, sauvegardez et réutilisez vos créations</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

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
    </>
  );
};

export default Landing;
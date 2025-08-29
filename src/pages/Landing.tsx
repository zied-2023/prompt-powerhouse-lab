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
      title: t('generationIntelligente', 'Génération Intelligente', 'التوليد الذكي'),
      description: t('generationIntelligenteDesc', 'Créez des prompts optimisés avec l\'IA', 'أنشئ نصوص توجيهية محسّنة بواسطة الذكاء الاصطناعي')
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: t('multiEtapesAvance', 'Multi-étapes Avancé', 'الوضع متعدد المراحل المتقدم'),
      description: t('multiEtapesAvanceDesc', 'Construisez des workflows complexes', 'ابنِ سير عمل معقدة متعددة المراحل')
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: t('bibliothequeComplete', 'Bibliothèque Complète', 'المكتبة الكاملة'),
      description: t('bibliothequeCompleteDesc', 'Accédez à des milliers de templates', 'وصول إلى آلاف القوالب الجاهزة')
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: t('ameliorationContinue', 'Amélioration Continue', 'التحسين المستمر'),
      description: t('ameliorationContinueDesc', 'Optimisez vos résultats automatiquement', 'حسّن نتائجك تلقائيًا')
    }
  ];

  const stats = [
    { number: "10K+", label: t('promptsGeneres', 'Prompts générés', 'نصوص توجيهية مُولدة') },
    { number: "500+", label: t('utilisateursActifs', 'Utilisateurs actifs', 'مستخدمين نشطين') },
    { number: "98%", label: t('satisfactionClient', 'Satisfaction client', 'نسبة رضا العملاء') },
    { number: "24/7", label: t('supportDisponible', 'Support disponible', 'دعم متاح على مدار الساعة') }
  ];

  const testimonials = [
    {
      name: t('marieDubois', 'Marie Dubois', 'ماري دوبوا'),
      role: t('createurContenu', 'Créatrice de contenu', 'مُنشئة محتوى'),
      content: t('testimonial1', 'AutoPrompt a révolutionné ma façon de créer du contenu. Les prompts générés sont d\'une qualité exceptionnelle.', 'لقد ثور AutoPrompt في طريقة إنشاء المحتوى. نصوص التوجيهية المُولدة ذات جودة استثنائية.'),
      rating: 5
    },
    {
      name: t('pierreMartin', 'Pierre Martin', 'بيير مارتن'),
      role: t('consultantIA', 'Consultant en IA', 'خبير استشاري في الذكاء الاصطناعي'),
      content: t('testimonial2', 'L\'interface est intuitive et les résultats sont impressionnants. Un outil indispensable pour tout professionnel de l\'IA.', 'الواجهة سهلة الاستخدام والنتائج مثيرة للإعجاب. أداة لا غنى عنها لأي محترف في مجال الذكاء الاصطناعي.'),
      rating: 5
    },
    {
      name: t('sophieLaurent', 'Sophie Laurent', 'صوفي لوران'),
      role: t('responsableMarketing', 'Responsable Marketing', 'مديرة التسويق'),
      content: t('testimonial3', 'Grâce à AutoPrompt, notre équipe a gagné 70% de temps dans la création de contenus marketing ciblés.', 'بفضل AutoPrompt، وفرت فريقنا 70% من الوقت في إنشاء محتوى تسويقي مستهدف.'),
      rating: 5
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": t('appName', 'AutoPrompt', 'المولد التلقائي'),
    "description": t('appDescription', 'Plateforme professionnelle de génération de prompts IA pour optimiser votre productivité', 'منصة مهنية لتوليد نصوص توجيهية مدعومة بالذكاء الاصطناعي لتحسين إنتاجيتك'),
    "url": "https://yoursite.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "SAR"
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
        title={t('seoTitle', 'AutoPrompt - Plateforme IA de Génération de Prompts Professionnels', 'المولد التلقائي - منصة ذكاء اصطناعي لتوليد نصوص توجيهية مهنية')}
        description={t('seoDesc', 'Transformez vos idées en prompts optimisés grâce à notre plateforme alimentée par l\'IA. Génération, amélioration et organisation de prompts professionnels. Gratuit et sans inscription.', 'حوّل أفكارك إلى نصوص توجيهية محسّنة بفضل منصتنا المدعومة بالذكاء الاصطناعي. توليد وتحسين وتنظيم نصوص توجيهية مهنية. مجاني وبدون تسجيل.')}
        keywords={t('seoKeywords', 'prompt generator, IA, intelligence artificielle, automatisation, productivité, génération de contenu, ChatGPT, prompts optimisés, workflow, création de contenu', 'مولد النصوص التوجيهية، الذكاء الاصطناعي، الأتمتة، الإنتاجية، توليد المحتوى، ChatGPT، نصوص توجيهية محسّنة، سير العمل، إنشاء المحتوى')}
        structuredData={structuredData}
      />
      <div className={`min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-between'} w-full`}>
            {isRTL ? (
              <>
                {/* Contrôles à gauche en mode arabe */}
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'} ml-auto`}>
                  <ThemeSelector />
                  <LanguageSelector />
                </div>
                
                {/* Logo et titre alignés à droite en mode arabe */}
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'} mx-4`}>
                  <img 
                    src="/logo.png" 
                    alt={t('logoAlt', 'AutoPrompt - Plateforme IA de génération de prompts professionnels', 'المولد التلقائي - منصة ذكاء اصطناعي لتوليد نصوص توجيهية مهنية')} 
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-xl font-display font-bold gradient-text">{t('appName', 'AutoPrompt', 'المولد التلقائي')}</span>
                </div>
                
                {/* Actions à droite en mode arabe */}
                <div className="flex items-center">
                  <AuthButtons />
                </div>
              </>
            ) : (
              <>
                <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <img 
                    src="/logo.png" 
                    alt={t('logoAlt', 'AutoPrompt - Plateforme IA de génération de prompts professionnels', 'المولد التلقائي - منصة ذكاء اصطناعي لتوليد نصوص توجيهية مهنية')} 
                    className="h-14 w-14 object-contain"
                  />
                  <span className="text-xl font-display font-bold gradient-text">{t('appName', 'AutoPrompt', 'المولد التلقائي')}</span>
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
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-full border border-violet-200 dark:border-violet-700 mb-8 animate-fade-in ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Sparkles className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} text-violet-600 dark:text-violet-300`} />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                {t('landingBadge', 'Nouvelle fonctionnalité', 'ميزة جديدة')}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 gradient-text leading-tight animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('titlePart1', 'Transformez vos idées en', 'حوّل أفكارك إلى')}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t('titlePart2', 'Prompts', 'نصوص توجيهية')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t('titlePart3', 'Parfaits', 'مثالية')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('landingSubtitle', 'La plateforme professionnelle de génération de prompts IA qui optimise votre productivité', 'المنصة المهنية لتوليد النصوص التوجيهية بالذكاء الاصطناعي التي تحسّن إنتاجيتك')}
            </p>

            {/* CTA Buttons */}
            <div className={`flex ${isRTL ? 'flex-row-reverse justify-start' : 'justify-center'} items-center mb-8 animate-fade-in`}>
              <Button 
                size="lg" 
                onClick={() => navigate('/generator')}
                className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
              >
                {t('landingCTA', 'Générer un Prompt', 'توليد نص توجيهي')}
                {isRTL ? (
                  <ArrowRight className="mr-2 h-5 w-5" />
                ) : (
                  <ArrowRight className="ml-2 h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Trust indicators */}
            <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 ${isRTL ? 'sm:space-x-reverse' : ''} sm:space-x-6 text-sm text-muted-foreground animate-fade-in`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
                <Shield className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'} text-green-500`} />
                <span>{t('startFree', 'Commencez gratuitement', 'ابدأ مجانًا')}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
                <Clock className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'} text-blue-500`} />
                <span>{t('immediateAccess', 'Accès immédiat', 'وصول فوري')}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2'}`}>
                <Users className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'} text-violet-500`} />
                <span>{t('usersCount', 'Plus de 500 utilisateurs', 'أكثر من 500 مستخدم')}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 mt-20">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto ${isRTL ? 'text-right' : 'text-left'}`}>
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
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">
                {t('featuresTitle', 'Tout ce dont vous avez besoin', 'كل ما تحتاجه')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('featuresSubtitle', 'Des outils puissants et intuitifs pour créer des prompts d\'exception', 'أدوات قوية وسهلة الاستخدام لإنشاء نصوص توجيهية استثنائية')}
              </p>
            </div>
            
            <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${isRTL ? 'md:grid-flow-row-dense' : ''}`}>
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
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 gradient-text">
                {t('testimonialsTitle', 'Ce que disent nos utilisateurs', 'ما يقوله مستخدمونا')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('testimonialsSubtitle', 'Rejoignez des milliers de professionnels qui font confiance à AutoPrompt', 'انضم إلى الآلاف من المحترفين الذين يثقون في المولد التلقائي')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center mb-4`}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className={`text-muted-foreground mb-4 italic ${isRTL ? 'text-right' : 'text-left'}`}>
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
          <div className={`max-w-4xl mx-auto text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="p-12 bg-gradient-to-r from-violet-600/10 to-blue-600/10 backdrop-blur-sm rounded-3xl border border-violet-200/50 dark:border-violet-700/50">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 gradient-text">
                {t('ctaTitle', 'Prêt à révolutionner vos prompts ?', 'هل أنت مستعد لثورة في نصوص التوجيهية الخاصة بك؟')}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('ctaDesc', 'Rejoignez des milliers d\'utilisateurs qui créent déjà des prompts exceptionnels avec AutoPrompt.', 'انضم إلى الآلاف من المستخدمين الذين ينشئون بالفعل نصوص توجيهية استثنائية مع المولد التلقائي.')}
              </p>
              <div className={isRTL ? 'flex flex-row-reverse justify-end' : ''}>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/generator')}
                  className="text-lg px-8 py-6 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white border-0 shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
                >
                  {t('ctaButton', 'Commencer Maintenant - C\'est Gratuit', 'ابدأ الآن - إنه مجاني')}
                  {isRTL ? (
                    <ArrowRight className="mr-2 h-5 w-5" />
                  ) : (
                    <ArrowRight className="ml-2 h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Preview Section */}
        <section className="container mx-auto px-4 mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 bg-card/60 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl">
              <div className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-2xl font-display font-bold mb-2 gradient-text">
                  {t('previewTitle', 'Aperçu de la plateforme', 'نظرة عامة على المنصة')}
                </h3>
                <p className="text-muted-foreground">
                  {t('previewDesc', 'Découvrez nos différents modes de génération', 'اكتشف أوضاع التوليد المختلفة لدينا')}
                </p>
              </div>
              <div className={`grid md:grid-cols-3 gap-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg w-fit">
                    <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">{t('simpleGeneration', 'Génération Simple', 'التوليد البسيط')}</h4>
                  <p className="text-sm text-muted-foreground">{t('simpleGenerationDesc', 'Interface intuitive pour créer rapidement des prompts optimisés', 'واجهة سهلة لإنشاء نصوص توجيهية محسّنة بسرعة')}</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg w-fit">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">{t('advancedMode', 'Mode Avancé', 'الوضع المتقدم')}</h4>
                  <p className="text-sm text-muted-foreground">{t('advancedModeDesc', 'Workflows complexes multi-étapes avec logique conditionnelle', 'سير عمل معقد متعدد المراحل مع منطق شرطي')}</p>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-violet-100 dark:bg-violet-900/50 rounded-lg w-fit">
                    <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-300" />
                  </div>
                  <h4 className="font-semibold text-foreground">{t('library', 'Bibliothèque', 'المكتبة')}</h4>
                  <p className="text-sm text-muted-foreground">{t('libraryDesc', 'Organisez, sauvegardez et réutilisez vos créations', 'نظم واحفظ وأعد استخدام إبداعاتك')}</p>
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
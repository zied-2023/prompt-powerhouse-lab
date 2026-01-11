
import SecuritySettings from "@/components/SecuritySettings";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Zap, Brain, Settings, Sparkles, Palette, Code, TrendingUp, History, Key, Coins, ShoppingCart, CreditCard, Shield, BarChart3, Activity, Video } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { LogoutButton } from "@/components/auth/LogoutButton";
import PromptGenerator from "@/components/PromptGenerator";
import PromptLibrary from "@/components/PromptLibrary";
import CategoryManager from "@/components/CategoryManager";
import IntegrationPanel from "@/components/IntegrationPanel";
import AdvancedPromptBuilder from "@/components/AdvancedPromptBuilder";
import AdvancedTemplates from "@/components/AdvancedTemplates";
import PromptImprovement from "@/components/PromptImprovement";
import PromptHistory from "@/components/PromptHistory";
import { useUserCredits } from "@/hooks/useUserCredits";
import CreditManager from "@/components/CreditManager";
import { CreditPurchaseWidget } from "@/components/CreditPurchaseWidget";
import MarketplacePromptGrid from "@/components/MarketplacePromptGrid";
import SellerDashboard from "@/components/SellerDashboard";
import { OpikAnalyticsDashboard } from "@/components/OpikAnalyticsDashboard";
import IntelligentApiKeyManager from "@/components/IntelligentApiKeyManager";
import Wan2VideoPromptGenerator from "@/components/Wan2VideoPromptGenerator";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { isRTL, language } = useLanguage();
  const { credits, isLoading: creditsLoading, refetchCredits } = useUserCredits();
  const tabsContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll vers l'onglet actif au chargement et quand il change
  React.useEffect(() => {
    const scrollToActiveTab = () => {
      if (tabsContainerRef.current) {
        // Chercher l'onglet actif dans le conteneur
        const activeButton = tabsContainerRef.current.querySelector(`button[data-state="active"]`) as HTMLElement;
        if (activeButton) {
          const container = tabsContainerRef.current;
          const buttonRect = activeButton.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const containerScrollLeft = container.scrollLeft;
          
          // Calculer la position relative de l'onglet actif
          const buttonRelativeLeft = activeButton.offsetLeft;
          const buttonWidth = activeButton.offsetWidth;
          const containerWidth = container.offsetWidth;
          const buttonRight = buttonRelativeLeft + buttonWidth;
          const visibleRight = containerScrollLeft + containerWidth;

          // Si l'onglet actif n'est pas complètement visible, scroller
          if (buttonRelativeLeft < containerScrollLeft || buttonRight > visibleRight) {
            const scrollLeft = buttonRelativeLeft - (containerWidth / 2) + (buttonWidth / 2);
            container.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
          }
        }
      }
    };

    // Attendre que le DOM soit mis à jour
    const timeoutId = setTimeout(scrollToActiveTab, 150);
    return () => clearTimeout(timeoutId);
  }, [activeTab]);

  // Mise à jour des crédits toutes les 30 secondes quand l'app est visible (réduit de 5s à 30s)
  React.useEffect(() => {
    // Ne pas créer l'interval si l'utilisateur n'est pas authentifié ou si les crédits sont en chargement
    if (creditsLoading || !credits) return;

    const interval = setInterval(() => {
      if (!document.hidden && credits) {
        // Rafraîchir silencieusement (sans afficher de loading)
        refetchCredits(true);
      }
    }, 30000); // 30 secondes au lieu de 5

    // Écoute les événements de visibilité pour rafraîchir quand l'utilisateur revient
    const handleVisibilityChange = () => {
      if (!document.hidden && credits) {
        // Rafraîchir silencieusement
        refetchCredits(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetchCredits, creditsLoading, credits]);

  // Ouvre automatiquement le dialog de paiement quand les crédits atteignent 0
  React.useEffect(() => {
    if (!creditsLoading && credits?.remaining_credits === 0) {
      setCreditDialogOpen(true);
    }
  }, [credits?.remaining_credits, creditsLoading]);

  // Fonction pour déterminer le style du badge crédits
  const getCreditBadgeStyle = () => {
    if (creditsLoading) return { variant: "secondary" as const, className: "animate-pulse" };
    
    const remaining = credits?.remaining_credits || 0;
    if (remaining === 0) {
      return { 
        variant: "destructive" as const, 
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700" 
      };
    } else if (remaining < 10) {
      return { 
        variant: "secondary" as const, 
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700" 
      };
    }
    return { 
      variant: "default" as const, 
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700" 
    };
  };

  const badgeStyle = getCreditBadgeStyle();

  // Fonction pour déterminer le style du bouton d'achat
  const getButtonStyle = () => {
    const remaining = credits?.remaining_credits || 0;
    if (remaining === 0) {
      return {
        text: t('buyCredits'),
        className: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0",
        icon: CreditCard
      };
    } else if (remaining < 10) {
      return {
        text: t('recharge'),
        className: "bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white border-0",
        icon: Coins
      };
    }
    return {
      text: t('buyCredits'),
      className: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0",
      icon: ShoppingCart
    };
  };

  const buttonStyle = getButtonStyle();
  const ButtonIcon = buttonStyle.icon;

  // Vérifier si l'utilisateur est en mode premium
  const isPremium = !creditsLoading && credits && (credits.remaining_credits ?? 0) > 50;
  
  // Debug: log pour vérifier l'état des crédits (uniquement en mode développement, et seulement quand ça change vraiment)
  const prevCreditsRef = React.useRef<number | undefined>();
  const prevIsLoadingRef = React.useRef<boolean>(true);
  React.useEffect(() => {
    const currentCredits = credits?.remaining_credits;
    const creditsValueChanged = prevCreditsRef.current !== currentCredits;
    const loadingChanged = prevIsLoadingRef.current !== creditsLoading;
    
    // Ne logger que si les crédits ont réellement changé de valeur OU si le chargement vient de se terminer
    if (import.meta.env.DEV && !creditsLoading && credits && (creditsValueChanged || loadingChanged)) {
      prevCreditsRef.current = currentCredits;
      prevIsLoadingRef.current = creditsLoading;
      console.log('🔍 Credits state:', {
        credits,
        remaining_credits: credits?.remaining_credits,
        isPremium,
        creditsLoading
      });
    } else if (creditsLoading !== prevIsLoadingRef.current) {
      prevIsLoadingRef.current = creditsLoading;
    }
  }, [credits?.remaining_credits, creditsLoading]); // Seulement dépendre de remaining_credits, pas de l'objet entier

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 glass-card border-0 border-b border-white/20 dark:border-gray-700/20 sticky top-0 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2 sm:space-x-4'} w-full sm:w-auto`}>
              <div className="relative">
                <img 
                  src="/logo.png?v=2"
                  alt="AutoPrompt Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
                <div className={`absolute -top-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-400 rounded-full animate-pulse ${isRTL ? '-left-1' : '-right-1'}`}></div>
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-left'} ${isRTL ? 'mr-2 sm:mr-4' : 'ml-2 sm:ml-4'}`}>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text text-shadow">
                  {t('title')}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">{t('subtitle')}</p>
              </div>
            </div>
            {/* Section droite - Actions et crédits */}
            <div className={`flex flex-col gap-2 sm:gap-3 w-full sm:w-auto ${language === 'ar' ? 'items-start sm:items-end mr-0 ml-auto' : 'items-end ml-auto'}`}>
              {/* Badge Crédits LARGE et visible */}
              <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20 dark:border-gray-700/30 w-full sm:w-auto ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 flex items-center justify-center border-2 border-yellow-400/50 flex-shrink-0">
                    <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  </div>
                  <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {creditsLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          credits?.remaining_credits || 0
                        )}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{(credits?.remaining_credits || 0) > 1 ? t('credits') : t('credit')}</span>
                    </div>
                    <Badge 
                      variant={badgeStyle.variant}
                      className={`${badgeStyle.className} text-xs px-2 py-0.5 w-fit`}
                    >
                      {credits?.remaining_credits === 0 ? t('depleted') :
                       credits?.remaining_credits && credits.remaining_credits < 10 ? t('low') : t('good')}
                    </Badge>
                  </div>
                </div>

                {/* Bouton d'achat TRÈS visible */}
                <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={credits?.remaining_credits && credits.remaining_credits > 10 ? "outline" : "default"}
                      size="default"
                      className={`${buttonStyle.className} font-semibold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto`}
                      disabled={creditsLoading}
                    >
                      <ButtonIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{buttonStyle.text}</span>
                      <span className="sm:hidden">{t('buyCredits')}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Coins className="h-5 w-5" />
                        {t('creditManagement')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <CreditPurchaseWidget />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Actions du header */}
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse space-x-reverse' : 'space-x-2 sm:space-x-3'} w-full sm:w-auto justify-end`}>
                <ThemeSelector />
                <LanguageSelector />
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div 
            ref={tabsContainerRef}
            className="w-full mb-6 sm:mb-10 overflow-x-auto scrollbar-hide scroll-smooth -mx-1 px-1" 
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <TabsList className="inline-flex flex-nowrap justify-start gap-1 glass-card border-white/30 dark:border-gray-700/30 p-1 sm:p-2 shadow-xl h-auto rounded-md min-w-max">
            <TabsTrigger 
              value="generator" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('generator')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="improvement" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('improvement')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('advanced')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('templates')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('marketplace')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="seller" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('seller')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('library')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('categories')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <History className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('history')}</span>
            </TabsTrigger>
            {/* <TabsTrigger
              value="security"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('security')}</span>
            </TabsTrigger> */}
            <TabsTrigger
              value="integration"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Code className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('integration')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{t('analytics')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="wan2-video"
              className="flex items-center space-x-1 sm:space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">WAN-2.2 Video</span>
              <span className="sm:hidden">Video</span>
              <Badge variant="secondary" className="ml-1 sm:ml-2 bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 text-xs flex-shrink-0">
                Premium
              </Badge>
            </TabsTrigger>
            {/* <TabsTrigger
              value="api-keys"
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium px-4 py-2 rounded-md"
            >
              <Key className="h-4 w-4" />
              <span>{t('apiKeys')}</span>
            </TabsTrigger> */}
          </TabsList>
        </div>

          <TabsContent value="generator" className="space-y-8">
            <PromptGenerator />
          </TabsContent>

          <TabsContent value="improvement" className="space-y-8">
            <PromptImprovement />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-8">
            <AdvancedPromptBuilder />
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <AdvancedTemplates />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-8">
            <MarketplacePromptGrid />
          </TabsContent>

          <TabsContent value="seller" className="space-y-8">
            <SellerDashboard />
          </TabsContent>

          <TabsContent value="library" className="space-y-8">
            <PromptLibrary />
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="history" className="space-y-8">
            <PromptHistory />
          </TabsContent>

          {/* <TabsContent value="security" className="space-y-8">
            <SecuritySettings />
          </TabsContent> */}

          <TabsContent value="integration" className="space-y-8">
            <IntegrationPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8">
            {isPremium ? (
              <OpikAnalyticsDashboard />
            ) : (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Mode Premium requis</h3>
                <p className="text-muted-foreground">Vous devez avoir plus de 50 crédits pour accéder à Analytics.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="wan2-video" className="space-y-8">
            {isPremium ? (
              <Wan2VideoPromptGenerator />
            ) : (
              <div className="text-center py-12">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Mode Premium requis</h3>
                <p className="text-muted-foreground">Vous devez avoir plus de 50 crédits pour accéder à WAN-2.2 Video.</p>
              </div>
            )}
          </TabsContent>

          {/* <TabsContent value="api-keys" className="space-y-8">
            <IntelligentApiKeyManager />
          </TabsContent> */}

        </Tabs>
      </div>
    </div>
  );
};

export default Index;

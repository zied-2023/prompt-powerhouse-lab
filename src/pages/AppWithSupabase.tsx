import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Zap, Brain, Settings, Sparkles, Palette, Code, TrendingUp, History, Key, Coins, ShoppingCart, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { LogoutButton } from "@/components/auth/LogoutButton";
import PromptGeneratorSupabase from "@/components/PromptGeneratorSupabase";
import PromptLibrary from "@/components/PromptLibrary";
import CategoryManager from "@/components/CategoryManager";
import IntegrationPanel from "@/components/IntegrationPanel";
import AdvancedPromptBuilder from "@/components/AdvancedPromptBuilder";
import AdvancedTemplates from "@/components/AdvancedTemplates";
import PromptImprovementSupabase from "@/components/PromptImprovementSupabase";
import PromptHistory from "@/components/PromptHistory";
import CreditManager from "@/components/CreditManager";
import { useUserCredits } from "@/hooks/useUserCredits";

const AppWithSupabase = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const [creditDialogOpen, setCreditDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { credits, isLoading: creditsLoading } = useUserCredits();

  // Fonction pour déterminer le style du badge crédits
  const getCreditBadgeStyle = () => {
    const creditCount = credits?.remaining_credits || 0;
    
    if (creditCount === 0) {
      return {
        variant: "destructive" as const,
        className: "bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 shadow-sm animate-pulse"
      };
    } else if (creditCount < 10) {
      return {
        variant: "secondary" as const,
        className: "bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900 dark:to-yellow-900 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 shadow-sm"
      };
    } else {
      return {
        variant: "default" as const,
        className: "bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 shadow-sm"
      };
    }
  };

  // Fonction pour déterminer le style du bouton d'achat
  const getPurchaseButtonStyle = () => {
    const creditCount = credits?.remaining_credits || 0;
    
    if (creditCount === 0) {
      return {
        className: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg animate-pulse border-2 border-red-300",
        text: "Recharger Urgent",
        icon: AlertCircle
      };
    } else if (creditCount < 10) {
      return {
        className: "bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white shadow-lg border-2 border-orange-300",
        text: "Recharger",
        icon: Coins
      };
    } else {
      return {
        className: "bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 hover:from-emerald-200 hover:to-green-200 dark:hover:from-emerald-800 dark:hover:to-green-800 shadow-sm",
        text: "Acheter Crédits",
        icon: ShoppingCart
      };
    }
  };

  const badgeStyle = getCreditBadgeStyle();
  const buttonStyle = getPurchaseButtonStyle();
  const ButtonIcon = buttonStyle.icon;

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
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-4 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className="relative">
                <img 
                  src="/lovable-uploads/4bfcbfae-c46b-471e-8938-d07bd52b4db2.png" 
                  alt="AutoPrompt Logo" 
                  className="w-16 h-16 object-contain"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text text-shadow">
                  {t('title')} - OpenAI
                </h1>
                <p className="text-sm text-muted-foreground font-medium">{t('subtitle')} avec clé API Supabase</p>
              </div>
            </div>

            {/* Section Crédits - Plus visible */}
            <div className={`flex items-center gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Badge Crédits LARGE et visible */}
              <div className="flex items-center gap-3 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-3 border border-white/20 dark:border-gray-700/30">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 flex items-center justify-center border-2 border-yellow-400/50">
                    <Coins className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {creditsLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          credits?.remaining_credits || 0
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">crédit{(credits?.remaining_credits || 0) > 1 ? 's' : ''}</span>
                    </div>
                    <Badge 
                      variant={badgeStyle.variant}
                      className={`${badgeStyle.className} text-xs px-2 py-0.5 w-fit`}
                    >
                      {credits?.remaining_credits === 0 ? "Épuisé" :
                       credits?.remaining_credits && credits.remaining_credits < 10 ? "Faible" : "Bon"}
                    </Badge>
                  </div>
                </div>

                {/* Bouton d'achat TRÈS visible */}
                <Dialog open={creditDialogOpen} onOpenChange={setCreditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant={credits?.remaining_credits && credits.remaining_credits > 10 ? "outline" : "default"}
                      size="lg"
                      className={`${buttonStyle.className} font-semibold text-sm px-6 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                      disabled={creditsLoading}
                    >
                      <ButtonIcon className="h-5 w-5 mr-2" />
                      {buttonStyle.text}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-xl">
                        <Coins className="h-6 w-6 text-yellow-500" />
                        Gestion des Crédits
                        <Badge variant="outline" className="ml-2">
                          Solde actuel: {credits?.remaining_credits || 0}
                        </Badge>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <CreditManager />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Séparateur visuel */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600"></div>

              {/* Contrôles d'interface */}
              <div className="flex items-center gap-2">
                <ThemeSelector />
                <LanguageSelector />
                <LogoutButton />
              </div>

              {/* Badges de technologie */}
              <div className="flex items-center gap-1 flex-wrap">
                <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 shadow-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  OpenAI API
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 shadow-sm">
                  <Zap className="h-3 w-3 mr-1" />
                  Supabase
                </Badge>
              </div>
            </div>
          </div>

          {/* Alerte de crédits faibles (si applicable) */}
          {credits?.remaining_credits !== undefined && credits.remaining_credits < 5 && (
            <div className="mt-4 p-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/50 dark:to-red-900/50 border border-orange-200 dark:border-orange-700 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {credits.remaining_credits === 0 
                    ? "Vous n'avez plus de crédits ! Rechargez maintenant pour continuer à utiliser l'application."
                    : `Attention: Il ne vous reste que ${credits.remaining_credits} crédit${credits.remaining_credits > 1 ? 's' : ''}. Pensez à recharger bientôt.`
                  }
                </span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCreditDialogOpen(true)}
                  className="ml-auto bg-white/80 hover:bg-white border-orange-300"
                >
                  Recharger
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-9 mb-10 glass-card border-white/30 dark:border-gray-700/30 p-1.5 shadow-xl overflow-x-auto">
            <TabsTrigger 
              value="generator" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">{t('generator')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="improvement" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">{t('improvement')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">{t('advanced')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t('library')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">{t('categories')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">{t('history')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integration" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">{t('integration')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="api-test" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Key className="h-4 w-4" />
              <span className="hidden sm:inline">API Test</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            <PromptGeneratorSupabase />
          </TabsContent>

          <TabsContent value="improvement" className="space-y-8">
            <PromptImprovementSupabase />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-8">
            <AdvancedPromptBuilder />
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <AdvancedTemplates />
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

          <TabsContent value="integration" className="space-y-8">
            <IntegrationPanel />
          </TabsContent>

          <TabsContent value="api-test" className="space-y-8">
            <div className="text-center py-12">
              <div className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl p-8 max-w-md mx-auto">
                <Key className="h-16 w-16 mx-auto mb-4 text-violet-500" />
                <h3 className="text-xl font-semibold mb-2">Centre de Test API</h3>
                <p className="text-muted-foreground mb-6">
                  Testez vos clés API dans un environnement dédié et sécurisé
                </p>
                <Button 
                  onClick={() => window.open('/api-test', '_blank')}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Ouvrir API Test Center
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AppWithSupabase;
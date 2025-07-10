
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Zap, Brain, Settings, Sparkles, Palette, Code, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import UserMenu from "@/components/auth/UserMenu";
import PromptGenerator from "@/components/PromptGenerator";
import PromptLibrary from "@/components/PromptLibrary";
import CategoryManager from "@/components/CategoryManager";
import IntegrationPanel from "@/components/IntegrationPanel";
import MultiStepPromptBuilder from "@/components/MultiStepPromptBuilder";
import PromptImprovement from "@/components/PromptImprovement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generator");
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

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
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg glow-effect">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text text-shadow">
                  {t('title')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('subtitle')}</p>
              </div>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <ThemeSelector />
              <LanguageSelector />
              <UserMenu />
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 shadow-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                {t('advancedAI')}
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 shadow-sm">
                <Zap className="h-3 w-3 mr-1" />
                {t('noCode')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-10 glass-card border-white/30 dark:border-gray-700/30 p-1.5 shadow-xl">
            <TabsTrigger 
              value="generator" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Zap className="h-4 w-4" />
              <span>{t('generator')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="improvement" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              <span>{t('improvement')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="advanced" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t('advanced')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Search className="h-4 w-4" />
              <span>{t('library')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Palette className="h-4 w-4" />
              <span>{t('categories')}</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integration" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-300 hover-lift font-medium"
            >
              <Code className="h-4 w-4" />
              <span>{t('integration')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            <PromptGenerator />
          </TabsContent>

          <TabsContent value="improvement" className="space-y-8">
            <PromptImprovement />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-8">
            <MultiStepPromptBuilder />
          </TabsContent>

          <TabsContent value="library" className="space-y-8">
            <PromptLibrary />
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="integration" className="space-y-8">
            <IntegrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

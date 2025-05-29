
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Search, Plus, Zap, Brain, Settings, Sparkles, Palette, Code } from "lucide-react";
import PromptGenerator from "@/components/PromptGenerator";
import PromptLibrary from "@/components/PromptLibrary";
import CategoryManager from "@/components/CategoryManager";
import IntegrationPanel from "@/components/IntegrationPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState("generator");

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-blue-600/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 glass-card border-0 border-b border-white/20 sticky top-0 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg glow-effect">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text text-shadow">
                  Prompt Powerhouse Lab
                </h1>
                <p className="text-sm text-gray-600 font-medium">Intelligence artificielle • Création automatisée • Sans code</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border-emerald-200 shadow-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                IA Avancée
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border-violet-200 shadow-sm">
                <Zap className="h-3 w-3 mr-1" />
                No-Code
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-10 glass-card border-white/30 p-1.5 shadow-xl">
            <TabsTrigger 
              value="generator" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 hover-lift font-medium"
            >
              <Zap className="h-4 w-4" />
              <span>Générateur</span>
            </TabsTrigger>
            <TabsTrigger 
              value="library" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 hover-lift font-medium"
            >
              <Search className="h-4 w-4" />
              <span>Bibliothèque</span>
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 hover-lift font-medium"
            >
              <Palette className="h-4 w-4" />
              <span>Catégories</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integration" 
              className="flex items-center space-x-2 data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-violet-700 hover-lift font-medium"
            >
              <Code className="h-4 w-4" />
              <span>Intégration</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            <PromptGenerator />
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

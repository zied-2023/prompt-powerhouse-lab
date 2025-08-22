import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  Zap, 
  Settings, 
  Sparkles, 
  Key, 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeSelector from "@/components/ThemeSelector";
import { LogoutButton } from "@/components/auth/LogoutButton";
import ApiKeyForm from "@/components/ApiTest/ApiKeyForm";
import TestHistoryTable from "@/components/ApiTest/TestHistoryTable";
import { Link } from "react-router-dom";

const ApiTest = () => {
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const handleApiTest = (testResult: any) => {
    const newTest = {
      id: Date.now(),
      ...testResult,
      timestamp: new Date().toISOString(),
    };
    setTestHistory(prev => [newTest, ...prev.slice(0, 19)]); // Keep last 20 tests
  };

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
              <Link to="/app" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
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
                    API Test Center
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">Testez vos clés API en toute sécurité</p>
                </div>
              </Link>
            </div>
            <div className={`flex items-center space-x-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <ThemeSelector />
              <LanguageSelector />
              <LogoutButton />
              <Badge variant="secondary" className="bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 shadow-sm">
                <Shield className="h-3 w-3 mr-1" />
                Sécurisé
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900 dark:to-purple-900 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-700 shadow-sm">
                <Key className="h-3 w-3 mr-1" />
                API Testing
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* API Test Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-violet-500" />
                  <span>Test d'API</span>
                </CardTitle>
                <CardDescription>
                  Validez vos clés API avant de les intégrer en production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApiKeyForm onTestComplete={handleApiTest} />
              </CardContent>
            </Card>
          </div>

          {/* Premium Features Sidebar */}
          <div className="space-y-6">
            {/* Upgrade to Premium */}
            <Card className="glass-card border-amber-200/50 dark:border-amber-700/50 shadow-xl bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/20 dark:to-orange-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-amber-700 dark:text-amber-300">
                  <Sparkles className="h-5 w-5" />
                  <span>Mode Premium</span>
                </CardTitle>
                <CardDescription>
                  Débloquez des fonctionnalités avancées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Tests illimités</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Historique complet</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Export des résultats</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>Tests automatisés</span>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Passer au Premium
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  <span>Statistiques</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tests aujourd'hui</span>
                  <Badge variant="secondary">{testHistory.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tests gratuits restants</span>
                  <Badge variant="outline">{Math.max(0, 5 - testHistory.length)}/5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux de succès</span>
                  <Badge variant={testHistory.filter(t => t.success).length / Math.max(1, testHistory.length) > 0.8 ? "default" : "destructive"}>
                    {testHistory.length > 0 ? Math.round((testHistory.filter(t => t.success).length / testHistory.length) * 100) : 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="glass-card border-blue-200/50 dark:border-blue-700/50 shadow-xl bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Shield className="h-5 w-5" />
                  <span>Sécurité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start space-x-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Vos clés API sont stockées temporairement et supprimées après 24h</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span>Chiffrement local pour la protection des données</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Test History */}
        {testHistory.length > 0 && (
          <div className="mt-8">
            <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>Historique des tests</span>
                </CardTitle>
                <CardDescription>
                  Derniers tests d'API effectués
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestHistoryTable tests={testHistory} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTest;
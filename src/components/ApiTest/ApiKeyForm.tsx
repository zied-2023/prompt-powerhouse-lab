import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Key, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  ExternalLink,
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiTestService } from '@/services/apiTestService';

interface ApiKeyFormProps {
  onTestComplete: (result: any) => void;
}

const API_PROVIDERS = [
  {
    id: 'openai',
    name: 'OpenAI',
    placeholder: 'sk-proj-...',
    description: 'Testez votre clé API OpenAI',
    icon: '🤖',
    docUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    placeholder: 'sk-...',
    description: 'Testez votre clé API DeepSeek',
    icon: '🔮',
    docUrl: 'https://platform.deepseek.com/api_keys'
  },
  {
    id: 'glm',
    name: 'GLM (ChatGLM)',
    placeholder: 'glm-...',
    description: 'Testez votre clé API GLM',
    icon: '⚡',
    docUrl: 'https://open.bigmodel.cn/usercenter/apikeys'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    placeholder: 'sk_test_... ou sk_live_...',
    description: 'Testez votre clé API Stripe',
    icon: '💳',
    docUrl: 'https://dashboard.stripe.com/apikeys'
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    placeholder: 'sk-ant-...',
    description: 'Testez votre clé API Anthropic',
    icon: '🧠',
    docUrl: 'https://console.anthropic.com/account/keys'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    placeholder: 'SG...',
    description: 'Testez votre clé API SendGrid',
    icon: '📧',
    docUrl: 'https://app.sendgrid.com/settings/api_keys'
  },
  {
    id: 'github',
    name: 'GitHub',
    placeholder: 'ghp_...',
    description: 'Testez votre token GitHub',
    icon: '🐙',
    docUrl: 'https://github.com/settings/tokens'
  }
];

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onTestComplete }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [lastTestResult, setLastTestResult] = useState<any>(null);

  const currentProvider = API_PROVIDERS.find(p => p.id === selectedProvider);

  const handleTest = async () => {
    if (!selectedProvider || !apiKey.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fournisseur et saisir une clé API",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLastTestResult(null);

    try {
      const result = await apiTestService.testApiKey(selectedProvider, apiKey.trim());
      
      setLastTestResult(result);
      onTestComplete({
        provider: selectedProvider,
        success: result.success,
        message: result.message,
        details: result.details,
        keyPreview: apiKey.substring(0, 8) + '...'
      });

      toast({
        title: result.success ? "Test réussi ✅" : "Test échoué ❌",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });

    } catch (error) {
      const errorResult = {
        success: false,
        message: 'Erreur lors du test de la clé API',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      
      setLastTestResult(errorResult);
      onTestComplete({
        provider: selectedProvider,
        success: false,
        message: errorResult.message,
        details: errorResult.details,
        keyPreview: apiKey.substring(0, 8) + '...'
      });

      toast({
        title: "Erreur de test",
        description: errorResult.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedProvider('');
    setApiKey('');
    setLastTestResult(null);
    setShowKey(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label htmlFor="provider" className="text-sm font-medium">
            Fournisseur d'API
          </Label>
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez un fournisseur d'API" />
            </SelectTrigger>
            <SelectContent>
              {API_PROVIDERS.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{provider.icon}</span>
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-muted-foreground">{provider.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Key Input */}
        {selectedProvider && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="apiKey" className="text-sm font-medium">
                Clé API {currentProvider?.name}
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(currentProvider?.docUrl, '_blank')}
                    className="h-auto p-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Documentation pour obtenir votre clé API</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder={currentProvider?.placeholder}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-20"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="h-auto p-1"
                  disabled={isLoading}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex items-start space-x-1 text-xs text-muted-foreground">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                Votre clé API est stockée temporairement et chiffrée localement. 
                Elle sera automatiquement supprimée après 24h.
              </span>
            </div>
          </div>
        )}

        {/* Test Result */}
        {lastTestResult && (
          <Card className={`border-2 ${
            lastTestResult.success 
              ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-900/20' 
              : 'border-red-200 bg-red-50/50 dark:border-red-700 dark:bg-red-900/20'
          }`}>
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                {lastTestResult.success ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant={lastTestResult.success ? "default" : "destructive"}>
                      {lastTestResult.success ? "Succès" : "Échec"}
                    </Badge>
                    <span className="text-sm font-medium">
                      {currentProvider?.name}
                    </span>
                  </div>
                  <p className="text-sm text-foreground mb-2">
                    {lastTestResult.message}
                  </p>
                  {lastTestResult.details && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Détails techniques
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {typeof lastTestResult.details === 'string' 
                          ? lastTestResult.details 
                          : JSON.stringify(lastTestResult.details, null, 2)
                        }
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleTest}
            disabled={!selectedProvider || !apiKey.trim() || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Test en cours...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                Tester la clé API
              </>
            )}
          </Button>
          
          {(selectedProvider || apiKey || lastTestResult) && (
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ApiKeyForm;
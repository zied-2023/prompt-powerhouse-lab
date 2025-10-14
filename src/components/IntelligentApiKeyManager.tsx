import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import {
  Key,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Settings,
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  BarChart3,
  Clock,
  DollarSign,
  Activity
} from 'lucide-react';
import { intelligentApiKeyManager, ApiKey, SelectionRule, RequestContext } from '@/services/intelligentApiKeyManager';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '🤖' },
  { id: 'anthropic', name: 'Anthropic (Claude)', icon: '🧠' },
  { id: 'openrouter', name: 'OpenRouter', icon: '🔀' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🔮' },
  { id: 'glm', name: 'GLM', icon: '⚡' }
];

const CONTEXT_TAGS = [
  'text_generation', 'code_generation', 'translation', 'analysis', 'chat',
  'embedding', 'fast', 'quality', 'cost_effective', 'high_priority'
];

const IntelligentApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [rules, setRules] = useState<SelectionRule[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const [newKey, setNewKey] = useState({
    provider: '',
    api_key: '',
    nickname: '',
    priority: 0,
    context_tags: [] as string[],
    rate_limit_per_minute: undefined as number | undefined,
    cost_per_token: undefined as number | undefined
  });

  const [newRule, setNewRule] = useState({
    name: '',
    preferred_provider: '',
    conditions: {} as Record<string, any>,
    priority: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const keys = await intelligentApiKeyManager.getActiveApiKeys(user.id);
    setApiKeys(keys);

    const userRules = await intelligentApiKeyManager.getUserRules(user.id);
    setRules(userRules);

    const analyticsData = await intelligentApiKeyManager.getUsageAnalytics(7);
    setAnalytics(analyticsData);
  };

  const handleAddKey = async () => {
    if (!newKey.provider || !newKey.api_key) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    const encryptedKey = intelligentApiKeyManager.encryptApiKey(newKey.api_key);

    const result = await intelligentApiKeyManager.addApiKey({
      provider: newKey.provider,
      api_key_encrypted: encryptedKey,
      nickname: newKey.nickname,
      is_active: true,
      priority: newKey.priority,
      context_tags: newKey.context_tags,
      rate_limit_per_minute: newKey.rate_limit_per_minute,
      cost_per_token: newKey.cost_per_token,
      last_used_at: undefined
    });

    if (result) {
      toast({
        title: 'Clé ajoutée',
        description: 'La clé API a été ajoutée avec succès'
      });
      setIsAddingKey(false);
      setNewKey({
        provider: '',
        api_key: '',
        nickname: '',
        priority: 0,
        context_tags: [],
        rate_limit_per_minute: undefined,
        cost_per_token: undefined
      });
      loadData();
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la clé API',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    const success = await intelligentApiKeyManager.deleteApiKey(keyId);
    if (success) {
      toast({
        title: 'Clé supprimée',
        description: 'La clé API a été supprimée avec succès'
      });
      loadData();
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la clé API',
        variant: 'destructive'
      });
    }
  };

  const handleToggleKeyStatus = async (keyId: string, isActive: boolean) => {
    const success = await intelligentApiKeyManager.updateApiKey(keyId, { is_active: !isActive });
    if (success) {
      toast({
        title: isActive ? 'Clé désactivée' : 'Clé activée',
        description: `La clé a été ${isActive ? 'désactivée' : 'activée'} avec succès`
      });
      loadData();
    }
  };

  const handleAddRule = async () => {
    if (!newRule.name || !newRule.preferred_provider) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    const result = await intelligentApiKeyManager.addSelectionRule({
      name: newRule.name,
      conditions: newRule.conditions,
      preferred_provider: newRule.preferred_provider,
      is_active: true,
      priority: newRule.priority
    });

    if (result) {
      toast({
        title: 'Règle ajoutée',
        description: 'La règle de sélection a été ajoutée avec succès'
      });
      setIsAddingRule(false);
      setNewRule({
        name: '',
        preferred_provider: '',
        conditions: {},
        priority: 0
      });
      loadData();
    } else {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter la règle',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    const success = await intelligentApiKeyManager.deleteSelectionRule(ruleId);
    if (success) {
      toast({
        title: 'Règle supprimée',
        description: 'La règle de sélection a été supprimée avec succès'
      });
      loadData();
    }
  };

  const toggleShowKey = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Gestion Intelligente des Clés API</h2>
          <p className="text-muted-foreground mt-1">
            Système de sélection automatique basé sur le contexte
          </p>
        </div>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            Clés API
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Settings className="h-4 w-4 mr-2" />
            Règles de Sélection
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddingKey} onOpenChange={setIsAddingKey}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une clé
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter une nouvelle clé API</DialogTitle>
                  <DialogDescription>
                    Configurez votre clé API avec ses paramètres intelligents
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fournisseur</Label>
                    <Select value={newKey.provider} onValueChange={(v) => setNewKey({...newKey, provider: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.icon} {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Clé API</Label>
                    <Input
                      type="password"
                      value={newKey.api_key}
                      onChange={(e) => setNewKey({...newKey, api_key: e.target.value})}
                      placeholder="sk-..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nom (optionnel)</Label>
                    <Input
                      value={newKey.nickname}
                      onChange={(e) => setNewKey({...newKey, nickname: e.target.value})}
                      placeholder="Ma clé OpenAI pour production"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Priorité: {newKey.priority}</Label>
                    <Slider
                      value={[newKey.priority]}
                      onValueChange={(v) => setNewKey({...newKey, priority: v[0]})}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags de contexte</Label>
                    <div className="flex flex-wrap gap-2">
                      {CONTEXT_TAGS.map(tag => (
                        <Badge
                          key={tag}
                          variant={newKey.context_tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            if (newKey.context_tags.includes(tag)) {
                              setNewKey({...newKey, context_tags: newKey.context_tags.filter(t => t !== tag)});
                            } else {
                              setNewKey({...newKey, context_tags: [...newKey.context_tags, tag]});
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Limite par minute</Label>
                      <Input
                        type="number"
                        value={newKey.rate_limit_per_minute || ''}
                        onChange={(e) => setNewKey({...newKey, rate_limit_per_minute: parseInt(e.target.value) || undefined})}
                        placeholder="60"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Coût par token</Label>
                      <Input
                        type="number"
                        step="0.000001"
                        value={newKey.cost_per_token || ''}
                        onChange={(e) => setNewKey({...newKey, cost_per_token: parseFloat(e.target.value) || undefined})}
                        placeholder="0.000002"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingKey(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddKey}>
                      Ajouter la clé
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {apiKeys.map(key => (
              <Card key={key.id} className={`${!key.is_active ? 'opacity-50' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">
                          {PROVIDERS.find(p => p.id === key.provider)?.icon} {key.provider}
                        </Badge>
                        {key.is_active ? (
                          <Badge variant="default">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                        <Badge variant="outline">Priorité: {key.priority}</Badge>
                      </div>
                      <div className="space-y-1">
                        {key.nickname && (
                          <p className="font-medium">{key.nickname}</p>
                        )}
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {showKeys[key.id]
                              ? intelligentApiKeyManager.decryptApiKey(key.api_key_encrypted)
                              : '••••••••••••••••'
                            }
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleShowKey(key.id)}
                          >
                            {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {key.context_tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            {key.usage_count} utilisations
                          </span>
                          {key.last_used_at && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(key.last_used_at).toLocaleDateString()}
                            </span>
                          )}
                          {key.cost_per_token && (
                            <span className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1" />
                              {key.cost_per_token} /token
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={key.is_active}
                        onCheckedChange={() => handleToggleKeyStatus(key.id, key.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {apiKeys.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune clé API configurée</p>
                  <p className="text-sm text-muted-foreground">Ajoutez votre première clé pour commencer</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une règle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une règle de sélection</DialogTitle>
                  <DialogDescription>
                    Définissez quand utiliser un fournisseur spécifique
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nom de la règle</Label>
                    <Input
                      value={newRule.name}
                      onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                      placeholder="Utiliser Claude pour l'analyse"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Fournisseur préféré</Label>
                    <Select value={newRule.preferred_provider} onValueChange={(v) => setNewRule({...newRule, preferred_provider: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un fournisseur" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVIDERS.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.icon} {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priorité: {newRule.priority}</Label>
                    <Slider
                      value={[newRule.priority]}
                      onValueChange={(v) => setNewRule({...newRule, priority: v[0]})}
                      min={0}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingRule(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleAddRule}>
                      Ajouter la règle
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {rules.map(rule => (
              <Card key={rule.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge>
                          {PROVIDERS.find(p => p.id === rule.preferred_provider)?.icon} {rule.preferred_provider}
                        </Badge>
                        <Badge variant="outline">Priorité: {rule.priority}</Badge>
                      </div>
                      <p className="font-medium">{rule.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRule(rule.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {rules.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune règle définie</p>
                  <p className="text-sm text-muted-foreground">Ajoutez des règles pour automatiser la sélection</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Requêtes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalRequests}</div>
                  <p className="text-xs text-muted-foreground">7 derniers jours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Succès</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">
                    {analytics.successfulRequests}/{analytics.totalRequests} réussies
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tokens Utilisés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalTokens.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total consommé</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Coût Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.totalCost.toFixed(4)}</div>
                  <p className="text-xs text-muted-foreground">7 derniers jours</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune donnée disponible</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelligentApiKeyManager;

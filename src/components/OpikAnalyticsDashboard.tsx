import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { opikService } from '@/services/opikService';
import { Activity, BarChart3, Clock, DollarSign, Star, TrendingUp, Sparkles, Play, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { llmRouter } from '@/services/llmRouter';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TraceData {
  id: string;
  trace_id: string;
  prompt_input: string;
  prompt_output: string;
  model: string;
  latency_ms: number;
  tokens_used: number;
  cost: number;
  feedback_score: number | null;
  tags: any;
  created_at: string;
}

export const OpikAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { credits, useCredit } = useUserCredits();
  const [stats, setStats] = useState({
    avgLatency: 0,
    totalTokens: 0,
    totalCost: 0,
    avgFeedback: 0,
    totalTraces: 0
  });
  const [recentTraces, setRecentTraces] = useState<TraceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [improvingTraceId, setImprovingTraceId] = useState<string | null>(null);
  const [improvedPrompt, setImprovedPrompt] = useState<string>('');
  const [showImprovedDialog, setShowImprovedDialog] = useState(false);
  const [testingTraceId, setTestingTraceId] = useState<string | null>(null);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testPrompt, setTestPrompt] = useState<string>('');
  const [testInput, setTestInput] = useState<string>('');
  const [testOutput, setTestOutput] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(0);

  useEffect(() => {
    if (user) {
      loadAnalytics();

      const interval = setInterval(() => {
        if (!document.hidden) {
          loadAnalytics(true);
        }
      }, 30000);

      const handleVisibilityChange = () => {
        if (!document.hidden) {
          loadAnalytics(true);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [user]);

  const loadAnalytics = async (isBackgroundRefresh = false) => {
    if (!user) return;

    if (isBackgroundRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      console.log('🔄 Rechargement des analytics Opik pour user:', user.id);

      const [aggregatedStats, traces] = await Promise.all([
        opikService.getAggregatedMetrics(user.id),
        opikService.getTracesByUser(user.id, 10)
      ]);

      console.log('📊 Stats reçues:', aggregatedStats);
      console.log('📝 Traces reçues:', traces.length);

      setStats(aggregatedStats);
      setRecentTraces(traces);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const formatLatency = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const improvePrompt = async (trace: TraceData) => {
    if (!user) return;

    const creditsRemaining = credits?.remaining_credits || 0;
    if (creditsRemaining <= 0) {
      toast({
        title: "Crédits insuffisants",
        description: "Vous n'avez plus de crédits pour améliorer des prompts.",
        variant: "destructive"
      });
      return;
    }

    setImprovingTraceId(trace.id);

    try {
      const userHasCredits = creditsRemaining > 0;

      const systemPrompt = `Tu es un expert en optimisation de prompts IA. Ton rôle est d'améliorer les prompts en utilisant les données d'analyse suivantes:

- Score actuel: ${trace.feedback_score || 'N/A'}
- Latence: ${trace.latency_ms}ms
- Tokens utilisés: ${trace.tokens_used}
- Modèle: ${trace.model}

Analyse le prompt et améliore-le en:
1. Rendant les instructions plus claires et précises
2. Ajoutant du contexte si nécessaire
3. Optimisant pour réduire les tokens si la latence est élevée
4. Améliorant la structure pour un meilleur score
5. Gardant l'objectif original intact

Fournis UNIQUEMENT le prompt amélioré, sans explications supplémentaires.`;

      const userPrompt = `Prompt à améliorer:\n\n${trace.prompt_output}`;

      const llmResponse = await llmRouter.generatePrompt(
        systemPrompt,
        userPrompt,
        {
          isAuthenticated: true,
          userHasCredits,
          temperature: 0.7,
          maxTokens: 1000
        }
      );

      setImprovedPrompt(llmResponse.content);
      setShowImprovedDialog(true);

      await useCredit(1, 'prompt_improvement');

      toast({
        title: "Prompt amélioré!",
        description: "Le prompt a été optimisé avec succès."
      });

    } catch (error) {
      console.error('Erreur lors de l\'amélioration du prompt:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'améliorer le prompt. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setImprovingTraceId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié!",
      description: "Le prompt a été copié dans le presse-papiers."
    });
  };

  const openTestDialog = (trace: TraceData) => {
    setTestingTraceId(trace.id);
    setTestPrompt(trace.prompt_output);
    setTestInput('');
    setTestOutput('');
    setShowTestDialog(true);
  };

  const runTest = async () => {
    if (!user || !testInput.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un texte de test.",
        variant: "destructive"
      });
      return;
    }

    const creditsRemaining = credits?.remaining_credits || 0;
    if (creditsRemaining <= 0) {
      toast({
        title: "Crédits insuffisants",
        description: "Vous n'avez plus de crédits pour tester des prompts.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestOutput('');
    setTestStartTime(Date.now());

    try {
      const userHasCredits = creditsRemaining > 0;

      const llmResponse = await llmRouter.generatePrompt(
        testPrompt,
        testInput,
        {
          isAuthenticated: true,
          userHasCredits,
          temperature: 0.7,
          maxTokens: 1000
        }
      );

      const latency = Date.now() - testStartTime;
      setTestOutput(llmResponse.content);

      await opikService.logTrace(
        user.id,
        testInput,
        llmResponse.content,
        {
          model: llmResponse.model || 'deepseek-chat',
          latency_ms: latency,
          tokens_used: llmResponse.usage?.total_tokens || 0,
          cost: 0,
          tags: {
            source: 'opik_test',
            provider: llmResponse.provider
          }
        }
      );

      await useCredit(1, 'prompt_test');

      toast({
        title: "Test réussi!",
        description: `Latence: ${latency}ms - Les résultats ont été enregistrés dans Opik.`
      });

      loadAnalytics(true);

    } catch (error) {
      console.error('Erreur lors du test:', error);
      toast({
        title: "Erreur",
        description: "Impossible de tester le prompt. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card">
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Opik Analytics</h2>
        <p className="text-muted-foreground">
          Suivez et optimisez la qualite de vos prompts avec Opik
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Traces</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTraces}</div>
            <p className="text-xs text-muted-foreground">Prompts generes</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latence Moyenne</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatLatency(stats.avgLatency)}</div>
            <p className="text-xs text-muted-foreground">Temps de reponse</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Utilises</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTokens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total consommes</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Moyen</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgFeedback > 0 ? stats.avgFeedback.toFixed(2) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Qualite des prompts</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cout Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCost.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">Depenses API</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traces Recentes
              </CardTitle>
              <CardDescription>
                Historique de vos 10 dernieres generations de prompts
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAnalytics(true)}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              ) : (
                <Activity className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {recentTraces.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune trace disponible</p>
                <p className="text-sm">Generez des prompts pour voir les analytics</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTraces.map((trace) => (
                  <Card key={trace.id} className="border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {trace.model}
                            </Badge>
                            {trace.tags?.provider && (
                              <Badge variant="secondary" className="text-xs">
                                {trace.tags.provider}
                              </Badge>
                            )}
                            {trace.tags?.category && (
                              <Badge variant="default" className="text-xs">
                                {trace.tags.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {trace.prompt_input}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Latence:</span>
                            <div className="font-medium">{formatLatency(trace.latency_ms)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tokens:</span>
                            <div className="font-medium">{trace.tokens_used}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <div className="font-medium">{formatDate(trace.created_at)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Score:</span>
                            <div className="font-medium">
                              {trace.feedback_score ? trace.feedback_score.toFixed(2) : 'N/A'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() => openTestDialog(trace)}
                            disabled={!credits || credits.remaining_credits <= 0}
                            size="sm"
                            variant="outline"
                            className="w-full"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Tester
                          </Button>

                          <Button
                            onClick={() => improvePrompt(trace)}
                            disabled={improvingTraceId === trace.id || !credits || credits.remaining_credits <= 0}
                            size="sm"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {improvingTraceId === trace.id ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                Amélioration...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Améliorer
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={showImprovedDialog} onOpenChange={setShowImprovedDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Prompt Amélioré
            </DialogTitle>
            <DialogDescription>
              Voici le prompt optimisé en utilisant les données d'analyse Opik
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Textarea
                value={improvedPrompt}
                readOnly
                className="min-h-[300px] font-mono text-sm resize-none"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowImprovedDialog(false)}
              >
                Fermer
              </Button>
              <Button
                onClick={() => copyToClipboard(improvedPrompt)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Copier le prompt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-600" />
              Tester votre prompt
            </DialogTitle>
            <DialogDescription>
              Testez votre prompt avec des données personnalisées et voyez les résultats en temps réel
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-prompt" className="text-sm font-medium">
                Prompt à tester
              </Label>
              <Textarea
                id="test-prompt"
                value={testPrompt}
                readOnly
                className="min-h-[120px] font-mono text-sm resize-none bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-input" className="text-sm font-medium">
                Entrée de test
              </Label>
              <Textarea
                id="test-input"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Entrez votre texte de test ici..."
                className="min-h-[120px] resize-none"
                disabled={isTesting}
              />
            </div>

            {testOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Résultat</Label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(testOutput)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                </div>
                <div className="relative">
                  <Textarea
                    value={testOutput}
                    readOnly
                    className="min-h-[200px] font-mono text-sm resize-none bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowTestDialog(false)}
                disabled={isTesting}
              >
                Fermer
              </Button>
              <Button
                onClick={runTest}
                disabled={isTesting || !testInput.trim()}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {isTesting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Test en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Lancer le test
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

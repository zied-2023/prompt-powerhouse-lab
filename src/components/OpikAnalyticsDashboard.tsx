import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { opikService } from '@/services/opikService';
import { Activity, BarChart3, Clock, DollarSign, Star, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

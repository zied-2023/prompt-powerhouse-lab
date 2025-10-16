import { supabase } from '@/integrations/supabase/client';

const OPIK_API_KEY = import.meta.env.VITE_OPIK_API_KEY;
const OPIK_BASE_URL = 'https://www.comet.com/opik/api';

export interface OpikTrace {
  id?: string;
  userId: string;
  traceId: string;
  promptInput: string;
  promptOutput?: string;
  model?: string;
  latencyMs?: number;
  tokensUsed?: number;
  cost?: number;
  feedbackScore?: number;
  tags?: Record<string, any>;
}

export interface OpikMetric {
  traceId: string;
  metricName: string;
  metricValue: number;
  metadata?: Record<string, any>;
}

class OpikService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = OPIK_API_KEY || '';
    this.baseUrl = OPIK_BASE_URL;
  }

  async createTrace(trace: OpikTrace): Promise<string | null> {
    try {
      const startTime = Date.now();

      console.log('🔍 Opik: Préparation des données de trace:', {
        userId: trace.userId,
        traceId: trace.traceId,
        model: trace.model,
        hasInput: !!trace.promptInput,
        hasOutput: !!trace.promptOutput,
        feedbackScore: trace.feedbackScore
      });

      const autoScore = this.calculateAutoScore(trace);

      const traceData = {
        user_id: trace.userId,
        trace_id: trace.traceId,
        prompt_input: trace.promptInput,
        prompt_output: trace.promptOutput,
        model: trace.model || 'gpt-3.5-turbo',
        latency_ms: trace.latencyMs || 0,
        tokens_used: trace.tokensUsed || 0,
        cost: trace.cost || 0,
        feedback_score: trace.feedbackScore !== undefined ? trace.feedbackScore : autoScore,
        tags: trace.tags || {}
      };

      console.log('📤 Opik: Envoi des données à Supabase avec score:', traceData.feedback_score);

      const { data, error } = await supabase
        .from('opik_prompt_traces')
        .insert(traceData)
        .select('id')
        .maybeSingle();

      if (error) {
        console.error('❌ Opik: Erreur lors de la création de la trace:', error);
        console.error('❌ Détails de l\'erreur:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return null;
      }

      console.log('✅ Opik: Trace créée dans Supabase avec ID:', data?.id);

      if (this.apiKey) {
        await this.sendToOpikAPI('traces', {
          id: trace.traceId,
          project_name: 'prompt-optimizer',
          start_time: new Date(startTime).toISOString(),
          end_time: new Date().toISOString(),
          input: { prompt: trace.promptInput },
          output: { text: trace.promptOutput },
          metadata: {
            model: trace.model,
            tokens: trace.tokensUsed,
            ...trace.tags
          }
        });
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in createTrace:', error);
      return null;
    }
  }

  async logTrace(
    userId: string,
    promptInput: string,
    promptOutput: string,
    options?: {
      model?: string;
      latency_ms?: number;
      tokens_used?: number;
      cost?: number;
      tags?: Record<string, any>;
    }
  ): Promise<string | null> {
    const traceId = this.generateTraceId();
    return this.createTrace({
      userId,
      traceId,
      promptInput,
      promptOutput,
      model: options?.model,
      latencyMs: options?.latency_ms,
      tokensUsed: options?.tokens_used,
      cost: options?.cost,
      tags: options?.tags
    });
  }

  async logMetric(metric: OpikMetric): Promise<boolean> {
    try {
      const metricData = {
        trace_id: metric.traceId,
        metric_name: metric.metricName,
        metric_value: metric.metricValue,
        metadata: metric.metadata || {}
      };

      const { error } = await supabase
        .from('opik_evaluation_metrics')
        .insert(metricData);

      if (error) {
        console.error('Error logging metric:', error);
        return false;
      }

      if (this.apiKey) {
        await this.sendToOpikAPI('metrics', {
          trace_id: metric.traceId,
          name: metric.metricName,
          value: metric.metricValue,
          metadata: metric.metadata
        });
      }

      return true;
    } catch (error) {
      console.error('Error in logMetric:', error);
      return false;
    }
  }

  async updateTraceFeedback(traceId: string, feedbackScore: number): Promise<{ error?: any }> {
    try {
      const { error } = await supabase
        .from('opik_prompt_traces')
        .update({ feedback_score: feedbackScore })
        .eq('trace_id', traceId);

      if (error) {
        console.error('Error updating feedback:', error);
        return { error };
      }

      return {};
    } catch (error) {
      console.error('Error in updateTraceFeedback:', error);
      return { error };
    }
  }

  async getTracesByUser(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('opik_prompt_traces')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching traces:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getTracesByUser:', error);
      return [];
    }
  }

  async getMetricsForTrace(traceId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('opik_evaluation_metrics')
        .select('*')
        .eq('trace_id', traceId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching metrics:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMetricsForTrace:', error);
      return [];
    }
  }

  async getAggregatedMetrics(userId: string): Promise<{
    avgLatency: number;
    totalTokens: number;
    totalCost: number;
    avgFeedback: number;
    totalTraces: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('opik_prompt_traces')
        .select('latency_ms, tokens_used, cost, feedback_score')
        .eq('user_id', userId);

      if (error || !data) {
        return {
          avgLatency: 0,
          totalTokens: 0,
          totalCost: 0,
          avgFeedback: 0,
          totalTraces: 0
        };
      }

      const stats = data.reduce((acc, trace) => {
        acc.totalLatency += trace.latency_ms || 0;
        acc.totalTokens += trace.tokens_used || 0;
        acc.totalCost += parseFloat(trace.cost?.toString() || '0');
        if (trace.feedback_score !== null) {
          acc.totalFeedback += trace.feedback_score;
          acc.feedbackCount += 1;
        }
        return acc;
      }, {
        totalLatency: 0,
        totalTokens: 0,
        totalCost: 0,
        totalFeedback: 0,
        feedbackCount: 0
      });

      return {
        avgLatency: data.length > 0 ? stats.totalLatency / data.length : 0,
        totalTokens: stats.totalTokens,
        totalCost: stats.totalCost,
        avgFeedback: stats.feedbackCount > 0 ? stats.totalFeedback / stats.feedbackCount : 0,
        totalTraces: data.length
      };
    } catch (error) {
      console.error('Error in getAggregatedMetrics:', error);
      return {
        avgLatency: 0,
        totalTokens: 0,
        totalCost: 0,
        avgFeedback: 0,
        totalTraces: 0
      };
    }
  }

  private async sendToOpikAPI(endpoint: string, data: any): Promise<void> {
    if (!this.apiKey) return;

    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.warn(`Opik API warning: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.warn('Could not send data to Opik API:', error);
    }
  }

  generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateAutoScore(trace: OpikTrace): number {
    let score = 3.5;

    if (trace.latencyMs && trace.latencyMs < 2000) {
      score += 0.5;
    }

    if (trace.promptOutput && trace.promptOutput.length > 100) {
      score += 0.5;
    }

    if (trace.promptOutput && trace.promptOutput.includes('**')) {
      score += 0.3;
    }

    if (trace.tokensUsed && trace.tokensUsed > 0) {
      if (trace.tokensUsed < 500) {
        score += 0.2;
      }
    }

    return Math.min(5, Math.max(1, score));
  }
}

export const opikService = new OpikService();

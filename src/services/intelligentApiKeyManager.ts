import { supabase } from '@/integrations/supabase/client';

export interface ApiKey {
  id: string;
  user_id: string;
  provider: string;
  api_key_encrypted: string;
  nickname?: string;
  is_active: boolean;
  priority: number;
  usage_count: number;
  last_used_at?: string;
  context_tags: string[];
  rate_limit_per_minute?: number;
  cost_per_token?: number;
  created_at: string;
  updated_at: string;
}

export interface SelectionRule {
  id: string;
  user_id: string;
  name: string;
  conditions: Record<string, any>;
  preferred_provider: string;
  is_active: boolean;
  priority: number;
  created_at: string;
}

export interface RequestContext {
  task_type?: 'text_generation' | 'code_generation' | 'translation' | 'analysis' | 'chat' | 'embedding';
  model_preference?: 'fast' | 'quality' | 'cost_effective';
  max_tokens?: number;
  estimated_tokens?: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  user_preference?: string;
}

export interface UsageLog {
  api_key_id: string;
  context: RequestContext;
  success: boolean;
  tokens_used?: number;
  cost?: number;
  response_time_ms?: number;
  error_message?: string;
}

class IntelligentApiKeyManager {

  async selectBestApiKey(context: RequestContext): Promise<ApiKey | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const rules = await this.getUserRules(user.id);
      const apiKeys = await this.getActiveApiKeys(user.id);

      if (!apiKeys || apiKeys.length === 0) {
        return null;
      }

      const matchingRule = this.findMatchingRule(rules, context);

      if (matchingRule) {
        const preferredKeys = apiKeys.filter(
          key => key.provider === matchingRule.preferred_provider
        );
        if (preferredKeys.length > 0) {
          return this.selectOptimalKey(preferredKeys, context);
        }
      }

      return this.selectOptimalKey(apiKeys, context);
    } catch (error) {
      console.error('Error selecting API key:', error);
      return null;
    }
  }

  private findMatchingRule(rules: SelectionRule[], context: RequestContext): SelectionRule | null {
    const activeRules = rules
      .filter(rule => rule.is_active)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of activeRules) {
      if (this.ruleMatches(rule.conditions, context)) {
        return rule;
      }
    }

    return null;
  }

  private ruleMatches(conditions: Record<string, any>, context: RequestContext): boolean {
    for (const [key, value] of Object.entries(conditions)) {
      const contextValue = context[key as keyof RequestContext];

      if (Array.isArray(value)) {
        if (!value.includes(contextValue)) {
          return false;
        }
      } else if (typeof value === 'object' && value !== null) {
        if (value.min !== undefined && contextValue !== undefined) {
          if (contextValue < value.min) return false;
        }
        if (value.max !== undefined && contextValue !== undefined) {
          if (contextValue > value.max) return false;
        }
      } else {
        if (contextValue !== value) {
          return false;
        }
      }
    }

    return true;
  }

  private selectOptimalKey(apiKeys: ApiKey[], context: RequestContext): ApiKey {
    const scoredKeys = apiKeys.map(key => ({
      key,
      score: this.calculateKeyScore(key, context)
    }));

    scoredKeys.sort((a, b) => b.score - a.score);

    return scoredKeys[0].key;
  }

  private calculateKeyScore(key: ApiKey, context: RequestContext): number {
    let score = 0;

    score += key.priority * 10;

    if (context.tags && key.context_tags) {
      const matchingTags = context.tags.filter(tag =>
        key.context_tags.includes(tag)
      );
      score += matchingTags.length * 5;
    }

    if (context.model_preference === 'cost_effective' && key.cost_per_token) {
      score -= key.cost_per_token * 1000;
    }

    if (context.model_preference === 'fast') {
      if (key.provider === 'openai' || key.provider === 'anthropic') {
        score += 20;
      }
    }

    if (context.model_preference === 'quality') {
      if (key.provider === 'anthropic' || key.provider === 'openai') {
        score += 15;
      }
    }

    if (key.rate_limit_per_minute) {
      const recentUsage = this.estimateRecentUsage(key);
      if (recentUsage < key.rate_limit_per_minute * 0.8) {
        score += 10;
      } else if (recentUsage >= key.rate_limit_per_minute) {
        score -= 50;
      }
    }

    const hoursSinceLastUse = key.last_used_at
      ? (Date.now() - new Date(key.last_used_at).getTime()) / (1000 * 60 * 60)
      : 24;

    if (hoursSinceLastUse > 1) {
      score += 5;
    }

    return score;
  }

  private estimateRecentUsage(key: ApiKey): number {
    return 0;
  }

  async logUsage(log: UsageLog): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('api_key_usage_logs').insert({
        api_key_id: log.api_key_id,
        user_id: user.id,
        context: log.context,
        success: log.success,
        tokens_used: log.tokens_used,
        cost: log.cost,
        response_time_ms: log.response_time_ms,
        error_message: log.error_message
      });

      await supabase
        .from('api_keys')
        .update({
          usage_count: supabase.sql`usage_count + 1`,
          last_used_at: new Date().toISOString()
        })
        .eq('id', log.api_key_id);

    } catch (error) {
      console.error('Error logging API key usage:', error);
    }
  }

  async getActiveApiKeys(userId: string): Promise<ApiKey[]> {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }

    return data || [];
  }

  async getUserRules(userId: string): Promise<SelectionRule[]> {
    const { data, error } = await supabase
      .from('api_key_selection_rules')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) {
      console.error('Error fetching selection rules:', error);
      return [];
    }

    return data || [];
  }

  async addApiKey(apiKey: Omit<ApiKey, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'usage_count'>): Promise<ApiKey | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          provider: apiKey.provider,
          api_key_encrypted: apiKey.api_key_encrypted,
          nickname: apiKey.nickname,
          is_active: apiKey.is_active,
          priority: apiKey.priority,
          context_tags: apiKey.context_tags,
          rate_limit_per_minute: apiKey.rate_limit_per_minute,
          cost_per_token: apiKey.cost_per_token
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding API key:', error);
      return null;
    }
  }

  async updateApiKey(keyId: string, updates: Partial<ApiKey>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', keyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating API key:', error);
      return false;
    }
  }

  async deleteApiKey(keyId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  async addSelectionRule(rule: Omit<SelectionRule, 'id' | 'user_id' | 'created_at'>): Promise<SelectionRule | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('api_key_selection_rules')
        .insert({
          user_id: user.id,
          name: rule.name,
          conditions: rule.conditions,
          preferred_provider: rule.preferred_provider,
          is_active: rule.is_active,
          priority: rule.priority
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding selection rule:', error);
      return null;
    }
  }

  async updateSelectionRule(ruleId: string, updates: Partial<SelectionRule>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_key_selection_rules')
        .update(updates)
        .eq('id', ruleId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating selection rule:', error);
      return false;
    }
  }

  async deleteSelectionRule(ruleId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('api_key_selection_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting selection rule:', error);
      return false;
    }
  }

  async getUsageAnalytics(days: number = 7): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('api_key_usage_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalRequests = data?.length || 0;
      const successfulRequests = data?.filter(log => log.success).length || 0;
      const totalTokens = data?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0;
      const totalCost = data?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0;
      const avgResponseTime = data && data.length > 0
        ? data.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / data.length
        : 0;

      const byProvider = data?.reduce((acc, log) => {
        const provider = log.context?.provider || 'unknown';
        if (!acc[provider]) {
          acc[provider] = { count: 0, tokens: 0, cost: 0 };
        }
        acc[provider].count += 1;
        acc[provider].tokens += log.tokens_used || 0;
        acc[provider].cost += log.cost || 0;
        return acc;
      }, {} as Record<string, { count: number; tokens: number; cost: number }>);

      return {
        totalRequests,
        successfulRequests,
        successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
        totalTokens,
        totalCost,
        avgResponseTime,
        byProvider
      };
    } catch (error) {
      console.error('Error fetching usage analytics:', error);
      return null;
    }
  }

  encryptApiKey(apiKey: string): string {
    return btoa(apiKey);
  }

  decryptApiKey(encryptedKey: string): string {
    return atob(encryptedKey);
  }
}

export const intelligentApiKeyManager = new IntelligentApiKeyManager();

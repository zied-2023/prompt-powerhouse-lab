
// Configuration centralisée des API
export interface ApiConfig {
  endpoint: string;
  key: string | null;
  model: string;
}

// Configuration pour OpenRouter API
const OPENROUTER_CONFIG: ApiConfig = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: null, // Sera définie via les secrets Supabase ou input utilisateur
  model: 'anthropic/claude-3.5-sonnet'
};

// Gestionnaire de configuration API sécurisé
export class ApiConfigManager {
  private static instance: ApiConfigManager;
  private config: ApiConfig;

  private constructor() {
    this.config = { ...OPENROUTER_CONFIG };
    this.loadApiKey();
  }

  public static getInstance(): ApiConfigManager {
    if (!ApiConfigManager.instance) {
      ApiConfigManager.instance = new ApiConfigManager();
    }
    return ApiConfigManager.instance;
  }

  private loadApiKey(): void {
    // Priorité 1: Secrets Supabase (recommandé pour la production)
    // Priorité 2: Variable d'environnement (non disponible en frontend)
    // Priorité 3: LocalStorage (temporaire pour développement)
    
    const localApiKey = localStorage.getItem('openrouter_api_key');
    if (localApiKey) {
      this.config.key = localApiKey;
    } else {
      // Clé par défaut (à remplacer par les secrets Supabase)
      this.config.key = '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';
    }
  }

  public getConfig(): ApiConfig {
    return { ...this.config };
  }

  public updateApiKey(newKey: string): void {
    this.config.key = newKey;
    // Sauvegarde temporaire en localStorage
    localStorage.setItem('openrouter_api_key', newKey);
  }

  public clearApiKey(): void {
    this.config.key = null;
    localStorage.removeItem('openrouter_api_key');
  }

  public hasValidKey(): boolean {
    return this.config.key !== null && this.config.key.trim().length > 0;
  }
}

// Export de l'instance singleton
export const apiConfigManager = ApiConfigManager.getInstance();


// Configuration centralisée des API
export interface ApiConfig {
  endpoint: string;
  key: string | null;
  model: string;
}

// Configuration pour OpenRouter API
const OPENROUTER_CONFIG: ApiConfig = {
  endpoint: 'https://openrouter.ai/api/v1/chat/completions',
  key: null, // Aucune clé par défaut - doit être configurée par l'utilisateur
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
    }
    // Suppression de la clé par défaut - l'utilisateur doit configurer sa propre clé
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

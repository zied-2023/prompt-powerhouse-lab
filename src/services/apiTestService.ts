// Service pour tester les clés API
export class ApiTestService {
  
  /**
   * Teste une clé API selon le fournisseur
   */
  async testApiKey(provider: string, apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      switch (provider) {
        case 'openai':
          return await this.testOpenAI(apiKey);
        case 'deepseek':
          return await this.testDeepSeek(apiKey);
        case 'glm':
          return await this.testGLM(apiKey);
        case 'stripe':
          return await this.testStripe(apiKey);
        case 'anthropic':
          return await this.testAnthropic(apiKey);
        case 'sendgrid':
          return await this.testSendGrid(apiKey);
        case 'github':
          return await this.testGitHub(apiKey);
        default:
          return {
            success: false,
            message: 'Fournisseur non supporté',
            details: `Le fournisseur '${provider}' n'est pas encore supporté`
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors du test de la clé API',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Teste une clé API OpenAI
   */
  private async testOpenAI(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `Clé OpenAI valide. ${data.data?.length || 0} modèles disponibles.`,
          details: {
            status: response.status,
            modelsCount: data.data?.length || 0,
            organization: response.headers.get('openai-organization') || 'Non spécifiée'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Clé OpenAI invalide: ${errorData.error?.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData.error || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API OpenAI',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  /**
   * Teste une clé API DeepSeek
   */
  private async testDeepSeek(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const response = await fetch('https://api.deepseek.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `Clé DeepSeek valide. ${data.data?.length || 0} modèles disponibles.`,
          details: {
            status: response.status,
            modelsCount: data.data?.length || 0,
            endpoint: 'https://api.deepseek.com/v1'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Clé DeepSeek invalide: ${errorData.error?.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData.error || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API DeepSeek',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  /**
   * Teste une clé API GLM
   */
  private async testGLM(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [
            {
              role: 'user',
              content: 'Test'
            }
          ],
          max_tokens: 1
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Clé GLM valide.',
          details: {
            status: response.status,
            model: 'glm-4-flash',
            endpoint: 'https://open.bigmodel.cn/api/paas/v4'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Clé GLM invalide: ${errorData.error?.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData.error || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API GLM',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  /**
   * Teste une clé API Stripe
   */
  private async testStripe(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const isTestKey = apiKey.startsWith('sk_test_');
      const baseUrl = 'https://api.stripe.com/v1';
      
      const response = await fetch(`${baseUrl}/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `Clé Stripe ${isTestKey ? 'de test' : 'en production'} valide.`,
          details: {
            status: response.status,
            mode: isTestKey ? 'test' : 'live',
            currency: data.available?.[0]?.currency || 'Non disponible',
            accountId: response.headers.get('request-id') || 'Non disponible'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Clé Stripe invalide: ${errorData.error?.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData.error || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API Stripe',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  /**
   * Teste une clé API Anthropic
   */
  private async testAnthropic(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // Anthropic ne fournit pas d'endpoint simple pour tester les clés
      // Nous utilisons une requête de completion minimale
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [
            {
              role: 'user',
              content: 'Test'
            }
          ]
        })
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Clé Anthropic (Claude) valide.',
          details: {
            status: response.status,
            model: 'claude-3-haiku-20240307'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Clé Anthropic invalide: ${errorData.error?.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData.error || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API Anthropic',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  /**
   * Teste une clé API SendGrid
   */
  private async testSendGrid(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Clé SendGrid valide.',
          details: {
            status: response.status,
            username: data.username || 'Non disponible',
            email: data.email || 'Non disponible'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Clé SendGrid invalide: ${errorData.errors?.[0]?.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData.errors || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API SendGrid',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }

  /**
   * Teste un token GitHub
   */
  private async testGitHub(apiKey: string): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'API-Test-Tool'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: 'Token GitHub valide.',
          details: {
            status: response.status,
            login: data.login || 'Non disponible',
            name: data.name || 'Non disponible',
            public_repos: data.public_repos || 0,
            scopes: response.headers.get('x-oauth-scopes') || 'Non disponible'
          }
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: `Token GitHub invalide: ${errorData.message || 'Erreur d\'authentification'}`,
          details: {
            status: response.status,
            error: errorData || 'Erreur inconnue'
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Impossible de contacter l\'API GitHub',
        details: error instanceof Error ? error.message : 'Erreur réseau'
      };
    }
  }
}

// Instance singleton du service
export const apiTestService = new ApiTestService();
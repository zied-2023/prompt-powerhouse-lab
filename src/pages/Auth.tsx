import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Sparkles } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the return URL or default to /app
  const from = location.state?.from?.pathname || '/app';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <>
      <SEOHead 
        title="Connexion - AutoPrompt"
        description="Connectez-vous à votre compte AutoPrompt pour accéder à vos prompts et fonctionnalités avancées."
        keywords="connexion, authentification, compte, login"
      />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-emerald-50 dark:from-violet-950/20 dark:via-blue-950/20 dark:to-emerald-950/20 flex items-center justify-center p-4">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="AutoPrompt" className="h-8 w-8" />
              <span className="text-xl font-bold gradient-text">AutoPrompt</span>
            </div>
          </div>

          <Card className="glass-card border-white/20 shadow-2xl backdrop-blur-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-violet-100 to-blue-100 dark:from-violet-900/50 dark:to-blue-900/50 rounded-full">
                  <Shield className="h-8 w-8 text-violet-600 dark:text-violet-300" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold gradient-text">
                Bienvenue sur AutoPrompt
              </CardTitle>
              <CardDescription className="text-base">
                Connectez-vous ou créez un compte pour accéder à toutes nos fonctionnalités
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="text-sm font-medium">
                    Se connecter
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm font-medium">
                    S'inscrire
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <LoginForm onSuccess={handleAuthSuccess} />
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <SignUpForm onSuccess={handleAuthSuccess} />
                </TabsContent>
              </Tabs>

              {/* Trust indicators */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-green-500" />
                    <span>Sécurisé</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3 text-blue-500" />
                    <span>Gratuit</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help text */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </>
  );
};

export default Auth;
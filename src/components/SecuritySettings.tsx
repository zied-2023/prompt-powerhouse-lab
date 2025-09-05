import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

const SecuritySettings = () => {
  const securityIssues = [
    {
      type: 'warning',
      title: 'Configuration OTP',
      description: 'L\'expiration OTP dépasse le seuil recommandé',
      action: 'Configurer dans Supabase Auth',
      link: 'https://supabase.com/docs/guides/platform/going-into-prod#security',
      status: 'pending'
    },
    {
      type: 'warning', 
      title: 'Protection Mots de Passe',
      description: 'La protection contre les mots de passe divulgués est désactivée',
      action: 'Activer dans Supabase Auth',
      link: 'https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection',
      status: 'pending'
    },
    {
      type: 'success',
      title: 'RLS Policies',
      description: 'Row Level Security correctement configuré',
      action: 'Complet',
      status: 'completed'
    },
    {
      type: 'success',
      title: 'Authentification',
      description: 'Système d\'authentification sécurisé avec redirections',
      action: 'Complet',
      status: 'completed'
    },
    {
      type: 'success',
      title: 'Fonctions Database',
      description: 'Search paths et SECURITY DEFINER configurés',
      action: 'Complet',
      status: 'completed'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <CardTitle>Configuration Sécurité</CardTitle>
          </div>
          <CardDescription>
            État de la sécurité de votre application et actions recommandées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityIssues.map((issue, index) => (
            <Alert key={index} className={issue.type === 'warning' ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950' : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'}>
              <div className="flex items-start space-x-3">
                {issue.type === 'warning' ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{issue.title}</h3>
                    {issue.link && issue.type === 'warning' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(issue.link, '_blank')}
                        className="text-xs"
                      >
                        Configurer
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                  <AlertDescription className="text-xs mt-1">
                    {issue.description}
                  </AlertDescription>
                  <p className="text-xs text-muted-foreground mt-1">
                    Action: {issue.action}
                  </p>
                </div>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Instructions de Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <h4 className="font-semibold text-orange-600 dark:text-orange-400">Configuration OTP</h4>
            <p className="text-muted-foreground">
              1. Allez dans votre dashboard Supabase<br/>
              2. Authentication → Settings<br/>
              3. Réduisez l'expiration OTP à 1 heure maximum
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-orange-600 dark:text-orange-400">Protection Mots de Passe</h4>
            <p className="text-muted-foreground">
              1. Authentication → Settings<br/>
              2. Activez "Leaked Password Protection"<br/>
              3. Configurez les critères de force des mots de passe
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
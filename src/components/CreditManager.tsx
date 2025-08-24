import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, CreditCard, Zap, Star, Crown, Sparkles } from "lucide-react";
import { useUserCredits } from "@/hooks/useUserCredits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Plans de crédits
const CREDIT_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    credits: 100,
    price: 4.99,
    priceId: 'price_starter_credits', // ID Stripe
    popular: false,
    features: ['100 générations de prompts', 'Support email', 'Accès bibliothèque']
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 500,
    price: 19.99,
    priceId: 'price_pro_credits',
    popular: true,
    features: ['500 générations de prompts', 'Support prioritaire', 'Templates avancés', 'Historique illimité']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    credits: 2000,
    price: 69.99,
    priceId: 'price_enterprise_credits',
    popular: false,
    features: ['2000 générations', 'Support 24/7', 'API privée', 'Intégrations custom']
  }
];

const CreditManager = () => {
  const { credits, refetchCredits } = useUserCredits();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Fonction pour créer une session Stripe Checkout
  const handlePurchase = async (plan: typeof CREDIT_PLANS[0]) => {
    setLoading(true);
    setSelectedPlan(plan.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour acheter des crédits",
          variant: "destructive"
        });
        return;
      }

      // Appel à votre fonction Edge de Supabase pour créer la session Stripe
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId: plan.priceId,
          credits: plan.credits,
          userId: user.id,
          userEmail: user.email,
          planName: plan.name
        }
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirection vers Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (error) {
      console.error('Erreur lors de la création du paiement:', error);
      toast({
        title: "Erreur de paiement",
        description: "Impossible de créer la session de paiement. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  // Fonction pour restaurer les crédits (useful pour debug/admin)
  const handleRestoreCredits = async () => {
    try {
      await refetchCredits();
      toast({
        title: "Crédits actualisés",
        description: "Vos crédits ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les crédits",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Statut actuel des crédits - Version compacte */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/30">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {credits?.remaining_credits || 0}
            </div>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">Crédits disponibles</div>
        
        {/* Statistiques en ligne */}
        <div className="flex justify-between text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
          <div className="text-center">
            <div className="font-bold text-foreground">{credits?.used_credits || 0}</div>
            <div>Utilisés</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">{credits?.total_credits || 0}</div>
            <div>Total</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-foreground">{credits?.remaining_credits || 0}</div>
            <div>Restants</div>
          </div>
        </div>
      </div>

      {/* Plans de crédits - Version compacte */}
      <div className="space-y-3">
        {CREDIT_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg border ${
              plan.popular 
                ? 'border-violet-200 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-900/10' 
                : 'border-border'
            }`}
          >
            {plan.popular && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300 text-xs">
                  Populaire
                </Badge>
              </div>
            )}
            
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                {/* Info du plan */}
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    plan.id === 'starter' ? 'bg-green-100 dark:bg-green-900' :
                    plan.id === 'pro' ? 'bg-violet-100 dark:bg-violet-900' :
                    'bg-orange-100 dark:bg-orange-900'
                  }`}>
                    {plan.id === 'starter' && <Coins className="h-5 w-5 text-green-600 dark:text-green-400" />}
                    {plan.id === 'pro' && <Crown className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
                    {plan.id === 'enterprise' && <Sparkles className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{plan.name}</div>
                    <div className="text-xs text-muted-foreground">{plan.credits} crédits</div>
                  </div>
                </div>

                {/* Prix et bouton */}
                <div className="text-right space-y-2">
                  <div className="text-lg font-bold">{plan.price}€</div>
                  <Button 
                    onClick={() => handlePurchase(plan)}
                    disabled={loading}
                    className={`w-full text-xs h-8 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="sm"
                  >
                    {loading && selectedPlan === plan.id ? (
                      <div className="flex items-center space-x-1">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        <span>...</span>
                      </div>
                    ) : (
                      'Acheter'
                    )}
                  </Button>
                </div>
              </div>

              {/* Features condensées */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="text-xs text-muted-foreground space-y-1">
                  {plan.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 2 && (
                    <div className="text-xs text-muted-foreground/70">
                      +{plan.features.length - 2} autres avantages
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info sécurité - Version minimale */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3" />
          <span>Paiement sécurisé par Stripe</span>
        </div>
      </div>
    </div>
  );
};

export default CreditManager;
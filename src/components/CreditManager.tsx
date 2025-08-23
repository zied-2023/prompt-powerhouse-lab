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
    <div className="space-y-8">
      {/* Statut actuel des crédits */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Coins className="h-8 w-8 text-yellow-500" />
            <span>Mes Crédits</span>
          </CardTitle>
          <CardDescription>
            Gérez vos crédits pour générer des prompts et utiliser les fonctionnalités avancées
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-4 border-yellow-400/30">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                {credits?.remaining_credits || 0}
              </div>
              <div className="text-sm text-muted-foreground">crédits</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="glass-card p-4 border-white/20 dark:border-gray-700/20">
              <div className="font-semibold text-green-600 dark:text-green-400">Total utilisé</div>
              <div className="text-2xl font-bold">{credits?.used_credits || 0}</div>
            </div>
            <div className="glass-card p-4 border-white/20 dark:border-gray-700/20">
              <div className="font-semibold text-blue-600 dark:text-blue-400">Total disponible</div>
              <div className="text-2xl font-bold">{credits?.total_credits || 0}</div>
            </div>
            <div className="glass-card p-4 border-white/20 dark:border-gray-700/20">
              <div className="font-semibold text-purple-600 dark:text-purple-400">Restants</div>
              <div className="text-2xl font-bold">{credits?.remaining_credits || 0}</div>
            </div>
          </div>

          <Button 
            onClick={handleRestoreCredits}
            variant="outline" 
            size="sm"
            className="mt-4"
          >
            <Zap className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </CardContent>
      </Card>

      {/* Plans de crédits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CREDIT_PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`glass-card border-white/30 dark:border-gray-700/30 shadow-xl relative overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              plan.popular ? 'ring-2 ring-violet-400/50 dark:ring-violet-500/50' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-br from-violet-500 to-purple-600 text-white px-4 py-1 text-xs font-semibold transform rotate-12 translate-x-4 -translate-y-1">
                <Star className="inline h-3 w-3 mr-1" />
                POPULAIRE
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                plan.id === 'starter' ? 'bg-green-100 dark:bg-green-900' :
                plan.id === 'pro' ? 'bg-violet-100 dark:bg-violet-900' :
                'bg-orange-100 dark:bg-orange-900'
              }`}>
                {plan.id === 'starter' && <Coins className="h-8 w-8 text-green-600 dark:text-green-400" />}
                {plan.id === 'pro' && <Crown className="h-8 w-8 text-violet-600 dark:text-violet-400" />}
                {plan.id === 'enterprise' && <Sparkles className="h-8 w-8 text-orange-600 dark:text-orange-400" />}
              </div>
              
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-center">
                <span className="text-4xl font-bold">{plan.credits}</span>
                <span className="text-muted-foreground ml-2">crédits</span>
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {plan.price}€
                </span>
                <span className="text-muted-foreground ml-1">
                  ({(plan.price / plan.credits * 100).toFixed(1)}¢/crédit)
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button 
                onClick={() => handlePurchase(plan)}
                disabled={loading}
                className={`w-full ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white' 
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
                size="lg"
              >
                {loading && selectedPlan === plan.id ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Traitement...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Acheter</span>
                  </div>
                )}
              </Button>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-muted-foreground">Inclus :</div>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Informations de sécurité */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Paiement sécurisé par Stripe</h3>
              <p className="text-sm text-muted-foreground">
                Tous les paiements sont traités de manière sécurisée par Stripe. 
                Nous ne stockons aucune information de carte bancaire sur nos serveurs.
              </p>
              <div className="flex space-x-4 text-xs text-muted-foreground">
                <span>✓ Cryptage SSL 256-bit</span>
                <span>✓ Conforme PCI DSS</span>
                <span>✓ Remboursement sous 30 jours</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditManager;
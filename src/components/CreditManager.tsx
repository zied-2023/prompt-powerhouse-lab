import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Coins, CreditCard, Smartphone, Building, Zap, CheckCircle } from "lucide-react";
import { useUserCredits } from "@/hooks/useUserCredits";
import { toast } from "@/hooks/use-toast";

const CreditManager = () => {
  const { credits, plans, isLoading, addCredits } = useUserCredits();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'payMe',
      name: 'PayMe Tunisie',
      description: 'Solution de paiement mobile tunisienne',
      icon: Smartphone,
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    },
    {
      id: 'tunisiePaiement',
      name: 'Tunisie Paiement',
      description: 'Passerelle de paiement officielle',
      icon: Building,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      description: 'Visa, Mastercard acceptées',
      icon: CreditCard,
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    }
  ];

  const handlePurchase = async (planId: string, method: string) => {
    try {
      // Simulation d'achat - à remplacer par l'intégration réelle
      const plan = plans.find(p => p.id === planId);
      if (!plan) return;

      toast({
        title: "Redirection vers le paiement",
        description: `Redirection vers ${paymentMethods.find(m => m.id === method)?.name} pour ${plan.credits} crédits`,
      });

      // Simuler l'ajout de crédits après paiement réussi
      setTimeout(() => {
        addCredits(plan.credits);
        toast({
          title: "Paiement réussi !",
          description: `${plan.credits} crédits ont été ajoutés à votre compte.`,
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-card border-white/30 dark:border-gray-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Affichage des crédits actuels */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500">
                <Coins className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Mes Crédits</CardTitle>
                <CardDescription>Crédits disponibles pour la génération de prompts</CardDescription>
              </div>
            </div>
            <Badge 
              variant={credits?.remaining_credits && credits.remaining_credits > 0 ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {credits?.remaining_credits || 0} crédits
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{credits?.total_credits || 0}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">{credits?.used_credits || 0}</div>
              <div className="text-sm text-muted-foreground">Utilisés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{credits?.remaining_credits || 0}</div>
              <div className="text-sm text-muted-foreground">Restants</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans d'abonnement */}
      <Card className="glass-card border-white/30 dark:border-gray-700/30 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-violet-500" />
            <span>Plans de Crédits</span>
          </CardTitle>
          <CardDescription>
            Rechargez vos crédits pour continuer à générer des prompts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden border-2 hover:border-violet-300 dark:hover:border-violet-600 transition-colors">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                    {plan.price_tnd} TND
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {plan.credits} crédits
                    </Badge>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        Acheter maintenant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Choisir un mode de paiement</DialogTitle>
                        <DialogDescription>
                          Sélectionnez votre méthode de paiement préférée pour {plan.name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-3">
                        {paymentMethods.map((method) => {
                          const IconComponent = method.icon;
                          return (
                            <button
                              key={method.id}
                              onClick={() => {
                                setPaymentMethod(method.id);
                                handlePurchase(plan.id, method.id);
                              }}
                              className="w-full p-4 rounded-lg border-2 border-muted hover:border-violet-300 dark:hover:border-violet-600 transition-colors text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${method.color}`}>
                                  <IconComponent className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">{method.description}</div>
                                </div>
                                <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span>Total à payer:</span>
                          <span className="text-xl font-bold text-violet-600 dark:text-violet-400">
                            {plan.price_tnd} TND
                          </span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditManager;
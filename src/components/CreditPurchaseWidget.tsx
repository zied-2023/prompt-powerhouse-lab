import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, Sparkles } from "lucide-react";
import { useUserCredits } from "@/hooks/useUserCredits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface CreditOffer {
  credits: number;
  bonus: number;
  price: number;
  popular?: boolean;
}

const CREDIT_OFFERS: CreditOffer[] = [
  { credits: 50, bonus: 10, price: 4.99 },
  { credits: 100, bonus: 25, price: 9.99 },
  { credits: 250, bonus: 75, price: 19.99, popular: true },
  { credits: 500, bonus: 200, price: 34.99 },
];

export const CreditPurchaseWidget = () => {
  const { credits, refetchCredits, addCredits } = useUserCredits();
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<CreditOffer | null>(null);

  const remainingPercentage = credits
    ? (credits.remaining_credits / credits.total_credits) * 100
    : 0;

  const getProgressColor = () => {
    if (remainingPercentage > 50) return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (remainingPercentage > 25) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-rose-500';
  };

  const getBadgeStatus = () => {
    if (remainingPercentage > 75) return { text: 'Excellent', variant: 'default' as const };
    if (remainingPercentage > 50) return { text: 'Bon', variant: 'default' as const };
    if (remainingPercentage > 25) return { text: 'Moyen', variant: 'secondary' as const };
    return { text: 'Faible', variant: 'destructive' as const };
  };

  const handlePurchase = async (offer: CreditOffer) => {
    setLoading(true);
    setSelectedOffer(offer);

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

      const totalCredits = offer.credits + offer.bonus;
      await addCredits(totalCredits);

      toast({
        title: "Crédits ajoutés avec succès !",
        description: `${totalCredits} crédits (${offer.credits} + ${offer.bonus} bonus) ont été ajoutés à votre compte.`,
      });

      await refetchCredits();
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les crédits. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setSelectedOffer(null);
    }
  };

  const status = getBadgeStatus();

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="p-6 bg-gradient-to-br from-background via-background to-muted/20 border-2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Crédits</h3>
              <p className="text-sm text-muted-foreground">
                {Math.round(remainingPercentage)}% restants
              </p>
            </div>
          </div>
          <Badge variant={status.variant} className="font-semibold">
            {status.text}
          </Badge>
        </div>

        <div className="mb-6">
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{credits?.remaining_credits || 0} disponibles</span>
            <span>{credits?.total_credits || 0} total</span>
          </div>
        </div>

        <div className="space-y-3">
          {CREDIT_OFFERS.map((offer, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                offer.popular
                  ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              {offer.popular && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-lg">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Le plus populaire
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">
                      {offer.credits}
                    </span>
                    {offer.bonus > 0 && (
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        +{offer.bonus} bonus
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total: {offer.credits + offer.bonus} crédits
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-bold text-foreground mb-2">
                    {offer.price}€
                  </div>
                  <Button
                    onClick={() => handlePurchase(offer)}
                    disabled={loading}
                    size="sm"
                    className={`min-w-[100px] ${
                      offer.popular
                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg'
                        : ''
                    }`}
                  >
                    {loading && selectedOffer === offer ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>...</span>
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Acheter
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            Paiement sécurisé • Crédits ajoutés instantanément
          </p>
        </div>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Coins, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wifi,
  AlertTriangle,
  Zap,
  Building,
  Rocket
} from "lucide-react";
import { useUserCredits } from "@/hooks/useUserCredits";
import { toast } from "@/hooks/use-toast";

interface OrderData {
  amount: number;
  credits: number;
  email: string;
}

interface PaymentResult {
  success: boolean;
  message: string;
  orderId: string;
  amount: number;
  currency: string;
  timestamp: string;
  testMode: boolean;
  transactionId?: string;
  error_code?: string;
}

const PaymentSimulator = () => {
  const { addCredits, refetchCredits } = useUserCredits();
  const [orderData, setOrderData] = useState<OrderData>({
    amount: 25,
    credits: 250,
    email: 'test@example.com'
  });

  // Récupération des paramètres URL pour préremplir les données
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const credits = params.get('credits');
    const amount = params.get('amount');
    const planName = params.get('planName');
    
    if (credits && amount) {
      setOrderData(prev => ({
        ...prev,
        credits: parseInt(credits),
        amount: parseFloat(amount)
      }));
    }
  }, []);
  
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const creditPackages = [
    { amount: 10, credits: 100, popular: false },
    { amount: 25, credits: 250, popular: true },
    { amount: 50, credits: 500, popular: false },
    { amount: 100, credits: 1000, popular: false }
  ];

  // Simulation réaliste de paiement
  const simulatePayment = async (scenario: string) => {
    setIsProcessing(true);
    setPaymentResult(null);
    
    // Simulation d'attente réaliste
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    const scenarios: Record<string, Partial<PaymentResult>> = {
      success: {
        success: true,
        message: "Paiement simulé réussi ✅",
        transactionId: `SIM_${Date.now()}`,
      },
      card_declined: {
        success: false,
        message: "Carte refusée - Fonds insuffisants 💳",
        error_code: "INSUFFICIENT_FUNDS"
      },
      network_error: {
        success: false,
        message: "Erreur réseau - Réessayez plus tard ⚠️",
        error_code: "NETWORK_ERROR"
      },
      timeout: {
        success: false,
        message: "Timeout - Transaction expirée ⏱️",
        error_code: "TIMEOUT"
      }
    };
    
    const result: PaymentResult = {
      ...scenarios[scenario],
      orderId: `ORDER_${Date.now()}`,
      amount: orderData.amount,
      currency: 'TND',
      timestamp: new Date().toISOString(),
      testMode: true
    } as PaymentResult;
    
    setPaymentResult(result);
    setIsProcessing(false);
    
    // Simulation d'ajout de crédits si succès
    if (result.success) {
      try {
        await addCredits(orderData.credits);
        await refetchCredits();
        
        toast({
          title: "Crédits ajoutés avec succès !",
          description: `${orderData.credits} crédits ont été ajoutés à votre compte`,
        });
      } catch (error) {
        toast({
          title: "Erreur lors de l'ajout des crédits",
          description: "Les crédits n'ont pas pu être ajoutés malgré le paiement réussi",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header MVP */}
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-200">
          <strong>🚧 Mode MVP - Simulateur de Paiement</strong><br/>
          Testez votre système sans frais réels. Parfait pour valider votre concept avant l'incorporation.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sélection du package */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Packages de Crédits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {creditPackages.map((pkg, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    orderData.amount === pkg.amount 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'hover:border-primary/30'
                  }`}
                  onClick={() => setOrderData({...orderData, amount: pkg.amount, credits: pkg.credits})}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold">{pkg.credits} crédits</span>
                          {pkg.popular && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                              POPULAIRE
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xl font-bold text-primary">{pkg.amount} DT</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      ≈ {(pkg.credits / pkg.amount).toFixed(0)} crédits par dinar
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email de test</Label>
              <Input 
                id="email"
                type="email" 
                value={orderData.email}
                onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                placeholder="test@example.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Simulation de paiement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Test de Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold text-primary mb-2">Commande Simulée</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-foreground">Montant: <strong>{orderData.amount} DT</strong></p>
                  <p className="text-foreground">Crédits: <strong>{orderData.credits}</strong></p>
                  <p className="text-muted-foreground">Email: {orderData.email}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={() => simulatePayment('success')}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isProcessing ? (
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {isProcessing ? 'Traitement...' : 'Simuler Paiement Réussi'}
              </Button>

              <Button
                onClick={() => simulatePayment('card_declined')}
                disabled={isProcessing}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Simuler Carte Refusée
              </Button>

              <Button
                onClick={() => simulatePayment('network_error')}
                disabled={isProcessing}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                size="lg"
              >
                <Wifi className="h-4 w-4 mr-2" />
                Simuler Erreur Réseau
              </Button>

              <Button
                onClick={() => simulatePayment('timeout')}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                <Clock className="h-4 w-4 mr-2" />
                Simuler Timeout
              </Button>
            </div>

            {/* Résultat */}
            {paymentResult && (
              <Card className={`${
                paymentResult.success 
                  ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                  : 'border-red-200 bg-red-50 dark:bg-red-950/20'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {paymentResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <h3 className="font-semibold">
                      {paymentResult.success ? 'Paiement Simulé' : 'Échec Simulé'}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Message:</strong> {paymentResult.message}</p>
                    <p><strong>ID Commande:</strong> {paymentResult.orderId}</p>
                    <p><strong>Montant:</strong> {paymentResult.amount} {paymentResult.currency}</p>
                    {paymentResult.transactionId && (
                      <p><strong>Transaction:</strong> {paymentResult.transactionId}</p>
                    )}
                    {paymentResult.error_code && (
                      <p><strong>Code d'erreur:</strong> {paymentResult.error_code}</p>
                    )}
                    <p className="text-muted-foreground">
                      <strong>Horodatage:</strong> {new Date(paymentResult.timestamp).toLocaleString('fr-TN')}
                    </p>
                  </div>

                  {paymentResult.success && (
                    <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 font-semibold text-sm">
                        🎉 {orderData.credits} crédits ont été ajoutés à votre compte
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informations sur les prochaines étapes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-primary" />
            Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-primary/20">
              <CardContent className="p-4">
                <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  1. Validation MVP
                </h4>
                <p className="text-sm text-muted-foreground">
                  Utilisez ce simulateur pour tester votre logique métier et l'UX complète
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  2. Création Entreprise
                </h4>
                <p className="text-sm text-muted-foreground">
                  Une fois validé, créez votre statut juridique (SUARL, SARL, etc.)
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  3. Intégration Réelle
                </h4>
                <p className="text-sm text-muted-foreground">
                  Intégrez e-DINAR ou Monétique avec vos credentials officiels
                </p>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-4" />

          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>💡 Astuce:</strong> Ce simulateur vous permet de tester tous les scénarios possibles 
              et d'identifier les bugs potentiels avant d'investir dans les frais légaux d'incorporation.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSimulator;
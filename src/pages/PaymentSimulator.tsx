import React from 'react';
import PaymentSimulator from '@/components/PaymentSimulator';
import SEOHead from '@/components/SEOHead';

const PaymentSimulatorPage = () => {
  return (
    <>
      <SEOHead 
        title="Simulateur de Paiement - Test MVP"
        description="Testez votre système de paiement sans frais réels. Simulateur MVP pour valider votre concept avant l'incorporation."
        keywords="simulateur paiement, MVP, test paiement, e-commerce tunisie"
      />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Simulateur de Paiement MVP
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Testez votre système de crédits et de paiement en toute sécurité avec notre simulateur.
              Parfait pour valider votre concept avant l'intégration de vrais systèmes de paiement.
            </p>
          </div>
          
          <PaymentSimulator />
        </div>
      </div>
    </>
  );
};

export default PaymentSimulatorPage;
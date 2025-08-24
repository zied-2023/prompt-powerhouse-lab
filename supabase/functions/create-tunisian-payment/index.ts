import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration théorique pour la démonstration
const monetiqueConfig = {
  merchantId: "DEMO_MERCHANT_123456",
  secretKey: "demo_secret_key_for_testing",
  environment: "sandbox",
  currency: "TND",
  baseUrl: "https://demo-ipay.monetique.tn"
};

const edinarConfig = {
  merchantId: "DEMO_EDINAR_789",
  apiKey: "demo_api_key_edinar",
  secretKey: "demo_secret_edinar",
  environment: "sandbox",
  baseUrl: "https://demo-sandbox.e-dinar.poste.tn/api"
};

function generateOrderId(): string {
  return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSecurityHash(params: Record<string, any>, secretKey: string): string {
  // Simulation d'un hash pour la démonstration
  const dataString = Object.values(params).join('|') + '|' + secretKey;
  return btoa(dataString).substr(0, 32);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { method, planId, amount, credits } = await req.json();

    // Récupération de l'utilisateur authentifié
    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user?.email) {
      throw new Error("Utilisateur non authentifié");
    }

    const orderId = generateOrderId();

    // Enregistrement de la commande dans Supabase
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { error: insertError } = await supabaseService
      .from("user_subscriptions")
      .insert({
        user_id: user.id,
        plan_id: planId,
        amount_paid_tnd: amount,
        credits_purchased: credits,
        payment_status: "pending",
        payment_method: method,
        transaction_id: orderId
      });

    if (insertError) {
      console.error("Erreur insertion commande:", insertError);
      throw new Error("Erreur lors de l'enregistrement de la commande");
    }

    if (method === 'monetique') {
      // Simulation Monétique Tunisie
      const params = {
        merchant_id: monetiqueConfig.merchantId,
        order_id: orderId,
        amount: Math.round(amount * 1000), // Conversion en millimes
        currency: monetiqueConfig.currency,
        return_url: `${req.headers.get("origin")}/payment/success?method=monetique&order=${orderId}`,
        cancel_url: `${req.headers.get("origin")}/payment/cancel?method=monetique&order=${orderId}`,
        notify_url: `${req.headers.get("origin")}/payment/notify?method=monetique`,
        customer_email: user.email,
        description: `Achat de ${credits} crédits`
      };

      params.hash = generateSecurityHash(params, monetiqueConfig.secretKey);

      return new Response(JSON.stringify({
        success: true,
        method: 'monetique',
        redirect_url: `${monetiqueConfig.baseUrl}/payment/init?${new URLSearchParams(params).toString()}`,
        order_id: orderId,
        message: "Redirection vers Monétique Tunisie (Démo)"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } else if (method === 'edinar') {
      // Simulation e-DINAR
      const paymentRequest = {
        merchant_id: edinarConfig.merchantId,
        order_reference: orderId,
        amount: amount,
        currency: "TND",
        description: `Achat de ${credits} crédits`,
        customer_email: user.email,
        success_url: `${req.headers.get("origin")}/payment/success?method=edinar&order=${orderId}`,
        failure_url: `${req.headers.get("origin")}/payment/failure?method=edinar&order=${orderId}`,
        cancel_url: `${req.headers.get("origin")}/payment/cancel?method=edinar&order=${orderId}`,
        notify_url: `${req.headers.get("origin")}/payment/notify?method=edinar`
      };

      // Simulation d'une réponse API e-DINAR
      const simulatedResponse = {
        success: true,
        payment_id: `EDINAR_${Date.now()}`,
        redirect_url: `${edinarConfig.baseUrl}/payment/redirect/${orderId}`
      };

      return new Response(JSON.stringify({
        success: true,
        method: 'edinar',
        redirect_url: simulatedResponse.redirect_url,
        payment_id: simulatedResponse.payment_id,
        order_id: orderId,
        message: "Redirection vers e-DINAR (Démo)"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    throw new Error("Méthode de paiement non supportée");

  } catch (error) {
    console.error('Erreur paiement tunisien:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
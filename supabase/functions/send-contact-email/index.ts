import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactEmailRequest = await req.json();

    // Validation des données
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs sont requis" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Envoyer l'email de confirmation à l'utilisateur
    const userEmailResponse = await resend.emails.send({
      from: "AutoPrompt <noreply@autoprompt.com>",
      to: [email],
      subject: "Confirmation de réception - AutoPrompt",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #6366f1; margin-bottom: 24px;">Merci pour votre message !</h1>
          <p style="margin-bottom: 16px;">Bonjour ${name},</p>
          <p style="margin-bottom: 16px;">
            Nous avons bien reçu votre message concernant : <strong>${subject}</strong>
          </p>
          <p style="margin-bottom: 16px;">
            Notre équipe vous répondra dans les plus brefs délais.
          </p>
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">Rappel de votre message :</h3>
            <p style="margin: 0; color: #6b7280; font-style: italic;">"${message}"</p>
          </div>
          <p style="margin-bottom: 16px;">
            Cordialement,<br>
            L'équipe AutoPrompt
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="font-size: 14px; color: #9ca3af; text-align: center;">
            AutoPrompt - La plateforme professionnelle pour vos prompts IA
          </p>
        </div>
      `,
    });

    // Envoyer l'email de notification à l'équipe
    const adminEmailResponse = await resend.emails.send({
      from: "AutoPrompt Contact <contact@autoprompt.com>",
      to: ["contact@autoprompt.com"], // Remplacez par votre email
      subject: `Nouveau message de contact - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #dc2626; margin-bottom: 24px;">Nouveau message de contact</h1>
          <div style="background-color: #fef2f2; padding: 16px; border-radius: 8px; border-left: 4px solid #dc2626; margin-bottom: 24px;">
            <h2 style="margin: 0 0 12px 0; color: #991b1b;">Détails du contact</h2>
            <p style="margin: 4px 0;"><strong>Nom :</strong> ${name}</p>
            <p style="margin: 4px 0;"><strong>Email :</strong> ${email}</p>
            <p style="margin: 4px 0;"><strong>Sujet :</strong> ${subject}</p>
          </div>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">Message :</h3>
            <p style="margin: 0; line-height: 1.6;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="font-size: 14px; color: #9ca3af;">
            Email reçu le ${new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { userEmailResponse, adminEmailResponse });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email envoyé avec succès",
        userEmailId: userEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erreur lors de l'envoi de l'email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
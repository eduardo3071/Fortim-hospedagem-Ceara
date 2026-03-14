import Stripe from "https://esm.sh/stripe@17.7.0?target=deno&no-check";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRICE_PER_NIGHT_CENTS = 20000; // R$200

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const { nights, checkin, checkout } = await req.json();

    if (!nights || nights < 1 || nights > 30) {
      return new Response(
        JSON.stringify({ error: "Número de diárias inválido (1-30)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-04-30.basil" });

    const amount = nights * PRICE_PER_NIGHT_CENTS;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const siteUrl = "https://pontalsereias.lovable.app";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Reserva Pontal Sereias",
              description: `Hospedagem em Fortim-CE — ${nights} diária${nights > 1 ? "s" : ""}${checkin && checkout ? ` (${checkin} a ${checkout})` : ""}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/reserva-confirmada?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/reserva-cancelada`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Erro interno";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

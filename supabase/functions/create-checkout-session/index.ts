import Stripe from "https://esm.sh/stripe@17.7.0?target=deno&no-check";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const { nights, checkin, checkout, amount, subtotal, cleaningFee } = await req.json();

    if (!nights || nights < 1 || nights > 60) {
      return new Response(
        JSON.stringify({ error: "Número de noites inválido (1-60)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!amount || amount < 1) {
      return new Response(
        JSON.stringify({ error: "Valor inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-04-30.basil" });

    const amountCents = Math.round(amount * 100);
    const subtotalCents = Math.round((subtotal ?? (amount - (cleaningFee ?? 150))) * 100);
    const cleaningFeeCents = Math.round((cleaningFee ?? 150) * 100);

    const siteUrl = "https://pontalsereias.lovable.app";

    const lineItems = [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Hospedagem Pontal Sereias",
            description: `${nights} diária${nights > 1 ? "s" : ""} em Fortim-CE${checkin && checkout ? ` (${checkin} a ${checkout})` : ""}`,
          },
          unit_amount: subtotalCents,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: "Taxa de limpeza",
            description: "Taxa única de limpeza por reserva",
          },
          unit_amount: cleaningFeeCents,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
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

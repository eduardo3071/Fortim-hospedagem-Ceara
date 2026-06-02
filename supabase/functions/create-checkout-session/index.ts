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

    const { nights, checkin, checkout, amount, subtotal, cleaningFee, couponCode } = await req.json();

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

    // Re-validate availability against the Airbnb iCal to prevent overbooking
    if (checkin && checkout) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
        if (supabaseUrl && anonKey) {
          const availRes = await fetch(
            `${supabaseUrl}/functions/v1/airbnb-availability?refresh=1`,
            { headers: { Authorization: `Bearer ${anonKey}`, apikey: anonKey } }
          );
          if (availRes.ok) {
            const { blockedDates } = (await availRes.json()) as { blockedDates: string[] };
            const blocked = new Set(blockedDates ?? []);

            // checkin/checkout come as pt-BR strings "dd/mm/yyyy"
            const parseBR = (s: string): Date | null => {
              const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
              if (!m) return null;
              return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));
            };
            const ci = parseBR(checkin);
            const co = parseBR(checkout);
            if (ci && co) {
              const cur = new Date(ci);
              while (cur < co) {
                const iso = cur.toISOString().slice(0, 10);
                if (blocked.has(iso)) {
                  return new Response(
                    JSON.stringify({ error: 'Estas datas já estão reservadas no Airbnb.' }),
                    { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                  );
                }
                cur.setUTCDate(cur.getUTCDate() + 1);
              }
            }
          }
        }
      } catch (e) {
        console.warn('Availability re-validation failed, proceeding:', e);
      }
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

    const sessionParams: any = {
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true,
      success_url: `${siteUrl}/reserva-confirmada?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/reserva-cancelada`,
    };

    // If a specific coupon code is provided, apply it directly
    if (couponCode) {
      try {
        // Try to find the coupon by promotion code
        const promoCodes = await stripe.promotionCodes.list({ code: couponCode, active: true, limit: 1 });
        if (promoCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
          delete sessionParams.allow_promotion_codes;
        }
      } catch (e) {
        console.warn("Coupon lookup failed, allowing manual entry:", e);
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

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

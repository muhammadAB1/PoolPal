// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import Stripe from "stripe";

// Best first, because a customer can also have old canceled subscriptions.
const statusPriority = ["active", "trialing", "past_due", "unpaid", "paused", "incomplete", "canceled", "incomplete_expired"];
// past_due stays premium while Stripe retries the payment.
const premiumStatuses = ["active", "trialing", "past_due"];

const cryptoProvider = Stripe.createSubtleCryptoProvider();

export default {
  // Stripe has no Supabase login, so its signature is the authentication.
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    const secretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");
    if (!secretKey || !webhookSecret) {
      console.log("stripe-webhook: stopped, missing configuration");
      return Response.json({ error: "Missing configuration" }, { status: 500 });
    }

    const stripe = new Stripe(secretKey);
    let event: Stripe.Event;
    try {
      const signature = req.headers.get("stripe-signature") ?? "";
      event = await stripe.webhooks.constructEventAsync(await req.text(), signature, webhookSecret, undefined, cryptoProvider);
    } catch {
      console.log("stripe-webhook: stopped, invalid signature");
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const profiles = () => ctx.supabaseAdmin.from("profiles");

    try {
      if (event.type === "customer.deleted") {
        const { error } = await profiles()
          .update({ stripe_customer_id: null, subscription_status: "canceled", membership_tier: "free" })
          .eq("stripe_customer_id", event.data.object.id);
        if (error) throw new Error(error.message);
        return Response.json({ received: true });
      }

      const customerId = getCustomerId(event);
      if (!customerId) return Response.json({ received: true });

      // Events can arrive late or out of order, so save what Stripe says now.
      let status = await getStatus(stripe, customerId);
      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, error } = await profiles()
          .update({
            subscription_status: status,
            membership_tier: premiumStatuses.includes(status) ? "premium" : "free",
          })
          .eq("stripe_customer_id", customerId)
          .select("id")
          .maybeSingle();
        if (error) throw new Error(error.message);
        if (!data) {
          console.log("stripe-webhook: no profile for customer", customerId);
          return Response.json({ received: true });
        }

        // Two events can run at the same time, so write again only if Stripe changed meanwhile.
        const latest = await getStatus(stripe, customerId);
        if (latest === status) {
          console.log("stripe-webhook: saved", { type: event.type, status });
          return Response.json({ received: true });
        }
        status = latest;
      }
      throw new Error("Status kept changing");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log("stripe-webhook: failed, Stripe will retry", event.type, message);
      return Response.json({ error: "Update failed" }, { status: 500 });
    }
  }),
};

function getCustomerId(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.resumed": {
      const customer = event.data.object.customer;
      return typeof customer === "string" ? customer : customer?.id;
    }
    default:
      return null;
  }
}

async function getStatus(stripe: Stripe, customerId: string) {
  const { data } = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 100 });
  return statusPriority.find((status) => data.some((item) => item.status === status)) ?? "inactive";
}

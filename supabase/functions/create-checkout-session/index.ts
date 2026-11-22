import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"

const priceEnv = {
  monthly: "STRIPE_PRICE_MONTHLY",
  yearly: "STRIPE_PRICE_YEARLY",
} as const

// These open the portal, so nobody buys a second plan.
const portalStatuses = ["active", "trialing", "past_due", "unpaid", "paused"]

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    const userId = ctx.userClaims?.id
    console.log("create-checkout-session: start", { userId: userId ?? null })
    if (!userId) {
      console.log("create-checkout-session: stopped, no user")
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan } = await req.json().catch(() => ({}))
    const priceKey = priceEnv[plan as keyof typeof priceEnv]
    console.log("create-checkout-session: plan", { plan, priceKey: priceKey ?? null })
    if (!priceKey) {
      console.log("create-checkout-session: stopped, bad plan")
      return Response.json({ error: "Bad request" }, { status: 400 })
    }

    const secretKey = Deno.env.get("STRIPE_SECRET_KEY")
    const priceId = Deno.env.get(priceKey)
    const successUrl = Deno.env.get("STRIPE_CHECKOUT_SUCCESS_URL")
    const cancelUrl = Deno.env.get("STRIPE_CHECKOUT_CANCEL_URL")
    const portalId = Deno.env.get("STRIPE_PORTAL_ID")
    console.log("create-checkout-session: config", {
      hasSecretKey: Boolean(secretKey),
      hasPrice: Boolean(priceId),
      hasSuccessUrl: Boolean(successUrl),
      hasCancelUrl: Boolean(cancelUrl),
      hasPortalId: Boolean(portalId),
    })
    if (!secretKey || !priceId || !successUrl || !cancelUrl) {
      console.log("create-checkout-session: stopped, missing configuration")
      return Response.json({ error: "Missing configuration" }, { status: 500 })
    }

    const email = ctx.userClaims?.email
    const profiles = () => ctx.supabaseAdmin.from("profiles")
    const { data: profile, error } = await profiles().select("stripe_customer_id").eq("id", userId).single()
    if (error) {
      console.log("create-checkout-session: stopped, profile error", error.message)
      return Response.json({ error: "Could not load profile" }, { status: 500 })
    }

    let customerId: string | null = profile.stripe_customer_id
    if (!customerId) {
      const params = new URLSearchParams({ "metadata[supabase_user_id]": userId })
      if (email) params.set("email", email)
      const created = await stripePost(secretKey, "customers", params)
      if (!created.ok) {
        console.log("create-checkout-session: stopped, customer error", created.data.error?.message)
        return Response.json({ error: "Could not create customer" }, { status: 500 })
      }
      // Save only if still empty, so a second click cannot replace the first customer.
      const { data: saved } = await profiles()
        .update({ stripe_customer_id: created.data.id })
        .eq("id", userId)
        .is("stripe_customer_id", null)
        .select("stripe_customer_id")
        .maybeSingle()
      if (!saved) {
        console.log("create-checkout-session: stopped, customer not saved")
        return Response.json({ error: "Please try again" }, { status: 500 })
      }
      customerId = created.data.id as string
    }

    // Close older Checkout tabs, so only the newest one can be paid.
    const openCheckouts = await stripeGet(secretKey, `checkout/sessions?customer=${customerId}&status=open&limit=100`)
    if (!openCheckouts.data) {
      console.log("create-checkout-session: stopped, open checkout error", openCheckouts.error?.message)
      return Response.json({ error: "Please try again" }, { status: 500 })
    }
    for (const checkout of openCheckouts.data) {
      const closed = await stripePost(secretKey, `checkout/sessions/${checkout.id}/expire`, new URLSearchParams())
      if (!closed.ok) {
        console.log("create-checkout-session: stopped, could not close checkout", closed.data.error?.message)
        return Response.json({ error: "Please try again" }, { status: 500 })
      }
    }

    const subscriptions = await stripeGet(secretKey, `subscriptions?customer=${customerId}&limit=100`)
    if (!subscriptions.data) {
      console.log("create-checkout-session: stopped, subscription error", subscriptions.error?.message)
      return Response.json({ error: "Could not check subscription" }, { status: 500 })
    }
    if (subscriptions.data.some((item: { status: string }) => portalStatuses.includes(item.status))) {
      if (!portalId) {
        console.log("create-checkout-session: stopped, missing portal id")
        return Response.json({ error: "Missing configuration" }, { status: 500 })
      }
      console.log("create-checkout-session: opening portal")
      const portal = await stripePost(secretKey, "billing_portal/sessions", new URLSearchParams({
        customer: customerId,
        return_url: successUrl,
        configuration: portalId,
      }))
      if (!portal.ok || !portal.data.url) {
        const message = portal.data.error?.message ?? "Stripe request failed"
        console.log("create-checkout-session: stopped, portal error", message)
        return Response.json({ error: message }, { status: 500 })
      }
      return Response.json({ url: portal.data.url })
    }

    const body = new URLSearchParams({
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerId,
      client_reference_id: userId,
      allow_promotion_codes: "true",
    })

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    })
    const session = await response.json()
    console.log("create-checkout-session: stripe status", response.status)
    if (!response.ok || !session.url) {
      const message = session.error?.message ?? "Stripe request failed"
      console.log("create-checkout-session: stopped, stripe error", message)
      return Response.json({ error: message }, { status: 500 })
    }

    console.log("create-checkout-session: session created")
    return Response.json({ url: session.url })
  }),
}

async function stripeGet(secretKey: string, path: string) {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  })
  return response.json()
}

async function stripePost(secretKey: string, path: string, body: URLSearchParams) {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })
  return { ok: response.ok, data: await response.json() }
}

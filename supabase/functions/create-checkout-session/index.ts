import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"

const priceEnv = {
  monthly: "STRIPE_PRICE_MONTHLY",
  yearly: "STRIPE_PRICE_YEARLY",
} as const

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
    const customerId = email ? await findActiveCustomer(secretKey, email) : null
    if (customerId) {
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
      client_reference_id: userId,
      allow_promotion_codes: "true",
    })
    if (email) body.set("customer_email", email)

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

async function findActiveCustomer(secretKey: string, email: string) {
  const customers = await stripeGet(secretKey, `customers?email=${encodeURIComponent(email)}&limit=10`)
  for (const customer of customers.data ?? []) {
    const subscriptions = await stripeGet(
      secretKey,
      `subscriptions?customer=${customer.id}&status=active&limit=1`,
    )
    if (subscriptions.data?.[0]) return customer.id as string
  }
  return null
}

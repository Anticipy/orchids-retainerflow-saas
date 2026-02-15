import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe, PLANS } from "@/lib/stripe"

async function getOrCreatePrice(tier: "pro" | "business") {
  const plan = PLANS[tier]

  const existing = await stripe.prices.list({
    lookup_keys: [plan.lookup_key],
    limit: 1,
  })

  if (existing.data.length > 0) {
    return existing.data[0].id
  }

  const product = await stripe.products.create({
    name: plan.name,
    description: plan.description,
  })

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: plan.price,
    currency: "usd",
    recurring: { interval: "month" },
    lookup_key: plan.lookup_key,
  })

  return price.id
}

async function getOrCreateCustomer(userId: string, email: string, stripeCustomerId?: string | null) {
  if (stripeCustomerId) {
    try {
      await stripe.customers.retrieve(stripeCustomerId)
      return stripeCustomerId
    } catch {
      // Customer doesn't exist in Stripe, create new one
    }
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  return customer.id
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tier } = body

    if (!tier || !["pro", "business"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier. Must be 'pro' or 'business'" }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from("users")
      .select("stripe_customer_id, email, subscription_tier")
      .eq("id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }

    if (profile.subscription_tier === tier) {
      return NextResponse.json({ error: `You are already on the ${tier} plan` }, { status: 400 })
    }

    const customerId = await getOrCreateCustomer(
      user.id,
      profile.email || user.email!,
      profile.stripe_customer_id
    )

    if (customerId !== profile.stripe_customer_id) {
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id)
    }

    const priceId = await getOrCreatePrice(tier as "pro" | "business")

    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || ""

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/settings/billing-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/settings`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier,
        },
      },
      metadata: {
        supabase_user_id: user.id,
        tier,
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    console.error("Stripe checkout error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

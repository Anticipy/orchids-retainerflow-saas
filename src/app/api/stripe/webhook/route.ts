import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Webhook signature verification failed:", message)
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        if (session.mode !== "subscription") break

        const userId = session.metadata?.supabase_user_id || session.client_reference_id
        const tier = session.metadata?.tier

        if (!userId || !tier) {
          console.error("Missing userId or tier in session metadata")
          break
        }

        const { error } = await supabase
          .from("users")
          .update({
            subscription_tier: tier,
            subscription_status: "active",
            stripe_customer_id: session.customer as string,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) {
          console.error("Failed to update user subscription:", error.message)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break

        const status = subscription.status === "active" ? "active" : subscription.status

        const { error } = await supabase
          .from("users")
          .update({
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) {
          console.error("Failed to update subscription status:", error.message)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = subscription.metadata?.supabase_user_id
        if (!userId) break

        const { error } = await supabase
          .from("users")
          .update({
            subscription_tier: "free",
            subscription_status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)

        if (error) {
          console.error("Failed to downgrade user:", error.message)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object
        const customerId = invoice.customer as string
        if (!customerId) break

        const { error } = await supabase
          .from("users")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Failed to update payment status:", error.message)
        }
        break
      }

      default:
        break
    }
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

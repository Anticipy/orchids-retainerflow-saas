import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
  typescript: true,
})

export const PLANS = {
  pro: {
    name: "RetainerFlow Pro",
    price: 1900,
    lookup_key: "retainerflow_pro_monthly",
    description: "Up to 10 clients, client portal, auto-invoicing",
  },
  business: {
    name: "RetainerFlow Business",
    price: 3900,
    lookup_key: "retainerflow_business_monthly",
    description: "Unlimited clients, Stripe auto-charge, priority support",
  },
} as const

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { name, email, monthly_hours, monthly_fee, overage_rate, billing_day } = body

  if (!name || !email || !monthly_hours || !monthly_fee || !overage_rate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check subscription limits
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_tier")
    .eq("id", user.id)
    .single()

  const { data: existingClients } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")

  const tier = profile?.subscription_tier || "free"
  const activeCount = existingClients?.length || 0
  const limits: Record<string, number> = { free: 1, pro: 10, business: Infinity }

  if (activeCount >= limits[tier]) {
    return NextResponse.json(
      { error: `Your ${tier} plan allows up to ${limits[tier]} active clients. Please upgrade.` },
      { status: 403 }
    )
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name,
      email,
      monthly_hours: parseFloat(monthly_hours),
      monthly_fee: parseFloat(monthly_fee),
      overage_rate: parseFloat(overage_rate),
      billing_day: parseInt(billing_day) || 1,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const hours = parseFloat(monthly_hours)
  const fee = parseFloat(monthly_fee)
  const rate = parseFloat(overage_rate)
  if (isNaN(hours) || hours <= 0 || isNaN(fee) || fee < 0 || isNaN(rate) || rate < 0) {
    return NextResponse.json(
      { error: "monthly_hours must be > 0; monthly_fee and overage_rate must be >= 0" },
      { status: 400 }
    )
  }

  // Check subscription limits and get name for portal email
  const { data: profile } = await supabase
    .from("users")
    .select("subscription_tier, name")
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

  const portal_uuid = crypto.randomUUID()

  const { data: inserted, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name,
      email,
      monthly_hours: hours,
      monthly_fee: fee,
      overage_rate: rate,
      billing_day: Math.min(28, Math.max(1, parseInt(billing_day) || 1)),
      portal_uuid,
      status: "active",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-send portal link if Resend is configured
  if (process.env.RESEND_API_KEY && inserted) {
    const origin = request.nextUrl.origin
    const portalUrl = `${origin}/portal/${portal_uuid}`
    const freelancerName = profile?.name || "Your freelancer"
    const from = (process.env.RESEND_FROM || "Retallio <onboarding@resend.dev>").replace(/^["']|["']$/g, "").trim()
    await resend.emails.send({
      from,
      to: email,
      subject: `${freelancerName} invited you to their client portal`,
      html: `
        <p>Hi ${name},</p>
        <p>${freelancerName} has set up a client portal for you. You can view your retainer usage and invoices in real time.</p>
        <p><a href="${portalUrl}" style="display:inline-block;margin:12px 0;padding:12px 24px;background:#18181b;color:#fff;text-decoration:none;border-radius:6px">Open portal</a></p>
        <p style="color:#666;font-size:14px">Or copy this link: ${portalUrl}</p>
        <p style="color:#999;font-size:12px;margin-top:24px">Sent via Retallio</p>
      `,
    }).catch(() => { /* Don't fail create if email fails */ })
  }

  return NextResponse.json(inserted, { status: 201 })
}

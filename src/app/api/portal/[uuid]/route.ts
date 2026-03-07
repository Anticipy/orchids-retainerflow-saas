import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params
  const supabase = createAdminClient()

  const { data: client, error } = await supabase
    .from("clients")
    .select("id, name, monthly_hours, monthly_fee, overage_rate, billing_day, status, portal_uuid, user_id")
    .eq("portal_uuid", uuid)
    .single()

  if (error || !client) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 })
  }

  const { data: user } = await supabase
    .from("users")
    .select("name, logo_url")
    .eq("id", client.user_id)
    .single()

  const monthParam = request.nextUrl.searchParams.get("month")
  let year: number
  let month: number

  if (/^\d{4}-\d{2}$/.test(monthParam || "")) {
    const [y, m] = monthParam!.split("-").map(Number)
    year = y
    month = m - 1
  } else {
    const now = new Date()
    year = now.getFullYear()
    month = now.getMonth()
  }

  const startOfMonth = new Date(year, month, 1).toISOString().split("T")[0]
  const endOfMonth = new Date(year, month + 1, 0).toISOString().split("T")[0]

  const { data: entries } = await supabase
    .from("time_entries")
    .select("id, date, hours, description")
    .eq("client_id", client.id)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth)
    .eq("is_running", false)
    .order("date", { ascending: false })

  // ── Active timer ──────────────────────────────────────────────────
  const { data: activeTimer } = await supabase
    .from("time_entries")
    .select("id, description, started_at")
    .eq("client_id", client.id)
    .eq("is_running", true)
    .single()

  const totalHoursUsed = Math.round(
    (entries || []).reduce((sum, e) => sum + parseFloat(String(e.hours)), 0) * 100
  ) / 100

  const monthlyHours = parseFloat(client.monthly_hours as unknown as string)
  const monthlyFee = parseFloat(client.monthly_fee as unknown as string)
  const overageRate = parseFloat(client.overage_rate as unknown as string)
  const hoursRemaining = Math.max(0, monthlyHours - totalHoursUsed)
  const overageHours = Math.max(0, totalHoursUsed - monthlyHours)
  const projectedBase = monthlyFee
  const projectedOverage = overageHours * overageRate
  const projectedTotal = projectedBase + projectedOverage

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, billing_period, total_amount, status, created_at")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false })

  return NextResponse.json({
    month: `${year}-${String(month + 1).padStart(2, "0")}`,
    client: {
      name: client.name,
      monthlyHours,
      monthlyFee,
      overageRate,
      billingDay: client.billing_day,
    },
    hoursUsed: totalHoursUsed,
    hoursRemaining,
    freelancerName: user?.name || null,
    freelancerLogoUrl: user?.logo_url || null,
    projectedInvoice: {
      base: projectedBase,
      overage: projectedOverage,
      total: projectedTotal,
    },
    entries: entries || [],
    invoices: invoices || [],
    // null if no active timer, otherwise { description, started_at }
    activeTimer: activeTimer
      ? { description: activeTimer.description, startedAt: activeTimer.started_at }
      : null,
  })
}
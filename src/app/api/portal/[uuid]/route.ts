import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params
  const supabase = createAdminClient()

  // Use service role-like query (portal is public, no auth needed)
  const { data: client, error } = await supabase
    .from("clients")
    .select("id, name, monthly_hours, billing_day, status, portal_uuid")
    .eq("portal_uuid", uuid)
    .single()

  if (error || !client) {
    return NextResponse.json({ error: "Portal not found" }, { status: 404 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  // Get time entries for current month (only date, description, hours - no sensitive data)
  const { data: entries } = await supabase
    .from("time_entries")
    .select("id, date, hours, description")
    .eq("client_id", client.id)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth)
    .eq("is_running", false)
    .order("date", { ascending: false })

  const totalHoursUsed = (entries || []).reduce((sum, e) => sum + parseFloat(e.hours), 0)

  // Get invoices
  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, billing_period, total_amount, status, created_at")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false })

  return NextResponse.json({
    client: {
      name: client.name,
      monthlyHours: parseFloat(client.monthly_hours as unknown as string),
      billingDay: client.billing_day,
    },
    hoursUsed: Math.round(totalHoursUsed * 100) / 100,
    entries: entries || [],
    invoices: invoices || [],
  })
}

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { clientStatusFromPercent } from "@/lib/notification-rules"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  // ── Active clients only ──────────────────────────────────────────
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")

  const activeClientIds = (clients || []).map((c) => c.id)

  // ── Time entries: current month AND active clients only ──────────
  // FIX 1: added .in("client_id", activeClientIds) so archived client
  // entries (e.g. Ionut's 65h) are never counted in the stat cards.
  const { data: entries } = activeClientIds.length > 0
    ? await supabase
        .from("time_entries")
        .select("*")
        .eq("user_id", user.id)
        .in("client_id", activeClientIds)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth)
        .eq("is_running", false)
    : { data: [] }

  // ── Aggregations ─────────────────────────────────────────────────
  const mrr = (clients || []).reduce((sum, c) => sum + parseFloat(c.monthly_fee), 0)
  const totalCommittedHours = (clients || []).reduce((sum, c) => sum + parseFloat(c.monthly_hours), 0)

  const hoursByClient: Record<string, number> = {}
  for (const entry of entries || []) {
    hoursByClient[entry.client_id] = (hoursByClient[entry.client_id] || 0) + parseFloat(entry.hours)
  }

  const totalHoursUsed = Object.values(hoursByClient).reduce((sum, h) => sum + h, 0)
  const totalHoursRemaining = Math.max(0, totalCommittedHours - totalHoursUsed)

  let projectedOverage = 0
  for (const client of clients || []) {
    const used = hoursByClient[client.id] || 0
    const overage = Math.max(0, used - parseFloat(client.monthly_hours))
    projectedOverage += overage * parseFloat(client.overage_rate)
  }

  // ── Client summaries ─────────────────────────────────────────────
  const clientSummaries = (clients || []).map((client) => {
    const hoursUsed = hoursByClient[client.id] || 0
    const monthlyHours = parseFloat(client.monthly_hours)
    const percentUsed = monthlyHours > 0 ? (hoursUsed / monthlyHours) * 100 : 0

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      hoursUsed: Math.round(hoursUsed * 100) / 100,
      monthlyHours,
      percentUsed: Math.round(percentUsed),
      monthlyFee: parseFloat(client.monthly_fee),
      status: clientStatusFromPercent(percentUsed),
      billingDay: client.billing_day ?? null,
    }
  })

  // ── Recent entries: current month + active clients only ──────────
  // FIX 2: was fetching ALL entries across ALL time from ALL clients.
  // Now scoped to current month and active client IDs only.
  const { data: recentEntries } = activeClientIds.length > 0
    ? await supabase
        .from("time_entries")
        .select("*, clients(name)")
        .eq("user_id", user.id)
        .in("client_id", activeClientIds)
        .gte("date", startOfMonth)
        .lte("date", endOfMonth)
        .eq("is_running", false)
        .order("date", { ascending: false })
        .limit(10)
    : { data: [] }

  return NextResponse.json({
    mrr,
    totalCommittedHours,
    totalHoursUsed: Math.round(totalHoursUsed * 100) / 100,
    totalHoursRemaining: Math.round(totalHoursRemaining * 100) / 100,
    projectedOverage: Math.round(projectedOverage * 100) / 100,
    activeClients: clients?.length || 0,
    clientSummaries,
    recentEntries: recentEntries || [],
  })
}
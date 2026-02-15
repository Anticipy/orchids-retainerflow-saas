import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  // Get active clients
  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")

  // Get time entries for current month
  const { data: entries } = await supabase
    .from("time_entries")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", startOfMonth)
    .lte("date", endOfMonth)
    .eq("is_running", false)

  // Calculate MRR
  const mrr = (clients || []).reduce((sum, c) => sum + parseFloat(c.monthly_fee), 0)

  // Calculate total committed hours
  const totalCommittedHours = (clients || []).reduce((sum, c) => sum + parseFloat(c.monthly_hours), 0)

  // Calculate hours by client
  const hoursByClient: Record<string, number> = {}
  for (const entry of entries || []) {
    hoursByClient[entry.client_id] = (hoursByClient[entry.client_id] || 0) + parseFloat(entry.hours)
  }

  const totalHoursUsed = Object.values(hoursByClient).reduce((sum, h) => sum + h, 0)
  const totalHoursRemaining = Math.max(0, totalCommittedHours - totalHoursUsed)

  // Calculate projected overage
  let projectedOverage = 0
  for (const client of clients || []) {
    const used = hoursByClient[client.id] || 0
    const overage = Math.max(0, used - parseFloat(client.monthly_hours))
    projectedOverage += overage * parseFloat(client.overage_rate)
  }

  // Client summaries with hours
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
      status: percentUsed >= 100 ? "exceeded" : percentUsed >= 80 ? "warning" : "good",
    }
  })

  // Recent time entries
  const { data: recentEntries } = await supabase
    .from("time_entries")
    .select("*, clients(name)")
    .eq("user_id", user.id)
    .eq("is_running", false)
    .order("date", { ascending: false })
    .limit(10)

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

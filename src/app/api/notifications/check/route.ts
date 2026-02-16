import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

/**
 * Called when dashboard loads: ensure we have notifications for 80% and 100% hours.
 * Idempotent: only inserts if no notification exists for that client + type + current month.
 */
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]
  const startOfMonthStr = startOfMonth.split("T")[0]

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, monthly_hours")
    .eq("user_id", user.id)
    .eq("status", "active")

  if (!clients?.length) return NextResponse.json({ created: 0 })

  const { data: entries } = await supabase
    .from("time_entries")
    .select("client_id, hours")
    .eq("user_id", user.id)
    .gte("date", startOfMonthStr)
    .lte("date", endOfMonth)
    .eq("is_running", false)

  const hoursByClient: Record<string, number> = {}
  for (const e of entries || []) {
    hoursByClient[e.client_id] = (hoursByClient[e.client_id] || 0) + parseFloat(e.hours)
  }

  const { data: existing } = await supabase
    .from("notifications")
    .select("id, type, client_id, created_at")
    .eq("user_id", user.id)
    .gte("created_at", startOfMonth)

  const existingSet = new Set(
    (existing || []).map((n) => `${n.client_id}:${n.type}`)
  )

  let created = 0
  for (const client of clients) {
    const used = hoursByClient[client.id] || 0
    const cap = parseFloat(client.monthly_hours)
    if (cap <= 0) continue
    const pct = (used / cap) * 100

    if (pct >= 100 && !existingSet.has(`${client.id}:hours_100`)) {
      const { error } = await supabase.from("notifications").insert({
        user_id: user.id,
        type: "hours_100",
        title: "Retainer limit reached",
        body: `${client.name} has used 100% of retainer hours this month.`,
        link: "/dashboard/clients",
        client_id: client.id,
      })
      if (!error) {
        existingSet.add(`${client.id}:hours_100`)
        created++
      }
    }
    if (pct >= 80 && pct < 100 && !existingSet.has(`${client.id}:hours_80`)) {
      const { error } = await supabase.from("notifications").insert({
        user_id: user.id,
        type: "hours_80",
        title: "80% of retainer hours used",
        body: `${client.name} has used 80% of retainer hours this month.`,
        link: "/dashboard/clients",
        client_id: client.id,
      })
      if (!error) {
        existingSet.add(`${client.id}:hours_80`)
        created++
      }
    }
  }

  return NextResponse.json({ created })
}

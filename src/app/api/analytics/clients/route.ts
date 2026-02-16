import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const now = new Date()

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, monthly_hours, monthly_fee")
    .eq("user_id", user.id)
    .eq("status", "active")

  if (!clients?.length) {
    return NextResponse.json({ perClient: [] })
  }

  const perClient: Array<{
    id: string
    name: string
    monthlyHours: number
    avgHoursLast3Months: number
    overageMonthsCount: number
    totalRevenue: number
  }> = []

  for (const client of clients) {
    const monthlyHours = parseFloat(client.monthly_hours)

    const months: string[] = []
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(d.toISOString().split("T")[0].slice(0, 7))
    }

    let totalHours = 0
    let overageCount = 0

    for (const month of months) {
      const [y, m] = month.split("-").map(Number)
      const start = new Date(y, m - 1, 1).toISOString().split("T")[0]
      const end = new Date(y, m, 0).toISOString().split("T")[0]

      const { data: entries } = await supabase
        .from("time_entries")
        .select("hours")
        .eq("client_id", client.id)
        .gte("date", start)
        .lte("date", end)
        .eq("is_running", false)

      const hours = (entries || []).reduce((s, e) => s + parseFloat(e.hours), 0)
      totalHours += hours
      if (hours > monthlyHours) overageCount++
    }

    const { data: paidInvoices } = await supabase
      .from("invoices")
      .select("total_amount")
      .eq("client_id", client.id)
      .eq("status", "paid")

    const totalRevenue = (paidInvoices || []).reduce((s, i) => s + parseFloat(String(i.total_amount)), 0)

    perClient.push({
      id: client.id,
      name: client.name,
      monthlyHours,
      avgHoursLast3Months: Math.round((totalHours / 3) * 100) / 100,
      overageMonthsCount: overageCount,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
    })
  }

  return NextResponse.json({ perClient })
}

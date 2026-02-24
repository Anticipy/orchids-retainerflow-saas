import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

/**
 * Cron endpoint: generate invoices for all clients whose billing day is today.
 * Call from Vercel Cron with Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 500 })
  }

  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createAdminClient()
  const today = new Date()
  const dayOfMonth = today.getDate()

  if (dayOfMonth > 28) {
    return NextResponse.json({ message: "No billing days on 29th or later", generated: 0 })
  }

  const billingPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`

  const { data: clients } = await supabase
    .from("clients")
    .select("id, user_id, name, monthly_hours, monthly_fee, overage_rate, billing_day")
    .eq("status", "active")
    .eq("billing_day", dayOfMonth)

  if (!clients?.length) {
    return NextResponse.json({ message: "No clients with billing day today", generated: 0 })
  }

  let generated = 0
  const errors: string[] = []

  for (const client of clients) {
    const { data: existing } = await supabase
      .from("invoices")
      .select("id")
      .eq("client_id", client.id)
      .eq("billing_period", billingPeriod)
      .maybeSingle()

    if (existing) continue

    const [year, month] = billingPeriod.split("-").map(Number)
    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
    const endDate = new Date(year, month, 0).toISOString().split("T")[0]

    const { data: entries } = await supabase
      .from("time_entries")
      .select("*")
      .eq("client_id", client.id)
      .gte("date", startDate)
      .lte("date", endDate)
      .eq("is_running", false)

    const totalHours = (entries || []).reduce((sum, e) => sum + (parseFloat(e.hours) || 0), 0)
    const overageHours = Math.max(0, totalHours - (parseFloat(client.monthly_hours) || 0))
    const overageAmount = overageHours * (parseFloat(client.overage_rate) || 0)
    const totalAmount = (parseFloat(client.monthly_fee) || 0) + overageAmount

    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        client_id: client.id,
        user_id: client.user_id,
        billing_period: billingPeriod,  // ✅ was incorrectly `billing_period` as a bare variable
        base_fee: client.monthly_fee,
        overage_hours: overageHours,
        overage_amount: overageAmount,
        total_amount: totalAmount,
        due_date: new Date(year, month - 1, client.billing_day).toISOString().split("T")[0],
        status: "unpaid",
      })
      .select()
      .single()

    if (error) {
      errors.push(`${client.id}: ${error.message}`)
      continue
    }

    if (entries?.length) {
      await supabase.from("invoice_line_items").insert(
        entries.map((e) => ({
          invoice_id: invoice.id,
          date: e.date,
          description: e.description,
          hours: e.hours,
        }))
      )
    }

    await supabase.from("notifications").insert({
      user_id: client.user_id,
      type: "invoice_generated",
      title: "Invoice generated",
      body: `Invoice for ${client.name} (${billingPeriod}) — $${totalAmount.toFixed(2)}`,
      link: "/dashboard/invoices",
      client_id: client.id,
      invoice_id: invoice.id,
    })

    generated++
  }

  return NextResponse.json({
    message: `Generated ${generated} invoice(s) for billing period ${billingPeriod}`,
    generated,
    errors: errors.length ? errors : undefined,
  })
}
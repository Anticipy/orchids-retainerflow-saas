import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("client_id")
  const status = searchParams.get("status")

  let query = supabase
    .from("invoices")
    .select("*, clients(name, email)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (clientId) query = query.eq("client_id", clientId)
  if (status) query = query.eq("status", status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { client_id, billing_period } = body

  if (!client_id || !billing_period) {
    return NextResponse.json({ error: "client_id and billing_period are required" }, { status: 400 })
  }

  // Check for duplicate
  const { data: existing } = await supabase
    .from("invoices")
    .select("id")
    .eq("client_id", client_id)
    .eq("billing_period", billing_period)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Invoice already exists for this period" }, { status: 409 })
  }

  // Get client info
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", client_id)
    .eq("user_id", user.id)
    .single()

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

  // Get time entries for the billing period
  const [year, month] = billing_period.split("-").map(Number)
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  const { data: entries } = await supabase
    .from("time_entries")
    .select("*")
    .eq("client_id", client_id)
    .gte("date", startDate)
    .lte("date", endDate)
    .eq("is_running", false)
    .order("date")

  const totalHours = (entries || []).reduce((sum, e) => sum + parseFloat(e.hours), 0)
  const overageHours = Math.max(0, totalHours - parseFloat(client.monthly_hours))
  const overageAmount = overageHours * parseFloat(client.overage_rate)
  const totalAmount = parseFloat(client.monthly_fee) + overageAmount

  // Create invoice
  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      client_id,
      user_id: user.id,
      billing_period,
      base_fee: client.monthly_fee,
      overage_hours: overageHours,
      overage_amount: overageAmount,
      total_amount: totalAmount,
      due_date: new Date(year, month - 1, client.billing_day + 14).toISOString().split("T")[0],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create line items from time entries
  if (entries && entries.length > 0) {
    const lineItems = entries.map((entry) => ({
      invoice_id: invoice.id,
      date: entry.date,
      description: entry.description,
      hours: entry.hours,
    }))

    await supabase.from("invoice_line_items").insert(lineItems)
  }

  return NextResponse.json(invoice, { status: 201 })
}

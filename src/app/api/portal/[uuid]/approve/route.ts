import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params
  const supabase = createAdminClient()

  // Look up client by portal UUID
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("portal_uuid", uuid)
    .single()

  if (!client) return NextResponse.json({ error: "Portal not found" }, { status: 404 })

  // Must actually be pending approval
  if (!client.pending_approval || !client.approval_month) {
    return NextResponse.json({ error: "No approval pending" }, { status: 400 })
  }

  const billing_period = client.approval_month // YYYY-MM

  // Prevent duplicate invoice
  const { data: existing } = await supabase
    .from("invoices")
    .select("id")
    .eq("client_id", client.id)
    .eq("billing_period", billing_period)
    .maybeSingle()

  if (existing) {
    // Already generated — just clear the flag
    await supabase
      .from("clients")
      .update({ pending_approval: false, approval_month: null })
      .eq("id", client.id)
    return NextResponse.json({ success: true, already_existed: true })
  }

  // Build invoice — same logic as /api/invoices POST
  const [year, month] = billing_period.split("-").map(Number)
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  const { data: entries } = await supabase
    .from("time_entries")
    .select("*")
    .eq("client_id", client.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .eq("is_running", false)
    .order("date")

  const totalHours = (entries || []).reduce((sum, e) => sum + parseFloat(e.hours), 0)
  const overageHours = Math.max(0, totalHours - parseFloat(client.monthly_hours))
  const overageAmount = overageHours * parseFloat(client.overage_rate)
  const totalAmount = parseFloat(client.monthly_fee) + overageAmount

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      client_id: client.id,
      user_id: client.user_id,
      billing_period,
      base_fee: client.monthly_fee,
      overage_hours: overageHours,
      overage_amount: overageAmount,
      total_amount: totalAmount,
      due_date: new Date(year, month - 1, client.billing_day).toISOString().split("T")[0],
      status: "unpaid",
    })
    .select()
    .single()

  if (invoiceError) return NextResponse.json({ error: invoiceError.message }, { status: 500 })

  // Line items
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

  // Get freelancer name
  const { data: freelancer } = await supabase
    .from("users")
    .select("name, email")
    .eq("id", client.user_id)
    .single()

  const freelancerName = freelancer?.name || "Your freelancer"
  const periodLabel = new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Send invoice email to client
  await resend.emails.send({
    from: "Retallio <invoices@retallio.app>",
    to: client.email,
    subject: `Invoice for ${periodLabel} — $${totalAmount.toFixed(2)}`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px 32px; border-radius: 16px;">
        <p style="font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">
          Invoice
        </p>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px; color: #fff;">
          ${periodLabel}
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 32px; line-height: 1.6;">
          Thanks for approving the summary. Here's your invoice from ${freelancerName}.
        </p>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size: 13px; color: rgba(255,255,255,0.4); padding-bottom: 12px;">Base retainer</td>
              <td align="right" style="font-size: 13px; color: #fff; padding-bottom: 12px;">$${parseFloat(client.monthly_fee).toFixed(2)}</td>
            </tr>
            ${overageAmount > 0 ? `
            <tr>
              <td style="font-size: 13px; color: rgba(255,255,255,0.4); padding-bottom: 12px;">Overage (${overageHours.toFixed(1)}h × $${parseFloat(client.overage_rate).toFixed(0)}/hr)</td>
              <td align="right" style="font-size: 13px; color: #fb923c; padding-bottom: 12px;">+$${overageAmount.toFixed(2)}</td>
            </tr>
            ` : ""}
            <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
              <td style="font-size: 14px; font-weight: 600; color: #fff; padding-top: 12px;">Total due</td>
              <td align="right" style="font-size: 16px; font-weight: 700; color: #fff; padding-top: 12px;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <a href="${process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin}/portal/${uuid}" style="display: block; background: #fff; color: #000; text-align: center; padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 24px;">
          View in portal →
        </a>

        <p style="font-size: 12px; color: rgba(255,255,255,0.2); text-align: center; margin: 0;">
          Powered by <a href="https://retallio.app" style="color: rgba(255,255,255,0.3);">Retallio</a>
        </p>
      </div>
    `,
  })

  // Notify freelancer
  await supabase.from("notifications").insert({
    user_id: client.user_id,
    type: "invoice_approved",
    title: "Invoice approved",
    body: `${client.name} approved the ${periodLabel} summary — invoice sent automatically ($${totalAmount.toFixed(2)})`,
    link: "/dashboard/invoices",
    client_id: client.id,
    invoice_id: invoice.id,
  })

  // Clear pending approval flag
  await supabase
    .from("clients")
    .update({ pending_approval: false, approval_month: null })
    .eq("id", client.id)

  return NextResponse.json({ success: true, invoice_id: invoice.id, total: totalAmount })
}
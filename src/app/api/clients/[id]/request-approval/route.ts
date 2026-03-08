import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: clientId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { billing_period } = body // YYYY-MM

  if (!billing_period || !/^\d{4}-\d{2}$/.test(billing_period)) {
    return NextResponse.json({ error: "billing_period required (YYYY-MM)" }, { status: 400 })
  }

  // Get client — must belong to this user
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .eq("user_id", user.id)
    .single()

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 })

  // Get freelancer name
  const { data: freelancer } = await supabase
    .from("users")
    .select("name")
    .eq("id", user.id)
    .single()

  // Mark client as pending approval for this month
  await supabase
    .from("clients")
    .update({ pending_approval: true, approval_month: billing_period })
    .eq("id", clientId)

  // Get the projected invoice amount for the email
  const [year, month] = billing_period.split("-").map(Number)
  const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0]
  const endDate = new Date(year, month, 0).toISOString().split("T")[0]

  const { data: entries } = await supabase
    .from("time_entries")
    .select("hours")
    .eq("client_id", clientId)
    .gte("date", startDate)
    .lte("date", endDate)
    .eq("is_running", false)

  const totalHours = (entries || []).reduce((sum, e) => sum + parseFloat(e.hours), 0)
  const overageHours = Math.max(0, totalHours - parseFloat(client.monthly_hours))
  const overageAmount = overageHours * parseFloat(client.overage_rate)
  const totalAmount = parseFloat(client.monthly_fee) + overageAmount

  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin}/portal/${client.portal_uuid}`
  const freelancerName = freelancer?.name || "Your freelancer"

  // Format billing period for display e.g. "March 2026"
  const periodLabel = new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })

  // Send approval request email to client
  await resend.emails.send({
    from: "Retallio <invoices@retallio.app>",
    to: client.email,
    subject: `Your ${periodLabel} summary is ready — does everything look good?`,
    html: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px 32px; border-radius: 16px;">
        <p style="font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">
          ${freelancerName}
        </p>
        <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 8px; color: #fff;">
          ${periodLabel} summary is ready
        </h1>
        <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 0 0 32px; line-height: 1.6;">
          ${freelancerName} has finished logging work for ${periodLabel}. Take a look at the summary and approve it — once you do, your invoice will be sent automatically.
        </p>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
            <tr>
              <td style="font-size: 13px; color: rgba(255,255,255,0.4); padding-bottom: 12px;">Hours used</td>
              <td align="right" style="font-size: 13px; color: #fff; font-weight: 600; padding-bottom: 12px;">${totalHours.toFixed(1)}h of ${parseFloat(client.monthly_hours)}h</td>
            </tr>
            <tr style="border-top: 1px solid rgba(255,255,255,0.06);">
              <td style="font-size: 13px; color: rgba(255,255,255,0.4); padding-top: 12px;">Invoice total</td>
              <td align="right" style="font-size: 15px; color: #fff; font-weight: 700; padding-top: 12px;">$${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <a href="${portalUrl}" style="display: block; background: #fff; color: #000; text-align: center; padding: 14px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; text-decoration: none; margin-bottom: 24px;">
          Review &amp; Approve →
        </a>

        <p style="font-size: 12px; color: rgba(255,255,255,0.2); text-align: center; margin: 0;">
          Powered by <a href="https://retallio.app" style="color: rgba(255,255,255,0.3);">Retallio</a>
        </p>
      </div>
    `,
  })

  // Notify freelancer
  await supabase.from("notifications").insert({
    user_id: user.id,
    type: "approval_requested",
    title: "Approval requested",
    body: `Approval request sent to ${client.name} for ${periodLabel}`,
    link: "/dashboard/invoices",
    client_id: clientId,
  })

  return NextResponse.json({ success: true })
}
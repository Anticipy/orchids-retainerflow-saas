import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const hasApiKey = !!process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || ""
  const isCustomDomain = !!from && !from.includes("onboarding@resend.dev")
  const fullyConfigured = hasApiKey && isCustomDomain

  return NextResponse.json({
    hasApiKey,
    hasCustomFrom: isCustomDomain,
    fullyConfigured,
  })
}

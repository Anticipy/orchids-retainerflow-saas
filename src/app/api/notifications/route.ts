import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    if (body.mark_all_read) {
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("read_at", null)
      return NextResponse.json({ success: true })
    }
  } catch {
    // no body or invalid
  }
  return NextResponse.json({ error: "Bad request" }, { status: 400 })
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const unreadOnly = searchParams.get("unread_only") === "true"
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10) || 20)

  let query = supabase
    .from("notifications")
    .select("id, type, title, body, link, client_id, invoice_id, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (unreadOnly) {
    query = query.is("read_at", null)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let unreadCount = 0
  if (unreadOnly) {
    unreadCount = data?.length ?? 0
  } else {
    const { count } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("read_at", null)
    unreadCount = count ?? 0
  }

  return NextResponse.json({ notifications: data ?? [], unreadCount })
}

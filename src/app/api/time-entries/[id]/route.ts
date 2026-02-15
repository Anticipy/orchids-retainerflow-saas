import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const updates: Record<string, unknown> = {}

  if (body.hours !== undefined) updates.hours = parseFloat(body.hours)
  if (body.description !== undefined) updates.description = body.description
  if (body.date !== undefined) updates.date = body.date
  if (body.is_running !== undefined) updates.is_running = body.is_running
  if (body.started_at !== undefined) updates.started_at = body.started_at
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("time_entries")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, clients(name)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Check if entry is older than 30 days
  const { data: entry } = await supabase
    .from("time_entries")
    .select("date")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const entryDate = new Date(entry.date)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  if (entryDate < thirtyDaysAgo) {
    return NextResponse.json(
      { error: "Cannot delete time entries older than 30 days" },
      { status: 403 }
    )
  }

  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

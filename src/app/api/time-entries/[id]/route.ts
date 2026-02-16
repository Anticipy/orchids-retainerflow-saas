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
  if (body.client_id !== undefined) {
    const { data: client } = await supabase
      .from("clients")
      .select("id")
      .eq("id", body.client_id)
      .eq("user_id", user.id)
      .single()
    if (client) updates.client_id = body.client_id
  }
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

  const { error } = await supabase
    .from("time_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

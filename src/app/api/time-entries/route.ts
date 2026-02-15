import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get("client_id")

  let query = supabase
    .from("time_entries")
    .select("*, clients(name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  if (clientId) {
    query = query.eq("client_id", clientId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { client_id, date, hours, description, is_running, started_at } = body

  if (!client_id) {
    return NextResponse.json({ error: "Client is required" }, { status: 400 })
  }

  // Verify client belongs to user
  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("id", client_id)
    .eq("user_id", user.id)
    .single()

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  const entry: Record<string, unknown> = {
    client_id,
    user_id: user.id,
    date: date || new Date().toISOString().split("T")[0],
    hours: parseFloat(hours) || 0,
    description: description || "",
    is_running: is_running || false,
    started_at: started_at || null,
  }

  // For running timers, hours can be 0
  if (!is_running && (!hours || parseFloat(hours) <= 0)) {
    return NextResponse.json({ error: "Hours must be greater than 0" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("time_entries")
    .insert(entry)
    .select("*, clients(name)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

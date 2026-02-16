"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Play, Square, Plus, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface Client {
  id: string
  name: string
  status: string
}

interface TimeEntry {
  id: string
  client_id: string
  date: string
  hours: number
  description: string
  is_running: boolean
  started_at: string | null
  clients: { name: string }
}

export default function TimeTrackingPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Timer state
  const [timerClientId, setTimerClientId] = useState("")
  const [timerDescription, setTimerDescription] = useState("")
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [runningEntryId, setRunningEntryId] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Manual entry state
  const [manualClientId, setManualClientId] = useState("")
  const [manualDate, setManualDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [manualHours, setManualHours] = useState("")
  const [manualDescription, setManualDescription] = useState("")

  // Edit entry state
  const [editOpen, setEditOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null)
  const [editForm, setEditForm] = useState({ date: "", client_id: "", hours: "", description: "" })

  const fetchData = useCallback(async () => {
    const [clientsRes, entriesRes] = await Promise.all([
      fetch("/api/clients"),
      fetch("/api/time-entries"),
    ])
    const clientsData = await clientsRes.json()
    const entriesData = await entriesRes.json()

    setClients((clientsData as Client[]).filter((c) => c.status === "active"))
    setEntries(entriesData)

    // Check for running timer
    const running = (entriesData as TimeEntry[]).find((e) => e.is_running)
    if (running && running.started_at) {
      setRunningEntryId(running.id)
      setTimerClientId(running.client_id)
      setTimerDescription(running.description)
      setTimerRunning(true)
      const elapsed = Math.floor((Date.now() - new Date(running.started_at).getTime()) / 1000)
      setTimerSeconds(elapsed)
    }

    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const startTimer = async () => {
    if (!timerClientId) { toast.error("Select a client"); return }

    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: timerClientId,
        date: format(new Date(), "yyyy-MM-dd"),
        hours: 0.01,
        description: timerDescription || "Timer session",
        is_running: true,
        started_at: new Date().toISOString(),
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to start timer")
      return
    }

    const entry = await res.json()
    setRunningEntryId(entry.id)
    setTimerRunning(true)
    setTimerSeconds(0)
    toast.success("Timer started")
  }

  const stopTimer = async () => {
    if (!runningEntryId) return

    const hours = Math.round((timerSeconds / 3600) * 100) / 100
    const finalHours = Math.max(hours, 0.01)

    await fetch(`/api/time-entries/${runningEntryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hours: finalHours,
        is_running: false,
        started_at: null,
        description: timerDescription || "Timer session",
      }),
    })

    setTimerRunning(false)
    setTimerSeconds(0)
    setRunningEntryId(null)
    setTimerDescription("")
    toast.success(`Logged ${finalHours}h`)
    fetchData()
  }

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualClientId || !manualHours) return

    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: manualClientId,
        date: manualDate,
        hours: manualHours,
        description: manualDescription,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to add entry")
      return
    }

    toast.success("Time entry added")
    setManualHours("")
    setManualDescription("")
    fetchData()
  }

  const deleteEntry = async (id: string) => {
    const res = await fetch(`/api/time-entries/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to delete")
      return
    }
    toast.success("Entry deleted")
    fetchData()
  }

  const openEdit = (entry: TimeEntry) => {
    setEditEntry(entry)
    setEditForm({
      date: entry.date,
      client_id: entry.client_id,
      hours: String(entry.hours),
      description: entry.description || "",
    })
    setEditOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editEntry || !editForm.client_id || !editForm.hours) return

    const res = await fetch(`/api/time-entries/${editEntry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: editForm.date,
        client_id: editForm.client_id,
        hours: parseFloat(editForm.hours),
        description: editForm.description || "",
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to update")
      return
    }

    toast.success("Entry updated")
    setEditOpen(false)
    setEditEntry(null)
    fetchData()
  }

  if (loading) {
    return <div className="space-y-6"><h1 className="text-2xl font-bold">Time Tracking</h1><Card><CardContent className="p-6"><div className="h-32 animate-pulse bg-muted rounded" /></CardContent></Card></div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Time Tracking</h1>

      {/* Timer */}
      <Card>
        <CardHeader>
          <CardTitle>Timer</CardTitle>
          <CardDescription>Start a timer for a client session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            <span className="text-5xl font-mono font-bold tabular-nums">{formatTime(timerSeconds)}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={timerClientId} onValueChange={setTimerClientId} disabled={timerRunning}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="What are you working on?"
              value={timerDescription}
              onChange={(e) => setTimerDescription(e.target.value)}
              className="md:col-span-2"
            />
          </div>
          <div className="flex justify-center">
            {timerRunning ? (
              <Button onClick={stopTimer} variant="destructive" size="lg">
                <Square className="mr-2 h-4 w-4" /> Stop Timer
              </Button>
            ) : (
              <Button onClick={startTimer} size="lg">
                <Play className="mr-2 h-4 w-4" /> Start Timer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Entry</CardTitle>
          <CardDescription>Add a time entry manually</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualEntry} className="grid gap-4 md:grid-cols-5">
            <div className="grid gap-2">
              <Label>Client</Label>
              <Select value={manualClientId} onValueChange={setManualClientId}>
                <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Hours</Label>
              <Input type="number" step="0.01" min="0.01" placeholder="e.g. 1 or 1.5" value={manualHours} onChange={(e) => setManualHours(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input placeholder="Task description" value={manualDescription} onChange={(e) => setManualDescription(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label className="invisible">Submit</Label>
              <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
          <CardDescription>All time entries</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.filter((e) => !e.is_running).length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No time entries yet.</p>
          ) : (
            <div className="space-y-2">
              {entries.filter((e) => !e.is_running).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{entry.description || "No description"}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{entry.clients?.name}</Badge>
                      <span>{format(new Date(entry.date), "MMM d, yyyy")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <span className="font-medium text-sm">{entry.hours}h</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(entry)} aria-label="Edit">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteEntry(entry.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit time entry</DialogTitle>
              <DialogDescription>Update date, client, hours, or description.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Client</Label>
                <Select value={editForm.client_id} onValueChange={(v) => setEditForm((f) => ({ ...f, client_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Hours</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editForm.hours}
                  onChange={(e) => setEditForm((f) => ({ ...f, hours: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  placeholder="Task description"
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

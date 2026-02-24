"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Square, Plus, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Client { id: string; name: string; status: string }
interface TimeEntry {
  id: string; client_id: string; date: string; hours: number
  description: string; is_running: boolean; started_at: string | null
  clients: { name: string }
}

const inputCls = "w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
const labelCls = "block text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-1.5"

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <p className="text-[14px] font-semibold text-white">{title}</p>
        {subtitle && <p className="text-[12px] text-white/30 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* ── Edit modal ─────────────────────────────────────────────────────── */
function EditModal({ open, onClose, entry, clients, onSubmit }: {
  open: boolean; onClose: () => void; entry: TimeEntry | null; clients: Client[]
  onSubmit: (e: React.FormEvent, form: { date: string; client_id: string; hours: string; description: string }) => void
}) {
  const [form, setForm] = useState({ date: "", client_id: "", hours: "", description: "" })

  useEffect(() => {
    if (entry) setForm({ date: entry.date, client_id: entry.client_id, hours: String(entry.hours), description: entry.description || "" })
  }, [entry])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: "#0d0d0d", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}>
              <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                <h2 className="text-[16px] font-bold text-white">Edit entry</h2>
              </div>
              <form onSubmit={(e) => onSubmit(e, form)}>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className={labelCls}>Client</label>
                    <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                      <SelectTrigger className="h-10 bg-white/[0.04] border-white/[0.08] text-white text-[13px] rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/[0.08] text-white">
                        {clients.map((c) => <SelectItem key={c.id} value={c.id} className="text-white/60 focus:text-white focus:bg-white/[0.05]">{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={labelCls}>Date</label>
                    <input className={inputCls} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Hours</label>
                    <input className={inputCls} type="number" step="0.01" min="0.01" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} required />
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <input className={inputCls} placeholder="Task description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </div>
                <div className="px-6 pb-6 flex items-center justify-end gap-2">
                  <button type="button" onClick={onClose} className="h-9 px-4 rounded-xl text-[13px] text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">Cancel</button>
                  <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors">
                    Save changes
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function TimeTrackingPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)

  const [timerClientId, setTimerClientId] = useState("")
  const [timerDescription, setTimerDescription] = useState("")
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [runningEntryId, setRunningEntryId] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [manualClientId, setManualClientId] = useState("")
  const [manualDate, setManualDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [manualHours, setManualHours] = useState("")
  const [manualDescription, setManualDescription] = useState("")

  const [editOpen, setEditOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null)

  const fetchData = useCallback(async () => {
    const [cr, er] = await Promise.all([fetch("/api/clients"), fetch("/api/time-entries")])
    const cd = await cr.json(); const ed = await er.json()
    setClients((cd as Client[]).filter((c) => c.status === "active"))
    setEntries(ed)
    const running = (ed as TimeEntry[]).find((e) => e.is_running)
    if (running?.started_at) {
      setRunningEntryId(running.id); setTimerClientId(running.client_id); setTimerDescription(running.description)
      setTimerRunning(true); setTimerSeconds(Math.floor((Date.now() - new Date(running.started_at).getTime()) / 1000))
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    if (timerRunning) { timerRef.current = setInterval(() => setTimerSeconds((s) => s + 1), 1000) }
    else if (timerRef.current) clearInterval(timerRef.current)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
  }

  const startTimer = async () => {
    if (!timerClientId) { toast.error("Select a client"); return }
    const res = await fetch("/api/time-entries", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: timerClientId, date: format(new Date(), "yyyy-MM-dd"), hours: 0.01, description: timerDescription || "Timer session", is_running: true, started_at: new Date().toISOString() }),
    })
    if (!res.ok) { const e = await res.json(); toast.error(e.error || "Failed"); return }
    const entry = await res.json()
    setRunningEntryId(entry.id); setTimerRunning(true); setTimerSeconds(0)
    toast.success("Timer started")
  }

  const stopTimer = async () => {
    if (!runningEntryId) return
    const hours = Math.max(Math.round((timerSeconds / 3600) * 100) / 100, 0.01)
    await fetch(`/api/time-entries/${runningEntryId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours, is_running: false, started_at: null, description: timerDescription || "Timer session" }),
    })
    setTimerRunning(false); setTimerSeconds(0); setRunningEntryId(null); setTimerDescription("")
    toast.success(`Logged ${hours}h`)
    fetchData()
  }

  const handleManualEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualClientId || !manualHours) return
    const res = await fetch("/api/time-entries", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: manualClientId, date: manualDate, hours: manualHours, description: manualDescription }),
    })
    if (!res.ok) { const e = await res.json(); toast.error(e.error || "Failed"); return }
    toast.success("Entry added"); setManualHours(""); setManualDescription(""); fetchData()
  }

  const deleteEntry = async (id: string) => {
    const res = await fetch(`/api/time-entries/${id}`, { method: "DELETE" })
    if (!res.ok) { const e = await res.json(); toast.error(e.error || "Failed"); return }
    toast.success("Entry deleted"); fetchData()
  }

  const handleEditSubmit = async (e: React.FormEvent, form: { date: string; client_id: string; hours: string; description: string }) => {
    e.preventDefault()
    if (!editEntry) return
    const res = await fetch(`/api/time-entries/${editEntry.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: form.date, client_id: form.client_id, hours: parseFloat(form.hours), description: form.description }),
    })
    if (!res.ok) { const e = await res.json(); toast.error(e.error || "Failed"); return }
    toast.success("Entry updated"); setEditOpen(false); setEditEntry(null); fetchData()
  }

  const displayed = entries.filter((e) => !e.is_running)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-bold tracking-tight text-white">Time Tracking</h1>
        <p className="text-[13px] text-white/30 mt-0.5">Track and log your client hours</p>
      </motion.div>

      {/* Timer */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <Panel title="Timer" subtitle="Start a timer for a live session">
          <div className="space-y-6">
            {/* Clock display */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {timerRunning && (
                  <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: "0 0 40px rgba(124,58,237,0.3)" }} />
                )}
                <div className={`px-8 py-4 rounded-2xl border transition-all duration-500 ${timerRunning ? "border-violet-500/30 bg-violet-500/[0.06]" : "border-white/[0.06] bg-white/[0.02]"}`}>
                  <span className="text-[52px] font-mono font-bold tabular-nums tracking-tight text-white">
                    {fmt(timerSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Select value={timerClientId} onValueChange={setTimerClientId} disabled={timerRunning}>
                <SelectTrigger className="h-10 w-full sm:w-44 bg-white/[0.04] border-white/[0.08] text-white text-[13px] rounded-xl">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border-white/[0.08] text-white">
                  {clients.map((c) => <SelectItem key={c.id} value={c.id} className="text-white/60 focus:text-white focus:bg-white/[0.05]">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <input
                className={`${inputCls} flex-1`}
                placeholder="What are you working on?"
                value={timerDescription}
                onChange={(e) => setTimerDescription(e.target.value)}
              />
              {timerRunning ? (
                <motion.button
                  onClick={stopTimer}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="h-10 px-5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-[13px] font-semibold flex items-center gap-2 transition-colors flex-shrink-0"
                >
                  <Square className="w-3.5 h-3.5" fill="currentColor" /> Stop
                </motion.button>
              ) : (
                <motion.button
                  onClick={startTimer}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="h-10 px-5 rounded-xl bg-white text-black text-[13px] font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors flex-shrink-0"
                >
                  <Play className="w-3.5 h-3.5" fill="currentColor" /> Start
                </motion.button>
              )}
            </div>
          </div>
        </Panel>
      </motion.div>

      {/* Manual entry */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <Panel title="Manual Entry" subtitle="Log past hours directly">
          <form onSubmit={handleManualEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className={labelCls}>Client</label>
              <Select value={manualClientId} onValueChange={setManualClientId}>
                <SelectTrigger className="h-10 bg-white/[0.04] border-white/[0.08] text-white text-[13px] rounded-xl"><SelectValue placeholder="Client" /></SelectTrigger>
                <SelectContent className="bg-[#111] border-white/[0.08] text-white">
                  {clients.map((c) => <SelectItem key={c.id} value={c.id} className="text-white/60 focus:text-white focus:bg-white/[0.05]">{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelCls}>Date</label>
              <input className={inputCls} type="date" value={manualDate} onChange={(e) => setManualDate(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Hours</label>
              <input className={inputCls} type="number" step="0.01" min="0.01" placeholder="e.g. 1.5" value={manualHours} onChange={(e) => setManualHours(e.target.value)} required />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input className={inputCls} placeholder="Task description" value={manualDescription} onChange={(e) => setManualDescription(e.target.value)} />
            </div>
            <div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full h-10 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </motion.button>
            </div>
          </form>
        </Panel>
      </motion.div>

      {/* Entries list */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Panel title="Time Entries" subtitle={`${displayed.length} entries`}>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-white/[0.03] animate-pulse" />)}
            </div>
          ) : displayed.length === 0 ? (
            <p className="text-[13px] text-white/25 text-center py-8">No entries yet. Start the timer or add one manually.</p>
          ) : (
            <div className="space-y-0">
              <AnimatePresence>
                {displayed.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-[13px] font-medium text-white/75 truncate">{entry.description || "No description"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-violet-400/60">{entry.clients?.name}</span>
                        <span className="text-[11px] text-white/25">·</span>
                        <span className="text-[11px] text-white/25">{format(new Date(entry.date), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[13px] font-semibold text-white/50 tabular-nums mr-2">{entry.hours}h</span>
                      <button
                        onClick={() => { setEditEntry(entry); setEditOpen(true) }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/[0.05] transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/[0.06] transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </Panel>
      </motion.div>

      <EditModal open={editOpen} onClose={() => { setEditOpen(false); setEditEntry(null) }} entry={editEntry} clients={clients} onSubmit={handleEditSubmit} />
    </div>
  )
}
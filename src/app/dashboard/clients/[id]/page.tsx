"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, Copy, ExternalLink, Pencil, Archive, Trash2,
  Clock, FileText, TrendingUp, Calendar, Send, Plus, Loader2, Check
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Client {
  id: string; name: string; email: string
  monthly_hours: number; monthly_fee: number
  overage_rate: number; billing_day: number
  status: string; portal_uuid: string; created_at: string
  pending_approval: boolean; approval_month: string | null
}

interface TimeEntry {
  id: string; date: string; hours: number; description: string; is_running: boolean
}

interface Invoice {
  id: string; billing_period: string; total_amount: number; status: string; created_at: string
}

const inputCls = "w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
const labelCls = "block text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-1.5"

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"]
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function fmtHours(h: number): string {
  const totalMins = Math.round(h * 60)
  if (totalMins < 60) return `${totalMins}m`
  const hrs = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`
}

function statusColors(pct: number) {
  if (pct >= 100) return { bar: "#f87171", badge: "text-red-400 bg-red-400/10 border-red-400/20", label: "Over limit" }
  if (pct >= 80) return { bar: "#fb923c", badge: "text-orange-400 bg-orange-400/10 border-orange-400/20", label: "Near limit" }
  return { bar: "#a78bfa", badge: "text-violet-400 bg-violet-400/10 border-violet-400/20", label: "On track" }
}

function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [client, setClient] = useState<Client | null>(null)
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(toMonthKey(new Date()))
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [requestingApproval, setRequestingApproval] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", monthly_hours: "", monthly_fee: "", overage_rate: "", billing_day: "1"
  })

  const fetchData = async () => {
    const [clientRes, entriesRes, invoicesRes] = await Promise.all([
      fetch(`/api/clients/${id}`),
      fetch(`/api/time-entries?client_id=${id}&month=${selectedMonth}`),
      fetch(`/api/invoices?client_id=${id}`),
    ])
    if (!clientRes.ok) { router.push("/dashboard/clients"); return }
    const clientData: Client = await clientRes.json()
    const entriesData = entriesRes.ok ? await entriesRes.json() : []
    const invoicesData = invoicesRes.ok ? await invoicesRes.json() : []
    setClient(clientData)
    setEntries(Array.isArray(entriesData) ? entriesData.filter((e: TimeEntry) => !e.is_running) : [])
    setInvoices(Array.isArray(invoicesData) ? invoicesData : [])
    setForm({
      name: clientData.name, email: clientData.email,
      monthly_hours: String(clientData.monthly_hours),
      monthly_fee: String(clientData.monthly_fee),
      overage_rate: String(clientData.overage_rate),
      billing_day: String(clientData.billing_day),
    })
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id, selectedMonth])

  const hoursUsed = entries.reduce((sum, e) => sum + parseFloat(String(e.hours)), 0)
  const percentUsed = client ? (hoursUsed / client.monthly_hours) * 100 : 0
  const sc = statusColors(percentUsed)
  const overageHours = client ? Math.max(0, hoursUsed - client.monthly_hours) : 0
  const projectedTotal = client
    ? parseFloat(String(client.monthly_fee)) + overageHours * parseFloat(String(client.overage_rate))
    : 0
    
  const invoiceExistsForMonth = invoices.some(inv => inv.billing_period === selectedMonth) 


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed"); return }
    toast.success("Client updated")
    setEditOpen(false)
    fetchData()
  }

  const handleArchive = async () => {
    if (!client) return
    const newStatus = client.status === "active" ? "archived" : "active"
    await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    toast.success(newStatus === "archived" ? "Client archived" : "Client reactivated")
    fetchData()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" })
    setDeleting(false)
    if (res.ok) { toast.success("Client deleted"); router.push("/dashboard/clients") }
    else { const d = await res.json().catch(() => ({})); toast.error(d.error || "Failed to delete") }
  }

  const handleCopyLink = () => {
    if (!client) return
    navigator.clipboard.writeText(`${window.location.origin}/portal/${client.portal_uuid}`)
    setCopied(true)
    toast.success("Portal link copied")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRequestApproval = async () => {
    setRequestingApproval(true)
    const res = await fetch(`/api/clients/${id}/request-approval`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billing_period: selectedMonth }),
    })
    setRequestingApproval(false)
    if (!res.ok) { const e = await res.json(); toast.error(e.error || "Failed"); return }
    toast.success("Approval request sent")
    fetchData()
  }

  const prevMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number)
    setSelectedMonth(toMonthKey(new Date(y, m - 2, 1)))
  }

  const nextMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number)
    const next = new Date(y, m, 1)
    if (next <= new Date()) setSelectedMonth(toMonthKey(next))
  }

  const isCurrentMonth = selectedMonth >= toMonthKey(new Date())

  if (loading) return (
    <div className="space-y-4 max-w-3xl">
      <div className="h-8 w-48 rounded-xl bg-white/[0.04] animate-pulse" />
      <div className="h-32 rounded-2xl bg-white/[0.03] animate-pulse" />
      <div className="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
    </div>
  )

  if (!client) return null

  return (
    <div className="space-y-5">

      {/* Back + actions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.push("/dashboard/clients")}
          className="flex items-center gap-1.5 text-[13px] text-white/35 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Clients
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-white/[0.07] bg-white/[0.03] text-[12px] text-white/40 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy portal link"}
          </button>
          <button
            onClick={() => window.open(`/portal/${client.portal_uuid}`, "_blank")}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
            title="View portal"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
            title="Edit client"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleArchive}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
            title={client.status === "active" ? "Archive client" : "Reactivate client"}
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
          {client.status === "archived" && (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.04] text-red-400/50 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
              title="Delete permanently"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </motion.div>

      {/* Client header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-6 py-5"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[18px] font-bold flex-shrink-0"
            style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}
          >
            {client.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[20px] font-bold text-white tracking-tight">{client.name}</h1>
              {client.status === "archived" && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-white/30 bg-white/[0.04] border-white/[0.08]">
                  Archived
                </span>
              )}
              {client.pending_approval && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border text-violet-400 bg-violet-400/10 border-violet-400/20">
                  Awaiting approval
                </span>
              )}
            </div>
            <p className="text-[13px] text-white/35 mt-0.5">{client.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-white/[0.05]">
          {[
            { label: "Monthly fee", value: `$${Number(client.monthly_fee).toLocaleString()}` },
            { label: "Included hours", value: `${client.monthly_hours}h/mo` },
            { label: "Overage rate", value: `$${client.overage_rate}/hr` },
            { label: "Bills on", value: ordinal(client.billing_day) },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[11px] text-white/25 uppercase tracking-[0.12em] font-semibold mb-1">{label}</p>
              <p className="text-[14px] font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Month selector + hours */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "rgba(167,139,250,0.20)", background: "rgba(109,40,217,0.06)" }}
      >
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.15em]">Hours</p>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all">
              ‹
            </button>
            <span className="text-[12px] font-medium text-white/50 min-w-[100px] text-center">
              {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
            </span>
            <button onClick={nextMonth} disabled={isCurrentMonth} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-25 disabled:pointer-events-none">
              ›
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[36px] font-bold text-white tabular-nums leading-none">{fmtHours(hoursUsed)}</span>
                <span className="text-[16px] text-white/30">of {client.monthly_hours}h</span>
              </div>
              <p className="text-[12px] text-white/35 mt-1">
                {overageHours > 0
                  ? `${fmtHours(overageHours)} overage · +$${(overageHours * parseFloat(String(client.overage_rate))).toFixed(2)}`
                  : `${fmtHours(Math.max(0, client.monthly_hours - hoursUsed))} remaining`
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${sc.badge}`}>
                {sc.label}
              </span>
              <span className="text-[15px] font-bold text-white tabular-nums">${projectedTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: sc.bar }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentUsed, 100)}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Request approval */}
          {isCurrentMonth && client.status === "active" && (
            <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between gap-4">
              <p className="text-[12px] text-white/30">
                {client.pending_approval
                  ? `Approval requested for ${format(new Date(selectedMonth + "-01"), "MMMM")} — waiting on client`
                  : "Ready to bill? Request client approval before generating the invoice."
                }
              </p>
              {!client.pending_approval && !invoiceExistsForMonth && (
                <button
                  onClick={handleRequestApproval}
                  disabled={requestingApproval}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-[12px] font-semibold hover:bg-violet-600/30 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  {requestingApproval ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  Request approval
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Time entries */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-white/30" />
          <p className="text-[13px] font-semibold text-white">Work logged</p>
          <span className="ml-auto text-[11px] text-white/25">{entries.length} entries</span>
        </div>
        <div className="p-5">
          {entries.length === 0 ? (
            <p className="text-[13px] text-white/25 text-center py-6">No work logged for {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}</p>
          ) : (
            <div>
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-[13px] text-white/70 truncate">{entry.description || "No description"}</p>
                    <p className="text-[11px] text-white/25 mt-0.5">{format(new Date(entry.date), "MMM d, yyyy")}</p>
                  </div>
                  <span className="text-[13px] font-medium text-white/50 tabular-nums flex-shrink-0">{fmtHours(entry.hours)}</span>
                </motion.div>
              ))}
              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.12em]">Total</span>
                <span className="text-[13px] font-bold text-white tabular-nums">{fmtHours(hoursUsed)}</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-white/30" />
          <p className="text-[13px] font-semibold text-white">Invoices</p>
          <span className="ml-auto text-[11px] text-white/25">{invoices.length} total</span>
        </div>
        <div className="p-5">
          {invoices.length === 0 ? (
            <p className="text-[13px] text-white/25 text-center py-6">No invoices yet</p>
          ) : (
            <div>
              {invoices.slice(0, 6).map((invoice, i) => {
                const paid = invoice.status === "paid"
                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.18 + i * 0.04 }}
                    onClick={() => router.push(`/dashboard/invoices?client=${client.id}`)}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 cursor-pointer hover:bg-white/[0.05] rounded-xl px-2 -mx-2 transition-colors"
                  >
                    <div>
                      <p className="text-[13px] text-white/70">{invoice.billing_period}</p>
                      <p className="text-[11px] text-white/25 mt-0.5">{format(new Date(invoice.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[13px] font-semibold text-white tabular-nums">${Number(invoice.total_amount).toLocaleString()}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        paid
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : "text-orange-400 bg-orange-400/10 border-orange-400/20"
                      }`}>
                        {paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit modal */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setEditOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
                style={{ background: "#0d0d0d", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
              >
                <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                  <h2 className="text-[16px] font-bold text-white">Edit client</h2>
                  <p className="text-[12px] text-white/30 mt-0.5">Update {client.name}'s details</p>
                </div>
                <form onSubmit={handleSave}>
                  <div className="px-6 py-5 space-y-4">
                    <div>
                      <label className={labelCls}>Client name</label>
                      <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Monthly hours</label>
                        <input className={inputCls} type="number" step="0.5" min="0.5" value={form.monthly_hours} onChange={(e) => setForm({ ...form, monthly_hours: e.target.value })} required />
                      </div>
                      <div>
                        <label className={labelCls}>Monthly fee ($)</label>
                        <input className={inputCls} type="number" step="0.01" min="0" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Overage rate ($/hr)</label>
                        <input className={inputCls} type="number" step="0.01" min="0" value={form.overage_rate} onChange={(e) => setForm({ ...form, overage_rate: e.target.value })} required />
                      </div>
                      <div>
                        <label className={labelCls}>Billing day (1–28)</label>
                        <input className={inputCls} type="number" min="1" max="28" value={form.billing_day} onChange={(e) => setForm({ ...form, billing_day: e.target.value })} required />
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex items-center justify-end gap-2">
                    <button type="button" onClick={() => setEditOpen(false)} className="h-9 px-4 rounded-xl text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">
                      Cancel
                    </button>
                    <motion.button
                      type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
                    >
                      Save changes
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AlertDialog open={deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(false)}>
        <AlertDialogContent className="bg-[#0d0d0d] border-white/[0.08] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete {client.name} permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              This will delete all their time entries and invoices. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="bg-white/[0.05] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.09]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => { e.preventDefault(); handleDelete() }}
              disabled={deleting}
              className="bg-red-500/80 hover:bg-red-500 text-white border-0"
            >
              {deleting ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
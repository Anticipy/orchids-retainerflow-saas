"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Plus, CheckCircle, Download, Mail, Loader2, Filter } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatePresence as AP } from "framer-motion"
import { useSearchParams } from "next/navigation"


interface Invoice {
  id: string; client_id: string; billing_period: string
  base_fee: number; overage_hours: number; overage_amount: number
  total_amount: number; status: string; pdf_url: string | null
  due_date: string | null; created_at: string
  clients: { name: string; email: string }
}

interface Client { id: string; name: string; status: string }

const inputCls = "w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
const labelCls = "block text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-1.5"

/* ── Generate modal ─────────────────────────────────────────────────── */
function GenerateModal({ open, onClose, clients, onGenerate }: {
  open: boolean; onClose: () => void; clients: Client[]
  onGenerate: (clientId: string, period: string) => Promise<void>
}) {
  const [clientId, setClientId] = useState("")
  const [period, setPeriod] = useState(format(new Date(), "yyyy-MM"))
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId) return
    setLoading(true)
    await onGenerate(clientId, period)
    setLoading(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ background: "#0d0d0d", boxShadow: "0 32px 80px rgba(0,0,0,0.8)" }}
            >
              <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                <h2 className="text-[16px] font-bold text-white">Generate invoice</h2>
                <p className="text-[12px] text-white/30 mt-0.5">Create an invoice for a billing period</p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className={labelCls}>Client</label>
                    <Select value={clientId} onValueChange={setClientId}>
                      <SelectTrigger className="h-10 bg-white/[0.04] border-white/[0.08] text-white text-[13px] rounded-xl">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111] border-white/[0.08] text-white">
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id} className="text-white/70 focus:text-white focus:bg-white/[0.05]">{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={labelCls}>Billing period</label>
                    <input className={inputCls} type="month" value={period} onChange={(e) => setPeriod(e.target.value)} />
                  </div>
                </div>
                <div className="px-6 pb-6 flex items-center justify-end gap-2">
                  <button type="button" onClick={onClose} className="h-9 px-4 rounded-xl text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">
                    Cancel
                  </button>
                  <motion.button
                    type="submit" disabled={!clientId || loading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-40"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Generate"}
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

/* ── Invoice row ───────────────────────────────────────────────────── */
function InvoiceRow({ invoice, onMarkPaid, onMarkUnpaid, onSendEmail, onDownload, sendingId, index }: {
  invoice: Invoice
  onMarkPaid: () => void
  onMarkUnpaid: () => void
  onSendEmail: () => void
  onDownload: () => void
  sendingId: string | null
  index: number
}) {
  const paid = invoice.status === "paid"
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-5 py-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] gap-4"
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${paid ? "bg-emerald-400/10" : "bg-white/[0.04]"}`}>
          <FileText className={`w-3.5 h-3.5 ${paid ? "text-emerald-400" : "text-white/30"}`} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-medium text-white/80">{invoice.clients?.name}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
              paid
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                : "text-orange-400 bg-orange-400/10 border-orange-400/20"
            }`}>
              {paid ? "Paid" : "Unpaid"}
            </span>
          </div>
          <p className="text-[12px] text-white/30 mt-0.5">
            {invoice.billing_period}
            {invoice.overage_hours > 0 && ` · ${invoice.overage_hours}h overage ($${invoice.overage_amount})`}
            {invoice.due_date && ` · Due ${format(new Date(invoice.due_date), "MMM d")}`}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[16px] font-bold text-white">${Number(invoice.total_amount).toLocaleString()}</span>

        {!paid ? (
          <button
            onClick={onMarkPaid}
            className="h-8 px-3 rounded-xl border border-white/[0.09] bg-white/[0.04] text-[12px] font-medium text-white/60 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Mark paid
          </button>
        ) : (
          <button
            onClick={onMarkUnpaid}
            className="h-8 px-3 rounded-xl text-[12px] font-medium text-white/25 hover:text-white/60 hover:bg-white/[0.04] transition-all"
          >
            Unpaid
          </button>
        )}

        <button
          onClick={onSendEmail}
          disabled={sendingId === invoice.id}
          title="Email to client"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all disabled:opacity-40"
        >
          {sendingId === invoice.id
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Mail className="w-3.5 h-3.5" />
          }
        </button>

        <button
          onClick={onDownload}
          title="Download PDF"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const searchParams = useSearchParams()
  const [filterClientId, setFilterClientId] = useState(searchParams.get("client") || "all")
  const [sendingId, setSendingId] = useState<string | null>(null)

  const fetchInvoices = async () => {
    const res = await fetch("/api/invoices")
    setInvoices(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
    fetch("/api/clients").then((r) => r.json()).then((d) =>
      setClients((d as Client[]).filter((c) => c.status === "active"))
    )
  }, [])

  const generateInvoice = async (clientId: string, period: string) => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, billing_period: period }),
    })
    if (!res.ok) { const e = await res.json(); toast.error(e.error || "Failed"); return }
    toast.success("Invoice generated")
    fetchInvoices()
  }

  const markAsPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "paid" }) })
    toast.success("Marked as paid"); fetchInvoices()
  }

  const markAsUnpaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "unpaid" }) })
    toast.success("Marked as unpaid"); fetchInvoices()
  }

  const sendEmail = async (id: string) => {
    setSendingId(id)
    const res = await fetch(`/api/invoices/${id}/send-email`, { method: "POST" })
    const data = await res.json().catch(() => ({}))
    setSendingId(null)
    if (!res.ok) { toast.error(data.error || "Failed to send"); return }
    toast.success("Invoice sent to client")
  }

  let filtered = filterStatus === "all" ? invoices : invoices.filter((i) => i.status === filterStatus)
  if (filterClientId !== "all") filtered = filtered.filter((i) => i.client_id === filterClientId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-white">Invoices</h1>
          <p className="text-[13px] text-white/30 mt-0.5">{filtered.length} invoice{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterClientId} onValueChange={setFilterClientId}>
            <SelectTrigger className="h-9 w-36 bg-white/[0.03] border-white/[0.07] text-white/50 text-[13px] rounded-xl">
              <SelectValue placeholder="All clients" />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/[0.08] text-white">
              <SelectItem value="all" className="text-white/60 focus:text-white focus:bg-white/[0.05]">All clients</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-white/60 focus:text-white focus:bg-white/[0.05]">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-9 w-28 bg-white/[0.03] border-white/[0.07] text-white/50 text-[13px] rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-white/[0.08] text-white">
              <SelectItem value="all" className="text-white/60 focus:text-white focus:bg-white/[0.05]">All</SelectItem>
              <SelectItem value="unpaid" className="text-white/60 focus:text-white focus:bg-white/[0.05]">Unpaid</SelectItem>
              <SelectItem value="paid" className="text-white/60 focus:text-white focus:bg-white/[0.05]">Paid</SelectItem>
            </SelectContent>
          </Select>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Generate
          </motion.button>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[76px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-[14px] font-medium text-white/35 mb-1">No invoices yet</p>
          <p className="text-[12px] text-white/20">Generate your first invoice above</p>
        </motion.div>
      )}

      {/* List */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((inv, i) => (
              <InvoiceRow
                key={inv.id}
                invoice={inv}
                index={i}
                sendingId={sendingId}
                onMarkPaid={() => markAsPaid(inv.id)}
                onMarkUnpaid={() => markAsUnpaid(inv.id)}
                onSendEmail={() => sendEmail(inv.id)}
                onDownload={() => window.open(`/api/invoices/${inv.id}/pdf`, "_blank")}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <GenerateModal open={dialogOpen} onClose={() => setDialogOpen(false)} clients={clients} onGenerate={generateInvoice} />
    </div>
  )
}
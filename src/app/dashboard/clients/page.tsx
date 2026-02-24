"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MoreHorizontal, Pencil, Archive, ExternalLink, Copy, Trash2, Users } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Client {
  id: string; name: string; email: string
  monthly_hours: number; monthly_fee: number
  overage_rate: number; billing_day: number
  status: string; portal_uuid: string; created_at: string
}

interface ClientWithHours extends Client {
  hoursUsed: number; percentUsed: number
}

/* ── Shared input style ─────────────────────────────────────────────── */
const inputCls = "w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
const labelCls = "block text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-1.5"

/* ── Status colors ─────────────────────────────────────────────────── */
function statusStyle(pct: number) {
  if (pct >= 100) return { bar: "#f87171", badge: "text-red-400 bg-red-400/10 border-red-400/20" }
  if (pct >= 80)  return { bar: "#fb923c", badge: "text-orange-400 bg-orange-400/10 border-orange-400/20" }
  return { bar: "#a78bfa", badge: "text-violet-400 bg-violet-400/10 border-violet-400/20" }
}

function ordinal(n: number) {
  const s = ["th","st","nd","rd"]
  const v = n % 100
  return n + (s[(v-20)%10] || s[v] || s[0])
}

/* ── Client card ───────────────────────────────────────────────────── */
function ClientCard({ client, onEdit, onArchive, onDelete, onCopyLink, index }: {
  client: ClientWithHours
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
  onCopyLink: () => void
  index: number
}) {
  const pct = Math.min(client.percentUsed, 100)
  const style = statusStyle(client.percentUsed)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      {/* Card header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[14px] font-bold flex-shrink-0"
            style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}
          >
            {client.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-white leading-tight truncate">{client.name}</p>
            <p className="text-[12px] text-white/30 truncate">{client.email}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.06] transition-all flex-shrink-0 ml-2">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#111] border-white/[0.08] text-white/70 min-w-[160px]">
            <DropdownMenuItem onClick={onEdit} className="hover:text-white hover:bg-white/[0.05] cursor-pointer text-[13px]">
              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopyLink} className="hover:text-white hover:bg-white/[0.05] cursor-pointer text-[13px]">
              <Copy className="mr-2 h-3.5 w-3.5" /> Copy portal link
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`/portal/${client.portal_uuid}`, "_blank")}
              className="hover:text-white hover:bg-white/[0.05] cursor-pointer text-[13px]"
            >
              <ExternalLink className="mr-2 h-3.5 w-3.5" /> View portal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onArchive} className="hover:text-white hover:bg-white/[0.05] cursor-pointer text-[13px]">
              <Archive className="mr-2 h-3.5 w-3.5" />
              {client.status === "active" ? "Archive" : "Reactivate"}
            </DropdownMenuItem>
            {client.status === "archived" && (
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-400/[0.06] cursor-pointer text-[13px]">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete permanently
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-3">
        {/* Hours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] text-white/35">Hours this month</span>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-white/60 tabular-nums">
                {client.hoursUsed}h / {client.monthly_hours}h
              </span>
              {client.percentUsed >= 80 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${style.badge}`}>
                  {client.percentUsed >= 100 ? "Over" : "Near limit"}
                </span>
              )}
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: style.bar }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold text-white/60">${client.monthly_fee.toLocaleString()}<span className="text-[11px] font-normal text-white/25">/mo</span></span>
          <span className="text-[11px] text-white/25">Bills {ordinal(client.billing_day)} each month</span>
        </div>

        {/* Portal link — always visible, primary action */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => { e.stopPropagation(); onCopyLink() }}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-white/[0.07] bg-white/[0.03] text-[12px] font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          >
            <Copy className="w-3 h-3" />
            Copy portal link
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); window.open(`/portal/${client.portal_uuid}`, "_blank") }}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
            title="View portal"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Modal / Sheet ──────────────────────────────────────────────────── */
function ClientModal({ open, onClose, onSubmit, editing, form, setForm }: {
  open: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  editing: Client | null
  form: { name: string; email: string; monthly_hours: string; monthly_fee: string; overage_rate: string; billing_day: string }
  setForm: React.Dispatch<React.SetStateAction<typeof form>>
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
              style={{ background: "#0d0d0d", boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)" }}
            >
              <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
                <h2 className="text-[16px] font-bold text-white">{editing ? "Edit client" : "Add new client"}</h2>
                <p className="text-[12px] text-white/30 mt-0.5">{editing ? "Update client details" : "Create a new retainer client"}</p>
              </div>

              <form onSubmit={onSubmit}>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className={labelCls}>Client name</label>
                    <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Meridian Studio" required />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="hello@meridian.co" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Monthly hours</label>
                      <input className={inputCls} type="number" step="0.5" min="0.5" value={form.monthly_hours} onChange={(e) => setForm({ ...form, monthly_hours: e.target.value })} placeholder="20" required />
                    </div>
                    <div>
                      <label className={labelCls}>Monthly fee ($)</label>
                      <input className={inputCls} type="number" step="0.01" min="0" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} placeholder="1900" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Overage rate ($/hr)</label>
                      <input className={inputCls} type="number" step="0.01" min="0" value={form.overage_rate} onChange={(e) => setForm({ ...form, overage_rate: e.target.value })} placeholder="95" required />
                    </div>
                    <div>
                      <label className={labelCls}>Billing day (1–28)</label>
                      <input className={inputCls} type="number" min="1" max="28" value={form.billing_day} onChange={(e) => setForm({ ...form, billing_day: e.target.value })} required />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-9 px-4 rounded-xl text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/[0.05] transition-all"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
                  >
                    {editing ? "Save changes" : "Create client"}
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
const emptyForm = { name: "", email: "", monthly_hours: "", monthly_fee: "", overage_rate: "", billing_day: "1" }

export default function ClientsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clients, setClients] = useState<ClientWithHours[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const fetchClients = async () => {
    const [clientsRes, dashRes] = await Promise.all([fetch("/api/clients"), fetch("/api/dashboard")])
    const clientsData: Client[] = await clientsRes.json()
    const dashData = await dashRes.json()
    const map = new Map((dashData.clientSummaries || []).map((s: { id: string; hoursUsed: number; percentUsed: number }) => [s.id, s]))
    setClients(clientsData.map((c) => {
      const s = map.get(c.id) as { hoursUsed: number; percentUsed: number } | undefined
      return { ...c, hoursUsed: s?.hoursUsed || 0, percentUsed: s?.percentUsed || 0 }
    }))
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingClient(null); setForm(emptyForm); setDialogOpen(true)
      router.replace("/dashboard/clients")
    }
  }, [searchParams, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients"
    const method = editingClient ? "PATCH" : "POST"
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    if (!res.ok) { const err = await res.json(); toast.error(err.error || "Failed to save"); return }
    toast.success(editingClient ? "Client updated" : "Client created")
    setDialogOpen(false); setEditingClient(null); setForm(emptyForm); fetchClients()
  }

  const handleArchive = async (client: Client) => {
    const newStatus = client.status === "active" ? "archived" : "active"
    await fetch(`/api/clients/${client.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) })
    toast.success(newStatus === "archived" ? "Client archived" : "Client reactivated")
    fetchClients()
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    setDeleting(true)
    const res = await fetch(`/api/clients/${deleteConfirm.id}`, { method: "DELETE" })
    setDeleteConfirm(null); setDeleting(false)
    if (res.ok) { toast.success("Client deleted"); fetchClients() }
    else { const d = await res.json().catch(() => ({})); toast.error(d.error || "Failed to delete") }
  }

  const filtered = clients.filter((c) => showArchived ? c.status === "archived" : c.status === "active")

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-white">Clients</h1>
          <p className="text-[13px] text-white/30 mt-0.5">{filtered.length} {showArchived ? "archived" : "active"} client{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="h-9 px-4 rounded-xl text-[13px] font-medium text-white/35 hover:text-white hover:bg-white/[0.05] border border-white/[0.07] transition-all"
          >
            {showArchived ? "Show active" : "Show archived"}
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setEditingClient(null); setForm(emptyForm); setDialogOpen(true) }}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add client
          </motion.button>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[180px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
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
            <Users className="w-5 h-5 text-white/20" />
          </div>
          <p className="text-[14px] font-medium text-white/35 mb-1">
            {showArchived ? "No archived clients" : "No clients yet"}
          </p>
          {!showArchived && (
            <p className="text-[12px] text-white/20 mb-5">Add your first retainer client to get started</p>
          )}
          {!showArchived && (
            <button
              onClick={() => { setEditingClient(null); setForm(emptyForm); setDialogOpen(true) }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add first client
            </button>
          )}
        </motion.div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtered.map((client, i) => (
              <ClientCard
                key={client.id}
                client={client}
                index={i}
                onEdit={() => {
                  setEditingClient(client)
                  setForm({ name: client.name, email: client.email, monthly_hours: String(client.monthly_hours), monthly_fee: String(client.monthly_fee), overage_rate: String(client.overage_rate), billing_day: String(client.billing_day) })
                  setDialogOpen(true)
                }}
                onArchive={() => handleArchive(client)}
                onDelete={() => setDeleteConfirm(client)}
                onCopyLink={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/portal/${client.portal_uuid}`)
                  toast.success("Portal link copied")
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <ClientModal
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditingClient(null); setForm(emptyForm) }}
        onSubmit={handleSubmit}
        editing={editingClient}
        form={form}
        setForm={setForm}
      />

      {/* Delete confirm */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-[#0d0d0d] border-white/[0.08] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete client permanently?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/40">
              This will delete &quot;{deleteConfirm?.name}&quot; and all their time entries and invoices. This cannot be undone.
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
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
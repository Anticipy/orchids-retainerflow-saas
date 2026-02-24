"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Clock, Users, TrendingUp, Play, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"
import OnboardingBanner from "@/components/onboarding-banner"
import WelcomeModal from "@/components/welcome-modal"
import { createClient } from "@/lib/supabase/client"

/* ── Types ──────────────────────────────────────────────────────────── */
interface TimeEntry {
  id: string
  date: string
  hours: number
  description: string
  clients: { name: string }
}

interface DashboardData {
  mrr: number
  totalCommittedHours: number
  totalHoursUsed: number
  totalHoursRemaining: number
  projectedOverage: number
  activeClients: number
  clientSummaries: ClientSummary[]
  recentEntries: TimeEntry[]
}

interface ClientSummary {
  id: string
  name: string
  email: string
  hoursUsed: number
  monthlyHours: number
  percentUsed: number
  monthlyFee: number
  status: string
  billingDay?: number
}

/* ── Hours formatter ────────────────────────────────────────────────── */
// Converts decimal hours to human-readable string.
// 0.01 → "< 1 min" | 0.5 → "30 min" | 1.0 → "1h" | 1.75 → "1h 45m" | 25 → "25h"
function fmtHours(h: number): string {
  if (h === 0) return "0h"
  const totalMins = Math.round(h * 60)
  if (totalMins < 1) return "< 1 min"
  if (totalMins < 60) return `${totalMins} min`
  const hrs = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`
}

/* ── Stat card ──────────────────────────────────────────────────────── */
function StatCard({
  label, value, sub, icon: Icon, accent, delay, isEmpty, emptyHint,
}: {
  label: string
  value: string
  sub: string
  icon: React.ElementType
  accent?: boolean
  delay: number
  isEmpty?: boolean
  emptyHint?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 overflow-hidden"
    >
      {accent && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(109,40,217,0.10) 0%, transparent 70%)",
        }} />
      )}
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em]">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white/30" />
        </div>
      </div>

      {isEmpty ? (
        // Empty state: dash + soft nudge instead of a raw zero
        <div>
          <p className="text-[28px] font-bold tracking-tight text-white/20 leading-none mb-1">—</p>
          <p className="text-[12px] text-white/20 leading-relaxed">{emptyHint}</p>
        </div>
      ) : (
        <div>
          <p className="text-[28px] font-bold tracking-tight text-white leading-none mb-1">{value}</p>
          <p className="text-[12px] text-white/30">{sub}</p>
        </div>
      )}
    </motion.div>
  )
}

/* ── Days until billing reset ───────────────────────────────────────── */
function daysUntilReset(billingDay?: number): number | null {
  if (!billingDay) return null
  const now = new Date()
  let next = new Date(now.getFullYear(), now.getMonth(), billingDay)
  if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, billingDay)
  return Math.ceil((next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

/* ── Client row ─────────────────────────────────────────────────────── */
function ClientRow({ client, index }: { client: ClientSummary; index: number }) {
  const pct = Math.min(client.percentUsed, 100)
  const statusColor =
    client.status === "exceeded" ? "#f87171" :
    client.status === "warning"  ? "#fb923c" : "#a78bfa"
  const days = daysUntilReset(client.billingDay)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/dashboard/clients/${client.id}`} className="block group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              {client.name.charAt(0)}
            </div>
            <span className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">{client.name}</span>
            {client.status !== "normal" && (
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30` }}
              >
                {client.status === "exceeded" ? "Over limit" : "Near limit"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {days !== null && (
              <span className="text-[11px] text-white/20 tabular-nums hidden sm:inline">{days}d left</span>
            )}
            {/* FIX: human-readable hours instead of raw decimals */}
            <span className="text-[12px] text-white/30 tabular-nums">
              {fmtHours(client.hoursUsed)} / {fmtHours(client.monthlyHours)}
            </span>
          </div>
        </div>
        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: statusColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.4 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

/* ── Panel ──────────────────────────────────────────────────────────── */
function Panel({ title, subtitle, action, children, delay }: {
  title: string; subtitle: string; action?: { label: string; href: string }; children: React.ReactNode; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div>
          <p className="text-[14px] font-semibold text-white">{title}</p>
          <p className="text-[12px] text-white/30 mt-0.5">{subtitle}</p>
        </div>
        {action && (
          <Link href={action.href} className="flex items-center gap-1 text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
            {action.label} <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

/* ── Skeleton ───────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[110px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[320px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        <div className="h-[320px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(
          data.user.user_metadata?.full_name ??
          data.user.email?.split("@")[0] ??
          ""
        )
      }
    })
  }, [])

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        await fetch("/api/notifications/check", { method: "POST" })
        const res = await fetch("/api/notifications?limit=5")
        if (res.ok) {
          const d = await res.json()
          const unread = (d.notifications ?? []).filter((n: { read_at: string | null }) => !n.read_at)
          if (unread.length > 0) {
            toast.warning(unread[0].title, { description: unread[0].body ?? undefined, duration: 5000 })
          }
        }
      } catch { /* silent */ }
    }, 1000)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <Skeleton />
  if (!data) return null

  const noClients = data.activeClients === 0

  // FIX: stat cards show "—" + a helpful nudge when the user has no clients yet,
  // instead of showing $0 / 0h / 0h / $0 which looks broken.
  const stats = [
    {
      label: "Monthly Revenue",
      value: `$${data.mrr.toLocaleString()}`,
      sub: `From ${data.activeClients} active client${data.activeClients === 1 ? "" : "s"}`,
      icon: DollarSign,
      accent: true,
      isEmpty: noClients,
      emptyHint: "Add a client to see revenue",
    },
    {
      label: "Hours Used",
      value: fmtHours(data.totalHoursUsed),
      sub: `of ${fmtHours(data.totalCommittedHours)} committed`,
      icon: Clock,
      isEmpty: noClients,
      emptyHint: "No active clients yet",
    },
    {
      label: "Hours Remaining",
      value: fmtHours(data.totalHoursRemaining),
      sub: "Across all clients",
      icon: Users,
      isEmpty: noClients,
      emptyHint: "No active clients yet",
    },
    {
      label: "Projected Overage",
      value: `$${data.projectedOverage.toLocaleString()}`,
      sub: "Additional revenue this month",
      icon: TrendingUp,
      isEmpty: noClients,
      emptyHint: "No overages to project",
    },
  ]

  return (
    <div className="space-y-6">
      <WelcomeModal userName={userName} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-[13px] text-white/30 mt-0.5">
            {format(new Date(), "MMMM yyyy")} · Your retainer overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/time">
            <motion.span
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white text-black text-[13px] font-semibold cursor-pointer hover:bg-white/90 transition-colors"
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" /> Start timer
            </motion.span>
          </Link>
          <Link href="/dashboard/clients?new=1">
            <motion.span
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-white/[0.09] bg-white/[0.03] text-white/60 text-[13px] font-medium cursor-pointer hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add client
            </motion.span>
          </Link>
        </div>
      </motion.div>

      <OnboardingBanner clientCount={data.activeClients} />

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.06} />
        ))}
      </div>

      {/* Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Client Retainers"
          subtitle="Hours used this month"
          action={{ label: "All clients", href: "/dashboard/clients" }}
          delay={0.25}
        >
          {data.clientSummaries.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                <Users className="w-4 h-4 text-white/20" />
              </div>
              <p className="text-[13px] text-white/30 mb-3">No active clients yet</p>
              <Link href="/dashboard/clients?new=1"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add your first client
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {data.clientSummaries.map((c, i) => (
                <ClientRow key={c.id} client={c} index={i} />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Recent Time Entries"
          subtitle="Your latest logged hours"
          action={{ label: "View all", href: "/dashboard/time" }}
          delay={0.32}
        >
          {data.recentEntries.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                <Clock className="w-4 h-4 text-white/20" />
              </div>
              <p className="text-[13px] text-white/30 mb-3">No entries yet</p>
              <Link href="/dashboard/time"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Start tracking
              </Link>
            </div>
          ) : (
            <div className="space-y-0">
              {data.recentEntries.slice(0, 8).map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 + i * 0.04 }}
                  className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[13px] font-medium text-white/75 truncate">
                      {entry.description || "No description"}
                    </p>
                    <p className="text-[11px] text-white/25 mt-0.5">
                      {entry.clients?.name} · {format(new Date(entry.date), "MMM d")}
                    </p>
                  </div>
                  {/* FIX: human-readable hours */}
                  <span className="text-[13px] font-semibold text-white/50 tabular-nums flex-shrink-0">
                    {fmtHours(entry.hours)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
"use client"

import { useState, use } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Calendar, ChevronLeft, ChevronRight, Download, Clock, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { usePortalData, PortalData } from "@/hooks/usePortalData"
import { useEffect } from "react"

function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

function fmtHours(h: number, short = false): string {
  if (h === 0) return short ? "0h" : "0 hours"
  const totalMins = Math.round(h * 60)
  if (totalMins < 1) return short ? "< 1 min" : "< 1 minute"
  if (totalMins < 60) return short ? `${totalMins} min` : `${totalMins} ${totalMins === 1 ? "minute" : "minutes"}`
  const hrs = Math.floor(totalMins / 60)
  const mins = totalMins % 60
  if (short) return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`
  const hLabel = `${hrs} ${hrs === 1 ? "hour" : "hours"}`
  return mins === 0 ? hLabel : `${hLabel} ${mins} min`
}

function Panel({ title, icon: Icon, children, delay = 0 }: {
  title: string; icon?: React.ElementType; children: React.ReactNode; delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5 text-white/30" />}
        <p className="text-[13px] font-semibold text-white">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  )
}

function statusColors(pct: number) {
  if (pct >= 100) return { bar: "#f87171", badge: "text-red-400 bg-red-400/10 border-red-400/20", label: "Over limit" }
  if (pct >= 80)  return { bar: "#fb923c", badge: "text-orange-400 bg-orange-400/10 border-orange-400/20", label: "Near limit" }
  return { bar: "#a78bfa", badge: "text-violet-400 bg-violet-400/10 border-violet-400/20", label: "On track" }
}

function ActiveTimerBanner({ timer, freelancerName }: {
  timer: { description: string | null; startedAt: string }
  freelancerName: string | null
}) {
  const [elapsed, setElapsed] = useState("")

  useEffect(() => {
    const tick = () => {
      const seconds = Math.floor((Date.now() - new Date(timer.startedAt).getTime()) / 1000)
      const h = Math.floor(seconds / 3600)
      const m = Math.floor((seconds % 3600) / 60)
      const s = seconds % 60
      setElapsed(
        h > 0
          ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
          : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [timer.startedAt])

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.04)" }}
    >
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-emerald-400">
              {freelancerName ? `${freelancerName} is working now` : "Currently working"}
            </p>
            {timer.description && (
              <p className="text-[12px] text-white/40 truncate mt-0.5">{timer.description}</p>
            )}
          </div>
        </div>
        <span className="text-[15px] font-bold text-emerald-400 tabular-nums flex-shrink-0">
          {elapsed}
        </span>
      </div>
    </motion.div>
  )
}

function ApprovalBanner({ uuid, month, onApproved }: {
  uuid: string
  month: string
  onApproved: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/portal/${uuid}/approve`, { method: "POST" })
      if (!res.ok) throw new Error()
      setDone(true)
    // Wait 3 seconds before refetching so user sees the confirmation
      setTimeout(() => onApproved(), 3000)
    } catch {
      setLoading(false)
    }
  }

  const periodLabel = new Date(month + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })

  if (done) return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.04)" }}
    >
      <div className="px-5 py-4 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <p className="text-[13px] font-semibold text-emerald-400">
          Approved — your invoice is on its way ✓
        </p>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border overflow-hidden"
      style={{ borderColor: "rgba(167,139,250,0.30)", background: "rgba(109,40,217,0.06)" }}
    >
      <div className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[13px] font-semibold text-violet-300">
            Does the {periodLabel} summary look good?
          </p>
          <p className="text-[12px] text-white/35 mt-0.5">
            Approving will generate and send your invoice automatically.
          </p>
        </div>
        <button
          onClick={handleApprove}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          ) : "Looks good ✓"}
        </button>
      </div>
    </motion.div>
  )
}

function Skeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="h-6 w-40 rounded-xl bg-white/[0.04] animate-pulse" />
      <div className="h-40 rounded-2xl bg-white/[0.03] animate-pulse" />
      <div className="h-32 rounded-2xl bg-white/[0.03] animate-pulse" />
      <div className="h-48 rounded-2xl bg-white/[0.03] animate-pulse" />
    </div>
  )
}

export default function ClientPortalPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params)
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(toMonthKey(now))

  const { data, loading, error, lastUpdated, fetchData } = usePortalData(uuid, selectedMonth)

  const prevMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number)
    setSelectedMonth(toMonthKey(new Date(y, m - 2, 1)))
  }

  const nextMonth = () => {
    const [y, m] = selectedMonth.split("-").map(Number)
    const d = new Date(y, m, 1)
    if (d <= new Date(now.getFullYear(), now.getMonth() + 1, 0)) setSelectedMonth(toMonthKey(d))
  }

  const isCurrentMonth = selectedMonth >= toMonthKey(now)

  if (loading) return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(109,40,217,0.14) 0%, transparent 70%)" }} aria-hidden />
      <Skeleton />
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-8 text-center max-w-sm w-full">
        <p className="text-[16px] font-semibold text-white mb-1">Portal not found</p>
        <p className="text-[13px] text-white/35">This portal link may be invalid or expired.</p>
      </div>
    </div>
  )

  const percentUsed = data.client.monthlyHours > 0
    ? (data.hoursUsed / data.client.monthlyHours) * 100 : 0
  const sc = statusColors(percentUsed)

  const nextResetDate = () => {
    const n = new Date()
    let next = new Date(n.getFullYear(), n.getMonth(), data.client.billingDay)
    if (next <= n) next = new Date(n.getFullYear(), n.getMonth() + 1, data.client.billingDay)
    return format(next, "MMMM d, yyyy")
  }

  const overageHours = Math.max(0, data.hoursUsed - data.client.monthlyHours)

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}>
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(109,40,217,0.16) 0%, transparent 72%)" }}
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
            <Image
              src={data.freelancerLogoUrl || "/logo.png"}
              alt="Logo" width={28} height={28} className="object-contain"
              onError={(e) => { e.currentTarget.src = "/logo.png" }}
            />
          </div>
          <span className="text-[14px] font-semibold text-white">{data.freelancerName || "Retallio"}</span>
          <span className="text-white/20 hidden sm:inline text-[13px]">·</span>
          <span className="text-[13px] text-white/35 hidden sm:inline">Client Portal</span>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {data.freelancerName && (
            <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.15em] mb-1">
              Retainer with {data.freelancerName}
            </p>
          )}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-[22px] font-bold tracking-tight text-white">{data.client.name}</h1>
            <div className="flex items-center gap-1.5">
              <button onClick={prevMonth} className="w-8 h-8 rounded-xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all" aria-label="Previous month">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[13px] font-medium text-white/70 min-w-[110px] text-center">
                {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
              </span>
              <button onClick={nextMonth} disabled={isCurrentMonth} className="w-8 h-8 rounded-xl border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.07] transition-all disabled:opacity-25 disabled:pointer-events-none" aria-label="Next month">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              {isCurrentMonth && (
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
          {lastUpdated && isCurrentMonth && (
            <p className="text-[11px] text-white/20 mt-1.5">
              Updated {format(lastUpdated, "h:mm:ss a")}
            </p>
          )}
        </motion.div>

        {/* ── Active timer banner ── */}
        {isCurrentMonth && data.activeTimer && (
          <ActiveTimerBanner timer={data.activeTimer} freelancerName={data.freelancerName} />
        )}

        {/* ── Approval banner ── */}
        {data.pendingApproval && data.approvalMonth && (
          <ApprovalBanner
            uuid={uuid}
            month={data.approvalMonth}
            onApproved={fetchData}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(167,139,250,0.20)", background: "rgba(109,40,217,0.06)" }}
        >
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <p className="text-[11px] font-semibold text-violet-400/70 uppercase tracking-[0.15em]">Hours this month</p>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[42px] font-bold tracking-tight text-white leading-none tabular-nums">
                    {fmtHours(data.hoursUsed, true)}
                  </span>
                  <span className="text-[18px] text-white/30 font-medium">
                    of {fmtHours(data.client.monthlyHours, true)}
                  </span>
                </div>
                <p className="text-[13px] text-white/35 mt-1">
                  {data.hoursRemaining > 0
                    ? <>{fmtHours(data.hoursRemaining)} remaining</>
                    : <>All included hours used</>
                  }
                </p>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${sc.badge} flex-shrink-0`}>
                {sc.label}
              </span>
            </div>

            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-4">
              <motion.div
                className="h-full rounded-full"
                style={{ background: sc.bar }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="flex items-center gap-1.5 text-[12px] text-white/30">
              <Calendar className="w-3.5 h-3.5" />
              Resets {nextResetDate()}
            </div>
          </div>
        </motion.div>

        <Panel title="What to expect" icon={TrendingUp} delay={0.12}>
          <div className="space-y-3">
            <p className="text-[12px] text-white/30 leading-relaxed">
              {overageHours > 0
                ? `You've used ${fmtHours(overageHours)} over your included hours. Overage is billed at $${Number(data.client.overageRate).toFixed(0)}/hr.`
                : `Overage rate if you go over: $${Number(data.client.overageRate).toFixed(0)}/hr.`
              }
            </p>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.05]">
                <p className="text-[11px] font-semibold text-white/25 uppercase tracking-[0.12em]">Projected this month</p>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-white/45">Base retainer</span>
                  <span className="text-[13px] text-white/70 tabular-nums">${Number(data.projectedInvoice.base).toFixed(2)}</span>
                </div>
                {data.projectedInvoice.overage > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-white/45">Overage</span>
                    <span className="text-[13px] text-orange-400 tabular-nums">+${Number(data.projectedInvoice.overage).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
                  <span className="text-[13px] font-semibold text-white">Total</span>
                  <span className="text-[15px] font-bold text-white tabular-nums">${Number(data.projectedInvoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Work logged" icon={Clock} delay={0.18}>
          {data.entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[13px] text-white/25 mb-1">No work logged yet this month</p>
              <p className="text-[12px] text-white/15">
                When {data.freelancerName || "your contractor"} logs time, it appears here.
              </p>
            </div>
          ) : (
            <div>
              <AnimatePresence>
                {data.entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-[13px] text-white/75 truncate">{entry.description || "No description"}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{format(new Date(entry.date), "MMM d, yyyy")}</p>
                    </div>
                    <span className="text-[13px] font-medium text-white/55 tabular-nums flex-shrink-0">
                      {fmtHours(entry.hours, true)}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="flex items-center justify-between pt-3 mt-1">
                <span className="text-[12px] font-semibold text-white/25 uppercase tracking-[0.12em]">Total logged</span>
                <span className="text-[14px] font-bold text-white tabular-nums">{fmtHours(data.hoursUsed, true)}</span>
              </div>
            </div>
          )}
        </Panel>

        <Panel title="Invoices" icon={FileText} delay={0.24}>
          {data.invoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[13px] text-white/25 mb-1">No invoices yet</p>
              <p className="text-[12px] text-white/15">Invoices appear here after each billing period.</p>
            </div>
          ) : (
            <div>
              {data.invoices.map((invoice, i) => {
                const paid = invoice.status === "paid"
                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.28 + i * 0.05 }}
                    className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-[13px] text-white/75">{invoice.billing_period}</p>
                      <p className="text-[11px] text-white/30 mt-0.5">{format(new Date(invoice.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="text-[13px] font-semibold text-white tabular-nums">${invoice.total_amount}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        paid
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : "text-white/35 bg-white/[0.04] border-white/[0.08]"
                      }`}>
                        {paid ? "Paid" : "Pending"}
                      </span>
                      <a
                        href={`/api/portal/${uuid}/invoices/${invoice.id}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg border border-white/[0.07] bg-white/[0.03] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.07] transition-all"
                        title="Download invoice"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </Panel>

        <p className="text-[11px] text-center text-white/15 pb-4 pt-2">
          Powered by{" "}
          <a href="https://retallio.app" className="hover:text-white/35 transition-colors">Retallio</a>
        </p>
      </main>
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, Clock, TrendingUp, Users } from "lucide-react"

interface DashboardData {
  mrr: number
  totalCommittedHours: number
  totalHoursUsed: number
  totalHoursRemaining: number
  projectedOverage: number
  activeClients: number
  clientSummaries: Array<{
    id: string; name: string; hoursUsed: number
    monthlyHours: number; percentUsed: number; monthlyFee: number
  }>
}

interface PerClientStats {
  id: string; name: string; monthlyHours: number
  avgHoursLast3Months: number; overageMonthsCount: number; totalRevenue: number
}

/* Violet-leaning palette — consistent with landing accent */
const CHART_COLORS = ["#7c3aed", "#a78bfa", "#6d28d9", "#c4b5fd", "#4c1d95", "#ddd6fe", "#8b5cf6", "#ede9fe"]

/* ── Shared primitives ─────────────────────────────────────────────── */
function StatCard({ label, value, sub, icon: Icon, delay }: {
  label: string; value: string; sub?: string; icon: React.ElementType; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.15em]">{label}</p>
        <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-white/30" />
        </div>
      </div>
      <p className="text-[28px] font-bold tracking-tight text-white leading-none mb-1">{value}</p>
      {sub && <p className="text-[12px] text-white/30">{sub}</p>}
    </motion.div>
  )
}

function Panel({ title, subtitle, children, delay }: {
  title: string; subtitle?: string; children: React.ReactNode; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <p className="text-[14px] font-semibold text-white">{title}</p>
        {subtitle && <p className="text-[12px] text-white/30 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

const tooltipStyle = {
  backgroundColor: "#0d0d0d",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: 12,
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-32 rounded-xl bg-white/[0.04] animate-pulse" />
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[110px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[360px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
        <div className="h-[360px] rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse" />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [invoiceStats, setInvoiceStats] = useState({ total: 0, paid: 0, unpaid: 0, totalRevenue: 0 })
  const [perClient, setPerClient] = useState<PerClientStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/invoices").then((r) => r.json()),
      fetch("/api/analytics/clients").then((r) => r.json()),
    ]).then(([dashData, invoices, analytics]) => {
      setData(dashData)
      const inv = invoices as Array<{ status: string; total_amount: number }>
      setInvoiceStats({
        total: inv.length,
        paid: inv.filter((i) => i.status === "paid").length,
        unpaid: inv.filter((i) => i.status === "unpaid").length,
        totalRevenue: inv.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total_amount), 0),
      })
      setPerClient((analytics as { perClient: PerClientStats[] }).perClient || [])
      setLoading(false)
    })
  }, [])

  if (loading || !data) return <Skeleton />

  const hoursChartData = data.clientSummaries.map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
    used: c.hoursUsed,
    included: c.monthlyHours,
  }))

  const revenueChartData = data.clientSummaries.map((c) => ({ name: c.name, value: c.monthlyFee }))

  const stats = [
    { label: "Total Revenue", value: `$${invoiceStats.totalRevenue.toLocaleString()}`, sub: "From paid invoices", icon: DollarSign },
    { label: "MRR", value: `$${data.mrr.toLocaleString()}`, sub: "Monthly recurring", icon: TrendingUp },
    { label: "Invoices", value: String(invoiceStats.total), sub: `${invoiceStats.paid} paid · ${invoiceStats.unpaid} unpaid`, icon: Clock },
    { label: "Active Clients", value: String(data.activeClients), icon: Users },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-[22px] font-bold tracking-tight text-white">Analytics</h1>
        <p className="text-[13px] text-white/30 mt-0.5">Your numbers at a glance</p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Hours by Client" subtitle="Used vs included this month" delay={0.22}>
          {hoursChartData.length === 0 ? (
            <p className="text-[13px] text-white/25 text-center py-10">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hoursChartData} barCategoryGap="24%"
                margin={{ bottom: hoursChartData.length > 4 ? 56 : 8 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }}
                  axisLine={false} tickLine={false}
                  interval={0}
                  angle={hoursChartData.length > 4 ? -35 : 0}
                  textAnchor={hoursChartData.length > 4 ? "end" : "middle"}
                />
                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="included" fill="rgba(167,139,250,0.25)" name="Included" radius={[4, 4, 0, 0]} />
                <Bar dataKey="used" fill="#7c3aed" name="Used" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Revenue Distribution" subtitle="Monthly fee per client" delay={0.28}>
          {revenueChartData.length === 0 ? (
            <p className="text-[13px] text-white/25 text-center py-10">No data yet</p>
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={revenueChartData} cx="50%" cy="50%" outerRadius={90} innerRadius={44} dataKey="value" paddingAngle={2}>
                    {revenueChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Monthly Fee"]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                {revenueChartData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-[11px] text-white/40">{d.name} · ${d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Panel>
      </div>

      {perClient.length > 0 && (
        <Panel title="Per-client insights" subtitle="Avg hours (3 months) · overage frequency · total revenue" delay={0.34}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {["Client", "Avg hours (3 mo)", "Overage months", "Total revenue"].map((h, i) => (
                    <th key={h} className={`pb-3 text-[11px] font-semibold text-white/25 uppercase tracking-[0.12em] ${i === 0 ? "text-left" : "text-right"}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perClient.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="border-b border-white/[0.04] last:border-0"
                  >
                    <td className="py-3 text-[13px] font-medium text-white/75">{c.name}</td>
                    <td className="py-3 text-right text-[13px] text-white/50 tabular-nums">{c.avgHoursLast3Months}h</td>
                    <td className="py-3 text-right text-[13px] text-white/50 tabular-nums">{c.overageMonthsCount} of 3</td>
                    <td className="py-3 text-right text-[13px] text-white/50 tabular-nums">${c.totalRevenue.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  )
}
"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"

interface PortalData {
  month: string
  client: { name: string; monthlyHours: number; monthlyFee: number; overageRate: number; billingDay: number }
  hoursUsed: number
  hoursRemaining: number
  freelancerName: string | null
  freelancerLogoUrl: string | null
  projectedInvoice: { base: number; overage: number; total: number }
  entries: Array<{ id: string; date: string; hours: number; description: string }>
  invoices: Array<{ id: string; billing_period: string; total_amount: number; status: string; created_at: string }>
}

function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default function ClientPortalPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params)
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(toMonthKey(now))
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/portal/${uuid}?month=${selectedMonth}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [uuid, selectedMonth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-white/30 text-sm">Loading portal...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold text-white mb-2">Portal not found</p>
            <p className="text-sm text-white/35">This portal link may be invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const percentUsed = data.client.monthlyHours > 0 ? (data.hoursUsed / data.client.monthlyHours) * 100 : 0
  const status = percentUsed >= 100 ? "exceeded" : percentUsed >= 80 ? "warning" : "good"

  const nextResetDate = () => {
    const n = new Date()
    let next = new Date(n.getFullYear(), n.getMonth(), data.client.billingDay)
    if (next <= n) next = new Date(n.getFullYear(), n.getMonth() + 1, data.client.billingDay)
    return format(next, "MMMM d, yyyy")
  }

  return (
    <div className="min-h-screen">
      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080810]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center gap-3 px-4 sm:px-6">
          <Image
            src={data.freelancerLogoUrl || "/logo.png"}
            alt="Logo"
            width={28}
            height={28}
            className="rounded-md object-contain"
            onError={(e) => { e.currentTarget.src = "/logo.png" }}
          />
          <span className="font-bold text-white">{data.freelancerName || "Retallio"}</span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="text-sm text-white/35 hidden sm:inline">Client Portal</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-2xl space-y-6 relative z-10">
        {/* Title + month nav */}
        <div>
          {data.freelancerName && (
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1">
              Your retainer with {data.freelancerName}
            </p>
          )}
          <h1 className="text-2xl font-bold text-white mb-4">{data.client.name}</h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const [y, m] = data.month.split("-").map(Number)
                const d = new Date(y, m - 1, 1)
                d.setMonth(d.getMonth() - 1)
                setSelectedMonth(toMonthKey(d))
              }}
              className="rounded-lg p-2 hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-white/[0.06]"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium text-white min-w-[140px] text-center">
              {format(new Date(data.month + "-01"), "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => {
                const [y, m] = data.month.split("-").map(Number)
                const d = new Date(y, m - 1, 1)
                d.setMonth(d.getMonth() + 1)
                if (d <= new Date(now.getFullYear(), now.getMonth() + 1, 0)) {
                  setSelectedMonth(toMonthKey(d))
                }
              }}
              disabled={data.month >= toMonthKey(now)}
              className="rounded-lg p-2 hover:bg-white/[0.06] text-white/40 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-white/[0.06]"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-xs text-white/25 ml-2">
              {data.month >= toMonthKey(now) ? "Live" : "Past month"}
            </span>
          </div>
        </div>

        {/* Hours card */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            background: "rgba(99,102,241,0.06)",
            borderColor: "rgba(99,102,241,0.2)",
          }}
        >
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-[0.15em] mb-3">
            Hours remaining this month
          </p>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <span className="text-4xl font-bold tracking-tight text-white">
                {Number(data.hoursRemaining).toFixed(2)}
              </span>
              <span className="text-white/35 text-xl ml-2">/ {data.client.monthlyHours} hrs</span>
            </div>
            <Badge
              className={
                status === "exceeded"
                  ? "bg-red-500/15 text-red-400 border-red-500/25"
                  : status === "warning"
                  ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/25"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
              }
              variant="outline"
            >
              {status === "exceeded" ? "Over limit" : status === "warning" ? "Near limit" : "On track"}
            </Badge>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden mb-4"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(percentUsed, 100)}%`,
                background:
                  status === "exceeded"
                    ? "#ef4444"
                    : status === "warning"
                    ? "#eab308"
                    : "#6366f1",
              }}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/35">
            <Calendar className="h-4 w-4" />
            Retainer resets on {nextResetDate()}
          </div>
        </div>

        {/* Projected invoice */}
        <Card style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-white">What to expect</CardTitle>
            <CardDescription className="text-white/35 text-sm">
              {data.hoursUsed > data.client.monthlyHours
                ? "You've used more than your included hours. Overage is billed at month end."
                : "If you exceed your included hours, overage is billed at your agreed rate."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-white/25 mb-3">
              Overage rate: ${Number(data.client.overageRate).toFixed(2)}/hr
            </p>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Projected this month</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Base retainer</span>
                  <span className="text-white">${Number(data.projectedInvoice.base).toFixed(2)}</span>
                </div>
                {data.projectedInvoice.overage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Overage</span>
                    <span className="text-yellow-400">${Number(data.projectedInvoice.overage).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t border-white/[0.06]">
                  <span className="text-white">Total</span>
                  <span className="text-white">${Number(data.projectedInvoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time entries */}
        <Card style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
          <CardHeader>
            <CardTitle className="text-base text-white">Time Entries</CardTitle>
            <CardDescription className="text-white/35">Work logged this month</CardDescription>
          </CardHeader>
          <CardContent>
            {data.entries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-white/25">No work logged yet this month.</p>
                <p className="text-xs text-white/15 mt-1">
                  When {data.freelancerName || "your contractor"} logs time, you&apos;ll see it here.
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                    <div>
                      <p className="text-sm text-white/80">{entry.description || "No description"}</p>
                      <p className="text-xs text-white/30 mt-0.5">{format(new Date(entry.date), "MMM d, yyyy")}</p>
                    </div>
                    <span className="text-sm font-medium text-white/70 tabular-nums">
                      {Number(entry.hours).toFixed(2)}h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}>
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" /> Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.invoices.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-white/25">No invoices yet.</p>
                <p className="text-xs text-white/15 mt-1">Invoices appear here after each billing period.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {data.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
                    <div>
                      <p className="text-sm text-white/80">Period: {invoice.billing_period}</p>
                      <p className="text-xs text-white/30 mt-0.5">{format(new Date(invoice.created_at), "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">${invoice.total_amount}</span>
                      <Badge
                        variant="outline"
                        className={invoice.status === "paid"
                          ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/10 text-xs"
                          : "text-white/40 border-white/10 text-xs"
                        }
                      >
                        {invoice.status}
                      </Badge>
                      <a
                        href={`/api/portal/${uuid}/invoices/${invoice.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors px-2 py-1"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-white/15 pb-4">Powered by Retallio</p>
      </main>
    </div>
  )
}
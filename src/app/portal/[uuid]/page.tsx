"use client"

import { useEffect, useState, use } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
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
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [uuid, selectedMonth])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading portal...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-medium">Portal not found</p>
            <p className="text-sm text-muted-foreground mt-2">This portal link may be invalid or expired.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const percentUsed = data.client.monthlyHours > 0 ? (data.hoursUsed / data.client.monthlyHours) * 100 : 0
  const status = percentUsed >= 100 ? "exceeded" : percentUsed >= 80 ? "warning" : "good"

  const nextResetDate = () => {
    const now = new Date()
    let next = new Date(now.getFullYear(), now.getMonth(), data.client.billingDay)
    if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, data.client.billingDay)
    return format(next, "MMMM d, yyyy")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center gap-2 px-4 sm:px-6">
        <Image
          src={data.freelancerLogoUrl || "/logo.png"}
          alt="Logo"
          width={28}
          height={28}
          className="rounded object-contain"
          onError={(e) => { e.currentTarget.src = "/logo.png" }}
        />
          <span className="font-bold">{data.freelancerName || "Retallio"}</span>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <span className="text-sm text-muted-foreground hidden sm:inline">Client Portal</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <div>
          {data.freelancerName && (
            <p className="text-sm text-muted-foreground mb-0.5">Your retainer with {data.freelancerName}</p>
          )}
          <h1 className="text-2xl font-bold">{data.client.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                const [y, m] = data.month.split("-").map(Number)
                const d = new Date(y, m - 1, 1)
                d.setMonth(d.getMonth() - 1)
                setSelectedMonth(toMonthKey(d))
              }}
              className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-medium min-w-[140px] text-center">
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
              className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {data.month >= toMonthKey(now) ? "Real-time overview" : "Past month"}
          </p>
        </div>

        {/* Hero: Hours Remaining */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Hours remaining this month
            </p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-4xl font-bold tracking-tight">{Number(data.hoursRemaining).toFixed(2)}</span>
                <span className="text-muted-foreground text-xl ml-1">/ {Number(data.client.monthlyHours).toFixed(2)} hrs</span>
              </div>
              <Badge
                variant={status === "exceeded" ? "destructive" : status === "warning" ? "secondary" : "outline"}
                className="shrink-0"
              >
                {status === "exceeded" ? "Over limit" : status === "warning" ? "Near limit" : "On track"}
              </Badge>
            </div>
            <Progress
              value={Math.min(percentUsed, 100)}
              className={`mt-4 h-2 ${status === "exceeded" ? "[&>div]:bg-destructive" : status === "warning" ? "[&>div]:bg-yellow-500" : ""}`}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
              <Calendar className="h-4 w-4 shrink-0" />
              Retainer resets on {nextResetDate()}
            </div>
          </CardContent>
        </Card>

        {/* Overage & Projected Invoice */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">What to expect</CardTitle>
            <CardDescription>
              {data.client.monthlyHours > 0 && data.hoursUsed > data.client.monthlyHours
                ? "You've used more than your included hours. Overage is billed at month end."
                : "If you exceed your included hours, overage is billed at your agreed rate."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Overage rate: ${Number(data.client.overageRate).toFixed(2)}/hr
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Projected this month
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base retainer</span>
                  <span>${Number(data.projectedInvoice.base).toFixed(2)}</span>
                </div>
                {data.projectedInvoice.overage > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overage</span>
                    <span>${Number(data.projectedInvoice.overage).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${Number(data.projectedInvoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Time Entries</CardTitle>
            <CardDescription>Work logged this month</CardDescription>
          </CardHeader>
          <CardContent>
            {data.entries.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-medium text-muted-foreground">No work logged yet this month</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  When {data.freelancerName || "your contractor"} logs time, you&apos;ll see it here. Check back soon.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{entry.description || "No description"}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, yyyy")}</p>
                    </div>
                    <span className="font-medium text-sm">{entry.hours}h</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.invoices.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">No invoices yet</p>
                <p className="text-xs text-muted-foreground mt-1">Invoices appear here after each billing period.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">Period: {invoice.billing_period}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(invoice.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${invoice.total_amount}</span>
                    <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                      {invoice.status}
                    </Badge>
                    <a
                      href={`/api/portal/${uuid}/invoices/${invoice.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center py-2 px-3 -my-1 -mx-1 text-xs text-primary hover:underline rounded-md hover:bg-muted touch-manipulation min-h-[44px]"
                    >
                      View / Download
                    </a>
                  </div>
                </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          Powered by Retallio
        </p>
      </main>
    </div>
  )
}

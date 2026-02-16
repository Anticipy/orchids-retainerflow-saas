"use client"

import { useEffect, useState, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Calendar } from "lucide-react"
import { format } from "date-fns"

interface PortalData {
  client: { name: string; monthlyHours: number; billingDay: number }
  hoursUsed: number
  entries: Array<{ id: string; date: string; hours: number; description: string }>
  invoices: Array<{ id: string; billing_period: string; total_amount: number; status: string; created_at: string }>
}

export default function ClientPortalPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params)
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/portal/${uuid}`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [uuid])

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

  const nextBillingDate = () => {
    const now = new Date()
    let next = new Date(now.getFullYear(), now.getMonth(), data.client.billingDay)
    if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, data.client.billingDay)
    return format(next, "MMMM d, yyyy")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/10">
        <div className="container mx-auto flex h-14 items-center gap-2 px-4">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-bold">Retallio</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Client Portal</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{data.client.name}</h1>
          <p className="text-muted-foreground">{format(new Date(), "MMMM yyyy")} Retainer Overview</p>
        </div>

        {/* Hours Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Hours This Month
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold">{data.hoursUsed}</span>
                <span className="text-muted-foreground text-lg"> / {data.client.monthlyHours}h</span>
              </div>
              <Badge
                variant={status === "exceeded" ? "destructive" : status === "warning" ? "secondary" : "outline"}
              >
                {status === "exceeded" ? "Over limit" : status === "warning" ? "Near limit" : "On track"}
              </Badge>
            </div>
            <Progress
              value={Math.min(percentUsed, 100)}
              className={
                status === "exceeded" ? "[&>div]:bg-destructive" :
                status === "warning" ? "[&>div]:bg-yellow-500" : ""
              }
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Next billing date: {nextBillingDate()}
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
              <p className="text-sm text-muted-foreground text-center py-4">No entries this month yet.</p>
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
              <p className="text-sm text-muted-foreground text-center py-4">No invoices yet.</p>
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
                      className="text-xs text-primary hover:underline"
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

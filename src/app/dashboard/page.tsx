"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, Users, TrendingUp, Play, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "sonner"


interface DashboardData {
  mrr: number
  totalCommittedHours: number
  totalHoursUsed: number
  totalHoursRemaining: number
  projectedOverage: number
  activeClients: number
  clientSummaries: Array<{
    id: string
    name: string
    email: string
    hoursUsed: number
    monthlyHours: number
    percentUsed: number
    monthlyFee: number
    status: string
  }>
  recentEntries: Array<{
    id: string
    date: string
    hours: number
    description: string
    clients: { name: string }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        await fetch("/api/notifications/check", { method: "POST" })
        
        // Check for unread notifications and show toast
        const res = await fetch("/api/notifications?limit=5")
        if (res.ok) {
          const data = await res.json()
          const unread = (data.notifications ?? []).filter(
            (n: { read_at: string | null }) => !n.read_at
          )
          if (unread.length > 0) {
            toast.warning(unread[0].title, {
              description: unread[0].body ?? undefined,
              duration: 5000,
            })
          }
        }
      } catch {
        // silent fail
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-16 animate-pulse bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/time">
            <Button size="sm">
              <Play className="mr-2 h-4 w-4" /> Start Timer
            </Button>
          </Link>
          <Link href="/dashboard/clients?new=1">
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards - slightly larger on xl screens */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="xl:p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 xl:pb-2">  {/* ← Reduced from pb-2 */}
            <CardTitle className="text-sm font-medium xl:text-base">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground xl:h-5 xl:w-5" />
          </CardHeader>
          <CardContent className="pt-0">  {/* ← Add pt-0 */}
            <div className="text-2xl font-bold xl:text-3xl">${data.mrr.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground xl:text-sm">From {data.activeClients} active clients</p>
          </CardContent>
        </Card>
        <Card className="xl:p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 xl:pb-2">  {/* ← Reduced from pb-2 */}
            <CardTitle className="text-sm font-medium xl:text-base">Hours Used</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground xl:h-5 xl:w-5" />  {/* ← Was DollarSign */}
          </CardHeader>
          <CardContent className="pt-0">  {/* ← Add pt-0 */}
            <div className="text-2xl font-bold xl:text-3xl">{data.totalHoursUsed}h</div>
            <p className="text-xs text-muted-foreground xl:text-sm">of {data.totalCommittedHours}h committed</p>
          </CardContent>
        </Card>
        <Card className="xl:p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 xl:pb-2">  {/* ← Reduced from pb-2 */}
            <CardTitle className="text-sm font-medium xl:text-base">Hours Remaining</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground xl:h-5 xl:w-5" />  {/* ← Was DollarSign */}
          </CardHeader>
          <CardContent className="pt-0">  {/* ← Add pt-0 */}
            <div className="text-2xl font-bold xl:text-3xl">{data.totalHoursRemaining}h</div>
            <p className="text-xs text-muted-foreground xl:text-sm">Across all clients</p>
          </CardContent>
        </Card>
        <Card className="xl:p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 xl:pb-2">
            <CardTitle className="text-sm font-medium xl:text-base">Projected Overage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground xl:h-5 xl:w-5" />  {/* ← Fixed */}
          </CardHeader>
          <CardContent className="pt-0">  {/* ← Add pt-0 */}
            <div className="text-2xl font-bold xl:text-3xl">${data.projectedOverage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground xl:text-sm">Additional revenue this month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:gap-8">
        {/* Client Status */}
        <Card className="xl:p-1">
          <CardHeader className="xl:pb-3 pb-3 pt-5">  {/* ← Added pt-5 */}
            <CardTitle className="xl:text-lg">Client Retainers</CardTitle>
            <CardDescription className="xl:text-sm">Hours used this month per client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 xl:space-y-5 pb-6">  {/* ← Changed to pb-6 */}
            {data.clientSummaries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active clients yet.{" "}
                <Link href="/dashboard/clients?new=1" className="text-primary underline">Add your first client</Link>
              </p>
            ) : (
              data.clientSummaries.map((client) => (
                <div key={client.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{client.name}</span>
                      <Badge
                        variant={
                          client.status === "exceeded" ? "destructive" :
                          client.status === "warning" ? "secondary" : "outline"
                        }
                        className="text-xs"
                      >
                        {client.status === "exceeded" ? "Over limit" :
                         client.status === "warning" ? "Near limit" : "On track"}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {client.hoursUsed}h / {client.monthlyHours}h
                    </span>
                  </div>
                  <Progress
                    value={Math.min(client.percentUsed, 100)}
                    className={
                      client.status === "exceeded" ? "[&>div]:bg-destructive" :
                      client.status === "warning" ? "[&>div]:bg-yellow-500" : ""
                    }
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Time Entries */}
        <Card className="xl:p-1">
          <CardHeader className="xl:pb-3 pb-3 pt-5">  {/* ← Added pt-5 */}
            <CardTitle className="xl:text-lg">Recent Time Entries</CardTitle>
            <CardDescription className="xl:text-sm">Your latest logged time</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">  {/* ← Added pb-6 */}
            {data.recentEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No time entries yet.{" "}
                <Link href="/dashboard/time" className="text-primary underline">Start tracking</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {data.recentEntries.slice(0, 8).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{entry.description || "No description"}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.clients?.name} &middot; {format(new Date(entry.date), "MMM d")}
                      </p>
                    </div>
                    <span className="font-medium ml-2">{entry.hours}h</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

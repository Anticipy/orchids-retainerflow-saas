"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, Clock, TrendingUp, Users } from "lucide-react"

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
    hoursUsed: number
    monthlyHours: number
    percentUsed: number
    monthlyFee: number
  }>
}

interface PerClientStats {
  id: string
  name: string
  monthlyHours: number
  avgHoursLast3Months: number
  overageMonthsCount: number
  totalRevenue: number
}

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#ca8a04", "#0891b2", "#6366f1"]

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [invoiceStats, setInvoiceStats] = useState<{ total: number; paid: number; unpaid: number; totalRevenue: number }>({
    total: 0, paid: 0, unpaid: 0, totalRevenue: 0,
  })
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
        totalRevenue: inv
          .filter((i) => i.status === "paid")
          .reduce((sum, i) => sum + Number(i.total_amount), 0),
      })
      setPerClient((analytics as { perClient: PerClientStats[] }).perClient || [])
      setLoading(false)
    })
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-16 animate-pulse bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const hoursChartData = data.clientSummaries.map((c) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
    used: c.hoursUsed,
    included: c.monthlyHours,
  }))

  const revenueChartData = data.clientSummaries.map((c) => ({
    name: c.name,
    value: c.monthlyFee,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Paid)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${invoiceStats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.mrr.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoiceStats.total}</div>
            <p className="text-xs text-muted-foreground">{invoiceStats.paid} paid, {invoiceStats.unpaid} unpaid</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeClients}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hours by Client</CardTitle>
            <CardDescription>Used vs included hours this month</CardDescription>
          </CardHeader>
          <CardContent>
            {hoursChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hoursChartData} margin={{ bottom: hoursChartData.length > 4 ? 60 : 24 }} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    interval={0}
                    angle={hoursChartData.length > 4 ? -35 : 0}
                    textAnchor={hoursChartData.length > 4 ? "end" : "middle"}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e2e",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                    }}
                    labelStyle={{
                      color: "#f9fafb",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                    itemStyle={{ color: "#d1d5db" }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                />
                <Bar dataKey="included" fill="#a78bfa" name="Included" radius={[2, 2, 0, 0]} />
                <Bar dataKey="used" fill="#6366f1" name="Used" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
            <CardDescription>Monthly fee per client</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueChartData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value}`}
                  >
                    {revenueChartData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#1e1e2e",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#f9fafb",
                    }}
                    itemStyle={{ color: "#d1d5db" }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, "Monthly Fee"]}
                    />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {perClient.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Per-client insights</CardTitle>
            <CardDescription>Average hours (last 3 months), overage frequency, total revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Client</th>
                    <th className="text-right py-2 font-medium">Avg hours (3 mo)</th>
                    <th className="text-right py-2 font-medium">Overage months</th>
                    <th className="text-right py-2 font-medium">Total revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {perClient.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="py-2 font-medium">{c.name}</td>
                      <td className="text-right py-2 tabular-nums">{c.avgHoursLast3Months}h</td>
                      <td className="text-right py-2 tabular-nums">{c.overageMonthsCount} of 3</td>
                      <td className="text-right py-2 tabular-nums">${c.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

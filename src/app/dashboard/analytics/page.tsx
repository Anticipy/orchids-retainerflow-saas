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

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#ca8a04", "#0891b2", "#6366f1"]

export default function AnalyticsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [invoiceStats, setInvoiceStats] = useState<{ total: number; paid: number; unpaid: number; totalRevenue: number }>({
    total: 0, paid: 0, unpaid: 0, totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard").then((r) => r.json()),
      fetch("/api/invoices").then((r) => r.json()),
    ]).then(([dashData, invoices]) => {
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
                <BarChart data={hoursChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="included" fill="#e2e8f0" name="Included" />
                  <Bar dataKey="used" fill="#2563eb" name="Used" />
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

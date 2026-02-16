"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Plus, CheckCircle, Download, Mail } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface Invoice {
  id: string
  client_id: string
  billing_period: string
  base_fee: number
  overage_hours: number
  overage_amount: number
  total_amount: number
  status: string
  pdf_url: string | null
  due_date: string | null
  created_at: string
  clients: { name: string; email: string }
}

interface Client {
  id: string
  name: string
  status: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [genClientId, setGenClientId] = useState("")
  const [genPeriod, setGenPeriod] = useState(format(new Date(), "yyyy-MM"))
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterClientId, setFilterClientId] = useState("all")
  const [sendingId, setSendingId] = useState<string | null>(null)

  const fetchInvoices = async () => {
    const res = await fetch("/api/invoices")
    const data = await res.json()
    setInvoices(data)
    setLoading(false)
  }

  const fetchClients = async () => {
    const res = await fetch("/api/clients")
    const data = await res.json()
    setClients((data as Client[]).filter((c) => c.status === "active"))
  }

  useEffect(() => {
    fetchInvoices()
    fetchClients()
  }, [])

  const generateInvoice = async () => {
    if (!genClientId || !genPeriod) return

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: genClientId, billing_period: genPeriod }),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to generate invoice")
      return
    }

    toast.success("Invoice generated")
    setDialogOpen(false)
    fetchInvoices()
  }

  const markAsPaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    })
    toast.success("Invoice marked as paid")
    fetchInvoices()
  }

  const markAsUnpaid = async (id: string) => {
    await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "unpaid" }),
    })
    toast.success("Invoice marked as unpaid")
    fetchInvoices()
  }

  const sendEmail = async (id: string) => {
    setSendingId(id)
    const res = await fetch(`/api/invoices/${id}/send-email`, { method: "POST" })
    const data = await res.json().catch(() => ({}))
    setSendingId(null)
    if (!res.ok) {
      toast.error(data.error || "Failed to send email")
      return
    }
    toast.success("Invoice sent by email to client")
  }

  let filtered = filterStatus === "all" ? invoices : invoices.filter((i) => i.status === filterStatus)
  if (filterClientId !== "all") {
    filtered = filtered.filter((i) => i.client_id === filterClientId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <div className="flex items-center gap-2">
          <Select value={filterClientId} onValueChange={setFilterClientId}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All clients" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All clients</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Generate Invoice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Invoice</DialogTitle>
                <DialogDescription>Create an invoice for a billing period</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Client</Label>
                  <Select value={genClientId} onValueChange={setGenClientId}>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Billing Period</Label>
                  <Input type="month" value={genPeriod} onChange={(e) => setGenPeriod(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={generateInvoice}>Generate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <Card><CardContent className="p-6"><div className="h-32 animate-pulse bg-muted rounded" /></CardContent></Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No invoices yet. Generate your first invoice.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{invoice.clients?.name}</p>
                    <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Period: {invoice.billing_period}</span>
                    <span>Base: ${invoice.base_fee}</span>
                    {invoice.overage_hours > 0 && (
                      <span>Overage: {invoice.overage_hours}h (${invoice.overage_amount})</span>
                    )}
                    {invoice.due_date && <span>Due: {format(new Date(invoice.due_date), "MMM d, yyyy")}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-lg font-bold">${invoice.total_amount}</span>
                  {invoice.status === "unpaid" ? (
                    <Button size="sm" variant="outline" onClick={() => markAsPaid(invoice.id)}>
                      <CheckCircle className="mr-1 h-4 w-4" /> Mark Paid
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => markAsUnpaid(invoice.id)}>
                      Mark Unpaid
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => sendEmail(invoice.id)}
                    disabled={sendingId === invoice.id}
                    title="Send to client by email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => window.open(`/api/invoices/${invoice.id}/pdf`, "_blank")} title="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

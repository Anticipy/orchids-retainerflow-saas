"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Archive, ExternalLink, Copy } from "lucide-react"
import { toast } from "sonner"

interface Client {
  id: string
  name: string
  email: string
  monthly_hours: number
  monthly_fee: number
  overage_rate: number
  billing_day: number
  status: string
  portal_uuid: string
  created_at: string
}

interface ClientWithHours extends Client {
  hoursUsed: number
  percentUsed: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientWithHours[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [form, setForm] = useState({
    name: "", email: "", monthly_hours: "", monthly_fee: "", overage_rate: "", billing_day: "1",
  })

  const fetchClients = async () => {
    const [clientsRes, dashRes] = await Promise.all([
      fetch("/api/clients"),
      fetch("/api/dashboard"),
    ])
    const clientsData: Client[] = await clientsRes.json()
    const dashData = await dashRes.json()

    const summaryMap = new Map(
      (dashData.clientSummaries || []).map((s: { id: string; hoursUsed: number; percentUsed: number }) => [s.id, s])
    )

    const enriched = clientsData.map((c) => {
      const summary = summaryMap.get(c.id) as { hoursUsed: number; percentUsed: number } | undefined
      return {
        ...c,
        hoursUsed: summary?.hoursUsed || 0,
        percentUsed: summary?.percentUsed || 0,
      }
    })

    setClients(enriched)
    setLoading(false)
  }

  useEffect(() => { fetchClients() }, [])

  const resetForm = () => {
    setForm({ name: "", email: "", monthly_hours: "", monthly_fee: "", overage_rate: "", billing_day: "1" })
    setEditingClient(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingClient ? `/api/clients/${editingClient.id}` : "/api/clients"
    const method = editingClient ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error || "Failed to save client")
      return
    }

    toast.success(editingClient ? "Client updated" : "Client created")
    setDialogOpen(false)
    resetForm()
    fetchClients()
  }

  const handleArchive = async (client: Client) => {
    const newStatus = client.status === "active" ? "archived" : "active"
    const res = await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      toast.success(newStatus === "archived" ? "Client archived" : "Client reactivated")
      fetchClients()
    }
  }

  const openEdit = (client: Client) => {
    setEditingClient(client)
    setForm({
      name: client.name,
      email: client.email,
      monthly_hours: String(client.monthly_hours),
      monthly_fee: String(client.monthly_fee),
      overage_rate: String(client.overage_rate),
      billing_day: String(client.billing_day),
    })
    setDialogOpen(true)
  }

  const copyPortalLink = (portalUuid: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/portal/${portalUuid}`)
    toast.success("Portal link copied to clipboard")
  }

  const filtered = clients.filter((c) => showArchived ? c.status === "archived" : c.status === "active")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm() }}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Client</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingClient ? "Edit Client" : "Add New Client"}</DialogTitle>
                  <DialogDescription>
                    {editingClient ? "Update client details" : "Create a new retainer client"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="monthly_hours">Monthly Hours</Label>
                      <Input id="monthly_hours" type="number" step="0.5" min="0.5" value={form.monthly_hours} onChange={(e) => setForm({ ...form, monthly_hours: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="monthly_fee">Monthly Fee ($)</Label>
                      <Input id="monthly_fee" type="number" step="0.01" min="0" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="overage_rate">Overage Rate ($/hr)</Label>
                      <Input id="overage_rate" type="number" step="0.01" min="0" value={form.overage_rate} onChange={(e) => setForm({ ...form, overage_rate: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="billing_day">Billing Day (1-28)</Label>
                      <Input id="billing_day" type="number" min="1" max="28" value={form.billing_day} onChange={(e) => setForm({ ...form, billing_day: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingClient ? "Save Changes" : "Create Client"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-32 animate-pulse bg-muted rounded" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {showArchived ? "No archived clients." : "No clients yet. Add your first retainer client to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => (
            <Card key={client.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">{client.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(client)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyPortalLink(client.portal_uuid)}>
                      <Copy className="mr-2 h-4 w-4" /> Copy Portal Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`/portal/${client.portal_uuid}`, "_blank")}>
                      <ExternalLink className="mr-2 h-4 w-4" /> View Portal
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleArchive(client)}>
                      <Archive className="mr-2 h-4 w-4" />
                      {client.status === "active" ? "Archive" : "Reactivate"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hours this month</span>
                  <span className="font-medium">{client.hoursUsed}h / {client.monthly_hours}h</span>
                </div>
                <Progress
                  value={Math.min(client.percentUsed, 100)}
                  className={
                    client.percentUsed >= 100 ? "[&>div]:bg-destructive" :
                    client.percentUsed >= 80 ? "[&>div]:bg-yellow-500" : ""
                  }
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">${client.monthly_fee}/mo</span>
                  <Badge variant="outline" className="text-xs">
                    Billing on the {client.billing_day}{client.billing_day === 1 ? "st" : client.billing_day === 2 ? "nd" : client.billing_day === 3 ? "rd" : "th"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User, CreditCard, Bell, Loader2 } from "lucide-react"

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth()
  const [name, setName] = useState(profile?.name || "")
  const [saving, setSaving] = useState(false)
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null)
  const supabase = createClient()

  const handleSaveProfile = async () => {
    if (!profile) return
    setSaving(true)
    const { error } = await supabase
      .from("users")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id", profile.id)

    if (error) {
      toast.error("Failed to update profile")
    } else {
      toast.success("Profile updated")
      await refreshProfile()
    }
    setSaving(false)
  }

  const handleUpgrade = async (tier: string) => {
    if (tier === "free") {
      toast.info("To downgrade to Free, please contact support.")
      return
    }
    setUpgradingTier(tier)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to create checkout session")
        return
      }
      if (data.url) {
        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: data.url } }, "*")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setUpgradingTier(null)
    }
  }

  const tierLabels: Record<string, string> = {
    free: "Free",
    pro: "Pro ($19/mo)",
    business: "Business ($39/mo)",
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Manage your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={profile?.email || ""} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Current Plan:</span>
            <Badge variant="secondary">
              {tierLabels[profile?.subscription_tier || "free"] || "Free"}
            </Badge>
          </div>
          <Separator />
          <div className="grid gap-3">
            {[
              { tier: "free", name: "Free", price: "$0/mo", desc: "1 client" },
              { tier: "pro", name: "Pro", price: "$19/mo", desc: "Up to 10 clients, portals, auto-invoicing" },
              { tier: "business", name: "Business", price: "$39/mo", desc: "Unlimited clients, Stripe auto-charge" },
            ].map((plan) => (
              <div key={plan.tier} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{plan.name} - {plan.price}</p>
                  <p className="text-xs text-muted-foreground">{plan.desc}</p>
                </div>
                {profile?.subscription_tier === plan.tier ? (
                    <Badge>Current</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={upgradingTier !== null}
                      onClick={() => handleUpgrade(plan.tier)}
                    >
                      {upgradingTier === plan.tier ? (
                        <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Processing...</>
                      ) : plan.tier === "free" ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Upgrade or downgrade your plan at any time. You&apos;ll be redirected to Stripe for secure payment.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Configure alert preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email notifications are sent when clients reach 80% and 100% of retainer hours,
            when invoices are generated, and when payments are received.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

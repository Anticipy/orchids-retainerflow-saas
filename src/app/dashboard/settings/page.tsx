"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User, CreditCard, Bell, Loader2, Lock } from "lucide-react"

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const displayName = profile?.name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""
  const displayEmail = profile?.email ?? user?.email ?? ""
  const [name, setName] = useState(displayName)
  const [saving, setSaving] = useState(false)
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null)
  const supabase = createClient()

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from("users")
      .upsert(
        {
          id: user.id,
          email: user.email ?? "",
          name,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )

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
        if (res.status === 503) {
          toast.info(data.error || "Payments will be available soon.")
        } else {
          toast.error(data.error || "Failed to create checkout session")
        }
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

  const [notify80, setNotify80] = useState(profile?.notify_email_80 ?? true)
  const [notify100, setNotify100] = useState(profile?.notify_email_100 ?? true)
  const [notifyInvoice, setNotifyInvoice] = useState(profile?.notify_email_invoice ?? true)
  const [savingNotif, setSavingNotif] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    const nextName = profile?.name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""
    const nextEmail = profile?.email ?? user?.email ?? ""
    setName(nextName)
    if (profile) {
      setNotify80(profile.notify_email_80 ?? true)
      setNotify100(profile.notify_email_100 ?? true)
      setNotifyInvoice(profile.notify_email_invoice ?? true)
    }
  }, [profile, user])

  const handleSaveNotificationPrefs = async () => {
    if (!profile) return
    setSavingNotif(true)
    const { error } = await supabase
      .from("users")
      .update({
        notify_email_80: notify80,
        notify_email_100: notify100,
        notify_email_invoice: notifyInvoice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id)
    if (error) {
      toast.error("Failed to save notification preferences")
    } else {
      toast.success("Notification preferences saved")
      await refreshProfile()
    }
    setSavingNotif(false)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      toast.error(error.message === "New password should be different from the old password." ? "Choose a different password." : error.message)
    } else {
      toast.success("Password updated")
      setNewPassword("")
      setConfirmPassword("")
    }
    setSavingPassword(false)
  }

  return (
    <div className="space-y-6 w-full">
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
            <Input value={displayEmail} disabled />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Password</CardTitle>
          </div>
          <CardDescription>Change your password. If you signed in with Google, this lets you also sign in with email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button onClick={handleChangePassword} disabled={savingPassword || !newPassword || !confirmPassword}>
            {savingPassword ? "Updating..." : "Update password"}
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
          <CardDescription>Choose when you want email alerts (in-app alerts are always on)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You always get in-app alerts (bell icon) when clients hit 80% and 100% of hours and when invoices are generated. Optionally receive the same by email:
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Email when client reaches 80% of hours</p>
                <p className="text-xs text-muted-foreground">Get an email in addition to the in-app alert</p>
              </div>
              <Switch checked={notify80} onCheckedChange={setNotify80} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Email when client reaches 100% of hours</p>
                <p className="text-xs text-muted-foreground">Get an email in addition to the in-app alert</p>
              </div>
              <Switch checked={notify100} onCheckedChange={setNotify100} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Email when an invoice is generated</p>
                <p className="text-xs text-muted-foreground">Get an email when a new invoice is created (e.g. by cron)</p>
              </div>
              <Switch checked={notifyInvoice} onCheckedChange={setNotifyInvoice} />
            </div>
          </div>
          <Button onClick={handleSaveNotificationPrefs} disabled={savingNotif}>
            {savingNotif ? "Saving..." : "Save notification preferences"}
          </Button>
        </CardContent>
      </Card>

      {/* Email sending (Resend / domain) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sending invoices by email</CardTitle>
          <CardDescription>Using the Mail button on Invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Right now you can only send test emails to your own address. To send invoices to clients (any email), verify your domain at{" "}
            <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="text-primary underline">resend.com/domains</a>
            {" "}and set <code className="text-xs bg-muted px-1 rounded">RESEND_FROM</code> in your env to an address on that domain (e.g. <code className="text-xs bg-muted px-1 rounded">invoices@yourdomain.com</code>).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

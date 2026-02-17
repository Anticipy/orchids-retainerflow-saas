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
import { User, CreditCard, Bell, Loader2, Lock, Upload, X } from "lucide-react"
import Image from "next/image"
export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const displayName = profile?.name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""
  const displayEmail = profile?.email ?? user?.email ?? ""
  const displayLogoUrl = (profile as { logo_url?: string } | null)?.logo_url ?? ""
  const [name, setName] = useState(displayName)
  const [logoUrl, setLogoUrl] = useState(displayLogoUrl)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null)
  const supabase = createClient()

  const handleLogoUpload = async (file: File) => {
    if (!user) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB")
      return
    }
  
    setUploadingLogo(true)
    try {
      const ext = file.name.split(".").pop() ?? "png"
      const path = `${user.id}/logo.${ext}`
  
      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true })
  
      if (uploadError) {
        toast.error("Failed to upload logo")
        return
      }
  
      const { data: { publicUrl } } = supabase.storage
        .from("logos")
        .getPublicUrl(path)
  
      // Save to DB immediately
      const { error: dbError } = await supabase
        .from("users")
        .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", user.id)
  
      if (dbError) {
        toast.error("Failed to save logo")
        return
      }
  
      setLogoUrl(publicUrl)
      await refreshProfile()
      toast.success("Logo uploaded!")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setUploadingLogo(false)
    }
  }
  
  const handleLogoRemove = async () => {
    if (!user) return
    const { error } = await supabase
      .from("users")
      .update({ logo_url: null, updated_at: new Date().toISOString() })
      .eq("id", user.id)
    if (error) {
      toast.error("Failed to remove logo")
      return
    }
    setLogoUrl("")
    await refreshProfile()
    toast.success("Logo removed")
  }
  
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
        window.location.href = data.url
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
  const [emailConfig, setEmailConfig] = useState<{ fullyConfigured?: boolean } | null>(null)

  useEffect(() => {
    const nextName = profile?.name ?? user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? ""
    const nextEmail = profile?.email ?? user?.email ?? ""
    const nextLogoUrl = (profile as { logo_url?: string } | null)?.logo_url ?? ""
    setName(nextName)
    setLogoUrl(nextLogoUrl)
    if (profile) {
      setNotify80(profile.notify_email_80 ?? true)
      setNotify100(profile.notify_email_100 ?? true)
      setNotifyInvoice(profile.notify_email_invoice ?? true)
    }
  }, [profile, user])

  useEffect(() => {
    fetch("/api/email-config")
      .then((r) => r.ok ? r.json() : null)
      .then(setEmailConfig)
      .catch(() => setEmailConfig(null))
  }, [])

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
          <div className="grid gap-2">
            <Label>Logo (for client portal)</Label>
            
            {/* Preview */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src={logoUrl || "/logo.png"}
                  alt="Logo preview"
                  width={64}
                  height={64}
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/logo.png"
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="logo-upload"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium cursor-pointer transition-colors hover:bg-accent ${uploadingLogo ? "opacity-50 pointer-events-none" : ""}`}
                >
                  {uploadingLogo ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4" /> Upload Logo</>
                  )}
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingLogo}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleLogoUpload(file)
                      e.target.value = ""
                    }}
                  />
                </label>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleLogoRemove}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" /> Remove logo
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Shows in your client portal header. Max 2MB. If none uploaded, your Retallio logo shows by default.
            </p>
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

     
    </div>
  )
}

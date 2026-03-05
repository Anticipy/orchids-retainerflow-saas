"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { User, CreditCard, Bell, Loader2, Lock, Upload, X, Check, Mail } from "lucide-react"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"

const inputCls = "w-full h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
const labelCls = "block text-[11px] font-semibold text-white/30 uppercase tracking-[0.12em] mb-1.5"

function Section({ title, subtitle, icon: Icon, children, delay }: {
  title: string; subtitle: string; icon: React.ElementType; children: React.ReactNode; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]">
        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-white/40" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-white leading-tight">{title}</p>
          <p className="text-[12px] text-white/30">{subtitle}</p>
        </div>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </motion.div>
  )
}

function SaveButton({ onClick, loading, label = "Save changes" }: {
  onClick: () => void; loading: boolean; label?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={loading ? {} : { scale: 1.02 }}
      whileTap={loading ? {} : { scale: 0.98 }}
      className="h-9 px-5 rounded-xl bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-40 flex items-center gap-2"
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {loading ? "Saving…" : label}
    </motion.button>
  )
}

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth()
  const supabase = createClient()

  // ── Fetch auth user directly instead of relying on useAuth() timing ──
  // useAuth() resolves asynchronously after mount. If the settings page
  // renders before it finishes, user is undefined → email shows "Loading…"
  // forever. We call getUser() ourselves so we own the loading state.
  const [authEmail, setAuthEmail] = useState<string | null>(null) // null = still fetching
  const [authUserId, setAuthUserId] = useState<string | null>(null)
  const [authMeta, setAuthMeta] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthEmail(data.user.email ?? "")
        setAuthUserId(data.user.id)
        setAuthMeta(data.user.user_metadata ?? {})
      } else {
        setAuthEmail("") // resolved with no user — shouldn't happen on this page
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived display values ──
  const resolvedName = profile?.name ?? authMeta?.full_name ?? (authEmail?.split("@")[0] ?? "")
  const resolvedLogoUrl = (profile as { logo_url?: string } | null)?.logo_url ?? ""

  // ── Local state ──
  const [name, setName]               = useState("")
  const [logoUrl, setLogoUrl]         = useState("")
  const [saving, setSaving]           = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const [newEmail, setNewEmail]       = useState("")
  const [savingEmail, setSavingEmail] = useState(false)
  const [emailSent, setEmailSent]     = useState(false)

  const [newPassword, setNewPassword]         = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword]   = useState(false)

  const [notify80, setNotify80]               = useState(true)
  const [notify100, setNotify100]             = useState(true)
  const [notifyInvoice, setNotifyInvoice]     = useState(true)
  const [savingNotif, setSavingNotif]         = useState(false)

  const [upgradingTier, setUpgradingTier]     = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [exportingData, setExportingData]     = useState(false)

  // Sync fields once data arrives
  useEffect(() => { if (resolvedName) setName(resolvedName) }, [resolvedName])
  useEffect(() => { if (resolvedLogoUrl) setLogoUrl(resolvedLogoUrl) }, [resolvedLogoUrl])
  useEffect(() => {
    if (profile) {
      setNotify80(profile.notify_email_80 ?? true)
      setNotify100(profile.notify_email_100 ?? true)
      setNotifyInvoice(profile.notify_email_invoice ?? true)
    }
  }, [profile])

  // ── Handlers ──────────────────────────────────────────────────────

  const handleLogoUpload = async (file: File) => {
    if (!authUserId) return
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return }
    if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2MB"); return }
    setUploadingLogo(true)
    try {
      const ext = file.name.split(".").pop() ?? "png"
      const path = `${authUserId}/logo.${ext}`
      const { error: uploadError } = await supabase.storage.from("logos").upload(path, file, { upsert: true })
      if (uploadError) { toast.error("Failed to upload logo"); return }
      const { data: { publicUrl } } = supabase.storage.from("logos").getPublicUrl(path)
      await supabase.from("users").update({ logo_url: publicUrl, updated_at: new Date().toISOString() }).eq("id", authUserId)
      setLogoUrl(publicUrl); await refreshProfile(); toast.success("Logo uploaded!")
    } catch { toast.error("Something went wrong") } finally { setUploadingLogo(false) }
  }

  const handleLogoRemove = async () => {
    if (!authUserId) return
    await supabase.from("users").update({ logo_url: null, updated_at: new Date().toISOString() }).eq("id", authUserId)
    setLogoUrl(""); await refreshProfile(); toast.success("Logo removed")
  }

  const handleSaveProfile = async () => {
    if (!authUserId) return
    setSaving(true)
    const { error } = await supabase.from("users").upsert(
      { id: authUserId, email: authEmail ?? "", name, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    )
    if (error) toast.error("Failed to update profile")
    else { toast.success("Profile updated"); await refreshProfile() }
    setSaving(false)
  }

  const handleChangeEmail = async () => {
    if (!newEmail.trim()) { toast.error("Please enter a new email address"); return }
    if (newEmail.trim() === authEmail) { toast.error("That's already your current email"); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.trim())) { toast.error("Please enter a valid email address"); return }
    setSavingEmail(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    if (error) toast.error(error.message || "Failed to update email")
    else { setEmailSent(true); setNewEmail(""); toast.success("Confirmation email sent! Check your new inbox.") }
    setSavingEmail(false)
  }

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) toast.error(error.message)
    else { toast.success("Password updated"); setNewPassword(""); setConfirmPassword("") }
    setSavingPassword(false)
  }

  const handleUpgrade = async (tier: string) => {
    if (tier === "free") { toast.info("To downgrade to Free, DM me on X — x.com/nemo30ss"); return }
    setUpgradingTier(tier)
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tier }) })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || "Failed"); return }
      if (data.url) window.location.href = data.url
    } catch { toast.error("Something went wrong") } finally { setUpgradingTier(null) }
  }

  const handleSaveNotificationPrefs = async () => {
    if (!profile) return
    setSavingNotif(true)
    const { error } = await supabase.from("users").update({
      notify_email_80: notify80, notify_email_100: notify100,
      notify_email_invoice: notifyInvoice, updated_at: new Date().toISOString(),
    }).eq("id", profile.id)
    if (error) toast.error("Failed to save")
    else { toast.success("Notification preferences saved"); await refreshProfile() }
    setSavingNotif(false)
  }

  const tierLabels: Record<string, string> = { free: "Free", pro: "Pro ($19/mo)", business: "Business ($39/mo)" }
  const currentTier = profile?.subscription_tier || "free"
  const plans = [
    { tier: "free",     name: "Free",     price: "$0/mo",  desc: "1 retainer client" },
    { tier: "pro",      name: "Pro",      price: "$19/mo", desc: "Up to 10 clients · portal · auto-invoicing" },
    { tier: "business", name: "Business", price: "$39/mo", desc: "Unlimited clients · Stripe auto-charge" },
  ]
  const notifPrefs = [
    { key: "80",  label: "Client reaches 80% of hours",  sub: "Emailed when a client approaches their limit",  value: notify80,      set: setNotify80 },
    { key: "100", label: "Client reaches 100% of hours", sub: "Emailed when a client hits or exceeds limit",   value: notify100,     set: setNotify100 },
    { key: "inv", label: "Invoice generated",            sub: "Emailed when a new invoice is created",         value: notifyInvoice, set: setNotifyInvoice },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-[22px] font-bold tracking-tight text-white">Settings</h1>
        <p className="text-[13px] text-white/30 mt-0.5">Manage your account and preferences</p>
      </motion.div>

      {/* ── Profile ── */}
      <Section title="Profile" subtitle="Your name and logo" icon={User} delay={0.08}>
        <div>
          <label className={labelCls}>Name</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className={labelCls}>Logo for client portal</label>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden flex items-center justify-center flex-shrink-0">
              <Image src={logoUrl || "/logo.png"} alt="Logo" width={56} height={56} className="object-contain"
                onError={(e) => { e.currentTarget.src = "/logo.png" }} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="logo-upload"
                className={`inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-white/[0.09] bg-white/[0.04] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.07] transition-all cursor-pointer ${uploadingLogo ? "opacity-40 pointer-events-none" : ""}`}
              >
                {uploadingLogo ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {uploadingLogo ? "Uploading…" : "Upload logo"}
                <input id="logo-upload" type="file" accept="image/*" className="hidden" disabled={uploadingLogo}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); e.target.value = "" }} />
              </label>
              {logoUrl && (
                <button onClick={handleLogoRemove} className="inline-flex items-center gap-1 text-[12px] text-white/25 hover:text-red-400 transition-colors">
                  <X className="w-3 h-3" /> Remove
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] text-white/20 mt-2">Max 2MB · Shown in your client portal header</p>
        </div>
        <SaveButton onClick={handleSaveProfile} loading={saving} />
      </Section>

      {/* ── Email ── */}
      <Section title="Email Address" subtitle="Change the email you sign in with" icon={Mail} delay={0.11}>
        <div>
          <label className={labelCls}>Current email</label>
          <div className="w-full h-10 px-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center">
            {authEmail === null
              ? <span className="text-[12px] text-white/20 animate-pulse">Loading…</span>
              : authEmail
                ? <span className="text-[13px] text-white/40 font-mono tracking-tight select-all">{authEmail}</span>
                : <span className="text-[12px] text-white/20 italic">No email on file</span>
            }
          </div>
          <p className="text-[11px] text-white/20 mt-1.5">This is the email you use to sign in.</p>
        </div>
        <div>
          <label className={labelCls}>New email address</label>
          <input
            className={inputCls} type="email" value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setEmailSent(false) }}
            placeholder="you@example.com"
          />
        </div>
        {emailSent && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-400/[0.06] border border-emerald-400/20"
          >
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-medium text-emerald-400">Confirmation email sent</p>
              <p className="text-[12px] text-white/35 mt-0.5">
                Check your new inbox and click the link to confirm. Your email won't change until you do.
              </p>
            </div>
          </motion.div>
        )}
        <SaveButton onClick={handleChangeEmail} loading={savingEmail} label="Send confirmation email" />
      </Section>

      {/* ── Password ── */}
      <Section title="Password" subtitle="Change your sign-in password" icon={Lock} delay={0.14}>
        <div>
          <label className={labelCls}>New password</label>
          <input className={inputCls} type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
        </div>
        <div>
          <label className={labelCls}>Confirm new password</label>
          <input className={inputCls} type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <SaveButton onClick={handleChangePassword} loading={savingPassword} label="Update password" />
      </Section>

      {/* ── Subscription ── */}
      <Section title="Subscription" subtitle={`Current plan: ${tierLabels[currentTier] || "Free"}`} icon={CreditCard} delay={0.20}>
        <div className="space-y-3">
          {plans.map((plan) => {
            const isCurrent = currentTier === plan.tier
            return (
              <div key={plan.tier}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isCurrent ? "border-violet-500/25 bg-violet-500/[0.05]" : "border-white/[0.07] bg-white/[0.02]"}`}
              >
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {plan.name} <span className="font-normal text-white/40">· {plan.price}</span>
                  </p>
                  <p className="text-[12px] text-white/30 mt-0.5">{plan.desc}</p>
                </div>
                {isCurrent ? (
                  <span className="text-[11px] font-semibold text-violet-400 bg-violet-400/10 border border-violet-400/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Current
                  </span>
                ) : (
                  <button onClick={() => handleUpgrade(plan.tier)} disabled={upgradingTier !== null}
                    className="h-8 px-4 rounded-xl border border-white/[0.09] bg-white/[0.04] text-[12px] font-medium text-white/50 hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-40 flex items-center gap-1.5"
                  >
                    {upgradingTier === plan.tier && <Loader2 className="w-3 h-3 animate-spin" />}
                    {plan.tier === "free" ? "Downgrade" : "Upgrade"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <p className="text-[11px] text-white/20">You'll be redirected to Stripe for secure payment.</p>
      </Section>

      {/* ── Notifications ── */}
      <Section title="Email Notifications" subtitle="In-app alerts are always on" icon={Bell} delay={0.26}>
        <div className="space-y-3">
          {notifPrefs.map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="pr-4">
                <p className="text-[13px] font-medium text-white/70">{pref.label}</p>
                <p className="text-[12px] text-white/30 mt-0.5">{pref.sub}</p>
              </div>
              <Switch checked={pref.value} onCheckedChange={pref.set} />
            </div>
          ))}
        </div>
        <SaveButton onClick={handleSaveNotificationPrefs} loading={savingNotif} label="Save preferences" />
      </Section>

      {/* ── Danger Zone ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-6 py-4 border-b border-red-500/[0.12]">
          <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white leading-tight">Danger Zone</p>
            <p className="text-[12px] text-red-400/60">Irreversible actions — proceed with care</p>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {/* Export */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div>
              <p className="text-[13px] font-semibold text-white/80">Export your data</p>
              <p className="text-[12px] text-white/35 mt-0.5">Download all your clients, time entries, and invoices as JSON.</p>
            </div>
            <motion.button
              onClick={async () => {
                setExportingData(true)
                try {
                  const res = await fetch("/api/account/export")
                  if (!res.ok) throw new Error()
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a"); a.href = url; a.download = "retallio-data-export.json"; a.click()
                  URL.revokeObjectURL(url); toast.success("Data exported!")
                } catch { toast.error("Export failed — DM me on X: x.com/nemo30ss") }
                finally { setExportingData(false) }
              }}
              disabled={exportingData}
              whileHover={exportingData ? {} : { scale: 1.02 }}
              whileTap={exportingData ? {} : { scale: 0.98 }}
              className="flex-shrink-0 h-9 px-4 rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/60 text-[13px] font-medium hover:text-white hover:bg-white/[0.07] transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {exportingData && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {exportingData ? "Exporting…" : "Export JSON"}
            </motion.button>
          </div>
          {/* Delete */}
          <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/[0.04]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-[13px] font-semibold text-white/80">Delete account</p>
                <p className="text-[12px] text-white/35 mt-0.5 leading-relaxed">
                  Permanently deletes your account, all clients, time entries, and invoices. Clients lose portal access. Cannot be undone.
                </p>
              </div>
              {!showDeleteConfirm && (
                <motion.button onClick={() => setShowDeleteConfirm(true)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 h-9 px-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-400 text-[13px] font-medium hover:bg-red-500/15 transition-all"
                >
                  Delete account
                </motion.button>
              )}
            </div>
            {showDeleteConfirm && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-[12px] text-red-400/80">
                  Type <span className="font-mono font-bold text-red-400">delete my account</span> to confirm:
                </p>
                <input
                  value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="delete my account"
                  className="w-full h-10 px-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/25 text-white text-[13px] placeholder:text-red-400/30 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15"
                />
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={async () => {
                      if (deleteConfirmText !== "delete my account") { toast.error("Please type the confirmation text exactly"); return }
                      setDeletingAccount(true)
                      try {
                        const res = await fetch("/api/account/delete", { method: "DELETE" })
                        if (!res.ok) throw new Error()
                        toast.success("Account deleted. Goodbye.")
                        await supabase.auth.signOut()
                        window.location.href = "/"
                      } catch { toast.error("Deletion failed — DM me on X: x.com/nemo30ss"); setDeletingAccount(false) }
                    }}
                    disabled={deletingAccount || deleteConfirmText !== "delete my account"}
                    whileHover={deletingAccount ? {} : { scale: 1.02 }}
                    whileTap={deletingAccount ? {} : { scale: 0.98 }}
                    className="h-9 px-4 rounded-xl bg-red-500 text-white text-[13px] font-semibold hover:bg-red-400 transition-colors disabled:opacity-40 flex items-center gap-2"
                  >
                    {deletingAccount && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {deletingAccount ? "Deleting…" : "Permanently delete"}
                  </motion.button>
                  <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText("") }}
                    className="h-9 px-4 rounded-xl border border-white/[0.07] text-white/40 text-[13px] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
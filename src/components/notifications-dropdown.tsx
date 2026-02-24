"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, FileText, Clock, AlertTriangle, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

function NotifIcon({ type }: { type: string }) {
  switch (type) {
    case "hours_80":
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
    case "hours_100":
      return <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
    case "invoice_generated":
      return <FileText className="w-3.5 h-3.5 text-violet-400 shrink-0" />
    default:
      return <Clock className="w-3.5 h-3.5 text-white/40 shrink-0" />
  }
}

export function NotificationsDropdown() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications?limit=15")
    if (!res.ok) return
    const data = await res.json()
    setNotifications(data.notifications ?? [])
    setUnreadCount(data.unreadCount ?? 0)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  useEffect(() => {
    if (open) {
      setLoading(true)
      fetchNotifications().finally(() => setLoading(false))
    }
  }, [open])

  const markRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mark_all_read: true }),
    })
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() }))
    )
    setUnreadCount(0)
  }

  const handleSelect = (n: Notification) => {
    if (!n.read_at) markRead(n.id)
    if (n.link) router.push(n.link)
    setOpen(false)
  }

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-white/[0.08] hover:border-white/[0.14] hover:bg-white/[0.04] text-white/50 hover:text-white/80 transition-all"
      >
        <Bell className="w-4 h-4" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-violet-500 text-[9px] font-bold text-white leading-none"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-full mt-2 z-50 w-80 rounded-2xl border border-white/[0.09] bg-[#0c0c0c] shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] font-semibold text-violet-300 leading-none">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] font-medium text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-lg text-white/25 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-[340px] overflow-y-auto">
                {loading ? (
                  <div className="py-10 text-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-violet-400 rounded-full animate-spin mx-auto" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-5 h-5 text-white/15 mx-auto mb-2" />
                    <p className="text-[13px] text-white/25">No notifications yet</p>
                  </div>
                ) : (
                  <div className="p-1.5 space-y-0.5">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSelect(n)}
                        className={`
                          w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all group
                          ${!n.read_at
                            ? "bg-violet-500/[0.06] hover:bg-violet-500/[0.10] border border-violet-500/[0.10]"
                            : "hover:bg-white/[0.04] border border-transparent"
                          }
                        `}
                      >
                        {/* Icon bubble */}
                        <div className={`
                          w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                          ${!n.read_at ? "bg-violet-500/10 border border-violet-500/20" : "bg-white/[0.04] border border-white/[0.07]"}
                        `}>
                          <NotifIcon type={n.type} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] leading-snug truncate ${!n.read_at ? "font-semibold text-white" : "font-medium text-white/50"}`}>
                            {n.title}
                          </p>
                          {n.body && (
                            <p className="text-[11px] text-white/30 truncate mt-0.5">{n.body}</p>
                          )}
                          <p className="text-[10px] text-white/20 mt-1">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </p>
                        </div>

                        {/* Unread dot */}
                        {!n.read_at && (
                          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0 mt-2" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <p className="text-[11px] text-white/20 text-center">
                    Showing last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
"use client";

import { motion } from "framer-motion";

/* ─── Notification types ───────────────────────────────────────────────── */
const ALERTS = [
  {
    id: "80pct",
    icon: "📊",
    title: "80% of hours used",
    body: "Meridian Studio has used 16 of 20 retainer hours. 4 remaining.",
    time: "2h ago",
    sent_to: "both",
    color: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.2)",
    dot: "#fb923c",
  },
  {
    id: "100pct",
    icon: "⚠️",
    title: "Retainer hours reached",
    body: "Meridian Studio hit 20/20 hours. Additional work billed at $95/hr.",
    time: "Just now",
    sent_to: "both",
    color: "rgba(239,68,68,0.10)",
    border: "rgba(239,68,68,0.2)",
    dot: "#f87171",
  },
];

/* ─── Phone-style notification card ────────────────────────────────────── */
function NotificationCard({
  alert,
  delay,
  from,
}: {
  alert: (typeof ALERTS)[0];
  delay: number;
  from: "freelancer" | "client";
}) {
  return (
    <motion.div
      className="rounded-2xl border overflow-hidden"
      style={{ background: alert.color, borderColor: alert.border }}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Notification header */}
      <div className="px-4 py-3 flex items-center gap-2.5 border-b" style={{ borderColor: alert.border }}>
        <span className="text-[14px]">{alert.icon}</span>
        <span className="text-[12px] font-semibold text-white/80 flex-1">{alert.title}</span>
        <span className="text-[11px] text-white/25">{alert.time}</span>
      </div>

      <div className="px-4 py-3">
        <p className="text-[12px] text-white/55 leading-relaxed mb-3">{alert.body}</p>

        {/* Sent-to indicators */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25 uppercase tracking-widest font-semibold">
            Notified
          </span>
          <div className="flex items-center gap-1.5">
            {from === "freelancer" || alert.sent_to === "both" ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-white/50 bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                You
              </span>
            ) : null}
            {alert.sent_to === "both" ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-white/50 bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Meridian Studio
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeatureNotificationDemo() {
  return (
    <div className="w-full bg-[#080808] p-6 md:p-8 space-y-5">
      {/* Section label */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold text-white/25 uppercase tracking-widest">
          Alert log
        </p>
        <span className="text-[11px] text-white/25">This month</span>
      </div>

      {/* Notification cards — staggered */}
      {ALERTS.map((alert, i) => (
        <NotificationCard
          key={alert.id}
          alert={alert}
          delay={i * 0.18}
          from="freelancer"
        />
      ))}

      {/* Email preview — both sides got it */}
      <motion.div
        className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.38, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
          <span className="text-[13px]">✉️</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white/70 truncate">
              Your retainer hours are running out
            </p>
            <p className="text-[11px] text-white/25">To: studio@meridian.co</p>
          </div>
          <span className="text-[10px] text-white/20 flex-shrink-0">auto</span>
        </div>
        <div className="px-4 py-3">
          <p className="text-[12px] text-white/40 leading-relaxed">
            Hi Meridian Studio, you&apos;ve used 20 of 20 retainer hours with Alex Chen this month.
            Additional hours will be billed at $95/hr. No action needed — your invoice reflects this automatically.
          </p>
        </div>
      </motion.div>

      {/* No-drama callout */}
      <motion.p
        className="text-[12px] text-white/20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.55 }}
      >
        No awkward call. No scope dispute. They already knew.
      </motion.p>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";

const RETAINER = 20;
const USED = 14.5;
const PCT = USED / RETAINER;

const TASKS = [
  { task: "Brand identity system", hours: 4.0, tag: "Design", done: true },
  { task: "Homepage wireframes", hours: 3.5, tag: "Design", done: true },
  { task: "Component library setup", hours: 3.5, tag: "Dev", done: true },
  { task: "Stakeholder revisions", hours: 2.0, tag: "Design", done: true },
  { task: "Motion specs", hours: 1.5, tag: "Design", done: false, active: true },
];

function ProgressRing({ pct }: { pct: number }) {
  const R = 52;
  const circ = 2 * Math.PI * R;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="flex-shrink-0">
      {/* Outer glow track */}
      <circle cx="60" cy="60" r={R} stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
      {/* Progress */}
      <motion.circle
        cx="60"
        cy="60"
        r={R}
        stroke="url(#ringGrad)"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
        transform="rotate(-90 60 60)"
        initial={{ strokeDasharray: `0 ${circ}` }}
        whileInView={{ strokeDasharray: `${circ * pct} ${circ}` }}
        viewport={{ once: false }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
      {/* Warning threshold at 80% */}
      <circle
        cx="60"
        cy="60"
        r={R}
        stroke="rgba(251,146,60,0.25)"
        strokeWidth="2"
        strokeDasharray={`${circ * 0.8} ${circ}`}
        strokeDashoffset={0}
        fill="none"
        transform="rotate(-90 60 60)"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FeaturePortalDemo() {
  return (
    <div className="w-full bg-[#080808]">
      {/* Portal header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[13px] font-semibold text-white">Meridian Studio</p>
          <p className="text-[11px] text-white/30">February retainer · 20 hrs/mo</p>
        </div>
        <span className="text-[10px] font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full tracking-wide">
          Client portal
        </span>
      </div>

      {/* Hours section */}
      <div className="px-6 py-5 flex items-center gap-6 border-b border-white/[0.06]">
        <div className="relative">
          <ProgressRing pct={PCT} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-[20px] font-bold text-white leading-none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.8 }}
            >
              {Math.round(PCT * 100)}%
            </motion.span>
            <span className="text-[10px] text-white/30 mt-0.5">of retainer</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-baseline gap-1.5 mb-1">
            <span className="text-[32px] font-bold text-white leading-none tracking-tight">{USED}</span>
            <span className="text-[14px] text-white/30 font-medium">/ {RETAINER} hrs</span>
          </div>
          <p className="text-[12px] text-white/35 mb-4">used this month</p>

          {/* Remaining pill */}
          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-600"
                initial={{ width: 0 }}
                whileInView={{ width: `${PCT * 100}%` }}
                viewport={{ once: false }}
                transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-[11px] text-white/30 flex-shrink-0">
              {(RETAINER - USED).toFixed(1)} left
            </span>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-[11px] text-violet-300">Alex is working now</span>
          </div>
        </div>
      </div>

      {/* Task log */}
      <div className="px-6 py-4">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-3">
          Work log
        </p>
        <div className="space-y-0">
          {TASKS.map((t, i) => (
            <motion.div
              key={t.task}
              className={`flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 ${
                t.active ? "opacity-100" : ""
              }`}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
            >
              {/* Status dot */}
              <div className="flex-shrink-0">
                {t.active ? (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-violet-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/15" />
                )}
              </div>
              <span
                className={`flex-1 text-[12px] truncate ${
                  t.active ? "text-white font-medium" : "text-white/50"
                }`}
              >
                {t.task}
                {t.active && (
                  <span className="ml-2 text-[10px] text-violet-400 font-medium">in progress</span>
                )}
              </span>
              <span className="text-[12px] tabular-nums text-white/25 flex-shrink-0">{t.hours}h</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
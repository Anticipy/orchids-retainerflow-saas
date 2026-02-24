"use client";

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/* ─── Real data — nothing placeholder ─────────────────────────────────── */
const CLIENT_NAME = "Meridian Studio";
const FREELANCER_HANDLE = "Alex Chen";
const RETAINER_HOURS = 20;
const USED_HOURS = 14.5;
const HOURLY_RATE = 95;

const TIME_ENTRIES = [
  { task: "Brand identity system", hours: 4.0, day: "Mon", tag: "Design" },
  { task: "Homepage wireframes", hours: 3.5, day: "Tue", tag: "Design" },
  { task: "Component library setup", hours: 3.5, day: "Wed", tag: "Dev" },
  { task: "Stakeholder revisions", hours: 2.0, day: "Thu", tag: "Design" },
  { task: "Motion specs", hours: 1.5, day: "Fri", tag: "Design" },
];

const TAG_COLORS: Record<string, string> = {
  Design: "rgba(167,139,250,0.15)",
  Dev: "rgba(52,211,153,0.15)",
};
const TAG_TEXT: Record<string, string> = {
  Design: "#a78bfa",
  Dev: "#34d399",
};

/* ─── Animated seconds counter ────────────────────────────────────────── */
function useLiveTimer() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let s = 47 * 60 + 23;
    setElapsed(s);
    const id = setInterval(() => {
      s++;
      setElapsed(s);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* ─── Progress arc SVG ────────────────────────────────────────────────── */
function ProgressArc({ pct }: { pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      <circle cx="44" cy="44" r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <motion.circle
        cx="44"
        cy="44"
        r={r}
        stroke="url(#arcGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform="rotate(-90 44 44)"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ}` }}
        transition={{ duration: 1.4, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Freelancer panel (left / top) ───────────────────────────────────── */
function FreelancerPanel({ timerStr }: { timerStr: string }) {
  return (
    <div className="flex flex-col">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold text-violet-300">
            A
          </div>
          <span className="text-[12px] font-medium text-white/70">{FREELANCER_HANDLE}</span>
        </div>
        <span className="text-[10px] font-semibold text-white/20 uppercase tracking-widest">
          Your view
        </span>
      </div>

      {/* Active timer */}
      <div className="px-4 sm:px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block flex-shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[11px] text-emerald-400 font-medium">Recording now</span>
          <span className="text-[11px] text-white/25 sm:ml-auto">Motion specs · {CLIENT_NAME}</span>
        </div>
        <div
          className="text-[36px] sm:text-[42px] font-bold tabular-nums tracking-tighter leading-none text-white"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {timerStr}
        </div>
      </div>

      {/* Time log */}
      <div className="px-4 sm:px-5 py-3">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-2.5">
          This week
        </p>
        <div className="space-y-0.5">
          {TIME_ENTRIES.map((e, i) => (
            <motion.div
              key={e.task}
              className="flex items-center gap-2 sm:gap-2.5 py-1.5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
            >
              <span className="text-[10px] text-white/25 w-6 text-right flex-shrink-0">{e.day}</span>
              {/* Full task name — no truncation now that we have full width on mobile */}
              <span className="flex-1 text-[12px] text-white/65 min-w-0">{e.task}</span>
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0"
                style={{ background: TAG_COLORS[e.tag], color: TAG_TEXT[e.tag] }}
              >
                {e.tag}
              </span>
              <span className="text-[12px] tabular-nums text-white/50 w-8 text-right flex-shrink-0">
                {e.hours}h
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer stats */}
      <div className="px-4 sm:px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[10px] text-white/25">Total logged</p>
          <p className="text-[13px] font-semibold text-white">{USED_HOURS} hrs</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/25">Earned</p>
          <p className="text-[13px] font-semibold text-white">
            ${(USED_HOURS * HOURLY_RATE).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/25">Remaining</p>
          <p className="text-[13px] font-semibold text-white">
            {(RETAINER_HOURS - USED_HOURS).toFixed(1)} hrs
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Client panel (right / bottom) ──────────────────────────────────── */
function ClientPanel() {
  const pct = USED_HOURS / RETAINER_HOURS;

  return (
    <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-white/[0.06]">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-300">
            M
          </div>
          <span className="text-[12px] font-medium text-white/70">{CLIENT_NAME}</span>
        </div>
        <span className="text-[10px] font-semibold text-white/20 uppercase tracking-widest">
          Client view
        </span>
      </div>

      {/* Hours progress */}
      <div className="px-4 sm:px-5 py-5 border-b border-white/[0.06] flex items-center gap-5">
        <div className="relative flex-shrink-0">
          <ProgressArc pct={pct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] font-bold text-white leading-none">{Math.round(pct * 100)}%</span>
            <span className="text-[9px] text-white/30 mt-0.5">used</span>
          </div>
        </div>
        <div>
          <p className="text-[22px] font-bold text-white leading-none mb-1">
            {USED_HOURS} <span className="text-[14px] font-medium text-white/30">/ {RETAINER_HOURS} hrs</span>
          </p>
          <p className="text-[12px] text-white/40 mb-3">February retainer</p>
          <div className="flex items-center gap-1.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }}
            />
            <span className="text-[11px] text-violet-300">Alex is working now</span>
          </div>
        </div>
      </div>

      {/* Work completed */}
      <div className="px-4 sm:px-5 py-3">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest mb-2.5">
          Work completed
        </p>
        <div className="space-y-0.5">
          {TIME_ENTRIES.slice(0, 4).map((e, i) => (
            <motion.div
              key={e.task}
              className="flex items-center justify-between py-1.5 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1 h-1 rounded-full bg-white/20 flex-shrink-0" />
                {/* Full task name on mobile now that it has full width */}
                <span className="text-[12px] text-white/55">{e.task}</span>
              </div>
              <span className="text-[12px] tabular-nums text-white/30 flex-shrink-0">{e.hours}h</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Invoice preview */}
      <motion.div
        className="mx-4 sm:mx-5 mb-4 mt-auto rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/[0.06]">
          <span className="text-[11px] font-medium text-white/50">Invoice · February</span>
          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            Pending
          </span>
        </div>
        <div className="px-4 py-2.5 flex items-center justify-between">
          <p className="text-[11px] text-white/30">Retainer + 0h overage</p>
          <p className="text-[16px] font-bold text-white">
            ${(USED_HOURS * HOURLY_RATE).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────── */
export function HeroProductDemo() {
  const timerStr = useLiveTimer();

  return (
    <div className="w-full bg-[#080808] rounded-xl overflow-hidden">
      {/*
        Mobile:  single column — Your View on top, Client View below
        sm+:     two columns side by side (original layout)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <FreelancerPanel timerStr={timerStr} />
        <ClientPanel />
      </div>
    </div>
  );
}
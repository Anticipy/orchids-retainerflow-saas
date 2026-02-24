"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Square } from "lucide-react";

function useLiveTimer(startSeconds: number) {
  const [elapsed, setElapsed] = useState(startSeconds);
  useEffect(() => {
    let s = startSeconds;
    const id = setInterval(() => { s++; setElapsed(s); }, 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return { h, m, s };
}

/* Digit flip — individual character with subtle animation */
function Digit({ value, prev }: { value: string; prev: string }) {
  const changed = value !== prev;
  return (
    <motion.span
      key={value}
      initial={changed ? { y: -12, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
}

function TimeDisplay({ h, m, s }: { h: number; m: number; s: number }) {
  const fmt = (n: number) => String(n).padStart(2, "0");
  const parts = [fmt(h), fmt(m), fmt(s)];

  return (
    <div className="flex items-center gap-1 tabular-nums font-bold tracking-tighter text-white"
      style={{ fontSize: "clamp(48px, 8vw, 72px)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
      {parts.map((part, pi) => (
        <span key={pi} className="flex items-center gap-0">
          {part.split("").map((ch, ci) => (
            <Digit key={ci} value={ch} prev={ch} />
          ))}
          {pi < 2 && <span className="text-white/20 mx-1" style={{ fontSize: "0.65em" }}>:</span>}
        </span>
      ))}
    </div>
  );
}

export function FeatureTimerDemo() {
  const { h, m, s } = useLiveTimer(47 * 60 + 23);

  // Simulate client seeing the same time with a tiny relay pulse
  const [clientPulse, setClientPulse] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setClientPulse(true);
      setTimeout(() => setClientPulse(false), 600);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full bg-[#080808] p-6 md:p-8 space-y-6">
      {/* Context row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center">
            <span className="text-[13px]">🎨</span>
          </div>
          <div>
            <p className="text-[13px] font-medium text-white leading-tight">Brand identity system</p>
            <p className="text-[11px] text-white/30">Meridian Studio · Design</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[11px] text-emerald-400 font-medium">Recording</span>
        </div>
      </div>

      {/* The timer — this IS the feature */}
      <div>
        <TimeDisplay h={h} m={m} s={s} />
        <p className="text-[12px] text-white/25 mt-2 tracking-wide">hours · minutes · seconds</p>
      </div>

      {/* Stop button */}
      <button
        type="button"
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.09] bg-white/[0.04] hover:bg-white/[0.07] transition-colors text-white/60 hover:text-white text-[13px] font-medium"
      >
        <Square className="w-3.5 h-3.5" fill="currentColor" />
        Stop timer
      </button>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Client relay — the key differentiator */}
      <div>
        <p className="text-[11px] text-white/25 uppercase tracking-widest font-semibold mb-3">
          Visible to client right now
        </p>
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-[11px] font-bold text-amber-300 flex-shrink-0">
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-white/60">Meridian Studio sees</p>
            <p className="text-[13px] font-semibold text-white truncate">
              Brand identity system · live
            </p>
          </div>
          {/* Relay pulse — every second it blinks */}
          <motion.div
            className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0"
            animate={{ opacity: clientPulse ? [1, 0.2, 1] : 1, scale: clientPulse ? [1, 1.5, 1] : 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}
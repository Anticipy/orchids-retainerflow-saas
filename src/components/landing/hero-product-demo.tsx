"use client";

import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Play, Square, Clock, FileText } from "lucide-react";

export function HeroProductDemo() {
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  // Timer counting animation (continuous); displayHours derived from timerSeconds
  useEffect(() => {
    const controls = animate(0, 1247, {
      duration: 60,
      repeat: Infinity,
      onUpdate: (v) => setTimerSeconds(v),
    });
    return () => controls.stop();
  }, []);
  const displayHours = 2 + timerSeconds / 3600;

  // Invoice appears every 5 seconds, visible for ~3.5s
  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout>;
    const show = () => setInvoiceVisible(true);
    const hide = () => setInvoiceVisible(false);
    const t1 = setTimeout(show, 800);
    const t2 = setTimeout(hide, 4500);
    const interval = setInterval(() => {
      show();
      hideTimeout = setTimeout(hide, 3500);
    }, 5000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(hideTimeout);
      clearInterval(interval);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60) % 60;
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative rounded-xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm overflow-hidden"
        style={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px -20px rgba(0,0,0,0.5)",
        }}
        animate={{
          y: [0, -6, 0],
          rotateX: [0, 0.5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <span className="text-[11px] text-white/40 font-medium flex-1 text-center">
            Tempo — Dashboard
          </span>
        </div>

        <div className="p-4 space-y-4 min-h-[200px]">
          {/* Timer card */}
          <div className="rounded-lg bg-white/5 border border-white/10 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white/60">Active timer</span>
              <div className="flex items-center gap-1">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#22c55e]"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-[10px] text-[#22c55e]">Running</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366f1]/20 text-[#6366f1]">
                <Play className="w-4 h-4" fill="currentColor" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Client work — Retainer A</p>
                <p className="text-xl font-semibold tabular-nums text-white font-mono">
                  {Math.floor(timerSeconds / 60)
                    .toString()
                    .padStart(2, "0")}
                  :{formatTime(Math.floor(timerSeconds % 60))}
                </p>
              </div>
              <button
                type="button"
                className="p-2 rounded-lg border border-white/20 text-white/70 hover:bg-white/10 transition-colors"
                aria-label="Stop"
              >
                <Square className="w-4 h-4" fill="currentColor" />
              </button>
            </div>
          </div>

          {/* Hours summary */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg bg-white/5 border border-white/10 p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#6366f1]" />
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">This month</p>
                <p className="text-lg font-semibold text-white tabular-nums">
                  {displayHours.toFixed(1)} hrs
                </p>
              </div>
            </div>
            <div className="flex-1 rounded-lg bg-white/5 border border-white/10 p-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6366f1]" />
              <div>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Invoices</p>
                <p className="text-lg font-semibold text-white">3 sent</p>
              </div>
            </div>
          </div>

          {/* Invoice preview - fades in periodically; fixed height to prevent layout shift */}
          <div className="min-h-[100px] rounded-lg border border-white/10 overflow-hidden">
            <motion.div
              className="rounded-lg bg-white/[0.07]"
              initial={false}
              animate={{
                opacity: invoiceVisible ? 1 : 0,
                y: invoiceVisible ? 0 : 4,
              }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-3 py-2 border-b border-white/10 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-[#22c55e]" />
                <span className="text-xs font-medium text-white/80">Invoice generated</span>
              </div>
              <div className="px-3 py-2 space-y-1 text-xs">
                <div className="flex justify-between text-white/70">
                  <span>Retainer — February</span>
                  <span>$1,200</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Overage (2.2 hrs)</span>
                  <span>$110</span>
                </div>
                <div className="flex justify-between font-medium text-white pt-1 border-t border-white/10">
                  <span>Total</span>
                  <span>$1,310</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

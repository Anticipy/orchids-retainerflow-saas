"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Play, Square } from "lucide-react";

export function FeatureTimerDemo() {
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const accumulated = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now() / 1000 - accumulated.current;
    let raf: number;
    const tick = () => {
      accumulated.current = performance.now() / 1000 - startRef.current;
      setSeconds(accumulated.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 md:p-6 lg:p-7 shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => setRunning(!running)}
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#6366f1] text-white hover:bg-[#6366f1]/90 transition-colors shrink-0"
        >
          {running ? (
            <Square className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill="currentColor" />
          )}
        </button>
        <div className="min-w-0">
          <p className="text-sm sm:text-base font-medium text-white">Retainer A — Design</p>
          <p className="text-2xl sm:text-3xl md:text-3xl font-semibold tabular-nums text-white font-mono">
            {formatTime(seconds)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 text-sm sm:text-base text-white/50">
        <span>Today: 2.4 hrs</span>
        <span>•</span>
        <span>Month: 18.2 hrs</span>
      </div>
    </motion.div>
  );
}

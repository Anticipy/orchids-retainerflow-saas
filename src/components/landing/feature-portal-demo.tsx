"use client";

import { motion } from "framer-motion";

const entries = [
  { task: "Homepage redesign", hours: 1.5, date: "Feb 14" },
  { task: "API integration", hours: 2.2, date: "Feb 13" },
  { task: "Bug fixes", hours: 0.8, date: "Feb 12" },
];

export function FeaturePortalDemo() {
  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-4 sm:p-5 md:p-6 border-b border-white/10">
        <p className="text-xs sm:text-sm text-white/50 uppercase tracking-wider mb-3">
          Hours used this month
        </p>
        <div className="flex items-end gap-2 sm:gap-3">
          <motion.div
            className="w-4 sm:w-5 rounded-full bg-[#6366f1]"
            initial={{ height: 8 }}
            whileInView={{ height: 56 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="w-4 sm:w-5 rounded-full bg-[#6366f1]"
            initial={{ height: 8 }}
            whileInView={{ height: 42 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="w-4 sm:w-5 rounded-full bg-[#6366f1]/60"
            initial={{ height: 8 }}
            whileInView={{ height: 24 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="text-lg sm:text-xl font-semibold text-white mt-3">18.2 / 20 hrs</p>
      </div>
      <div className="p-3 sm:p-4 space-y-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.task}
            className="flex justify-between items-center text-xs sm:text-sm py-2 sm:py-2.5 border-b border-white/5 last:border-0"
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
          >
            <span className="text-white/80">{entry.task}</span>
            <span className="text-white/60 tabular-nums">{entry.hours} hrs</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

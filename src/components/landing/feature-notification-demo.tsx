"use client";

import { motion } from "framer-motion";
import { Bell } from "lucide-react";

export function FeatureNotificationDemo() {
  return (
    <motion.div
      className="relative w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-2 text-white/60 mb-3 sm:mb-4">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base">Notifications</span>
      </div>
      <motion.div
        className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-5 shadow-xl space-y-3"
        initial={{ opacity: 0, x: -12, y: 8 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.25, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
          <div>
            <p className="text-sm sm:text-base font-medium text-white">80% hours used</p>
            <p className="text-xs sm:text-sm text-white/60">Retainer A has used 16 of 20 hours.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
          <div>
            <p className="text-sm sm:text-base font-medium text-white">Overage warning</p>
            <p className="text-xs sm:text-sm text-white/60">Client B approaching limit next week.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

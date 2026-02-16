"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const lineItems = [
  { label: "Retainer — February", amount: "$1,200" },
  { label: "Overage (2.2 hrs @ $50/hr)", amount: "$110" },
];

export function FeatureInvoiceDemo() {
  return (
    <motion.div
      className="rounded-xl border border-white/10 bg-white/5 overflow-hidden shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10 flex items-center gap-2">
        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#22c55e]" />
        <span className="text-sm sm:text-base font-medium text-white/90">Invoice #1024</span>
      </div>
      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
        {lineItems.map((item, i) => (
          <motion.div
            key={item.label}
            className="flex justify-between text-sm sm:text-base"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.35 }}
          >
            <span className="text-white/70">{item.label}</span>
            <span className="text-white font-medium tabular-nums">{item.amount}</span>
          </motion.div>
        ))}
        <motion.div
          className="flex justify-between text-sm sm:text-base pt-3 sm:pt-4 border-t border-white/10 font-semibold text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5, duration: 0.35 }}
        >
          <span>Total</span>
          <span className="tabular-nums">$1,310</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

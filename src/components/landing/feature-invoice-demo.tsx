"use client";

import { motion } from "framer-motion";

const INVOICE = {
  number: "INV-2024-012",
  date: "March 1, 2024",
  due: "March 15, 2024",
  client: "Meridian Studio",
  from: "Alex Chen",
  items: [
    { desc: "Monthly retainer — February", sub: "20 hrs @ $95/hr", amount: 1900 },
    { desc: "Overage hours", sub: "2.2 hrs @ $95/hr", amount: 209 },
  ],
  total: 2109,
};

export function FeatureInvoiceDemo() {
  const subtotal = INVOICE.items.reduce((a, i) => a + i.amount, 0);

  return (
    <motion.div
      className="w-full bg-[#080808]"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      {/* Invoice document */}
      <div className="p-6 md:p-8">
        {/* Header */}
        <motion.div
          className="flex items-start justify-between mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div>
            <p className="text-[22px] font-bold text-white tracking-tight leading-none mb-1">Invoice</p>
            <p className="text-[12px] text-white/30 font-mono">{INVOICE.number}</p>
          </div>
          <span className="text-[11px] font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            Awaiting payment
          </span>
        </motion.div>

        {/* From / To */}
        <motion.div
          className="grid grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-1.5">From</p>
            <p className="text-[13px] font-semibold text-white">{INVOICE.from}</p>
            <p className="text-[12px] text-white/35">Freelance designer</p>
          </div>
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-1.5">To</p>
            <p className="text-[13px] font-semibold text-white">{INVOICE.client}</p>
            <p className="text-[12px] text-white/35">Studio client</p>
          </div>
        </motion.div>

        {/* Dates */}
        <motion.div
          className="flex gap-8 pb-5 mb-5 border-b border-white/[0.06]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-1">Issued</p>
            <p className="text-[12px] text-white/60">{INVOICE.date}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-1">Due</p>
            <p className="text-[12px] text-white/60">{INVOICE.due}</p>
          </div>
        </motion.div>

        {/* Line items */}
        <div className="space-y-3 mb-5">
          {INVOICE.items.map((item, i) => (
            <motion.div
              key={item.desc}
              className="flex items-start justify-between"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
            >
              <div>
                <p className="text-[13px] font-medium text-white/80 leading-tight">{item.desc}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{item.sub}</p>
              </div>
              <p className="text-[13px] font-semibold text-white tabular-nums">
                ${item.amount.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <motion.div
          className="flex items-center justify-between pt-4 border-t border-white/[0.08]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          <p className="text-[13px] font-semibold text-white">Total due</p>
          <p className="text-[24px] font-bold text-white tracking-tight">
            ${INVOICE.total.toLocaleString()}
          </p>
        </motion.div>

        {/* Auto-generated note */}
        <motion.div
          className="mt-5 pt-4 border-t border-white/[0.05]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <p className="text-[11px] text-white/20">
            Generated automatically by Retallio · Client has had live access to hours all month
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
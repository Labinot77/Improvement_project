"use client";

import { motion } from "framer-motion";
import { useQuickAdd } from "@/app/components/useQuickAdd";

// Grid of one-tap create buttons for every area
export function QuickAdd() {
  const actions = useQuickAdd();
  return (
    <section className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {actions.map((a, i) => (
        <motion.button
          key={a.href}
          type="button"
          onClick={a.run}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#16181b] px-2 py-4 text-sm text-zinc-300 transition-colors hover:border-white/[0.14]"
        >
          <span className="grid size-10 place-items-center rounded-xl" style={{ background: `${a.color}1f`, color: a.color }}>
            <a.icon className="size-5" />
          </span>
          {a.label}
        </motion.button>
      ))}
    </section>
  );
}

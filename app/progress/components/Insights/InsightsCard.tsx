"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Plain-language takeaways, staggered in
export function InsightsCard({ insights }: { insights: string[] }) {
  return (
    <section className="rounded-3xl border border-[#3a3465]/60 bg-[#1d1a2e] p-6 sm:p-8">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-indigo-400">
        <Sparkles className="size-3.5" />
        What the data says
      </p>
      <ul className="mt-5 space-y-4">
        {insights.map((text, i) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="flex gap-3 leading-relaxed text-zinc-200"
          >
            <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-indigo-400" />
            {text}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

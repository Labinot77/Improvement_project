"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import type { CoachNote } from "@/app/main/data/main";

const TONE = {
  good: { icon: TrendingUp, cls: "text-emerald-300 bg-emerald-400/10" },
  warn: { icon: AlertTriangle, cls: "text-amber-300 bg-amber-400/10" },
  info: { icon: Sparkles, cls: "text-indigo-300 bg-indigo-400/10" },
};

// Plain-language feedback, staggered in
export function CoachNotes({ notes }: { notes: CoachNote[] }) {
  return (
    <section className="rounded-3xl border border-[#3a3465]/60 bg-[#1d1a2e] p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-400">What stands out</p>
      <ul className="mt-5 space-y-3">
        {notes.map((n, i) => {
          const t = TONE[n.tone];
          return (
            <motion.li
              key={n.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${t.cls}`}>
                <t.icon className="size-3.5" />
              </span>
              <span className="leading-relaxed text-zinc-200">{n.text}</span>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}

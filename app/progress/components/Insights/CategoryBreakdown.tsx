"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { CARD } from "@/constants/progress/template";
import type { CategoryStat } from "@/types/Progress/progress";

// Completion per category over 30 days
export function CategoryBreakdown({
  categories,
}: {
  categories: CategoryStat[];
}) {
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">By category</h2>
      <p className="text-sm text-zinc-500">Last 30 days</p>

      {categories.length === 0 ? (
        <p className="mt-6 text-zinc-500">No tasks in the last 30 days.</p>
      ) : (
        <ul className="mt-6 space-y-5">
          {categories.map((c) => {
            const pct = Math.round((c.done / c.total) * 100);
            return (
              <li key={c.name} className="group">
                <div className="mb-2 flex items-baseline justify-between text-sm">
                  <span className="text-zinc-300">{c.name}</span>
                  <span className="text-zinc-500 tabular-nums">
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      {c.done}/{c.total} ·{" "}
                    </span>
                    {pct}%
                  </span>
                </div>
                {/* Grows in when scrolled into view */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="origin-left"
                >
                  <Progress
                    value={pct}
                    className="h-2 bg-white/[0.06] [&>[data-slot=progress-indicator]]:bg-[#7c6cf0] group-hover:[&>[data-slot=progress-indicator]]:bg-[#9a8df5]"
                  />
                </motion.div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

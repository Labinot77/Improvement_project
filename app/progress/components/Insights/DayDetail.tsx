"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CARD } from "@/constants/progress/template";
import type { DayStat } from "@/types/Progress/progress";

// Breakdown of the day picked in the chart or heatmap
export function DayDetail({ day }: { day: DayStat | undefined }) {
  const pct = day?.total ? Math.round((day.done / day.total) * 100) : 0;

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={day?.date ?? "none"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">Selected day</p>
          <h2 className="mt-2 text-xl font-medium">
            {day
              ? new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              : "Pick a day"}
          </h2>

          {!day || day.total === 0 ? (
            <p className="mt-6 text-zinc-500">No tasks were planned this day.</p>
          ) : (
            <>
              <div className="mt-5 flex items-baseline justify-between text-sm">
                <span className="text-zinc-400">
                  {day.done} of {day.total} done
                </span>
                <span className="font-medium tabular-nums">{pct}%</span>
              </div>
              <Progress
                value={pct}
                className="mt-2 h-2 bg-white/[0.06] [&>[data-slot=progress-indicator]]:bg-[#7c6cf0] [&>[data-slot=progress-indicator]]:duration-700"
              />
              <ul className="mt-5 max-h-56 space-y-2.5 overflow-y-auto pr-1">
                {day.tasks.map((t, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    {t.completed ? (
                      <CheckCircle2 className="size-4 shrink-0 text-[#7c6cf0]" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-zinc-600" />
                    )}
                    <span className={`min-w-0 flex-1 truncate ${t.completed ? "text-zinc-300" : "text-zinc-500"}`}>
                      {t.title}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-600">{t.category}</span>
                  </motion.li>
                ))}
              </ul>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

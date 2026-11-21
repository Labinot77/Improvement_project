"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { PILLARS, type PillarKey } from "@/constants/main/overview";
import { CARD } from "@/constants/ui";
import { today } from "@/lib/mics/date";
import { formatDuration } from "@/app/sleep/data/main";
import type { DayFacts } from "@/app/main/data/main";

// Facts line per area
function fact(k: PillarKey, d: DayFacts) {
  if (k === "tasks") return d.tasksTotal ? `${d.tasksDone} of ${d.tasksTotal} done` : "No tasks";
  if (k === "sleep") return d.sleepHours === null ? "Not logged" : formatDuration(d.sleepHours);
  if (k === "move") return d.activeMins ? `${d.activeMins}m · ${d.sessions.join(", ")}` : "Rest day";
  return d.lessons ? `${d.lessons} lesson${d.lessons > 1 ? "s" : ""}` : "None";
}

// What's still open today (links to the page that fixes it)
function openToday(d: DayFacts) {
  return [
    d.tasksTotal > d.tasksDone && { text: `${d.tasksTotal - d.tasksDone} to-dos left`, href: "/progress" },
    d.sleepHours === null && { text: "Log last night's sleep", href: "/sleep" },
    d.activeMins === 0 && { text: "Move for a bit", href: "/activity" },
    d.lessons === 0 && { text: "Write down a lesson", href: "/lessons" },
  ].filter(Boolean) as { text: string; href: string }[];
}

// Score parts for the selected day
export function DayBreakdown({ day }: { day: DayFacts }) {
  const isToday = day.date === today();
  const todo = isToday ? openToday(day) : [];

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={day.date}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">{isToday ? "Today" : "Selected day"}</p>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <h2 className="text-xl font-medium">
              {new Date(`${day.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </h2>
            <span className="text-3xl font-semibold tabular-nums">{day.score ?? "—"}</span>
          </div>

          <ul className="mt-6 space-y-4">
            {(Object.keys(PILLARS) as PillarKey[]).map((k) => {
              const v = day.parts[k];
              return (
                <li key={k}>
                  <div className="mb-1.5 flex items-baseline justify-between text-sm">
                    <span className="text-zinc-300">{PILLARS[k].label}</span>
                    <span className="truncate pl-3 text-zinc-500">{fact(k, day)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(v ?? 0) * 100}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: PILLARS[k].color, opacity: v === null ? 0.2 : 1 }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {isToday && (
            <div className="mt-6 border-t border-white/[0.06] pt-5">
              {todo.length === 0 ? (
                <p className="flex items-center gap-2 text-emerald-300">
                  <Check className="size-4" /> Everything covered today.
                </p>
              ) : (
                <ul className="space-y-2">
                  {todo.map((t) => (
                    <li key={t.href}>
                      <Link href={t.href} className="flex items-center gap-2.5 text-sm text-zinc-400 transition hover:text-zinc-100">
                        <Circle className="size-3.5 text-zinc-600" />
                        {t.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

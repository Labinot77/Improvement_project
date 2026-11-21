"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { ACTIVITY_COLOR, ACTIVITY_META, CARDIO_META, WEEKLY_GOAL } from "@/constants/fitness";
import type { WorkoutSet } from "@/types/fitness";
import { CARD } from "@/constants/ui";
import { formatMins, type weekPlan } from "@/app/activity/data/main";

type Day = ReturnType<typeof weekPlan>[number];
type Stat = { label: string; value: string; foot: string };

type Props = {
  days: Day[];
  stats: Stat[];
  last: Record<string, Pick<WorkoutSet, "reps" | "weightKg">[]>;
  known: string[];
};

// Mon..Sun columns with this week's workouts, plus the headline stats
export function WeekPlanner({ days, stats, last, known }: Props) {
  const { open } = useModal();
  const done = days.reduce((s, d) => s + d.sessions.length, 0);

  return (
    <section className={`${CARD} overflow-hidden`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-8 sm:pt-7">
        <div>
          <h2 className="text-lg font-medium">This week</h2>
          <p className="text-sm text-zinc-500">
            {done}/{WEEKLY_GOAL} sessions · tap a day to log a workout
          </p>
        </div>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (done / WEEKLY_GOAL) * 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{ background: ACTIVITY_COLOR }}
          />
        </div>
      </div>

      {/* Day columns (scroll sideways on small phones) */}
      <div className="grid grid-cols-7 gap-1.5 overflow-x-auto px-3 py-5 sm:gap-3 sm:px-8">
        {days.map((d, i) => (
          <motion.button
            key={d.date}
            type="button"
            disabled={d.isFuture}
            onClick={() => open("workout_form", { date: d.date, last, known })}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`group flex min-h-36 min-w-10 flex-col items-center gap-2 rounded-2xl border p-2 transition sm:min-h-44 sm:p-3 ${
              d.isToday ? "border-[#f97362]/50 bg-[#f97362]/[0.06]" : "border-white/[0.05] bg-white/[0.02]"
            } ${d.isFuture ? "opacity-40" : "hover:border-white/[0.15]"}`}
          >
            <span className="text-[11px] uppercase tracking-wider text-zinc-500">{d.label}</span>
            <span className={`text-lg font-semibold ${d.isToday ? "text-[#f97362]" : "text-zinc-200"}`}>{d.dayNum}</span>
            <div className="flex flex-1 flex-col items-center gap-1">
              {d.sessions.map((s) => (
                <span
                  key={s.id}
                  title={`${s.workoutName ?? s.type} · ${s.durationMins}m`}
                  className="flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-center"
                  style={{ background: `${ACTIVITY_META[s.type].color}26` }}
                >
                  <span className="text-base leading-none">{ACTIVITY_META[s.type].icon}</span>
                  <span className="hidden w-full truncate text-[10px] text-zinc-300 sm:block">{s.workoutName ?? s.type}</span>
                  {s.cardioType && <span className="text-xs leading-none">{CARDIO_META[s.cardioType].icon}</span>}
                </span>
              ))}
              {!d.sessions.length && !d.isFuture && (
                <Plus className="mt-2 size-4 text-zinc-700 transition group-hover:text-zinc-400" />
              )}
            </div>
            {d.mins > 0 && <span className="text-[11px] tabular-nums text-zinc-500">{formatMins(d.mins)}</span>}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 border-t border-white/[0.06] lg:grid-cols-4 lg:divide-x lg:divide-white/[0.06]">
        {stats.map((s) => (
          <div key={s.label} className="p-5 sm:px-8">
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{s.value}</p>
            <p className="text-sm text-zinc-500">{s.foot}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

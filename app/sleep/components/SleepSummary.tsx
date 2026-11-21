"use client";

import { motion } from "framer-motion";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { CARD } from "@/constants/ui";
import { clockOffset, formatDuration } from "@/app/sleep/data/main";
import type { sleepStats } from "@/app/sleep/data/main";

type Stats = ReturnType<typeof sleepStats>;
const DEBT_CAP = 10; // hours that fill the debt bar

// Debt bar, regularity ring and average rhythm
export function SleepSummary({ s }: { s: Stats }) {
  const regularity = s.regularity ?? 0;
  const C = 2 * Math.PI * 30;

  // Average bed/wake as a span on a 18:00 -> 14:00 track
  const bed = s.avgBedtime ? clockOffset(s.avgBedtime) : 0;
  let wake = s.avgWake ? clockOffset(s.avgWake) : 0;
  if (wake <= bed) wake += 24;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Debt */}
      <section className={`${CARD} p-6`}>
        <p className="text-sm text-zinc-500">Sleep debt · 7 days</p>
        <p className="mt-2 text-3xl font-semibold">{s.debt ? formatDuration(s.debt) : "None"}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (s.debt / DEBT_CAP) * 100)}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-red-400"
          />
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          {s.debt ? `Short of ${TARGET_HOURS}h across ${s.nightsThisWeek} logged nights` : "You're keeping up with your target"}
        </p>
      </section>

      {/* Regularity */}
      <section className={`${CARD} flex items-center gap-5 p-6`}>
        <svg viewBox="0 0 72 72" className="size-20 shrink-0 -rotate-90" aria-hidden>
          <circle cx="36" cy="36" r="30" fill="none" strokeWidth="7" className="stroke-white/[0.06]" />
          <motion.circle
            cx="36"
            cy="36"
            r="30"
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            stroke={SLEEP_COLOR}
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - regularity / 100) }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div>
          <p className="text-sm text-zinc-500">Regularity</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums">{s.regularity ?? "—"}</p>
          <p className="text-sm text-zinc-500">
            {s.regularity === null ? "Log 3+ nights" : `±${s.spreadMins} min bed/wake drift`}
          </p>
        </div>
      </section>

      {/* Rhythm */}
      <section className={`${CARD} p-6`}>
        <p className="text-sm text-zinc-500">Average rhythm</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums">
          {s.avgBedtime ?? "—"} <span className="text-zinc-600">→</span> {s.avgWake ?? "—"}
        </p>
        <div className="relative mt-4 h-2 rounded-full bg-white/[0.06]">
          {s.avgBedtime && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-y-0 origin-left rounded-full"
              style={{ left: `${(bed / 20) * 100}%`, width: `${((wake - bed) / 20) * 100}%`, background: SLEEP_COLOR }}
            />
          )}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-zinc-600">
          <span>18:00</span>
          <span>00:00</span>
          <span>06:00</span>
          <span>14:00</span>
        </div>
      </section>
    </div>
  );
}

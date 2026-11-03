"use client";

import { motion } from "framer-motion";
import type { Activity } from "@/types/fitness";
import { WEEKLY_GOAL, ACTIVITY_META } from "@/constants/fitness";
import { formatDate } from "@/lib/mics/date";

interface Props {
  activities: Activity[];
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return formatDate(d);
  });
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeeklyRing({ activities }: Props) {
  const last7 = getLast7Days();

  // Sessions this week keyed by date
  const weekMap: Record<string, Activity[]> = {};
  for (const date of last7) weekMap[date] = [];
  for (const a of activities) {
    if (weekMap[a.date]) weekMap[a.date].push(a);
  }

  const sessionCount = Object.values(weekMap).reduce((s, arr) => s + arr.length, 0);
  const progress     = Math.min(sessionCount / WEEKLY_GOAL, 1);
  const totalMins    = activities
    .filter((a) => last7.includes(a.date))
    .reduce((s, a) => s + a.durationMins, 0);

  const strokeDash = CIRCUMFERENCE * progress;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Ring */}
      <div className="relative flex items-center justify-center">
        <svg width="148" height="148" viewBox="0 0 148 148" className="-rotate-90">
          {/* Track */}
          <circle cx="74" cy="74" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          {/* Progress */}
          <motion.circle
            cx="74" cy="74" r={RADIUS}
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: CIRCUMFERENCE - strokeDash }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold text-zinc-100 tabular-nums leading-none">
            {sessionCount}
          </span>
          <span className="text-xs text-zinc-500 mt-1">of {WEEKLY_GOAL}</span>
          <span className="text-[10px] text-zinc-600">sessions</span>
        </div>
      </div>

      {/* Day dots */}
      <div className="flex items-end gap-3">
        {last7.map((date, i) => {
          const daySessions = weekMap[date];
          const isToday     = date === formatDate(new Date());
          const hasSession  = daySessions.length > 0;
          const topActivity = daySessions[0];

          return (
            <div key={date} className="flex flex-col items-center gap-1.5">
              {/* Stack indicator for multiple sessions */}
              {daySessions.length > 1 && (
                <span className="text-[10px] text-zinc-500">+{daySessions.length - 1}</span>
              )}

              {/* Activity icon or empty dot */}
              <div
                className={`flex size-8 items-center justify-center rounded-xl border transition-all ${
                  hasSession
                    ? "border-white/[0.10] bg-[#131313]"
                    : isToday
                    ? "border-dashed border-white/[0.12] bg-transparent"
                    : "border-white/[0.04] bg-transparent"
                }`}
              >
                {hasSession ? (
                  <span className="text-base leading-none">
                    {ACTIVITY_META[topActivity.type].icon}
                  </span>
                ) : isToday ? (
                  <span className="size-1.5 rounded-full bg-white/[0.2]" />
                ) : (
                  <span className="size-1 rounded-full bg-white/[0.08]" />
                )}
              </div>

              {/* Day label */}
              <span className={`text-[10px] font-medium ${isToday ? "text-zinc-300" : "text-zinc-600"}`}>
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Weekly minutes */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <span className="font-semibold text-zinc-300 tabular-nums">{totalMins}m</span>
        <span>trained this week</span>
      </div>
    </div>
  );
}

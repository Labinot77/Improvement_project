"use client";

import type { Activity } from "@/types/fitness";
import { byDate, dateLabel, dayKey, lastDays } from "@/app/activity/data/main";
import { useActivityModals } from "./UseActivityModal";

const WEEKS = 20;
const opacity = (lvl: number) => [0.25, 0.4, 0.6, 0.8, 1][lvl - 1] ?? 0.6;

// 20-week grid, shaded by the day's highest intensity
export function Heatmap({ activities, color }: { activities: Activity[]; color: string }) {
  const { openDay } = useActivityModals();
  const days = lastDays(WEEKS * 7);
  const map = byDate(activities);
  const today = dayKey();
  const weeks = Array.from({ length: WEEKS }, (_, w) => days.slice(w * 7, w * 7 + 7));

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex shrink-0 flex-col gap-1.5">
            {week.map((date) => {
              const sessions = map[date] ?? [];
              const max = Math.max(0, ...sessions.map((s) => s.intensity));
              return (
                <button
                  key={date}
                  type="button"
                  title={`${dateLabel(date)} · ${sessions.length} ${sessions.length === 1 ? "session" : "sessions"}`}
                  aria-label={`${dateLabel(date)}, ${sessions.length} sessions`}
                  onClick={() => openDay(date, sessions)}
                  className={`size-4 rounded-[5px] transition hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 ${
                    date === today ? "ring-1 ring-white/40" : ""
                  }`}
                  style={{
                    backgroundColor: sessions.length ? color : "rgba(255,255,255,0.05)",
                    opacity: sessions.length ? opacity(max) : 1,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
        <span>Easy</span>
        {[1, 2, 3, 4, 5].map((l) => (
          <span key={l} className="size-3.5 rounded-[4px]" style={{ backgroundColor: color, opacity: opacity(l) }} />
        ))}
        <span>Max</span>
      </div>
    </div>
  );
}

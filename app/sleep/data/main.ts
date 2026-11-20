import type { SleepEntry } from "@/types/sleep";
import { TARGET_HOURS } from "@/constants/sleep/main";
import { dayKey, lastDays } from "@/app/activity/data/main";

export { dayKey, lastDays, dateLabel } from "@/app/activity/data/main";
export { formatDuration } from "@/lib/sleep/calc";

// Status vs target: label + colour
export function sleepStatus(hours: number) {
  if (hours < TARGET_HOURS - 1) return { label: "Below target", color: "#f87171" };
  if (hours > TARGET_HOURS + 1) return { label: "Above target", color: "#fb923c" };
  return { label: "On target", color: "#4ade80" };
}

// Averages, streak and 30-day consistency
export function getStats(list: SleepEntry[]) {
  const dates = new Set(list.map((e) => e.date));

  // Streak counts back from today (or yesterday if today is empty)
  let streak = 0;
  for (let i = dates.has(dayKey()) ? 0 : -1; dates.has(dayKey(i)); i--) streak++;

  return {
    avg: list.length ? list.reduce((s, e) => s + e.durationHours, 0) / list.length : 0,
    best: Math.max(0, ...list.map((e) => e.durationHours)),
    streak,
    consistency: Math.round((lastDays(30).filter((d) => dates.has(d)).length / 30) * 100),
  };
}

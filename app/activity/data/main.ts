import type { Activity, ActivityType } from "@/types/fitness";
import { ALL_ACTIVITY_TYPES } from "@/constants/fitness";

export type Filter = "All activities" | ActivityType;
export const FILTERS: Filter[] = ["All activities", ...ALL_ACTIVITY_TYPES];

// "YYYY-MM-DD" for today + offset days
export function dayKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
}

// Last n days, oldest first
export const lastDays = (n: number) => Array.from({ length: n }, (_, i) => dayKey(i - (n - 1)));

// Minutes -> "45m" / "1h 30m"
export function formatMinutes(m: number) {
  if (m < 60) return `${m}m`;
  return m % 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m / 60}h`;
}

// Date -> "Mon, Nov 20" (or custom options)
export const dateLabel = (date: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", opts);

// Group sessions by date
export function byDate(list: Activity[]) {
  const map: Record<string, Activity[]> = {};
  for (const a of list) (map[a.date] ??= []).push(a);
  return map;
}

// Totals, weekly count and day streak
export function getStats(list: Activity[]) {
  const totalMins = list.reduce((s, a) => s + a.durationMins, 0);
  const week = new Set(lastDays(7));
  const thisWeek = list.filter((a) => week.has(a.date));
  const dates = new Set(list.map((a) => a.date));

  // Streak counts back from today (or yesterday if today is empty)
  let streak = 0;
  for (let i = dates.has(dayKey()) ? 0 : -1; dates.has(dayKey(i)); i--) streak++;

  return {
    total: list.length,
    totalMins,
    avg: list.length ? Math.round(totalMins / list.length) : 0,
    weekCount: thisWeek.length,
    weekMins: thisWeek.reduce((s, a) => s + a.durationMins, 0),
    streak,
  };
}

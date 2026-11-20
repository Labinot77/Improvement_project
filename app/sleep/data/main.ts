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

// Timeline spans 18:00 → 14:00 next day
const AXIS_START = 18 * 60;
const AXIS_SPAN = 20 * 60;
export const AXIS_TICKS = ["18:00", "21:00", "00:00", "03:00", "06:00", "09:00", "12:00"];

// "HH:MM" -> minutes after 18:00
export function offset(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h * 60 + m - AXIS_START + 1440) % 1440;
}

// "HH:MM" -> % position on the timeline
export const axisPct = (time: string) => Math.min(100, (offset(time) / AXIS_SPAN) * 100);

// Minutes after 18:00 -> "HH:MM"
export function fromOffset(mins: number) {
  const t = (Math.round(mins) + AXIS_START) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

// Average bed/wake times and bedtime spread (std dev, minutes)
export function getRhythm(list: SleepEntry[]) {
  if (!list.length) return null;
  const beds = list.map((e) => offset(e.bedtime));
  const wakes = list.map((e) => offset(e.wakeTime));
  const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
  const bedMean = mean(beds);
  return {
    bedtime: fromOffset(bedMean),
    wakeTime: fromOffset(mean(wakes)),
    spread: Math.round(Math.sqrt(mean(beds.map((b) => (b - bedMean) ** 2)))),
  };
}

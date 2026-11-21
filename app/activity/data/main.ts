import { addDays, startOfWeek, subDays, subWeeks } from "date-fns";
import { formatDate } from "@/lib/mics/date";
import { ALL_ACTIVITY_TYPES, LOAD_ZONES, WEEKLY_GOAL } from "@/constants/fitness";
import type { Activity, ActivityType } from "@/types/fitness";

// Session load: minutes x intensity (session-RPE style)
export const sessionLoad = (a: Activity) => a.durationMins * a.intensity;

// Monday of the week containing `d`
const weekStart = (d: Date) => startOfWeek(d, { weekStartsOn: 1 });

// Sum a field over sessions on/after a date key (and before `until`)
function sumBetween(list: Activity[], from: string, until: string, f: (a: Activity) => number) {
  return list.filter((a) => a.date >= from && a.date < until).reduce((s, a) => s + f(a), 0);
}

// Acute (7d) vs chronic (28d weekly avg) training load
export function loadRatio(list: Activity[], now = new Date()) {
  const tomorrow = formatDate(addDays(now, 1));
  const acute = sumBetween(list, formatDate(subDays(now, 6)), tomorrow, sessionLoad);
  const chronic = sumBetween(list, formatDate(subDays(now, 27)), tomorrow, sessionLoad) / 4;
  const ratio = chronic ? Math.round((acute / chronic) * 100) / 100 : null;
  const zone = ratio === null ? null : LOAD_ZONES.find((z) => ratio < z.max)!;
  return { acute, chronic: Math.round(chronic), ratio, zone };
}

// Minutes per type for each of the last `weeks` weeks (oldest first)
export function weeklyVolume(list: Activity[], weeks: number, now = new Date()) {
  return Array.from({ length: weeks }, (_, i) => {
    const start = weekStart(subWeeks(now, weeks - 1 - i));
    const from = formatDate(start);
    const until = formatDate(addDays(start, 7));
    const row: Record<string, number | string> = {
      week: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    for (const t of ALL_ACTIVITY_TYPES) row[t] = 0;
    for (const a of list) if (a.date >= from && a.date < until) (row[a.type] as number) += a.durationMins;
    return row;
  });
}

// Minutes per type over the last 30 days, biggest first
export function typeMix(list: Activity[], now = new Date()) {
  const from = formatDate(subDays(now, 29));
  const map = new Map<ActivityType, number>();
  for (const a of list) if (a.date >= from) map.set(a.type, (map.get(a.type) ?? 0) + a.durationMins);
  return [...map.entries()].map(([type, mins]) => ({ type, mins })).sort((a, b) => b.mins - a.mins);
}

// Headline numbers for the tile row
export function activityKpis(list: Activity[], now = new Date()) {
  const thisWeek = formatDate(weekStart(now));
  const lastWeek = formatDate(weekStart(subWeeks(now, 1)));
  const tomorrow = formatDate(addDays(now, 1));

  const sessionsThisWeek = list.filter((a) => a.date >= thisWeek).length;
  const minsThisWeek = sumBetween(list, thisWeek, tomorrow, (a) => a.durationMins);
  const minsLastWeek = sumBetween(list, lastWeek, thisWeek, (a) => a.durationMins);

  // Consecutive past weeks that hit the goal (+ this week once it does)
  let goalStreak = 0;
  for (let w = 1; w < 52; w++) {
    const from = formatDate(weekStart(subWeeks(now, w)));
    const until = formatDate(weekStart(subWeeks(now, w - 1)));
    if (list.filter((a) => a.date >= from && a.date < until).length < WEEKLY_GOAL) break;
    goalStreak++;
  }
  if (sessionsThisWeek >= WEEKLY_GOAL) goalStreak++;

  const last30 = list.filter((a) => a.date >= formatDate(subDays(now, 29)));
  const avgSession = last30.length
    ? Math.round(last30.reduce((s, a) => s + a.durationMins, 0) / last30.length)
    : 0;

  return { sessionsThisWeek, minsThisWeek, minsLastWeek, goalStreak, avgSession };
}

// "1h 05m" / "45m"
export function formatMins(m: number) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

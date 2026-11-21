import { subDays } from "date-fns";
import { formatDate } from "@/lib/mics/date";
import { RECENT_NIGHTS, TARGET_HOURS, WINDOW_START_HOUR } from "@/constants/sleep/main";
import type { SleepEntry } from "@/types/sleep";

// Hours between bedtime and wake time (crosses midnight)
export function calcDuration(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);
  let mins = wh * 60 + wm - (bh * 60 + bm);
  if (mins <= 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

// 7.5 -> "7h 30m"
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

// "23:30" -> hours after the chart start (18:00 -> 0)
export function clockOffset(time: string) {
  const [h, m] = time.split(":").map(Number);
  return (h + m / 60 - WINDOW_START_HOUR + 24) % 24;
}

// Hours after chart start -> "23:30"
export function offsetToClock(offset: number) {
  const total = Math.round(((offset + WINDOW_START_HOUR) % 24) * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

// Standard deviation in minutes
function sdMins(hours: number[]) {
  if (hours.length < 2) return 0;
  const mean = hours.reduce((s, h) => s + h, 0) / hours.length;
  const v = hours.reduce((s, h) => s + (h - mean) ** 2, 0) / hours.length;
  return Math.sqrt(v) * 60;
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

// Bed/wake bars for the window chart, oldest first
export function sleepWindows(entries: SleepEntry[]) {
  return entries
    .slice(0, RECENT_NIGHTS)
    .reverse()
    .map((e) => {
      const bed = clockOffset(e.bedtime);
      let wake = clockOffset(e.wakeTime);
      if (wake <= bed) wake += 24;
      return {
        date: e.date,
        label: new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
        window: [bed, wake] as [number, number],
        hours: e.durationHours,
        bedtime: e.bedtime,
        wakeTime: e.wakeTime,
      };
    });
}

// Duration per night with a 7-night rolling average, oldest first
export function durationTrend(entries: SleepEntry[], nights = 30) {
  const asc = entries.slice(0, nights).reverse();
  return asc.map((e, i) => ({
    date: e.date,
    label: new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    hours: e.durationHours,
    avg: Math.round(avg(asc.slice(Math.max(0, i - 6), i + 1).map((x) => x.durationHours)) * 10) / 10,
  }));
}

// Headline numbers: debt, regularity, averages
export function sleepStats(entries: SleepEntry[], now = new Date()) {
  const weekFrom = formatDate(subDays(now, 6));
  const week = entries.filter((e) => e.date >= weekFrom);
  const recent = entries.slice(0, RECENT_NIGHTS);

  // Debt: shortfall vs target across logged nights this week (surplus pays some back)
  const debt = Math.max(0, week.reduce((s, e) => s + (TARGET_HOURS - e.durationHours), 0));

  // Regularity: steadier bed/wake times score higher (45 min spread ~ 50)
  const bedOffsets = recent.map((e) => clockOffset(e.bedtime));
  const wakeOffsets = recent.map((e) => {
    const w = clockOffset(e.wakeTime);
    return w <= clockOffset(e.bedtime) ? w + 24 : w;
  });
  const spread = (sdMins(bedOffsets) + sdMins(wakeOffsets)) / 2;
  const regularity = recent.length >= 3 ? Math.round(Math.max(0, Math.min(100, 100 - spread / 0.9))) : null;

  return {
    lastNight: entries[0] ?? null,
    weekAvg: Math.round(avg(week.map((e) => e.durationHours)) * 10) / 10,
    nightsThisWeek: week.length,
    debt: Math.round(debt * 10) / 10,
    regularity,
    spreadMins: Math.round(spread),
    avgBedtime: recent.length ? offsetToClock(avg(bedOffsets)) : null,
    avgWake: recent.length ? offsetToClock(avg(wakeOffsets)) : null,
    onTarget: recent.filter((e) => e.durationHours >= TARGET_HOURS).length,
    recentCount: recent.length,
  };
}

// Average hours per weekday (Mon first), for spotting weekend drift
export function weekdayAverages(entries: SleepEntry[]) {
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = names.map(() => [] as number[]);
  for (const e of entries) buckets[(new Date(`${e.date}T12:00:00`).getDay() + 6) % 7].push(e.durationHours);
  return names.map((label, i) => ({
    label,
    hours: buckets[i].length ? Math.round(avg(buckets[i]) * 10) / 10 : 0,
    nights: buckets[i].length,
  }));
}

// Last `weeks` weeks of nights as a Monday-first calendar grid
export function nightCalendar(entries: SleepEntry[], weeks = 5, now = new Date()) {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const start = subDays(now, ((now.getDay() + 6) % 7) + (weeks - 1) * 7);
  return Array.from({ length: weeks * 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const date = formatDate(d);
    return { date, day: d.getDate(), entry: byDate.get(date), future: date > formatDate(now) };
  });
}

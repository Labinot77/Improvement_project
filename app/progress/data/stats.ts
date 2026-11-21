import { addDays, startOfWeek, subDays } from "date-fns";
import { formatDate } from "@/lib/mics/date";
import {
  HEATMAP_WEEKS,
  MOMENTUM_ALPHA,
  MOMENTUM_DECAY,
} from "@/constants/progress/template";
import type {
  CategoryStat,
  DayStat,
  DayStatTask,
  ProgressStats,
  WeekdayStat,
} from "@/types/Progress/progress";

export type TasksByDate = Record<string, DayStatTask[]>;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// "Wed" -> "Wednesdays"
const plural = (label: string) => `${WEEKDAY_NAMES[WEEKDAYS.indexOf(label)]}s`;

// Percentage helper
const pct = (done: number, total: number) =>
  total ? Math.round((done / total) * 100) : 0;

// Date key -> local Date (noon avoids DST edges)
const toDate = (key: string) => new Date(`${key}T12:00:00`);

// One day's totals
function dayStat(date: string, byDate: TasksByDate): DayStat {
  const tasks = byDate[date] ?? [];
  return {
    date,
    total: tasks.length,
    done: tasks.filter((t) => t.completed).length,
    tasks,
  };
}

// Consecutive day keys, oldest first
function dateRange(from: Date, to: Date): string[] {
  const keys: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) keys.push(formatDate(d));
  return keys;
}

// Every task done (and at least one)
const isPerfect = (d: DayStat) => d.total > 0 && d.done === d.total;

// Sum done/total over days
function sum(days: DayStat[]) {
  return days.reduce(
    (acc, d) => ({ done: acc.done + d.done, total: acc.total + d.total }),
    { done: 0, total: 0 },
  );
}

// Current streak: perfect days back from yesterday, plus today once finished
function currentStreak(series: DayStat[]): number {
  const past = series.slice(0, -1);
  let streak = 0;
  for (let i = past.length - 1; i >= 0 && isPerfect(past[i]); i--) streak++;
  return streak + (isPerfect(series[series.length - 1]) ? 1 : 0);
}

// Longest run of perfect days
function bestStreak(series: DayStat[]): number {
  let best = 0;
  let run = 0;
  for (const d of series) {
    run = isPerfect(d) ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

// Momentum: exponentially smoothed completion rate.
// Empty days decay it; today only counts once it helps.
function momentum(series: DayStat[]) {
  let m: number | null = null;
  let weekAgo = 0;
  series.forEach((d, i) => {
    const isToday = i === series.length - 1;
    if (d.total === 0) {
      if (m !== null && !isToday) m *= MOMENTUM_DECAY;
    } else {
      const r = pct(d.done, d.total);
      const next: number = m === null ? r : MOMENTUM_ALPHA * r + (1 - MOMENTUM_ALPHA) * m;
      if (!isToday || next > (m ?? 0)) m = next;
    }
    if (i === series.length - 8) weekAgo = m ?? 0;
  });
  const now = Math.round(m ?? 0);
  return { now, delta: now - Math.round(weekAgo) };
}

// Done/total per category, busiest first
function categories(days: DayStat[]): CategoryStat[] {
  const map = new Map<string, CategoryStat>();
  for (const t of days.flatMap((d) => d.tasks)) {
    const c = map.get(t.category) ?? { name: t.category, done: 0, total: 0 };
    c.total++;
    if (t.completed) c.done++;
    map.set(t.category, c);
  }
  return [...map.values()].sort((a, b) => b.total - a.total);
}

// Average completion per weekday (Mon first), past days only
function weekdays(days: DayStat[]): WeekdayStat[] {
  const buckets = WEEKDAYS.map(() => ({ sum: 0, days: 0 }));
  for (const d of days) {
    if (d.total === 0) continue;
    const idx = (toDate(d.date).getDay() + 6) % 7;
    buckets[idx].sum += pct(d.done, d.total);
    buckets[idx].days++;
  }
  return buckets.map((b, i) => ({
    label: WEEKDAYS[i],
    rate: b.days ? Math.round(b.sum / b.days) : 0,
    days: b.days,
  }));
}

// Plain-language takeaways from the numbers
function buildInsights(s: Omit<ProgressStats, "insights" | "days">, hasPrevWeek: boolean): string[] {
  const out: string[] = [];

  if (hasPrevWeek) {
    const diff = s.weekRate - s.prevWeekRate;
    if (diff >= 5) out.push(`Completion is up ${diff} points on last week. Keep it rolling.`);
    else if (diff <= -5) out.push(`Completion dipped ${-diff} points from last week. Try fewer, smaller tasks.`);
    else out.push(`Steady week: you're holding at ${s.weekRate}% completion.`);
  }

  const active = s.weekdays.filter((w) => w.days >= 2);
  if (active.length >= 2) {
    const best = active.reduce((a, b) => (b.rate > a.rate ? b : a));
    const worst = active.reduce((a, b) => (b.rate < a.rate ? b : a));
    out.push(`${plural(best.label)} are your strongest day at ${best.rate}%.`);
    if (best.rate - worst.rate >= 15)
      out.push(`${plural(worst.label)} slip to ${worst.rate}%. Plan lighter there.`);
  }

  const cats = s.categories.filter((c) => c.total >= 3);
  if (cats.length >= 2) {
    const weakest = cats.reduce((a, b) => (pct(b.done, b.total) < pct(a.done, a.total) ? b : a));
    out.push(`${weakest.name} tasks get left behind most (${pct(weakest.done, weakest.total)}% done).`);
  }

  if (s.streak > 0 && s.streak >= s.bestStreak) out.push("You're on your best streak ever.");
  else if (s.bestStreak > s.streak)
    out.push(`${s.bestStreak - s.streak + 1} perfect days in a row beats your best streak of ${s.bestStreak}.`);

  return out.length ? out : ["Complete a few tasks to unlock insights."];
}

// Build every Progress page stat from tasks grouped by date
export function computeProgressStats(byDate: TasksByDate): ProgressStats {
  const now = new Date();
  now.setHours(12, 0, 0, 0);

  // Full year history, ends today
  const firstKey = Object.keys(byDate).sort()[0];
  const historyStart = firstKey ? toDate(firstKey) : now;
  const series = dateRange(historyStart < now ? historyStart : now, now).map((k) => dayStat(k, byDate));

  // Fixed windows (padded so short histories still work)
  const lastN = (n: number) =>
    dateRange(subDays(now, n - 1), now).map((k) => dayStat(k, byDate));
  const last30 = lastN(30);
  const last14 = lastN(14);
  const week = sum(last14.slice(7));
  const prevWeek = sum(last14.slice(0, 7));
  const m = momentum(lastN(60));

  const heatmapStart = startOfWeek(subDays(now, (HEATMAP_WEEKS - 1) * 7), { weekStartsOn: 1 });

  const base = {
    streak: currentStreak(series),
    bestStreak: bestStreak(series),
    weekRate: pct(week.done, week.total),
    prevWeekRate: pct(prevWeek.done, prevWeek.total),
    momentum: m.now,
    momentumDelta: m.delta,
    completed30: sum(last30).done,
    categories: categories(last30),
    weekdays: weekdays(lastN(85).slice(0, -1)),
  };

  return {
    ...base,
    days: dateRange(heatmapStart, now).map((k) => dayStat(k, byDate)),
    insights: buildInsights(base, prevWeek.total > 0),
  };
}

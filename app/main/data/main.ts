import { subDays } from "date-fns";
import { formatDate } from "@/lib/mics/date";
import { TARGET_HOURS } from "@/constants/sleep/main";
import {
  ACTIVE_MINS,
  CONNECTION_DAYS,
  GOOD_NIGHT_HOURS,
  MIN_SAMPLE,
  PILLARS,
  SCORE_DAYS,
  type PillarKey,
} from "@/constants/main/overview";
import type { DayStat } from "@/types/Progress/progress";
import type { Activity } from "@/types/fitness";
import type { SleepEntry } from "@/types/sleep";

// One day across every area (null = nothing logged)
export type DayFacts = {
  date: string;
  tasksDone: number;
  tasksTotal: number;
  sleepHours: number | null;
  activeMins: number;
  sessions: string[];
  lessons: number;
  parts: Record<PillarKey, number | null>; // 0..1 each
  score: number | null; // 0..100
};

type Sources = {
  taskDays: DayStat[];
  activities: Activity[];
  sleep: SleepEntry[];
  lessonDates: string[];
};

const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

// Weighted score over the areas that have data that day
function scoreOf(parts: DayFacts["parts"]) {
  let sum = 0;
  let weight = 0;
  for (const k of Object.keys(parts) as PillarKey[]) {
    const v = parts[k];
    if (v === null) continue;
    sum += v * PILLARS[k].weight;
    weight += PILLARS[k].weight;
  }
  return weight ? Math.round((sum / weight) * 100) : null;
}

// Merge all sources into one row per day, oldest first, ending today
export function buildDays(src: Sources, days: number, now = new Date()): DayFacts[] {
  const tasks = new Map(src.taskDays.map((d) => [d.date, d]));
  const sleep = new Map(src.sleep.map((e) => [e.date, e.durationHours]));

  return Array.from({ length: days }, (_, i) => {
    const date = formatDate(subDays(now, days - 1 - i));
    const t = tasks.get(date);
    const acts = src.activities.filter((a) => a.date === date);
    const activeMins = acts.reduce((s, a) => s + a.durationMins, 0);
    const lessons = src.lessonDates.filter((d) => d === date).length;
    const sleepHours = sleep.get(date) ?? null;
    const anyLogged = !!t?.total || sleepHours !== null || activeMins > 0 || lessons > 0;

    // Activity and lessons only count on days you logged something at all
    const parts = {
      tasks: t?.total ? t.done / t.total : null,
      sleep: sleepHours === null ? null : Math.min(1, sleepHours / TARGET_HOURS),
      move: anyLogged ? Math.min(1, activeMins / ACTIVE_MINS) : null,
      learn: anyLogged ? Math.min(1, lessons) : null,
    };

    return {
      date,
      tasksDone: t?.done ?? 0,
      tasksTotal: t?.total ?? 0,
      sleepHours,
      activeMins,
      sessions: acts.map((a) => a.type),
      lessons,
      parts,
      score: scoreOf(parts),
    };
  });
}

export type Connection = {
  title: string;
  a: { label: string; value: number };
  b: { label: string; value: number };
  unit: "%" | "h";
  verdict: string;
};

// Compare a metric on two groups of days; null if either side is too small
function compare(
  rows: DayFacts[],
  split: (d: DayFacts, i: number) => boolean | null,
  metric: (d: DayFacts, i: number) => number | null,
) {
  const yes: number[] = [];
  const no: number[] = [];
  rows.forEach((d, i) => {
    const s = split(d, i);
    const m = metric(d, i);
    if (s === null || m === null) return;
    (s ? yes : no).push(m);
  });
  if (yes.length < MIN_SAMPLE || no.length < MIN_SAMPLE) return null;
  return { yes: avg(yes), no: avg(no) };
}

// Plain verdict for a difference
function verdict(diff: number, unit: "%" | "h", what: string, topic = what) {
  const size = unit === "%" ? Math.abs(Math.round(diff)) : Math.abs(Math.round(diff * 10) / 10);
  if (size < (unit === "%" ? 5 : 0.3)) return `No real difference in ${topic}.`;
  return `${diff > 0 ? "+" : "−"}${size}${unit === "%" ? " points" : "h"} ${what}.`;
}

// Cross-area patterns over the last CONNECTION_DAYS days
export function findConnections(src: Sources, now = new Date()): Connection[] {
  const rows = buildDays(src, CONNECTION_DAYS, now);
  const out: Connection[] = [];
  const taskRate = (d: DayFacts) => (d.tasksTotal ? (d.tasksDone / d.tasksTotal) * 100 : null);

  // Sleep -> next day's tasks (night logged on the same date)
  const s = compare(rows, (d) => (d.sleepHours === null ? null : d.sleepHours >= GOOD_NIGHT_HOURS), taskRate);
  if (s)
    out.push({
      title: "Sleep → To-dos",
      a: { label: `${GOOD_NIGHT_HOURS}h+ nights`, value: s.yes },
      b: { label: "Shorter nights", value: s.no },
      unit: "%",
      verdict: verdict(s.yes - s.no, "%", `task completion after a good night`),
    });

  // Training day -> that night's sleep (logged the next date)
  const t = compare(
    rows,
    (d, i) => (i === rows.length - 1 ? null : d.activeMins > 0),
    (_, i) => rows[i + 1]?.sleepHours ?? null,
  );
  if (t)
    out.push({
      title: "Activity → Sleep",
      a: { label: "After training", value: t.yes },
      b: { label: "After rest days", value: t.no },
      unit: "h",
      verdict: verdict(t.yes - t.no, "h", "of sleep after training", "sleep after training"),
    });

  // Training day -> tasks done that day
  const m = compare(rows, (d) => d.activeMins > 0, taskRate);
  if (m)
    out.push({
      title: "Activity → To-dos",
      a: { label: "Training days", value: m.yes },
      b: { label: "Rest days", value: m.no },
      unit: "%",
      verdict: verdict(m.yes - m.no, "%", "task completion on training days"),
    });

  return out;
}

// Score series for the chart plus averages
export function scoreSummary(src: Sources, now = new Date()) {
  const days = buildDays(src, SCORE_DAYS, now);
  const scored = days.filter((d) => d.score !== null).map((d) => d.score as number);
  const week = days.slice(-7).filter((d) => d.score !== null).map((d) => d.score as number);
  const prev = days.slice(-14, -7).filter((d) => d.score !== null).map((d) => d.score as number);
  const best = days.reduce<DayFacts | null>((b, d) => (d.score !== null && d.score > (b?.score ?? -1) ? d : b), null);

  return {
    days,
    today: days[days.length - 1],
    avg: scored.length ? Math.round(avg(scored)) : null,
    weekAvg: week.length ? Math.round(avg(week)) : null,
    prevWeekAvg: prev.length ? Math.round(avg(prev)) : null,
    best,
  };
}

// Per-area 14-day sparkline values and headline
export function pillarCards(days: DayFacts[]) {
  const last14 = days.slice(-14);
  const week = days.slice(-7);
  const slept = week.filter((d) => d.sleepHours !== null).map((d) => d.sleepHours as number);
  const taskTotals = week.reduce((s, d) => ({ done: s.done + d.tasksDone, total: s.total + d.tasksTotal }), { done: 0, total: 0 });

  return {
    tasks: {
      value: taskTotals.total ? `${Math.round((taskTotals.done / taskTotals.total) * 100)}%` : "—",
      foot: `${taskTotals.done} of ${taskTotals.total} done this week`,
      spark: last14.map((d) => (d.tasksTotal ? d.tasksDone / d.tasksTotal : 0)),
    },
    sleep: {
      value: slept.length ? `${(Math.round(avg(slept) * 10) / 10).toFixed(1)}h` : "—",
      foot: `avg over ${slept.length} nights this week`,
      spark: last14.map((d) => d.sleepHours ?? 0),
    },
    move: {
      value: `${week.reduce((s, d) => s + d.activeMins, 0)}m`,
      foot: `${week.filter((d) => d.activeMins > 0).length} active days this week`,
      spark: last14.map((d) => d.activeMins),
    },
    learn: {
      value: String(week.reduce((s, d) => s + d.lessons, 0)),
      foot: "lessons logged this week",
      spark: last14.map((d) => d.lessons),
    },
  } satisfies Record<PillarKey, { value: string; foot: string; spark: number[] }>;
}

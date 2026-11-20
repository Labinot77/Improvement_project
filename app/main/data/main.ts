import type { DashRaw } from "@/app/main/store/main";
import { ACTIVITY_META, WEEKLY_GOAL } from "@/constants/fitness";
import { TARGET_HOURS } from "@/constants/sleep/main";
import { dateLabel, dayKey, lastDays } from "@/app/activity/data/main";
import type { ActivityType } from "@/types/fitness";
import type { Mood } from "@/types/journal";

export const LESSON_GOAL = 5; // per week

// Area colours shared by every chart
export const AREA = {
  tasks: "#7dd3fc",
  activity: "#fda4af",
  sleep: "#a5b4fc",
  lessons: "#6ee7b7",
  journal: "#fcd34d",
} as const;

export const MOOD_SCORE: Record<Mood, number> = { great: 5, good: 4, okay: 3, low: 2, rough: 1 };

const pct = (v: number, goal: number) => Math.max(0, Math.min(100, Math.round((v / goal) * 100)));
const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

// Count values, sorted high to low
function tally<T extends string>(items: { key: T; n: number }[]) {
  const m = new Map<T, number>();
  for (const { key, n } of items) m.set(key, (m.get(key) ?? 0) + n);
  return [...m].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

// Turn raw rows into everything the dashboard draws
export function summarize(raw: DashRaw) {
  const today = dayKey();
  const week = new Set(lastDays(7));
  const inWeek = <T extends { date: string }>(xs: T[]) => xs.filter((x) => week.has(x.date));

  const weekTasks = inWeek(raw.tasks);
  const weekActs = inWeek(raw.activities);
  const weekSleep = inWeek(raw.sleep);
  const weekLessons = inWeek(raw.lessons);
  const weekMoods = inWeek(raw.moods);
  const sleepAvg = weekSleep.length ? sum(weekSleep.map((s) => s.hours)) / weekSleep.length : 0;

  // Weekly balance per area (0–100)
  const balance = [
    { key: "tasks", name: "To-dos", value: weekTasks.length ? pct(weekTasks.filter((t) => t.completed).length, weekTasks.length) : 0, fill: AREA.tasks },
    { key: "activity", name: "Activity", value: pct(weekActs.length, WEEKLY_GOAL), fill: AREA.activity },
    { key: "sleep", name: "Sleep", value: pct(sleepAvg, TARGET_HOURS), fill: AREA.sleep },
    { key: "lessons", name: "Lessons", value: pct(weekLessons.length, LESSON_GOAL), fill: AREA.lessons },
    { key: "journal", name: "Journal", value: pct(new Set(weekMoods.map((m) => m.date)).size, 7), fill: AREA.journal },
  ];
  const score = Math.round(sum(balance.map((b) => b.value)) / balance.length);

  // 14-day body & rest series
  const sleepBy = new Map(raw.sleep.map((s) => [s.date, s.hours]));
  const moodBy = new Map(raw.moods.map((m) => [m.date, m.mood]));
  const bodyRest = lastDays(14).map((d) => ({
    day: dateLabel(d, { month: "short", day: "numeric" }),
    minutes: sum(raw.activities.filter((a) => a.date === d).map((a) => a.durationMins)),
    sleep: sleepBy.get(d) ?? null,
  }));

  // 7-day task completion
  const taskDays = lastDays(7).map((d) => {
    const ts = raw.tasks.filter((t) => t.date === d);
    const done = ts.filter((t) => t.completed).length;
    return { day: dateLabel(d, { weekday: "short" }), done, open: ts.length - done };
  });

  // 14-day mood strip
  const moods = lastDays(14).map((d) => ({ date: d, mood: moodBy.get(d) ?? null }));
  const scored = raw.moods.filter((m) => week.has(m.date)).map((m) => MOOD_SCORE[m.mood]);

  return {
    score,
    balance,
    bodyRest,
    taskDays,
    moods,
    moodAvg: scored.length ? sum(scored) / scored.length : null,
    training: tally(raw.activities.map((a) => ({ key: a.type as ActivityType, n: a.durationMins })))
      .map((t) => ({ ...t, fill: ACTIVITY_META[t.name]?.color ?? "#71717a" })),
    learning: tally(raw.lessons.map((l) => ({ key: l.category, n: 1 }))).slice(0, 5),
    todayTasks: raw.tasks.filter((t) => t.date === today).sort((a, b) => Number(a.completed) - Number(b.completed)),
    meals: raw.meals,
    kpis: {
      weekMinutes: sum(weekActs.map((a) => a.durationMins)),
      sleepAvg,
      lessons: weekLessons.length,
      tasksDone: weekTasks.filter((t) => t.completed).length,
    },
  };
}

export type Summary = ReturnType<typeof summarize>;

import { addDays, startOfWeek, subDays, subWeeks } from "date-fns";
import { formatDate } from "@/lib/mics/date";
import { CARDIO_TYPES, LOAD_ZONES, MUSCLES, WEEKLY_GOAL } from "@/constants/fitness";
import type { Activity, CardioType, WorkoutSet, WorkoutTemplate } from "@/types/fitness";

// Session load: minutes x intensity (session-RPE style)
export const sessionLoad = (a: Activity) => a.durationMins * a.intensity;

// Monday of the week containing `d`
const weekStart = (d: Date) => startOfWeek(d, { weekStartsOn: 1 });

// Noon Date for a key (avoids DST edges)
const toDate = (key: string) => new Date(`${key}T12:00:00`);

// "Nov 21"
const short = (key: string) => toDate(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });

// Estimated one-rep max (Epley), rounded to 0.5 kg
export function e1rm(weightKg: number, reps: number) {
  const v = reps === 1 ? weightKg : weightKg * (1 + reps / 30);
  return Math.round(v * 2) / 2;
}

// Muscle group for an exercise name (whole-word match), or "Other"
export function muscleOf(exercise: string) {
  const name = exercise.toLowerCase();
  const hit = MUSCLES.find((m) =>
    m.keywords.some((k) => new RegExp(`(^|[^a-z])${k.replace(/[-]/g, "\\-")}s?([^a-z]|$)`).test(name)),
  );
  return hit?.name ?? "Other";
}

// Sum a field over sessions in [from, until)
function sumBetween(list: Activity[], from: string, until: string, f: (a: Activity) => number) {
  return list.filter((a) => a.date >= from && a.date < until).reduce((s, a) => s + f(a), 0);
}

// Kilos moved in a session (reps x weight)
export const volumeOf = (a: Activity) => a.sets.reduce((s, x) => s + x.reps * x.weightKg, 0);

// Acute (7d) vs chronic (28d weekly avg) training load
export function loadRatio(list: Activity[], now = new Date()) {
  const tomorrow = formatDate(addDays(now, 1));
  const acute = sumBetween(list, formatDate(subDays(now, 6)), tomorrow, sessionLoad);
  const chronic = sumBetween(list, formatDate(subDays(now, 27)), tomorrow, sessionLoad) / 4;
  const ratio = chronic ? Math.round((acute / chronic) * 100) / 100 : null;
  const zone = ratio === null ? null : LOAD_ZONES.find((z) => ratio < z.max)!;
  return { acute, chronic: Math.round(chronic), ratio, zone };
}

// Exercises by how often they were trained
export function exerciseNames(list: Activity[]) {
  const count = new Map<string, number>();
  for (const a of list) for (const ex of new Set(a.sets.map((s) => s.exercise))) count.set(ex, (count.get(ex) ?? 0) + 1);
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}

// Best set per session for one exercise, oldest first
export function exerciseHistory(list: Activity[], exercise: string) {
  return list
    .filter((a) => a.sets.some((s) => s.exercise === exercise))
    .map((a) => {
      const sets = a.sets.filter((s) => s.exercise === exercise);
      const top = sets.reduce((b, s) => (e1rm(s.weightKg, s.reps) > e1rm(b.weightKg, b.reps) ? s : b));
      return {
        date: a.date,
        label: short(a.date),
        e1rm: e1rm(top.weightKg, top.reps),
        topWeight: top.weightKg,
        topReps: top.reps,
        volume: sets.reduce((s, x) => s + x.reps * x.weightKg, 0),
      };
    })
    .reverse();
}

// Best estimated 1RM per exercise, newest records first
export function personalRecords(list: Activity[], now = new Date()) {
  const best = new Map<string, { exercise: string; e1rm: number; weightKg: number; reps: number; date: string }>();
  for (const a of [...list].reverse()) {
    for (const s of a.sets) {
      const v = e1rm(s.weightKg, s.reps);
      const prev = best.get(s.exercise);
      if (!prev || v > prev.e1rm) best.set(s.exercise, { exercise: s.exercise, e1rm: v, weightKg: s.weightKg, reps: s.reps, date: a.date });
    }
  }
  const recent = formatDate(subDays(now, 13));
  return [...best.values()]
    .map((r) => ({ ...r, isNew: r.date >= recent }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Kilos lifted, sets and cardio minutes per week (oldest first)
export function weeklyStrength(list: Activity[], weeks: number, now = new Date()) {
  return Array.from({ length: weeks }, (_, i) => {
    const start = weekStart(subWeeks(now, weeks - 1 - i));
    const from = formatDate(start);
    const until = formatDate(addDays(start, 7));
    const inWeek = list.filter((a) => a.date >= from && a.date < until);
    return {
      week: short(from),
      volume: Math.round(inWeek.reduce((s, a) => s + volumeOf(a), 0)),
      sets: inWeek.reduce((s, a) => s + a.sets.length, 0),
      cardio: inWeek.reduce((s, a) => s + (a.cardioMins ?? 0), 0),
    };
  });
}

// Working sets per muscle group over the last 7 days
export function muscleSets(list: Activity[], now = new Date()) {
  const from = formatDate(subDays(now, 6));
  const counts = new Map<string, number>(MUSCLES.map((m) => [m.name, 0]));
  for (const a of list) if (a.date >= from) for (const s of a.sets) {
    const m = muscleOf(s.exercise);
    counts.set(m, (counts.get(m) ?? 0) + 1);
  }
  return [...counts.entries()].map(([name, sets]) => ({
    name,
    sets,
    color: MUSCLES.find((m) => m.name === name)?.color ?? "#71717a",
  }));
}

// Most recent sets per exercise (to prefill "last time")
export function lastPerformance(list: Activity[]) {
  const out: Record<string, Pick<WorkoutSet, "reps" | "weightKg">[]> = {};
  for (const a of list) {
    for (const ex of new Set(a.sets.map((s) => s.exercise))) {
      if (out[ex]) continue;
      out[ex] = a.sets.filter((s) => s.exercise === ex).map(({ reps, weightKg }) => ({ reps, weightKg }));
    }
  }
  return out;
}

// Next program day: the one after the last template you trained
export function nextTemplate(templates: WorkoutTemplate[], list: Activity[]) {
  if (!templates.length) return null;
  const names = templates.map((t) => t.name.toLowerCase());
  const last = list.find((a) => a.workoutName && names.includes(a.workoutName.toLowerCase()));
  if (!last) return { template: templates[0], lastDone: null as string | null };
  const i = names.indexOf(last.workoutName!.toLowerCase());
  const template = templates[(i + 1) % templates.length];
  const lastDone = list.find((a) => a.workoutName?.toLowerCase() === template.name.toLowerCase())?.date ?? null;
  return { template, lastDone };
}

// Cardio minutes, distance and sessions per machine (last 30 days)
export function cardioSummary(list: Activity[], now = new Date()) {
  const from = formatDate(subDays(now, 29));
  return CARDIO_TYPES.map((type: CardioType) => {
    const xs = list.filter((a) => a.date >= from && a.cardioType === type);
    return {
      type,
      mins: xs.reduce((s, a) => s + (a.cardioMins ?? 0), 0),
      km: Math.round(xs.reduce((s, a) => s + (a.distanceKm ?? 0), 0) * 10) / 10,
      sessions: xs.length,
    };
  }).filter((c) => c.sessions > 0);
}

// Headline numbers for the week strip
export function gymKpis(list: Activity[], now = new Date()) {
  const thisWeek = formatDate(weekStart(now));
  const lastWeek = formatDate(weekStart(subWeeks(now, 1)));
  const tomorrow = formatDate(addDays(now, 1));

  let goalStreak = 0;
  for (let w = 1; w < 52; w++) {
    const from = formatDate(weekStart(subWeeks(now, w)));
    const until = formatDate(weekStart(subWeeks(now, w - 1)));
    if (list.filter((a) => a.date >= from && a.date < until).length < WEEKLY_GOAL) break;
    goalStreak++;
  }
  const sessionsThisWeek = list.filter((a) => a.date >= thisWeek).length;
  if (sessionsThisWeek >= WEEKLY_GOAL) goalStreak++;

  const monthStart = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
  return {
    sessionsThisWeek,
    volumeThisWeek: Math.round(sumBetween(list, thisWeek, tomorrow, volumeOf)),
    volumeLastWeek: Math.round(sumBetween(list, lastWeek, thisWeek, volumeOf)),
    cardioThisWeek: sumBetween(list, thisWeek, tomorrow, (a) => a.cardioMins ?? 0),
    prsThisMonth: personalRecords(list, now).filter((r) => r.date >= monthStart).length,
    goalStreak,
  };
}

// Sessions for each day of the current week (Mon..Sun)
export function weekPlan(list: Activity[], now = new Date()) {
  const start = weekStart(now);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(start, i);
    const date = formatDate(day);
    const sessions = list.filter((a) => a.date === date);
    return {
      date,
      label: day.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: day.getDate(),
      sessions,
      mins: sessions.reduce((s, a) => s + a.durationMins, 0),
      isToday: date === formatDate(now),
      isFuture: date > formatDate(now),
    };
  });
}

// "1h 05m" / "45m"
export function formatMins(m: number) {
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}

// 12345 -> "12.3t", 850 -> "850kg"
export function formatKg(kg: number) {
  return kg >= 1000 ? `${(Math.round(kg / 100) / 10).toFixed(1)}t` : `${Math.round(kg)}kg`;
}

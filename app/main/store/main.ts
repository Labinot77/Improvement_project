import "server-only";
import { createClient } from "@/lib/supabase/server";
import { dayKey } from "@/app/activity/data/main";
import type { Mood } from "@/types/journal";

export type DashTask = { id: string; title: string; description: string; completed: boolean; date: string };
export type DashRaw = {
  tasks: DashTask[];
  lessons: { category: string; date: string }[];
  activities: { type: string; durationMins: number; date: string }[];
  sleep: { date: string; hours: number }[];
  moods: { date: string; mood: Mood }[];
  meals: { id: string; title: string; date: string; mealType: string }[];
  error: string | null;
};

// Joined `days` comes back as an object or a one-item array
const dateOf = (d: any): string => (Array.isArray(d) ? d[0]?.date : d?.date) ?? "";

// Last 30 days of every area in one round trip (RLS scopes to the user)
export async function getDashboard(): Promise<DashRaw> {
  const supabase = await createClient();
  const since = dayKey(-29);

  const [tasks, lessons, activities, sleep, journal, meals] = await Promise.all([
    supabase.from("tasks").select("id, title, description, completed, created_at, days!inner(date)")
      .gte("days.date", dayKey(-6)).lte("days.date", dayKey()).order("created_at"),
    supabase.from("lessons").select("category, date").gte("date", since),
    supabase.from("activities").select("type, duration_mins, date").gte("date", since),
    supabase.from("sleep_entries").select("date, duration_hours").gte("date", since),
    supabase.from("journal_entries").select("date, mood").gte("date", since),
    supabase.from("recipes").select("id, title, date, meal_type").gte("date", dayKey()).lte("date", dayKey(6)).order("date"),
  ]);

  const error = [tasks, lessons, activities, sleep, journal, meals].find((r) => r.error)?.error?.message ?? null;

  return {
    tasks: (tasks.data ?? []).map((t: any) => ({
      id: t.id, title: t.title, description: t.description ?? "", completed: !!t.completed, date: dateOf(t.days),
    })),
    lessons: lessons.data ?? [],
    activities: (activities.data ?? []).map((a) => ({ type: a.type, durationMins: a.duration_mins ?? 0, date: a.date })),
    sleep: (sleep.data ?? []).map((s) => ({ date: s.date, hours: Number(s.duration_hours) })),
    moods: journal.data ?? [],
    meals: (meals.data ?? []).map((m) => ({ id: m.id, title: m.title, date: m.date, mealType: m.meal_type })),
    error,
  };
}

import { createClient } from "@/lib/supabase/server";
import { formatDate, today } from "@/lib/mics/date";
import { Task } from "@/types/Progress/progress";

// export type DashboardTask = {
//   id: string;
//   title: string;
//   description: string | null;
//   completed: boolean;
//   createdAt: Date;
// };

export type DashboardStats = {
  lessons: { count: number; topCategory: string | null };
  activity: { workouts: number; totalMins: number };
  recipes: { saved: number; plannedToday: number; cookedThisWeek: number };
  sleep: { hours: number | null; date: string | null };
};

// Monday 00:00 (server time), matching the Mon–Sun weekly chart
function startOfWeek() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(0, 0, 0, 0);
  return d;
}

function mostCommon(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  let best: string | null = null;
  let bestCount = 0;
  for (const [v, c] of counts) {
    if (c > bestCount) {
      best = v;
      bestCount = c;
    }
  }
  return best;
}

export async function getDashboardData() {
  const supabase = await createClient();
  const weekStart = startOfWeek();
  const weekStartDate = formatDate(weekStart);

  // Row Level Security scopes every query to the signed-in user
  const [tasks, lessons, activities, saved, planned, cooked, sleep] =
    await Promise.all([
      supabase
        .from("tasks")
        .select("id, title, description, completed, created_at, days!inner(date)")
        .eq("days.date", today())
        .order("created_at"),
      supabase.from("lessons").select("category").gte("date", weekStartDate),
      supabase.from("activities").select("duration_mins").gte("date", weekStartDate),
      supabase.from("recipes").select("id", { count: "exact", head: true }),
      supabase
        .from("meal_plan_entries")
        .select("id", { count: "exact", head: true })
        .eq("date", today()),
      supabase
        .from("cook_log")
        .select("id", { count: "exact", head: true })
        .gte("cooked_at", weekStart.toISOString()),
      supabase
        .from("sleep_entries")
        .select("date, duration_hours")
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const error =
    [tasks, lessons, activities, saved, planned, cooked, sleep].find((r) => r.error)
      ?.error?.message ?? null;

  const taskList: Task[] = (tasks.data ?? [])
    .map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description ?? undefined,
      completed: !!t.completed,
      createdAt: t.created_at,
    }))
    // Unfinished first; the sort is stable so creation order is kept within each group
    .sort((a, b) => Number(a.completed) - Number(b.completed));

  const lessonRows = lessons.data ?? [];
  const activityRows = activities.data ?? [];

  const stats: DashboardStats = {
    lessons: {
      count: lessonRows.length,
      topCategory: mostCommon(lessonRows.map((l) => l.category)),
    },
    activity: {
      workouts: activityRows.length,
      totalMins: activityRows.reduce((sum, a) => sum + (a.duration_mins ?? 0), 0),
    },
    recipes: {
      saved: saved.count ?? 0,
      plannedToday: planned.count ?? 0,
      cookedThisWeek: cooked.count ?? 0,
    },
    sleep: {
      hours: sleep.data ? Number(sleep.data.duration_hours) : null,
      date: sleep.data?.date ?? null,
    },
  };

  return { tasks: taskList, stats, error };
}
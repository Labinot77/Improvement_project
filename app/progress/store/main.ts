import "server-only";
import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { formatDate, today } from "@/lib/mics/date";
import { DEFAULT_CATEGORY, MAX_UPCOMING } from "@/constants/progress/template";
import { computeProgressStats, type TasksByDate } from "@/app/progress/data/stats";
import type { ProgressStats, TodoTask } from "@/types/Progress/progress";

// Tables: days (id, user_id, date, created_at) -> tasks (id, day_id, title,
// description, category, completed, created_at). `days` has no RLS, so every
// query on it is scoped to the user; RLS on `tasks` covers the rest.

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  completed: boolean | null;
  created_at: string;
};

type DayRow = { date: string; tasks: TaskRow[] | null };

// DB row -> TodoTask
function toTask(date: string, r: TaskRow): TodoTask {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    category: r.category ?? DEFAULT_CATEGORY,
    completed: !!r.completed,
    date,
  };
}

// Tasks grouped by date, in creation order (rows don't jump when toggled)
function groupByDate(rows: DayRow[]) {
  const map: Record<string, TodoTask[]> = {};
  for (const r of rows) {
    const tasks = [...(r.tasks ?? [])]
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((t) => toTask(r.date, t));
    // Duplicate day rows for one date are merged
    map[r.date] = [...(map[r.date] ?? []), ...tasks];
  }
  return map;
}

export type TodosData = {
  todayTasks: TodoTask[];
  upcoming: TodoTask[];
  stats: ProgressStats | null;
  error: string | null;
};

// Today, upcoming and insight stats for the Progress page
export async function getTodosData(): Promise<TodosData> {
  const empty = { todayTasks: [], upcoming: [], stats: null };

  const user = await getUser();
  if (!user) return { ...empty, error: "Not signed in" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("days")
    .select("date, tasks(id, title, description, category, completed, created_at)")
    .eq("user_id", user.id)
    .gte("date", formatDate(subDays(new Date(), 366)))
    .order("date");
  if (error) return { ...empty, error: error.message };

  const todayKey = today();
  const byDate = groupByDate((data ?? []) as DayRow[]);
  const dates = Object.keys(byDate).sort();

  // Stats only look at today and the past
  const history: TasksByDate = Object.fromEntries(
    dates.filter((d) => d <= todayKey).map((d) => [d, byDate[d]]),
  );

  return {
    todayTasks: byDate[todayKey] ?? [],
    upcoming: dates
      .filter((d) => d > todayKey)
      .flatMap((d) => byDate[d])
      .slice(0, MAX_UPCOMING),
    stats: computeProgressStats(history),
    error: null,
  };
}

// Day row id for a date (created if missing)
async function ensureDay(date: string) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");

  const supabase = await createClient();
  const { data: existing, error } = await supabase
    .from("days")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", date)
    .order("created_at")
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (existing) return existing.id as string;

  const { data: created, error: insertError } = await supabase
    .from("days")
    .insert({ user_id: user.id, date })
    .select("id")
    .single();
  if (insertError) throw new Error(insertError.message);
  return created.id as string;
}

// Insert a task on a date
export async function insertTask(task: Pick<TodoTask, "date" | "title" | "description" | "category">) {
  const dayId = await ensureDay(task.date);
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").insert({
    day_id: dayId,
    title: task.title,
    description: task.description,
    category: task.category,
    completed: false,
  });
  if (error) throw new Error(error.message);
}

// Set a task's completion
export async function updateTaskCompleted(id: string, completed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw new Error(error.message);
}

// Delete a task
export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

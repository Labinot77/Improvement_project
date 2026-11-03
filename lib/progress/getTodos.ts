import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { formatDate, today } from "@/lib/mics/date";
import { computeStreak } from "@/lib/progress/streak";
import type { Days } from "@/types/Progress/progress";
import { DEFAULT_CATEGORY, MAX_UPCOMING } from "@/constants/progress/template";
import { wait } from "../mics/helpers";

export type TodoTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
};

type TaskRow = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  completed: boolean | null;
  created_at: string;
};

export async function getTodosData() {
  const dateKey = today();
  const empty = {
    dateKey,
    todayTasks: [] as TodoTask[],
    upcoming: [] as TodoTask[],
    journal: "",
    streak: 0,
  };

  const user = await getUser();
  if (!user) return { ...empty, error: "Not signed in" };

  const supabase = await createClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 366);

  // `days` has no Row Level Security, so scope it to the user explicitly
  const { data, error } = await supabase
    .from("days")
    .select("date, journal, tasks(id, title, description, category, completed, created_at)")
    .eq("user_id", user.id)
    .gte("date", formatDate(cutoff))
    .order("date");


  if (error) return { ...empty, error: error.message };

  const rows = (data ?? []) as unknown as {
    date: string;
    journal: string | null;
    tasks: TaskRow[] | null;
  }[];

  // Creation order, so rows don't jump around when toggled
  const toTasks = (date: string, tasks: TaskRow[] | null): TodoTask[] =>
    [...(tasks ?? [])]
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description ?? "",
        category: t.category ?? DEFAULT_CATEGORY,
        completed: !!t.completed,
        date,
      }));

  const todayRow = rows.find((r) => r.date === dateKey);

  const upcoming = rows
    .filter((r) => r.date > dateKey)
    .flatMap((r) => toTasks(r.date, r.tasks))
    .slice(0, MAX_UPCOMING);

  // Same streak logic as the Progress page
  const daysMap = Object.fromEntries(
    rows.map((r) => [r.date, { tasks: r.tasks ?? [], journal: r.journal ?? "" }]),
  ) as unknown as Days;

  return {
    dateKey,
    todayTasks: toTasks(dateKey, todayRow?.tasks ?? null),
    upcoming,
    journal: todayRow?.journal ?? "",
    streak: computeStreak(daysMap),
    error: null as string | null,
  };
}
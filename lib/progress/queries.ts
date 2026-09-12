"use server"

import { createClient } from "@/lib/supabase/server"
import type { DayData } from "@/types/Progress/progress"

export async function getDay(date: string): Promise<DayData | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: day, error: dayError } = await supabase
    .from("days")
    .select("id, date, journal")
    .eq("date", date)
    .eq("user_id", user.id)
    .maybeSingle()

  if (dayError) {
    throw new Error(dayError.message)
  }

  // No database row for this day yet
  if (!day) {
    return {
      date,
      journal: "",
      tasks: [],
    }
  }

  const { data: tasks, error: taskError } = await supabase
    .from("tasks")
    .select(
      "id, title, description, completed, reflection, created_at"
    )
    .eq("day_id", day.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (taskError) {
    throw new Error(taskError.message)
  }

  return {
    date: day.date,
    journal: day.journal ?? "",
    tasks: (tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description ?? "",
      completed: task.completed,
      reflection: task.reflection ?? "",
      createdAt: task.created_at,
    })),
  }
}
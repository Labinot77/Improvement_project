"use server"

import { createClient } from "@/lib/supabase/server"
import type { DayData, Task } from "@/types/Progress/progress"

export async function getTasks(): Promise<Record<string, DayData>> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return {}

  const { data: dayRows, error: dayError } = await supabase
    .from("days")
    .select("id, date, journal")
    .eq("user_id", user.id)

  if (dayError || !dayRows) {
    throw new Error(dayError?.message ?? "Failed to fetch days")
  }

  const { data: taskRows, error: taskError } = await supabase
    .from("tasks")
    .select(
      "id, day_id, title, description, completed, reflection, created_at"
    )
    .eq("user_id", user.id)

  if (taskError) {
    throw new Error(taskError.message)
  }

  const next: Record<string, DayData> = {}

  for (const day of dayRows) {
    next[day.date] = {
      date: day.date,
      journal: day.journal ?? "",
      tasks: (taskRows ?? [])
        .filter((task) => task.day_id === day.id)
        .map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description ?? "",
          completed: task.completed,
          reflection: task.reflection ?? "",
          createdAt: task.created_at,
        })),
      // dayRating can be added to DayData later
      // dayRating: day.day_rating ?? 0,
    }
  }

  return next
}

async function ensureDayId(date: string): Promise<string | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: existing, error: existingError } = await supabase
    .from("days")
    .select("id")
    .eq("date", date)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existingError) {
    throw new Error(existingError.message)
  }

  if (existing) {
    return existing.id
  }

  const { data: created, error: createError } = await supabase
    .from("days")
    .insert({
      date,
      user_id: user.id,
    })
    .select("id")
    .single()

  if (createError || !created) {
    return null
  }

  return created.id
}

export async function createTask(
  date: string,
  task: Task
): Promise<Task | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const dayId = await ensureDayId(date)

  if (!dayId) return null

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      day_id: dayId,
      user_id: user.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      reflection: task.reflection ?? "",
    })
    .select(
      "id, title, description, completed, reflection, created_at"
    )
    .single()

  if (error || !data) {
    return null
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description ?? "",
    completed: data.completed,
    reflection: data.reflection ?? "",
    createdAt: data.created_at,
  }
}

export async function updateTask(
  taskId: string,
  task: Task
): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from("tasks")
    .update({
      title: task.title,
      description: task.description,
      completed: task.completed,
      reflection: task.reflection ?? "",
    })
    .eq("id", taskId)
    .eq("user_id", user.id)

  return !error
}

export async function deleteTask(taskId: string): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id)

  return !error
}

export async function updateJournal(
  date: string,
  journal: string
): Promise<boolean> {
  const supabase = await createClient()

  const dayId = await ensureDayId(date)

  if (!dayId) return false

  const { error } = await supabase
    .from("days")
    .update({ journal })
    .eq("id", dayId)

  return !error
}
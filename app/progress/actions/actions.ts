"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { CATEGORIES, DEFAULT_CATEGORY } from "@/constants/progress/template";

// The dashboard also shows today's tasks
function refresh() {
  revalidatePath("/todos");
  revalidatePath("/");
}

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
  if (existing) return { supabase, dayId: existing.id as string };

  const { data: created, error: insertError } = await supabase
    .from("days")
    .insert({ user_id: user.id, date })
    .select("id")
    .single();
  if (insertError) throw new Error(insertError.message);
  return { supabase, dayId: created.id as string };
}

export async function createTask(input: {
  date: string;
  title: string;
  description?: string;
  category?: string;
}) {
  const title = input.title.trim();
  if (!title) return;

  const category = (CATEGORIES as readonly string[]).includes(input.category ?? "")
    ? (input.category as string)
    : DEFAULT_CATEGORY;

  const { supabase, dayId } = await ensureDay(input.date);
  const { error } = await supabase.from("tasks").insert({
    day_id: dayId,
    title,
    description: (input.description ?? "").trim(),
    category,
    completed: false,
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function setTaskCompleted(id: string, completed: boolean) {
  const supabase = await createClient();
  // RLS on `tasks` limits this to the user's own rows
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function removeTask(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function saveJournal(date: string, journal: string) {
  const { supabase, dayId } = await ensureDay(date);
  const { error } = await supabase.from("days").update({ journal }).eq("id", dayId);
  if (error) throw new Error(error.message);
  // No revalidation: nothing else on screen shows the journal
}
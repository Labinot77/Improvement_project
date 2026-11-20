import "server-only";
import { createClient } from "@/lib/supabase/server";
import { calcDuration } from "@/lib/sleep/calc";
import type { SleepEntry, SleepFormValues } from "@/types/sleep";

// Table "sleep_entries": id, user_id, date, bedtime, wake_time, duration_hours, notes, created_at
// Unique (user_id, date): one entry per night

// DB row (snake_case) -> SleepEntry
function toEntry(r: any): SleepEntry {
  return {
    id: r.id,
    date: r.date,
    bedtime: String(r.bedtime).slice(0, 5),
    wakeTime: String(r.wake_time).slice(0, 5),
    durationHours: Number(r.duration_hours),
    notes: r.notes ?? "",
    createdAt: r.created_at,
  };
}

// Signed-in user or throw
async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");
  return { supabase, user };
}

// All nights, newest first (RLS scopes to the user)
export async function getSleepEntries(): Promise<SleepEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("sleep_entries").select("*").order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(toEntry);
}

// Create or replace the entry for that date
export async function upsertSleep(v: SleepFormValues) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("sleep_entries").upsert(
    {
      user_id: user.id,
      date: v.date,
      bedtime: v.bedtime,
      wake_time: v.wakeTime,
      duration_hours: calcDuration(v.bedtime, v.wakeTime),
      notes: v.notes,
    },
    { onConflict: "user_id,date" }
  );
  if (error) throw new Error(error.message);
}

// Delete one of the user's entries
export async function removeSleep(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("sleep_entries").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

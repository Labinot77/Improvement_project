import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Activity, ActivityFormValues } from "@/types/fitness";

// Table "activities": id, user_id, date, type, duration_mins, intensity, notes, created_at

// DB row (snake_case) -> Activity
function toActivity(r: any): Activity {
  return {
    id: r.id,
    date: r.date,
    type: r.type,
    durationMins: r.duration_mins,
    intensity: r.intensity,
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

// All activities, newest first (RLS scopes to the user)
export async function getActivities(): Promise<Activity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toActivity);
}

// Insert a new session for the user
export async function insertActivity(v: ActivityFormValues) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("activities").insert({
    user_id: user.id,
    date: v.date,
    type: v.type,
    duration_mins: v.durationMins,
    intensity: v.intensity,
    notes: v.notes,
  });
  if (error) throw new Error(error.message);
}

// Delete one of the user's sessions
export async function removeActivity(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase.from("activities").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

import "server-only";
import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { formatDate } from "@/lib/mics/date";
import type { Activity, ActivityType, IntensityLevel } from "@/types/fitness";

// Table: activities (id, user_id, date, type, duration_mins, intensity, notes, created_at)

type Row = {
  id: string;
  date: string;
  type: string;
  duration_mins: number;
  intensity: number | null;
  notes: string | null;
  created_at: string;
};

// DB row -> Activity
function toActivity(r: Row): Activity {
  return {
    id: r.id,
    date: r.date,
    type: r.type as ActivityType,
    durationMins: r.duration_mins,
    intensity: (r.intensity ?? 3) as IntensityLevel,
    notes: r.notes ?? "",
    createdAt: r.created_at,
  };
}

// Sessions from the last `days` days, newest first
export async function getActivities(days = 182): Promise<{ activities: Activity[]; error: string | null }> {
  const user = await getUser();
  if (!user) return { activities: [], error: "Not signed in" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("id, date, type, duration_mins, intensity, notes, created_at")
    .eq("user_id", user.id)
    .gte("date", formatDate(subDays(new Date(), days)))
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return { activities: [], error: error.message };
  return { activities: (data as Row[]).map(toActivity), error: null };
}

// Insert a session
export async function insertActivity(a: Omit<Activity, "id" | "createdAt">) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("activities").insert({
    user_id: user.id,
    date: a.date,
    type: a.type,
    duration_mins: a.durationMins,
    intensity: a.intensity,
    notes: a.notes,
  });
  if (error) throw new Error(error.message);
}

// Delete a session (own rows only)
export async function deleteActivity(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("activities").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

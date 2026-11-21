import "server-only";
import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { formatDate } from "@/lib/mics/date";
import type {
  Activity,
  ActivityType,
  CardioType,
  IntensityLevel,
  TemplateExercise,
  WorkoutInput,
  WorkoutTemplate,
} from "@/types/fitness";

// Tables: activities (one row per session), workout_sets (lifts), workout_templates (program)

type SetRow = { exercise: string; set_index: number; reps: number; weight_kg: number | string };
type Row = {
  id: string;
  date: string;
  type: string;
  duration_mins: number;
  intensity: number | null;
  notes: string | null;
  created_at: string;
  workout_name: string | null;
  cardio_type: string | null;
  cardio_mins: number | null;
  distance_km: number | string | null;
  workout_sets: SetRow[] | null;
};

// DB row -> Activity (sets in logged order)
function toActivity(r: Row): Activity {
  return {
    id: r.id,
    date: r.date,
    type: r.type as ActivityType,
    durationMins: r.duration_mins,
    intensity: (r.intensity ?? 3) as IntensityLevel,
    notes: r.notes ?? "",
    createdAt: r.created_at,
    workoutName: r.workout_name,
    cardioType: r.cardio_type as CardioType | null,
    cardioMins: r.cardio_mins,
    distanceKm: r.distance_km === null ? null : Number(r.distance_km),
    sets: (r.workout_sets ?? [])
      .map((s) => ({ exercise: s.exercise, setIndex: s.set_index, reps: s.reps, weightKg: Number(s.weight_kg) }))
      .sort((a, b) => a.setIndex - b.setIndex),
  };
}

// Sessions (with their sets) from the last `days` days, newest first
export async function getActivities(days = 182): Promise<{ activities: Activity[]; error: string | null }> {
  const user = await getUser();
  if (!user) return { activities: [], error: "Not signed in" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select(
      "id, date, type, duration_mins, intensity, notes, created_at, workout_name, cardio_type, cardio_mins, distance_km, workout_sets(exercise, set_index, reps, weight_kg)",
    )
    .eq("user_id", user.id)
    .gte("date", formatDate(subDays(new Date(), days)))
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return { activities: [], error: error.message };
  return { activities: (data as Row[]).map(toActivity), error: null };
}

// Insert a gym session and its sets (session is removed again if the sets fail)
export async function insertWorkout(w: WorkoutInput) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .insert({
      user_id: user.id,
      date: w.date,
      type: "Gym",
      duration_mins: w.durationMins,
      intensity: w.intensity,
      notes: w.notes,
      workout_name: w.workoutName || null,
      cardio_type: w.cardio?.type ?? null,
      cardio_mins: w.cardio?.mins ?? null,
      distance_km: w.cardio?.distanceKm ?? null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  let index = 0;
  const sets = w.exercises.flatMap((ex) =>
    ex.sets.map((s) => ({
      user_id: user.id,
      activity_id: data.id,
      exercise: ex.name,
      set_index: index++,
      reps: s.reps,
      weight_kg: s.weightKg,
    })),
  );
  if (sets.length) {
    const { error: setError } = await supabase.from("workout_sets").insert(sets);
    if (setError) {
      await supabase.from("activities").delete().eq("id", data.id);
      throw new Error(setError.message);
    }
  }
}

// Delete a session (its sets cascade)
export async function deleteActivity(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("activities").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

// The user's program, in rotation order
export async function getTemplates(): Promise<WorkoutTemplate[]> {
  const user = await getUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("workout_templates")
    .select("id, name, position, exercises")
    .eq("user_id", user.id)
    .order("position")
    .order("created_at");
  return (data ?? []).map((t) => ({
    id: t.id as string,
    name: t.name as string,
    position: t.position as number,
    exercises: (t.exercises ?? []) as TemplateExercise[],
  }));
}

// Create or update a program day
export async function writeTemplate(id: string | null, t: { name: string; exercises: TemplateExercise[] }) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  if (id) {
    const { error } = await supabase.from("workout_templates").update(t).eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    return;
  }
  const { count } = await supabase
    .from("workout_templates")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  const { error } = await supabase.from("workout_templates").insert({ ...t, user_id: user.id, position: count ?? 0 });
  if (error) throw new Error(error.message);
}

// Delete a program day
export async function deleteTemplate(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("workout_templates").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

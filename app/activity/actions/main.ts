"use server";

import { revalidatePath } from "next/cache";
import { CARDIO_TYPES } from "@/constants/fitness";
import { deleteActivity, deleteTemplate, insertWorkout, writeTemplate } from "@/app/activity/store/main";
import type { IntensityLevel, TemplateExercise, WorkoutInput } from "@/types/fitness";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Re-render Activity and the overview
function refresh() {
  revalidatePath("/activity");
  revalidatePath("/main");
}

// Clamp to a whole number in range
const int = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(Number(v) || 0)));

// Validate and log a gym session; returns an error for the form
export async function logWorkout(input: WorkoutInput) {
  if (!DATE.test(input.date)) return { error: "Pick a date." };

  const exercises = input.exercises
    .map((ex) => ({
      name: ex.name.trim().slice(0, 60),
      sets: ex.sets
        .filter((s) => Number(s.reps) > 0)
        .map((s) => ({ reps: int(s.reps, 1, 200), weightKg: Math.max(0, Math.round(Number(s.weightKg) * 4) / 4 || 0) })),
    }))
    .filter((ex) => ex.name && ex.sets.length);

  const cardio =
    input.cardio && CARDIO_TYPES.includes(input.cardio.type) && Number(input.cardio.mins) > 0
      ? {
          type: input.cardio.type,
          mins: int(input.cardio.mins, 1, 600),
          distanceKm: input.cardio.distanceKm ? Math.max(0, Math.round(Number(input.cardio.distanceKm) * 100) / 100) : null,
        }
      : null;

  if (!exercises.length && !cardio) return { error: "Add at least one set or a cardio block." };

  const durationMins = int(input.durationMins, 1, 600);
  if (!input.durationMins) return { error: "How long was the session?" };

  await insertWorkout({
    date: input.date,
    workoutName: input.workoutName.trim().slice(0, 40),
    durationMins,
    intensity: int(input.intensity, 1, 5) as IntensityLevel,
    notes: input.notes.trim().slice(0, 1000),
    exercises,
    cardio,
  });
  refresh();
  return {};
}

// Delete a session
export async function removeActivity(id: string) {
  await deleteActivity(id);
  refresh();
}

// Create or update a program day
export async function saveTemplate(id: string | null, input: { name: string; exercises: TemplateExercise[] }) {
  const name = input.name.trim().slice(0, 40);
  if (!name) return { error: "Name the workout, e.g. Push day." };
  const exercises = input.exercises
    .map((e) => ({ name: e.name.trim().slice(0, 60), sets: int(e.sets, 1, 10), reps: int(e.reps, 1, 50) }))
    .filter((e) => e.name);
  if (!exercises.length) return { error: "Add at least one exercise." };
  await writeTemplate(id, { name, exercises });
  revalidatePath("/activity");
  return {};
}

// Delete a program day
export async function removeTemplate(id: string) {
  await deleteTemplate(id);
  revalidatePath("/activity");
}

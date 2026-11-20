"use server";

import { revalidatePath } from "next/cache";
import type { ActivityFormValues } from "@/types/fitness";
import { ALL_ACTIVITY_TYPES, ALL_INTENSITIES } from "@/constants/fitness";
import { insertActivity, removeActivity } from "@/app/activity/store/main";

// Run a store call, return its error message instead of throwing
async function attempt(fn: () => Promise<void>): Promise<{ error?: string }> {
  const failure = await fn().then(() => null, (e: Error) => e.message);
  if (failure) return { error: failure };
  revalidatePath("/activity");
  return {};
}

// Validate and log a session
export async function saveActivity(v: ActivityFormValues) {
  const durationMins = Math.round(Number(v.durationMins));
  if (!ALL_ACTIVITY_TYPES.includes(v.type)) return { error: "Pick an activity type." };
  if (!durationMins || durationMins <= 0 || durationMins > 1440) return { error: "Enter a duration between 1 and 1440 minutes." };
  if (!ALL_INTENSITIES.includes(v.intensity)) return { error: "Pick an intensity." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return { error: "Enter a valid date." };

  return attempt(() =>
    insertActivity({ ...v, durationMins, notes: String(v.notes ?? "").trim().slice(0, 2000) })
  );
}

// Delete a session by id
export async function deleteActivity(id: string) {
  if (!/^[\w-]{1,64}$/.test(String(id))) return { error: "Invalid session id." };
  return attempt(() => removeActivity(id));
}

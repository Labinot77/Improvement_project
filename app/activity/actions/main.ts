"use server";

import { revalidatePath } from "next/cache";
import { ALL_ACTIVITY_TYPES } from "@/constants/fitness";
import { deleteActivity, insertActivity } from "@/app/activity/store/main";
import type { ActivityType, IntensityLevel } from "@/types/fitness";

// Re-render Activity and the overview
function refresh() {
  revalidatePath("/activity");
  revalidatePath("/main");
}

// Log a session; returns an error message for the form
export async function logActivity(input: {
  date: string;
  type: ActivityType;
  durationMins: number;
  intensity: IntensityLevel;
  notes: string;
}) {
  const mins = Math.round(input.durationMins);
  if (!mins || mins <= 0 || mins > 1440) return { error: "Enter a duration in minutes." };
  if (!ALL_ACTIVITY_TYPES.includes(input.type)) return { error: "Pick an activity." };

  const intensity = Math.min(5, Math.max(1, Math.round(input.intensity))) as IntensityLevel;
  await insertActivity({ ...input, durationMins: mins, intensity, notes: input.notes.trim() });
  refresh();
  return {};
}

// Delete a session
export async function removeActivity(id: string) {
  await deleteActivity(id);
  refresh();
}

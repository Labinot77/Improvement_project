"use server";

import { revalidatePath } from "next/cache";
import { deleteSleep, upsertSleep } from "@/app/sleep/store/main";
import { calcDuration } from "@/app/sleep/data/main";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

// Re-render Sleep and the overview
function refresh() {
  revalidatePath("/sleep");
  revalidatePath("/main");
}

// Save a night (duration is derived); returns an error for the form
export async function saveSleep(input: { date: string; bedtime: string; wakeTime: string; notes: string }) {
  if (!TIME.test(input.bedtime) || !TIME.test(input.wakeTime)) return { error: "Enter both times." };
  await upsertSleep({
    ...input,
    durationHours: calcDuration(input.bedtime, input.wakeTime),
    notes: input.notes.trim(),
  });
  refresh();
  return {};
}

// Delete a night
export async function removeSleep(id: string) {
  await deleteSleep(id);
  refresh();
}

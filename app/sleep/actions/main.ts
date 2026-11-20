"use server";

import { revalidatePath } from "next/cache";
import type { SleepFormValues } from "@/types/sleep";
import { removeSleep, upsertSleep } from "@/app/sleep/store/main";

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

// Run a store call, return its error message instead of throwing
async function attempt(fn: () => Promise<void>): Promise<{ error?: string }> {
  const failure = await fn().then(() => null, (e: Error) => e.message);
  if (failure) return { error: failure };
  revalidatePath("/sleep");
  return {};
}

// Validate and save a night
export async function saveSleep(v: SleepFormValues) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return { error: "Enter a valid date." };
  if (!TIME.test(v.bedtime) || !TIME.test(v.wakeTime)) return { error: "Enter valid times." };
  if (v.bedtime === v.wakeTime) return { error: "Bedtime and wake time can't be the same." };

  return attempt(() => upsertSleep({ ...v, notes: String(v.notes ?? "").trim().slice(0, 2000) }));
}

// Delete a night by id
export async function deleteSleep(id: string) {
  if (!/^[\w-]{1,64}$/.test(String(id))) return { error: "Invalid entry id." };
  return attempt(() => removeSleep(id));
}

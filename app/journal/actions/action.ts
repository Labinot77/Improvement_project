"use server";

import { revalidatePath } from "next/cache";
import { MOODS } from "@/constants/journal";
import { removeEntry, upsertEntry } from "../store/main";
import type { JournalFormValues } from "@/types/journal";

type Result = { error?: string };

export async function saveEntry(id: string | null, values: JournalFormValues): Promise<Result> {
  const content = values.content.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date)) return { error: "Pick a valid date." };
  if (!MOODS.some((m) => m.value === values.mood)) return { error: "Pick a mood." };
  if (!content) return { error: "Write something first." };

  try {
    await upsertEntry(id, { ...values, content, prompt: values.prompt.trim() });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't save the entry." };
  }
  revalidatePath("/journal");
  return {};
}

export async function deleteEntry(id: string): Promise<Result> {
  try {
    await removeEntry(id);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't delete the entry." };
  }
  revalidatePath("/journal");
  return {};
}
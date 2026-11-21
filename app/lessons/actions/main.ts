"use server";

import { revalidatePath } from "next/cache";
import { ALL_CATEGORIES } from "@/app/lessons/constants/Main";
import { deleteLesson, writeLesson } from "@/app/lessons/store/main";
import type { LessonFormValues } from "@/app/lessons/components/Form_modal";

const IMPACTS = ["low", "medium", "high"];

// Re-render Lessons and the overview
function refresh() {
  revalidatePath("/lessons");
  revalidatePath("/main");
}

// Create or update a lesson
export async function saveLesson(id: string | undefined, v: LessonFormValues) {
  const title = v.title.trim();
  if (!title) throw new Error("Give the lesson a title.");
  if (!(ALL_CATEGORIES as readonly string[]).includes(v.category) || v.category === "All")
    throw new Error("Pick a category.");
  if (!IMPACTS.includes(v.impact)) throw new Error("Pick an impact.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) throw new Error("Pick a date.");

  await writeLesson(id, { ...v, title, body: v.body.trim() });
  refresh();
}

// Delete a lesson
export async function removeLesson(id: string) {
  await deleteLesson(id);
  refresh();
}

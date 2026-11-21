"use server";

import { revalidatePath } from "next/cache";
import { CATEGORIES, DEFAULT_CATEGORY } from "@/constants/progress/template";
import { deleteTask, insertTask, updateTaskCompleted } from "@/app/progress/store/main";

// Re-render Progress and the dashboard (it shows today's tasks)
function refresh() {
  revalidatePath("/progress");
  revalidatePath("/main");
}

// Create a task (unknown categories fall back to the default)
export async function createTask(input: {
  date: string;
  title: string;
  description?: string;
  category?: string;
}) {
  const title = input.title.trim();
  if (!title) return;

  const category = (CATEGORIES as readonly string[]).includes(input.category ?? "")
    ? (input.category as string)
    : DEFAULT_CATEGORY;

  await insertTask({
    date: input.date,
    title,
    description: (input.description ?? "").trim(),
    category,
  });
  refresh();
}

// Mark a task done / not done
export async function setTaskCompleted(id: string, completed: boolean) {
  await updateTaskCompleted(id, completed);
  refresh();
}

// Same as setTaskCompleted, for a no-JS <form action> (dashboard)
export async function toggleTaskForm(formData: FormData) {
  await setTaskCompleted(String(formData.get("id")), formData.get("completed") === "true");
}

// Delete a task
export async function removeTask(id: string) {
  await deleteTask(id);
  refresh();
}

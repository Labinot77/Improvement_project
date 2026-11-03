"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Used as a <form action>, so toggling a task needs no client-side JavaScript
export async function toggleTask(formData: FormData) {
  const id = String(formData.get("id"));
  const completed = formData.get("completed") === "true";

  const supabase = await createClient();
  // RLS on `tasks` ensures users can only update their own rows
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
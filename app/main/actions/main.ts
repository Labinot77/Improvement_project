"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// <form action> toggle, so it works without client JS
export async function toggleTask(formData: FormData) {
  const id = String(formData.get("id"));
  if (!/^[\w-]{1,64}$/.test(id)) return;
  const completed = formData.get("completed") === "true";

  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id); // RLS: own rows only
  if (error) throw new Error(error.message);

  revalidatePath("/main");
}

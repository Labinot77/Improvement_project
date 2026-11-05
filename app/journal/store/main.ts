import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { JournalEntry, JournalFormValues, Mood } from "@/types/journal";

type Row = {
  id: string;
  date: string;
  mood: Mood;
  prompt: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const toEntry = (r: Row): JournalEntry => ({
  id: r.id,
  date: r.date,
  mood: r.mood,
  prompt: r.prompt,
  content: r.content,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export async function getEntries(): Promise<JournalEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[]).map(toEntry);
}

export async function upsertEntry(id: string | null, values: JournalFormValues) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  if (id) {
    const { error } = await supabase.from("journal_entries").update(values).eq("id", id);
    if (error) throw new Error(friendly(error));
  } else {
    const { error } = await supabase
      .from("journal_entries")
      .insert({ ...values, user_id: user.id });
    if (error) throw new Error(friendly(error));
  }
}

export async function removeEntry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// 23505 = unique violation (one entry per day)
const friendly = (e: { code?: string; message: string }) =>
  e.code === "23505" ? "There's already an entry for that day." : e.message;
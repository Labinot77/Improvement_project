import "server-only";

import { createClient } from "@/lib/supabase/server";
import { PAGE_SIZE, todayISO, toISO, weekDays } from "@/constants/journal";
import type { JournalEntry, JournalFilter, JournalFormValues, Mood } from "@/types/journal";

type Row = {
  id: string;
  date: string;
  mood: Mood;
  prompt: string;
  content: string;
  created_at: string;
  updated_at: string;
};

// DB row -> JournalEntry
const toEntry = (r: Row): JournalEntry => ({
  id: r.id,
  date: r.date,
  mood: r.mood,
  prompt: r.prompt,
  content: r.content,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

// Strip characters that break PostgREST `or`/`ilike` filters
const cleanQuery = (q: string) => q.replace(/[%_,()\\*:."']/g, " ").trim().slice(0, 100);

// One page of entries, filtered and searched in the database
export async function getEntriesPage({ page, filter, q }: { page: number; filter: JournalFilter; q: string }) {
  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("journal_entries")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (filter === "week") query = query.gte("date", weekDays()[0]);
  if (filter === "month") query = query.gte("date", `${todayISO().slice(0, 7)}-01`);
  if (filter === "good") query = query.in("mood", ["great", "good"]);
  if (filter === "tough") query = query.in("mood", ["low", "rough"]);

  const term = cleanQuery(q);
  if (term) query = query.or(`content.ilike.%${term}%,prompt.ilike.%${term}%`);

  const { data, error, count } = await query;
  // Out-of-range page: PostgREST returns 416, treat as empty
  if (error && error.code !== "PGRST103") throw new Error(error.message);

  const total = count ?? 0;
  return {
    entries: ((data ?? []) as Row[]).map(toEntry),
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

// Light overview: dates + moods for the last year, total count, today's entry
export async function getOverview() {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 365);

  const [marks, total, today] = await Promise.all([
    supabase.from("journal_entries").select("date, mood").gte("date", toISO(since)),
    supabase.from("journal_entries").select("id", { count: "exact", head: true }),
    supabase.from("journal_entries").select("*").eq("date", todayISO()).maybeSingle(),
  ]);

  const error = marks.error ?? total.error ?? today.error;
  if (error) throw new Error(error.message);

  return {
    marks: (marks.data ?? []) as { date: string; mood: Mood }[],
    total: total.count ?? 0,
    today: today.data ? toEntry(today.data as Row) : null,
  };
}

// Create (no id) or update an entry
export async function upsertEntry(id: string | null, values: JournalFormValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  const { error } = id
    ? await supabase.from("journal_entries").update(values).eq("id", id).eq("user_id", user.id)
    : await supabase.from("journal_entries").insert({ ...values, user_id: user.id });
  if (error) throw new Error(friendly(error));
}

// Delete one of the user's entries
export async function removeEntry(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  const { error } = await supabase.from("journal_entries").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

// 23505 = unique violation (one entry per day)
const friendly = (e: { code?: string; message: string }) =>
  e.code === "23505" ? "There's already an entry for that day." : e.message;

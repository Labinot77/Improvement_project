import "server-only";

import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/mics/date";
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

export const PAGE_SIZE = 9;

// Strip characters that would break a PostgREST `or` filter
const cleanQuery = (q: string) => q.replace(/[,()%*\\]/g, " ").trim().slice(0, 80);

// Monday of this week / 1st of this month as YYYY-MM-DD
function since(filter: JournalFilter) {
  const d = new Date();
  if (filter === "week") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  else d.setDate(1);
  return formatDate(d);
}

// One page of entries matching the filter and search, plus the total count
export async function getEntriesPage(opts: { filter: JournalFilter; q: string; page: number }) {
  const supabase = await createClient();
  const from = (opts.page - 1) * PAGE_SIZE;
  let query = supabase
    .from("journal_entries")
    .select("*", { count: "exact" })
    .order("date", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  if (opts.filter === "week" || opts.filter === "month") query = query.gte("date", since(opts.filter));
  if (opts.filter === "good") query = query.in("mood", ["great", "good"]);
  if (opts.filter === "tough") query = query.in("mood", ["low", "rough"]);
  const q = cleanQuery(opts.q);
  if (q) query = query.or(`content.ilike.%${q}%,prompt.ilike.%${q}%`);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);
  return { entries: (data as Row[]).map(toEntry), total: count ?? 0 };
}

// Light summary of recent entries (date + mood) for streaks and charts
export async function getJournalMeta(days = 90) {
  const supabase = await createClient();
  const d = new Date();
  d.setDate(d.getDate() - days);
  const [recent, all] = await Promise.all([
    supabase.from("journal_entries").select("id, date, mood").gte("date", formatDate(d)).order("date"),
    supabase.from("journal_entries").select("id", { count: "exact", head: true }),
  ]);
  if (recent.error) throw new Error(recent.error.message);
  return {
    recent: recent.data as { id: string; date: string; mood: Mood }[],
    total: all.count ?? 0,
  };
}

// Full entries between two dates (inclusive), for the week strip
export async function getEntriesBetween(from: string, to: string): Promise<JournalEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("journal_entries").select("*").gte("date", from).lte("date", to);
  if (error) throw new Error(error.message);
  return (data as Row[]).map(toEntry);
}


// Insert, or update when an id is given
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

// Delete an entry
export async function removeEntry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("journal_entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// 23505 = unique violation (one entry per day)
const friendly = (e: { code?: string; message: string }) =>
  e.code === "23505" ? "There's already an entry for that day." : e.message;
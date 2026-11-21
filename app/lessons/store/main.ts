import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import type { Lesson, LessonCategory, LessonImpact } from "@/types/lessons";
import type { LessonFormValues } from "@/app/lessons/components/Form_modal";

// Table: lessons (id, user_id, title, body, category, impact, date, created_at)

type Row = {
  id: string;
  title: string;
  body: string | null;
  category: string;
  impact: string;
  date: string;
  created_at: string;
};

// DB row -> Lesson
function toLesson(r: Row): Lesson {
  return {
    id: r.id,
    title: r.title,
    body: r.body ?? "",
    category: r.category as LessonCategory,
    impact: r.impact as LessonImpact,
    date: r.date,
    createdAt: r.created_at,
  };
}

export const PAGE_SIZE = 8;

// Strip characters that would break a PostgREST `or` filter
const cleanQuery = (q: string) => q.replace(/[,()%*\\]/g, " ").trim().slice(0, 80);

// One page of lessons for a category + search, with the total count
export async function getLessonsPage(opts: { category: string; q: string; page: number }) {
  const user = await getUser();
  if (!user) return { lessons: [] as Lesson[], total: 0, error: "Not signed in" };

  const supabase = await createClient();
  const from = (opts.page - 1) * PAGE_SIZE;
  let query = supabase
    .from("lessons")
    .select("id, title, body, category, impact, date, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (opts.category !== "All") query = query.eq("category", opts.category);
  const q = cleanQuery(opts.q);
  if (q) query = query.or(`title.ilike.%${q}%,body.ilike.%${q}%`);

  const { data, count, error } = await query;
  if (error) return { lessons: [] as Lesson[], total: 0, error: error.message };
  return { lessons: (data as Row[]).map(toLesson), total: count ?? 0, error: null };
}

// Totals for the header: lesson count and distinct categories
export async function getLessonStats() {
  const user = await getUser();
  if (!user) return { total: 0, categoryCount: 0 };
  const supabase = await createClient();
  const { data } = await supabase.from("lessons").select("category").eq("user_id", user.id);
  const rows = data ?? [];
  return { total: rows.length, categoryCount: new Set(rows.map((r) => r.category)).size };
}

// Insert, or update when an id is given
export async function writeLesson(id: string | undefined, v: LessonFormValues) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const row = { title: v.title, body: v.body, category: v.category, impact: v.impact, date: v.date };
  const { error } = id
    ? await supabase.from("lessons").update(row).eq("id", id).eq("user_id", user.id)
    : await supabase.from("lessons").insert({ ...row, user_id: user.id });
  if (error) throw new Error(error.message);
}

// Delete a lesson (own rows only)
export async function deleteLesson(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

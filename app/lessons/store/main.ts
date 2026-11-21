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

// All of the user's lessons, newest first
export async function getLessons(): Promise<{ lessons: Lesson[]; error: string | null }> {
  const user = await getUser();
  if (!user) return { lessons: [], error: "Not signed in" };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, body, category, impact, date, created_at")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return { lessons: [], error: error.message };
  return { lessons: (data as Row[]).map(toLesson), error: null };
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

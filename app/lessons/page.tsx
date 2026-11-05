"use server"

import { createClient } from "@/lib/supabase/server";
import { LessonsHeader } from "./components/LessonsHeader";
import { ReflectionPrompt } from "./components/ReflectionPrompt";
import { LessonList } from "./components/List";

import type { Lesson } from "@/types/lessons";

export default async function LessonsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please sign in to view your lessons.</div>;
  }

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new Error("Failed to load lessons.");
  }

  const lessons: Lesson[] = (data ?? []).map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    body: lesson.body ?? "",
    category: lesson.category,
    impact: lesson.impact,
    date: lesson.date,
    createdAt: lesson.created_at,
  }));

  const categoryCount = new Set(lessons.map((lesson) => lesson.category)).size;

  return (
    <main className="lg:px-32 px-10 py-6 space-y-6">
      <LessonsHeader />

      <ReflectionPrompt totalLessons={lessons.length} categoryCount={categoryCount}/>

      <LessonList initialLessons={lessons} />
    </main>
  );
}
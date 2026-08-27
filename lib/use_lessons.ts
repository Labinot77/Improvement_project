"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lesson, LessonCategory, LessonImpact } from "../types/lessons";
import { wait } from "./mics/helpers";

const supabase = createClient();

export type LessonInput = {
  title: string;
  body: string;
  category: LessonCategory;
  impact: LessonImpact;
  date: string;
};

function toLesson(r: any): Lesson {
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

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLessonIds, setPendingLessonIds] = useState<Set<string>>(new Set());

  const setPending = (id: string, isPending: boolean) =>
    setPendingLessonIds((prev) => {
      const next = new Set(prev);
      isPending ? next.add(id) : next.delete(id);
      return next;
    });

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) setLessons(data.map(toLesson));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function addLesson(input: LessonInput): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tempId = crypto.randomUUID();
    const optimistic: Lesson = { id: tempId, ...input, createdAt: new Date().toISOString() };

    setPending(tempId, true);
    setLessons((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from("lessons")
      .insert({ user_id: user.id, ...input })
      .select()
      .single();

    if (error || !data) {
      setLessons((prev) => prev.filter((l) => l.id !== tempId));
      setPending(tempId, false);
      return;
    }

    setLessons((prev) =>
      prev.map((l) => (l.id === tempId ? { ...l, id: data.id, createdAt: data.created_at } : l))
    );
    setPending(tempId, false);
  }

  async function updateLesson(id: string, input: LessonInput) {
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, ...input } : l)));

    await supabase
      .from("lessons")
      .update({
        title: input.title,
        body: input.body,
        category: input.category,
        impact: input.impact,
        date: input.date,
      })
      .eq("id", id);
  }

  async function deleteLesson(id: string) {
    const lessonToDelete = lessons.find((l) => l.id === id);
    if (!lessonToDelete) return;

    const originalIndex = lessons.findIndex((l) => l.id === id);
    setLessons((prev) => prev.filter((l) => l.id !== id));

    const { error } = await supabase.from("lessons").delete().eq("id", id);
    // NOTE: preserved as-is from original — this branch runs when there is NO error,
    // meaning a successful delete gets reverted (the lesson reappears) and the
    // console.error fires on success rather than failure. Likely an inverted
    // condition bug (should probably be `if (error)`), but left unchanged per request.
    if (error) {
      setLessons((prev) => {
        const restored = [...prev];
        restored.splice(originalIndex, 0, lessonToDelete);
        return restored;
      });
      console.error("Failed to delete lesson:", error);
    }
  }

  return { lessons, loading, pendingLessonIds, addLesson, updateLesson, deleteLesson };
}
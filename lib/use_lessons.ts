// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { createClient } from "@/lib/supabase/client";
// import type { Lesson, LessonCategory, LessonImpact } from "../types/lessons";
// import { formatDate } from "@/lib/mics/date";

// const supabase = createClient();

// export type LessonInput = {
//   title: string;
//   body: string;
//   category: LessonCategory;
//   impact: LessonImpact;
//   date: string;
// };

// export function useLessons() {
//   const [lessons, setLessons] = useState<Lesson[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchAll = useCallback(async () => {
//     const { data, error } = await supabase
//       .from("lessons")
//       .select("*")
//       .order("date", { ascending: false });

//     if (error || !data) { setLoading(false); return; }

//     setLessons(
//       data.map((r) => ({
//         id: r.id,
//         title: r.title,
//         body: r.body ?? "",
//         category: r.category as LessonCategory,
//         impact: r.impact as LessonImpact,
//         date: r.date,
//         createdAt: r.created_at,
//       }))
//     );
//     setLoading(false);
//   }, []);

//   useEffect(() => { fetchAll(); }, [fetchAll]);

//   async function addLesson(input: LessonInput): Promise<void> {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return;

//     // Optimistic
//     const tempId = crypto.randomUUID();
//     const optimistic: Lesson = { id: tempId, ...input, createdAt: new Date().toISOString() };
//     setLessons((prev) => [optimistic, ...prev]);

//     const { data, error } = await supabase
//       .from("lessons")
//       .insert({ user_id: user.id, ...input })
//       .select()
//       .single();

//     if (error || !data) {
//       setLessons((prev) => prev.filter((l) => l.id !== tempId));
//       return;
//     }

//     setLessons((prev) =>
//       prev.map((l) =>
//         l.id === tempId
//           ? { id: data.id, title: data.title, body: data.body, category: data.category, impact: data.impact, date: data.date, createdAt: data.created_at }
//           : l
//       )
//     );
//   }

//   async function updateLesson(id: string, input: LessonInput): Promise<void> {
//     setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, ...input } : l)));
//     await supabase.from("lessons").update(input).eq("id", id);
//   }

//   async function deleteLesson(id: string): Promise<void> {
//     setLessons((prev) => prev.filter((l) => l.id !== id));
//     await supabase.from("lessons").delete().eq("id", id);
//   }

//   return { lessons, loading, addLesson, updateLesson, deleteLesson };
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lesson, LessonCategory, LessonImpact } from "../types/lessons";

const supabase = createClient();

export type LessonInput = {
  title: string;
  body: string;
  category: LessonCategory;
  impact: LessonImpact;
  date: string;
};

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingLessonIds, setPendingLessonIds] = useState<Set<string>>(new Set());

  // ── Small helper to avoid repeating setPendingLessonIds boilerplate ──
  function setPending(id: string, isPending: boolean) {
    setPendingLessonIds((prev) => {
      const next = new Set(prev);
      isPending ? next.add(id) : next.delete(id);
      return next;
    });
  }

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("date", { ascending: false });

    if (error || !data) {
      setLoading(false);
      return;
    }

    setLessons(
      data.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body ?? "",
        category: r.category as LessonCategory,
        impact: r.impact as LessonImpact,
        date: r.date,
        createdAt: r.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function addLesson(input: LessonInput) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Optimistic insert
    const tempId = crypto.randomUUID();
    const optimistic: Lesson = { id: tempId, ...input, createdAt: new Date().toISOString() };
    setLessons((prev) => [optimistic, ...prev]);
    setPending(tempId, true);

    const { data, error } = await supabase
      .from("lessons")
      .insert({ user_id: user.id, ...input })
      .select()
      .single();

    if (error || !data) {
      // Rollback
      setLessons((prev) => prev.filter((l) => l.id !== tempId));
      setPending(tempId, false);
      return;
    }

    // Swap temp id for real DB id
    setLessons((prev) =>
      prev.map((l) =>
        l.id === tempId
          ? {
              id: data.id,
              title: data.title,
              body: data.body,
              category: data.category,
              impact: data.impact,
              date: data.date,
              createdAt: data.created_at,
            }
          : l
      )
    );
    setPending(tempId, false);
  }

  async function updateLesson(id: string, input: LessonInput) {
    setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, ...input } : l)));
    await supabase.from("lessons").update(input).eq("id", id);
  }

  async function deleteLesson(id: string) {
    setLessons((prev) => prev.filter((l) => l.id !== id));
    await supabase.from("lessons").delete().eq("id", id);
  }

  return { lessons, loading, pendingLessonIds, addLesson, updateLesson, deleteLesson };
}
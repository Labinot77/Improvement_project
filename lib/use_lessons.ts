"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  Lesson,
  LessonCategory,
  LessonImpact,
} from "@/types/lessons";

export type LessonInput = {
  title: string;
  body: string;
  category: LessonCategory;
  impact: LessonImpact;
  date: string;
};

type LessonEvent =
  | { type: "add"; lesson: Lesson }
  | { type: "replace"; oldId: string; lesson: Lesson }
  | { type: "update"; id: string; input: LessonInput }
  | { type: "delete"; id: string }
  | { type: "restore"; lesson: Lesson };

const EVENT_NAME = "lessons:changed";

function publish(event: LessonEvent) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<LessonEvent>(EVENT_NAME, {
      detail: event,
    }));
  }
}

function toLesson(row: any): Lesson {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? "",
    category: row.category as LessonCategory,
    impact: row.impact as LessonImpact,
    date: row.date,
    createdAt: row.created_at,
  };
}

export function useLessons(initialLessons: Lesson[] = []) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [loading] = useState(false);
  const [pendingLessonIds, setPendingLessonIds] = useState<Set<string>>(
    new Set(),
  );

  const setPending = useCallback((id: string, pending: boolean) => {
    setPendingLessonIds((previous) => {
      const next = new Set(previous);

      if (pending) next.add(id);
      else next.delete(id);

      return next;
    });
  }, []);

  // Keep separate hook instances synchronized.
  useEffect(() => {
    function handleLessonEvent(event: Event) {
      const { detail } = event as CustomEvent<LessonEvent>;

      switch (detail.type) {
        case "add":
          setLessons((previous) =>
            previous.some((lesson) => lesson.id === detail.lesson.id)
              ? previous
              : [detail.lesson, ...previous],
          );
          break;

        case "replace":
          setLessons((previous) =>
            previous.map((lesson) =>
              lesson.id === detail.oldId ? detail.lesson : lesson,
            ),
          );
          break;

        case "update":
          setLessons((previous) =>
            previous.map((lesson) =>
              lesson.id === detail.id
                ? { ...lesson, ...detail.input }
                : lesson,
            ),
          );
          break;

        case "delete":
          setLessons((previous) =>
            previous.filter((lesson) => lesson.id !== detail.id),
          );
          break;

        case "restore":
          setLessons((previous) =>
            previous.some((lesson) => lesson.id === detail.lesson.id)
              ? previous
              : [...previous, detail.lesson].sort((a, b) =>
                  b.date.localeCompare(a.date),
                ),
          );
          break;
      }
    }

    window.addEventListener(EVENT_NAME, handleLessonEvent);

    return () => {
      window.removeEventListener(EVENT_NAME, handleLessonEvent);
    };
  }, []);


  const addLesson = useCallback(async (input: LessonInput): Promise<void> => {
    const supabase = createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("You must be signed in to add a lesson.");
    }

    const tempId = crypto.randomUUID();

    const optimistic: Lesson = {
      id: tempId,
      ...input,
      createdAt: new Date().toISOString(),
    };

    setPending(tempId, true);
    publish({ type: "add", lesson: optimistic });

    try {
      const { data, error } = await supabase
        .from("lessons")
        .insert({
          user_id: user.id,
          title: input.title,
          body: input.body,
          category: input.category,
          impact: input.impact,
          date: input.date,
        })
        .select()
        .single();

      if (error || !data) {
        throw error ?? new Error("Failed to create lesson.");
      }

      publish({
        type: "replace",
        oldId: tempId,
        lesson: toLesson(data),
      });
    } catch (error) {
      publish({ type: "delete", id: tempId });
      throw error;
    } finally {
      setPending(tempId, false);
    }
  }, [setPending]);

  const updateLesson = useCallback(async (
    id: string,
    input: LessonInput,
  ): Promise<void> => {
    const supabase = createClient();

    let previousLesson: Lesson | undefined;

    setLessons((previous) => {
      previousLesson = previous.find((lesson) => lesson.id === id);
      return previous.map((lesson) =>
        lesson.id === id ? { ...lesson, ...input } : lesson,
      );
    });

    publish({ type: "update", id, input });

    try {
      const { error } = await supabase
        .from("lessons")
        .update({
          title: input.title,
          body: input.body,
          category: input.category,
          impact: input.impact,
          date: input.date,
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      if (previousLesson) {
        publish({ type: "restore", lesson: previousLesson });
        publish({
          type: "update",
          id,
          input: {
            title: previousLesson.title,
            body: previousLesson.body,
            category: previousLesson.category,
            impact: previousLesson.impact,
            date: previousLesson.date,
          },
        });
      }

      throw error;
    }
  }, []);

  const deleteLesson = useCallback(async (id: string): Promise<void> => {
    const supabase = createClient();

    const previousLesson = lessons.find((lesson) => lesson.id === id);
    if (!previousLesson) return;

    publish({ type: "delete", id });

    try {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      publish({ type: "restore", lesson: previousLesson });
      throw error;
    }
  }, [lessons]);

  return {
    lessons,
    loading,
    pendingLessonIds,
    addLesson,
    updateLesson,
    deleteLesson,
  };
}
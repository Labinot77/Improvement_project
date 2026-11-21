"use client";

import { useOptimistic, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Lesson } from "@/types/lessons";
import { removeLesson, saveLesson } from "@/app/lessons/actions/main";
import { LessonCard } from "./Card";

type Props = { lessons: Lesson[]; emptyText: string };

// Grid of lesson cards with optimistic delete
export function LessonList({ lessons, emptyText }: Props) {
  const [, startTransition] = useTransition();
  const [items, removeLocal] = useOptimistic(lessons, (state: Lesson[], id: string) =>
    state.filter((l) => l.id !== id),
  );

  // Hide right away, then delete on the server
  function deleteLesson(id: string) {
    startTransition(async () => {
      removeLocal(id);
      await removeLesson(id);
    });
  }

  if (items.length === 0)
    return (
      <p className="rounded-3xl border border-white/[0.06] bg-[#16181b] px-6 py-12 text-center text-zinc-500">{emptyText}</p>
    );

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((lesson) => (
          <motion.div
            key={lesson.id}
            layout
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <LessonCard lesson={lesson} onUpdate={saveLesson} onDelete={() => deleteLesson(lesson.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

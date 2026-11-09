"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Lesson, LessonCategory } from "@/types/lessons";
import { ALL_CATEGORIES } from "@/constants/lessons/lessons";
import { LessonCard } from "./Card";
import LessonSkeleton from "./Skeleton";
import { useLessons } from "@/lib/use_lessons";
import { useSearchParams } from "next/navigation";

interface Props {
  initialLessons: Lesson[];
}

export function LessonList({ initialLessons }: Props) {
  const { lessons, updateLesson, deleteLesson, pendingLessonIds, loading } =
    useLessons(initialLessons);

  const searchParams = useSearchParams();

  const param = searchParams.get("category");
  const filterCat = (
    (ALL_CATEGORIES as readonly string[]).includes(param ?? "") ? param : "All"
  ) as LessonCategory | "All";

  function setFilterCat(cat: LessonCategory | "All") {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "All") params.delete("category");
    else params.set("category", cat);

    const qs = params.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `?${qs}` : window.location.pathname,
    );
  }

  const filtered = useMemo(
    () =>
      filterCat === "All"
        ? lessons
        : lessons.filter((lesson) => lesson.category === filterCat),
    [lessons, filterCat],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2.5">
        {ALL_CATEGORIES.map((cat) => {
          const active = filterCat === cat;

          return (
            <button
              key={cat}
              type="button"
              aria-pressed={active}
              onClick={() => setFilterCat(cat)}
              className={`h-12 rounded-full border px-6 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                active
                  ? "border-white bg-white font-medium text-zinc-900"
                  : "border-white/[0.1] text-zinc-400 hover:border-white/20 hover:text-zinc-100"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full rounded-3xl border border-white/[0.06] bg-[#16181b] px-6 py-12 text-center text-zinc-500"
            >
              {filterCat !== "All"
                ? "No lessons in this category yet."
                : "No lessons yet — add your first one."}
            </motion.p>
          ) : (
            filtered.map((lesson) =>
              pendingLessonIds.has(lesson.id) ? (
                <LessonSkeleton key={lesson.id} />
              ) : (
                <motion.div
                  key={lesson.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                >
                  <LessonCard
                    lesson={lesson}
                    onUpdate={updateLesson}
                    onDelete={() => deleteLesson(lesson.id)}
                  />
                </motion.div>
              ),
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

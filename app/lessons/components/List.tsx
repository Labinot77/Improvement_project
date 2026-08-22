"use client";

// TODO: Expanded list view (full screen modal) for better UX when there are many lessons. Currently, the list is cramped in a sidebar and can be hard to navigate.

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Maximize2 } from "lucide-react";
import type { Lesson, LessonCategory } from "@/types/lessons";
import { ALL_CATEGORIES, CATEGORY_META, ACCENT } from "@/constants/mental";
import { LessonCard } from "./Card";
import SectionCard from "@/app/components/SectionCard";
import { useModal } from "@/providers/Modalprovider";
import type { LessonFormValues } from "@/app/lessons/components/Form";
import { Input } from "@/components/ui/input";
import { LessonSkeleton } from "./Skeleton";
import DefaultButton from "@/app/components/DefaultButton";

interface Props {
  lessons: Lesson[];
  onUpdate: (id: string, values: LessonFormValues) => void;
  onDelete: (id: string) => void;
  pendingLessonIds: Set<string>;
}

export function LessonList({
  lessons,
  onUpdate,
  onDelete,
  pendingLessonIds,
}: Props) {
  const { open } = useModal();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<LessonCategory | "All">("All");

  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const matchesCat = filterCat === "All" || l.category === filterCat;
      const matchesSearch =
        !search.trim() ||
        l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.body.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [lessons, filterCat, search]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lessons…"
            className="w-full border border-white/[0.08] pl-8 pr-3 py-2
              text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none
              focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <DefaultButton
          variant="ghost"
          size="icon"
          onClick={() =>
            open("lessons_list", {
              lessons,
              onUpdate,
              onDelete,
              pendingLessonIds,
            })
          }
          title="Expand list"
          className="border border-white/[0.08] text-zinc-600 hover:text-amber-500
    hover:border-amber-500/30 hover:bg-amber-500/10 transition-all"
        >
          <Maximize2 className="size-3.5" />
        </DefaultButton>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => setFilterCat("All")}
          className={`rounded-full px-2.5 py-1 text-xs font-medium border transition-all ${
            filterCat === "All"
              ? "border-zinc-500 bg-zinc-500/20 text-zinc-200"
              : "border-white/[0.06] text-zinc-600 hover:text-zinc-400"
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat === filterCat ? "All" : cat)}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all"
            style={{
              borderColor:
                filterCat === cat
                  ? CATEGORY_META[cat].color
                  : "rgba(255,255,255,0.06)",
              background:
                filterCat === cat
                  ? `${CATEGORY_META[cat].color}20`
                  : "transparent",
              color: filterCat === cat ? CATEGORY_META[cat].color : "#52525b",
            }}
          >
            {CATEGORY_META[cat].icon} {cat}
          </button>
        ))}
      </div>

      <motion.div
        layoutScroll
        layout
        className="flex flex-col gap-2 h-76 max-h-76 overflow-y-auto pr-3"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-zinc-600 py-6 text-center"
            >
              {search || filterCat !== "All"
                ? "No lessons match your filter."
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
                  exit={{ opacity: 0, x: 25, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                >
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onUpdate={onUpdate}
                    onDelete={() => onDelete(lesson.id)}
                  />
                </motion.div>
              ),
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

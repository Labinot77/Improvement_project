//! Done: Pass the data to the component instead of fetching it here, due to a missmatch with the lessons in the main list, and the expanded modal, when editing/saving a lesson.

"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, Maximize2 } from "lucide-react";
import type { Lesson, LessonCategory } from "@/types/lessons";
import { ALL_CATEGORIES, CATEGORY_META } from "@/constants/mental";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LessonCard } from "../Card";
import type { LessonFormValues } from "@/app/lessons/components/Form";
import LessonSkeleton from "../Card_skeleton";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessons: Lesson[];
  onUpdate: (id: string, values: LessonFormValues) => void;
  onDelete: (id: string) => void;
  pendingLessonIds: Set<string>;
}

export function LessonsExpandedModal({
  open,
  onOpenChange,
  lessons,
  onUpdate,
  onDelete,
  pendingLessonIds,
}: Props) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] w-full lg:min-w-[55dvw] min-w-[80dvw] flex-col gap-0 overflow-hidden
    rounded-2xl border border-white/[0.08] bg-zinc-950 p-0 shadow-2xl"
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0 border-b border-white/[0.06] px-6 py-4">
          <div className="text-left">
            <DialogTitle className="text-base font-semibold text-zinc-100">
              All lessons
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-0.5">
              {lessons.length} recorded lessons
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
          >
            <X className="size-4" />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-600" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search lessons…"
              className="w-full border border-white/[0.08] pl-9 pr-3 py-2.5
                text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none
                focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterCat("All")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all ${
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
                className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border transition-all"
                style={{
                  borderColor:
                    filterCat === cat
                      ? CATEGORY_META[cat].color
                      : "rgba(255,255,255,0.06)",
                  background:
                    filterCat === cat
                      ? `${CATEGORY_META[cat].color}20`
                      : "transparent",
                  color:
                    filterCat === cat ? CATEGORY_META[cat].color : "#52525b",
                }}
              >
                {CATEGORY_META[cat].icon} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List — bigger, grid on wide screens, generous scroll area */}
        <motion.div
          layoutScroll
          layout
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {filtered.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-zinc-600 py-12 text-center"
              >
                {search || filterCat !== "All"
                  ? "No lessons match your filter."
                  : "No lessons yet — add your first one."}
              </motion.p>
            ) : (
              <div className="md:flex md:flex-col gap-3">
                {filtered.map((lesson) =>
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
                        lesson={lesson}
                        onUpdate={onUpdate}
                        onDelete={() => onDelete(lesson.id)}
                      />
                    </motion.div>
                  ),
                )}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Small trigger button to drop into the SectionCard header (next to "New lesson"
 * subtitle in LessonsClient) to open the expanded view.
 */
export function ExpandLessonsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-1.5
        text-xs font-medium text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
      title="Expand"
    >
      <Maximize2 className="size-3.5" />
      Expand
    </button>
  );
}

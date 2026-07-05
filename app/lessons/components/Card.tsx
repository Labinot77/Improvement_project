"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import type { Lesson } from "@/types/lessons";
import { CATEGORY_META, IMPACT_META } from "@/constants/mental";
import DefaultButton from "@/app/components/Button";

interface Props {
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
}

export function LessonCard({ lesson, onEdit, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const catMeta    = CATEGORY_META[lesson.category];
  const impactMeta = IMPACT_META[lesson.impact];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
     className="
    shrink-0
    rounded-xl
    border
    border-white/[0.06]
    bg-[#0f0f0f]
    overflow-hidden
    hover:border-white/[0.10]
    transition-colors"
    >
      {/* The use of DefaultButton breaks the components visually */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
      >
        {/* Category icon */}
        <span className="text-base shrink-0 mt-0.5">{catMeta.icon}</span>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-100 truncate">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* Category badge */}
            <span
              className="text-xs px-2 py-0.5 rounded-full border"
              style={{
                color: catMeta.color,
                borderColor: `${catMeta.color}40`,
                background: `${catMeta.color}12`,
              }}
            >
              {lesson.category}
            </span>

            {/* Impact dot */}
            <span className="flex items-center gap-1 text-xs text-zinc-600">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: impactMeta.color }}
              />
              {impactMeta.label} impact
            </span>

            {/* Date */}
            <span className="text-xs text-zinc-600">
              {new Date(lesson.date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-zinc-600 shrink-0 mt-1"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/[0.04] pt-3">
              {lesson.body ? (
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                  {lesson.body}
                </p>
              ) : (
                <p className="text-sm text-zinc-600 italic">No description added.</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <DefaultButton
                  variant={'outline'}
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5
                    text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:border-white/[0.12] transition-all"
                >
                  <Pencil className="size-3" /> Edit
                </DefaultButton>
                <DefaultButton
                  variant={'outline'}
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5
                    text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="size-3" /> Delete
                </DefaultButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
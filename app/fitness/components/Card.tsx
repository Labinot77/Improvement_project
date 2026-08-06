"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2 } from "lucide-react";
import { ACTIVITY_META, INTENSITY_META } from "@/constants/fitness";
import type { Activity } from "@/types/fitness";
import { useModal } from "@/providers/Modalprovider";

interface ActivityCardProps {
  activity: Activity;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
}

export function ActivityCard({
  activity,
  isOpen,
  onToggle,
  onDelete,
}: ActivityCardProps) {
  const { open } = useModal();

  const meta = ACTIVITY_META[activity.type];
  const intMeta = INTENSITY_META[activity.intensity];

  const dateLabel = new Date(
    activity.date + "T12:00:00",
  ).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0f0f0f] transition-colors hover:border-white/[0.10]"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <span className="shrink-0 text-lg">{meta.icon}</span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-200">
            {activity.type}
          </p>
          <p className="text-xs text-zinc-600">{dateLabel}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="tabular-nums text-xs font-semibold text-zinc-300">
            {activity.durationMins}m
          </span>

          <span
            className="rounded-full border px-2 py-0.5 text-xs"
            style={{
              color: intMeta.color,
              borderColor: `${intMeta.color}40`,
              background: `${intMeta.color}12`,
            }}
          >
            {intMeta.label}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-600"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 border-t border-white/[0.04] px-3 pt-2 pb-3">
              <p className="min-w-0 flex-1 break-words whitespace-pre-wrap text-sm leading-relaxed text-zinc-500">
                {activity.notes || (
                  <span className="italic text-zinc-700">
                    No notes.
                  </span>
                )}
              </p>

              <button
                onClick={() =>
                  open("delete", {
                    onConfirm: () => onDelete(activity.id),
                    title: "Delete session",
                  })
                }
                className="shrink-0 rounded-lg border border-red-500/20 px-2.5 py-1.5 text-xs text-red-400 transition-all hover:bg-red-500/10"
              >
                <div className="flex items-center gap-1">
                  <Trash2 className="size-3" />
                  Delete
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
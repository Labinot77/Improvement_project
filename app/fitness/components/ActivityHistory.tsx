"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown } from "lucide-react";
import type { Activity } from "@/types/fitness";
import { ACTIVITY_META, INTENSITY_META } from "@/constants/fitness";

interface Props {
  activities: Activity[];
  onDelete: (id: string) => void;
}

const INITIAL_LIMIT = 14;

export function ActivityHistory({ activities, onDelete }: Props) {
  const [limit, setLimit]     = useState(INITIAL_LIMIT);
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = activities.slice(0, limit);
  const hasMore = activities.length > limit;

  if (activities.length === 0) {
    return (
      <p className="text-sm text-zinc-600 py-4 text-center">
        No sessions logged yet — add your first one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <AnimatePresence initial={false}>
        {visible.map((activity) => {
          const meta      = ACTIVITY_META[activity.type];
          const intMeta   = INTENSITY_META[activity.intensity];
          const isOpen    = expanded === activity.id;
          const dateLabel = new Date(activity.date + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          });

          return (
            <motion.div
              key={activity.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] overflow-hidden
                hover:border-white/[0.10] transition-colors"
            >
              {/* Row */}
              <button
                onClick={() => setExpanded(isOpen ? null : activity.id)}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
              >
                <span className="text-lg shrink-0">{meta.icon}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200">{activity.type}</p>
                  <p className="text-xs text-zinc-600">{dateLabel}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold tabular-nums text-zinc-300">
                    {activity.durationMins}m
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full border"
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

              {/* Expanded */}
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
                    <div className="px-3 pb-3 pt-2 border-t border-white/[0.04] flex items-start justify-between gap-3">
                      <p className="text-sm text-zinc-500 leading-relaxed flex-1">
                        {activity.notes || <span className="italic text-zinc-700">No notes.</span>}
                      </p>
                      <button
                        onClick={() => onDelete(activity.id)}
                        className="flex items-center gap-1 rounded-lg border border-red-500/20 px-2.5 py-1.5
                          text-xs text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                      >
                        <Trash2 className="size-3" /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setLimit((l) => l + INITIAL_LIMIT)}
          className="mt-1 w-full rounded-xl border border-white/[0.06] py-2 text-xs font-medium
            text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] transition-all"
        >
          Load more ({activities.length - limit} remaining)
        </button>
      )}
    </div>
  );
}

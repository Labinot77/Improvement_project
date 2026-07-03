"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SleepDays } from "@/types/sleep";
import { formatDuration } from "@/lib/sleep/calc";
import { Button } from "@/components/ui/button";

interface Props {
  days: SleepDays;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export function SleepHistory({ days, selectedDate, onSelectDate }: Props) {
  const [limit, setLimit] = useState(14);

  const entries = Object.values(days).sort((a, b) => b.date.localeCompare(a.date));
  const visible = entries.slice(0, limit);
  const hasMore = entries.length > limit;

  if (entries.length === 0) {
    return (
      <p className="text-sm text-zinc-600 py-4 text-center">
        No sleep logged yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <AnimatePresence initial={false}>
        {visible.map((entry) => {
          const isSelected = entry.date === selectedDate;
          const label = new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", {
            weekday: "short", month: "short", day: "numeric",
          });

          return (
            <motion.button
              key={entry.date}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => onSelectDate(entry.date)}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all w-full"
              style={{
                borderColor: isSelected ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.04)",
                background: isSelected ? "rgba(99,102,241,0.08)" : "rgba(15,15,15,1)",
              }}
            >
              {/* Dot */}
              <div className="size-2 rounded-full shrink-0 bg-indigo-400" />

              {/* Date + notes */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-300">{label}</p>
                {entry.notes && (
                  <p className="text-xs text-zinc-600 truncate mt-0.5">{entry.notes}</p>
                )}
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-semibold text-zinc-200 tabular-nums">
                  {formatDuration(entry.durationHours)}
                </p>
                <p className="text-xs text-zinc-600 tabular-nums">
                  {entry.bedtime} → {entry.wakeTime}
                </p>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {hasMore && (
        <Button
          onClick={() => setLimit((l) => l + 14)}
          variant={"outline"}
          className="mt-1 w-full rounded-xl border border-white/[0.06] py-2 text-xs font-medium
            text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] transition-all"
        >
          Load more ({entries.length - limit} remaining)
        </Button>
      )}
    </div>
  );
}
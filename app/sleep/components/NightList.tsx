"use client";

import { useOptimistic, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/Modalprovider";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { CARD } from "@/constants/ui";
import { removeSleep } from "@/app/sleep/actions/main";
import { formatDuration } from "@/app/sleep/data/main";
import type { SleepEntry } from "@/types/sleep";

const PAGE = 10;

type Props = { entries: SleepEntry[]; selected: string; onSelect: (date: string) => void };

// Night history; click to edit, optimistic delete
export function NightList({ entries, selected, onSelect }: Props) {
  const { open } = useModal();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useState(PAGE);
  const [items, remove] = useOptimistic(entries, (state: SleepEntry[], id: string) =>
    state.filter((e) => e.id !== id),
  );

  // Ask, then delete
  function confirmDelete(e: SleepEntry) {
    open("confirm", {
      title: "Delete night",
      description: "Remove this night from your log? This can't be undone.",
      onConfirm: () =>
        startTransition(async () => {
          remove(e.id);
          await removeSleep(e.id);
        }),
    });
  }

  return (
    <section>
      <h2 className="mb-4 flex items-baseline gap-2 text-lg font-medium">
        Nights
        <span className="text-zinc-600">{items.length}</span>
      </h2>
      <div className={`${CARD} overflow-hidden`}>
        {items.length === 0 ? (
          <p className="px-6 py-8 text-center text-zinc-500">No nights logged yet.</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            <AnimatePresence initial={false}>
              {items.slice(0, shown).map((e) => {
                const short = e.durationHours < TARGET_HOURS;
                return (
                  <motion.li
                    key={e.id}
                    layout
                    exit={{ opacity: 0, x: 24 }}
                    onClick={() => onSelect(e.date)}
                    className={`group flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:px-6 ${
                      e.date === selected ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <span
                      className="w-1 self-stretch rounded-full"
                      style={{ background: e.date === selected ? SLEEP_COLOR : "transparent" }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg text-zinc-100">
                        {new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="truncate text-sm text-zinc-600">
                        {[`${e.bedtime} → ${e.wakeTime}`, e.notes].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <span className={`shrink-0 tabular-nums ${short ? "text-amber-300" : "text-zinc-300"}`}>
                      {formatDuration(e.durationHours)}
                    </span>
                    <button
                      type="button"
                      aria-label="Delete night"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        confirmDelete(e);
                      }}
                      className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
      {items.length > shown && (
        <Button variant="ghost" className="mt-3 w-full text-zinc-500" onClick={() => setShown((s) => s + PAGE)}>
          Show more
        </Button>
      )}
    </section>
  );
}

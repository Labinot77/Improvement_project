"use client";

import { useOptimistic, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/Modalprovider";
import { ACTIVITY_META, INTENSITY_META } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import { removeActivity } from "@/app/activity/actions/main";
import { formatMins } from "@/app/activity/data/main";
import type { Activity } from "@/types/fitness";

const PAGE = 8; // days shown before "Show more"

// "Today" / "Yesterday" / "Mon, Nov 17"
function dayLabel(date: string) {
  const d = new Date(`${date}T12:00:00`);
  const diff = Math.round((new Date().setHours(12, 0, 0, 0) - d.getTime()) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// Sessions grouped by day, with optimistic delete
export function SessionList({ activities }: { activities: Activity[] }) {
  const { open } = useModal();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useState(PAGE);
  const [items, remove] = useOptimistic(activities, (state: Activity[], id: string) =>
    state.filter((a) => a.id !== id),
  );

  // Ask, then delete
  function confirmDelete(a: Activity) {
    open("confirm", {
      title: "Delete session",
      description: `Delete this ${a.type} session? This can't be undone.`,
      onConfirm: () =>
        startTransition(async () => {
          remove(a.id);
          await removeActivity(a.id);
        }),
    });
  }

  const days = [...new Set(items.map((a) => a.date))];

  return (
    <section>
      <h2 className="mb-4 flex items-baseline gap-2 text-lg font-medium">
        Sessions
        <span className="text-zinc-600">{items.length}</span>
      </h2>

      <div className={`${CARD} overflow-hidden`}>
        {days.length === 0 ? (
          <p className="px-6 py-8 text-center text-zinc-500">No sessions yet. Log your first one.</p>
        ) : (
          days.slice(0, shown).map((date) => {
            const list = items.filter((a) => a.date === date);
            return (
              <div key={date} className="border-b border-white/[0.06] last:border-0">
                <div className="flex items-baseline justify-between px-5 pt-4 sm:px-6">
                  <p className="text-sm font-medium text-zinc-400">{dayLabel(date)}</p>
                  <p className="text-xs tabular-nums text-zinc-600">
                    {formatMins(list.reduce((s, a) => s + a.durationMins, 0))}
                  </p>
                </div>
                <ul>
                  <AnimatePresence initial={false}>
                    {list.map((a) => (
                      <motion.li
                        key={a.id}
                        layout
                        exit={{ opacity: 0, x: 24 }}
                        className="group flex items-center gap-4 px-5 py-3 sm:px-6"
                      >
                        <span
                          className="grid size-10 shrink-0 place-items-center rounded-xl text-lg"
                          style={{ background: `${ACTIVITY_META[a.type].color}1f` }}
                        >
                          {ACTIVITY_META[a.type].icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg text-zinc-100">{a.type}</p>
                          <p className="truncate text-sm text-zinc-600">
                            {[formatMins(a.durationMins), a.notes].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <span
                          className="hidden shrink-0 rounded-full px-3 py-1 text-sm sm:inline-flex"
                          style={{
                            color: INTENSITY_META[a.intensity].color,
                            background: `${INTENSITY_META[a.intensity].color}14`,
                          }}
                        >
                          {INTENSITY_META[a.intensity].label}
                        </span>
                        <button
                          type="button"
                          aria-label={`Delete ${a.type} session`}
                          onClick={() => confirmDelete(a)}
                          className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            );
          })
        )}
      </div>

      {days.length > shown && (
        <Button variant="ghost" className="mt-3 w-full text-zinc-500" onClick={() => setShown((s) => s + PAGE)}>
          Show more
        </Button>
      )}
    </section>
  );
}

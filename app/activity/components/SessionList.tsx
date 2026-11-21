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

const PAGE = 10;

// "Mon, Nov 17"
const day = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

// Vertical timeline of sessions with optimistic delete
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

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="flex items-baseline gap-2 text-lg font-medium">
        Training log <span className="text-zinc-600">{items.length}</span>
      </h2>

      {items.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-zinc-500">No sessions yet.</p>
          <Button className="mt-4 rounded-full" onClick={() => open("activity_form", {})}>
            Log your first session
          </Button>
        </div>
      ) : (
        <ol className="relative mt-6 ml-3 border-l border-white/[0.08]">
          <AnimatePresence initial={false}>
            {items.slice(0, shown).map((a, i) => {
              const meta = ACTIVITY_META[a.type];
              const newDay = i === 0 || items[i - 1].date !== a.date;
              return (
                <motion.li key={a.id} layout exit={{ opacity: 0, x: 24 }} className="group relative pb-5 pl-7">
                  <span
                    className="absolute -left-[7px] top-1.5 size-3.5 rounded-full ring-4 ring-[#16181b]"
                    style={{ background: meta.color }}
                  />
                  {newDay && <p className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">{day(a.date)}</p>}
                  <div className="flex items-center gap-3 rounded-2xl bg-white/[0.02] p-3 transition hover:bg-white/[0.04]">
                    <span className="text-xl">{meta.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-zinc-100">
                        {a.type} <span className="text-zinc-500">· {formatMins(a.durationMins)}</span>
                      </p>
                      {a.notes && <p className="truncate text-sm text-zinc-600">{a.notes}</p>}
                    </div>
                    <span
                      className="hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs sm:inline"
                      style={{ color: INTENSITY_META[a.intensity].color, background: `${INTENSITY_META[a.intensity].color}14` }}
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
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      )}

      {items.length > shown && (
        <Button variant="ghost" className="w-full text-zinc-500" onClick={() => setShown((s) => s + PAGE)}>
          Show more
        </Button>
      )}
    </section>
  );
}

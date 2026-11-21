"use client";

import { useOptimistic, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/Modalprovider";
import { ACTIVITY_META, CARDIO_META, INTENSITY_META } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import { removeActivity } from "@/app/activity/actions/main";
import { formatKg, formatMins, volumeOf } from "@/app/activity/data/main";
import type { Activity } from "@/types/fitness";

const PAGE = 10;

// "Mon, Nov 17"
const day = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

// Sets grouped by exercise, in order
function grouped(a: Activity) {
  const out: { name: string; sets: Activity["sets"] }[] = [];
  for (const s of a.sets) {
    const g = out.find((x) => x.name === s.exercise);
    if (g) g.sets.push(s);
    else out.push({ name: s.exercise, sets: [s] });
  }
  return out;
}

// Timeline of workouts; tap one to see its sets
export function WorkoutLog({ activities }: { activities: Activity[] }) {
  const { open } = useModal();
  const [, startTransition] = useTransition();
  const [shown, setShown] = useState(PAGE);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [items, remove] = useOptimistic(activities, (state: Activity[], id: string) => state.filter((a) => a.id !== id));

  // Ask, then delete
  function confirmDelete(a: Activity) {
    open("confirm", {
      title: "Delete workout",
      description: `Delete ${a.workoutName ?? "this workout"} from ${day(a.date)}? This can't be undone.`,
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
        Workout log <span className="text-zinc-600">{items.length}</span>
      </h2>

      {items.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-zinc-500">No workouts yet.</p>
          <Button className="mt-4 rounded-full" onClick={() => open("workout_form", {})}>
            Log your first workout
          </Button>
        </div>
      ) : (
        <ol className="relative mt-6 ml-3 border-l border-white/[0.08]">
          <AnimatePresence initial={false}>
            {items.slice(0, shown).map((a) => {
              const meta = ACTIVITY_META[a.type];
              const isOpen = expanded === a.id;
              const groups = grouped(a);
              const vol = volumeOf(a);
              return (
                <motion.li key={a.id} layout exit={{ opacity: 0, x: 24 }} className="group relative pb-5 pl-7">
                  <span className="absolute -left-[7px] top-4 size-3.5 rounded-full ring-4 ring-[#16181b]" style={{ background: meta.color }} />
                  <div className="rounded-2xl bg-white/[0.02] transition hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3 p-3">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : a.id)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-xl">{meta.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-zinc-100">
                            {a.workoutName ?? a.type} <span className="text-sm text-zinc-500">· {day(a.date)}</span>
                          </p>
                          <p className="truncate text-sm text-zinc-500">
                            {[
                              formatMins(a.durationMins),
                              groups.length && `${groups.length} exercises`,
                              vol && formatKg(vol),
                              a.cardioType && `${CARDIO_META[a.cardioType].icon} ${a.cardioMins}m`,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <ChevronDown className={`size-4 shrink-0 text-zinc-500 transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete workout"
                        onClick={() => confirmDelete(a)}
                        className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-2 border-t border-white/[0.05] px-4 py-3 text-sm">
                            {groups.map((g) => (
                              <div key={g.name} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span className="min-w-36 text-zinc-200">{g.name}</span>
                                <span className="tabular-nums text-zinc-500">
                                  {g.sets.map((s) => `${s.weightKg}×${s.reps}`).join("  ·  ")}
                                </span>
                              </div>
                            ))}
                            {a.cardioType && (
                              <p className="text-zinc-400">
                                {CARDIO_META[a.cardioType].icon} {a.cardioType} · {a.cardioMins}m{a.distanceKm ? ` · ${a.distanceKm} km` : ""}
                              </p>
                            )}
                            <p className="text-xs" style={{ color: INTENSITY_META[a.intensity].color }}>
                              Effort: {INTENSITY_META[a.intensity].label}
                            </p>
                            {a.notes && <p className="text-zinc-500">{a.notes}</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

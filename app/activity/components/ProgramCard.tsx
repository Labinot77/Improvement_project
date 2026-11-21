"use client";

import { motion } from "framer-motion";
import { Pencil, Play, Plus } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { ACTIVITY_COLOR } from "@/constants/fitness";
import type { WorkoutSet, WorkoutTemplate } from "@/types/fitness";

type Last = Record<string, Pick<WorkoutSet, "reps" | "weightKg">[]>;
type Props = {
  templates: WorkoutTemplate[];
  next: { template: WorkoutTemplate; lastDone: string | null } | null;
  last: Last;
  known: string[];
};

// "3 days ago" style label
function ago(date: string | null) {
  if (!date) return "Not done yet";
  const days = Math.round((new Date().setHours(12, 0, 0, 0) - new Date(`${date}T12:00:00`).getTime()) / 86_400_000);
  return days === 0 ? "Last done today" : days === 1 ? "Last done yesterday" : `Last done ${days} days ago`;
}

// Hero: next workout in the program, with last numbers and a start button
export function ProgramCard({ templates, next, last, known }: Props) {
  const { open } = useModal();
  const start = (template?: WorkoutTemplate) => open("workout_form", { template, last, known });

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#f97362]/15 bg-gradient-to-br from-[#2a1712] via-[#1a1615] to-[#16181b] p-5 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#f97362]/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Up next */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#f97362]">Up next</p>
          {next ? (
            <>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{next.template.name}</h2>
              <p className="mt-1 text-zinc-400">{ago(next.lastDone)}</p>
              <ul className="mt-6 space-y-2">
                {next.template.exercises.map((e, i) => {
                  const prev = last[e.name];
                  const top = prev?.reduce((b, s) => (s.weightKg > b.weightKg ? s : b), prev[0]);
                  return (
                    <motion.li
                      key={e.name + i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3"
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-xs tabular-nums text-zinc-400">
                        {i + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-zinc-100">{e.name}</span>
                      <span className="shrink-0 text-sm tabular-nums text-zinc-400">
                        {e.sets}×{e.reps}
                        {top && <span className="ml-2 text-zinc-500">· last {top.weightKg}kg</span>}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => start(next.template)}
                  className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium text-white transition hover:opacity-90"
                  style={{ background: ACTIVITY_COLOR }}
                >
                  <Play className="size-4 fill-current" /> Start {next.template.name}
                </button>
                <button
                  type="button"
                  onClick={() => start()}
                  className="h-12 rounded-full border border-white/10 px-6 text-zinc-300 transition hover:border-white/25 hover:text-white"
                >
                  Free workout
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Set up your program</h2>
              <p className="mt-2 max-w-md text-zinc-400">
                Add the workouts you rotate through (Push, Pull, Legs…). The next one is suggested here with last
                time&apos;s weights.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => open("template_form", {})}
                  className="inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium text-white"
                  style={{ background: ACTIVITY_COLOR }}
                >
                  <Plus className="size-4" /> Create first workout
                </button>
                <button
                  type="button"
                  onClick={() => start()}
                  className="h-12 rounded-full border border-white/10 px-6 text-zinc-300 hover:border-white/25"
                >
                  Log a free workout
                </button>
              </div>
            </>
          )}
        </div>

        {/* Program rotation */}
        <div className="rounded-2xl bg-black/20 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-200">Your program</p>
            <button
              type="button"
              onClick={() => open("template_form", {})}
              className="flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100"
            >
              <Plus className="size-4" /> Add day
            </button>
          </div>
          {templates.length === 0 ? (
            <p className="mt-6 text-sm text-zinc-500">No program days yet.</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {templates.map((t, i) => {
                const isNext = next?.template.id === t.id;
                return (
                  <li
                    key={t.id}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 ${isNext ? "bg-[#f97362]/10 ring-1 ring-[#f97362]/30" : "bg-white/[0.03]"}`}
                  >
                    <span className="text-xs tabular-nums text-zinc-500">{i + 1}</span>
                    <button type="button" onClick={() => start(t)} className="min-w-0 flex-1 truncate text-left text-zinc-200 hover:text-white">
                      {t.name}
                      <span className="ml-2 text-xs text-zinc-500">{t.exercises.length} exercises</span>
                    </button>
                    {isNext && <span className="text-xs text-[#f97362]">next</span>}
                    <button
                      type="button"
                      aria-label={`Edit ${t.name}`}
                      onClick={() => open("template_form", { template: t })}
                      className="grid size-8 place-items-center rounded-full text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}

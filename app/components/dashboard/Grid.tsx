"use client";

import { useState } from "react";
import { Check, Plus, BookOpen, Activity, UtensilsCrossed, Moon, ChevronRight } from "lucide-react";

const week = [
  { day: "Mon", value: 36 },
  { day: "Tue", value: 56 },
  { day: "Wed", value: 42 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 50 },
  { day: "Sat", value: 76 },
  { day: "Sun", value: 55 },
];
const highlight = "Sat";

const initialTasks = [
  { id: 1, title: "Finish design lesson", tag: "Lessons", done: true },
  { id: 2, title: "30 minute recovery run", tag: "Activity", done: true },
  { id: 3, title: "Prepare overnight oats", tag: "Nutrition", done: true },
  { id: 4, title: "Read for 20 minutes", tag: "Personal", done: false },
];

const stats = [
  { label: "Lessons", value: "3h 40m", note: "This week · Design systems", icon: BookOpen, iconColor: "text-emerald-400", bar: "bg-emerald-400", pct: 64 },
  { label: "Activity", value: "4", note: "Workouts · 18.2 km total", icon: Activity, iconColor: "text-orange-400", bar: "bg-orange-400", pct: 80 },
  { label: "Recipes", value: "12", note: "Saved recipes · 2 planned today", icon: UtensilsCrossed, iconColor: "text-emerald-400", bar: "bg-emerald-500", pct: 46 },
  { label: "Sleep", value: "7h 42m", note: "Last night · Good quality", icon: Moon, iconColor: "text-blue-400", bar: "bg-blue-500", pct: 86 },
];

const card = "rounded-3xl border border-white/[0.06] bg-[#16181b]";

export default function DashboardGrid() {
  const [tasks, setTasks] = useState(initialTasks);
  const completed = tasks.filter((t) => t.done).length;

  const toggle = (id: number) =>
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        {/* Weekly rhythm */}
        <section className={`${card} flex flex-col p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-medium">Weekly rhythm</h2>
              <p className="text-zinc-500">Your consistency across all areas</p>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
              +12% this week
            </span>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3 border-b border-white/10 sm:h-64 sm:gap-4">
            {week.map(({ day, value }) => (
              <div
                key={day}
                role="img"
                aria-label={`${day}: ${value}%`}
                style={{ height: `${value}%` }}
                className={`flex-1 rounded-t-lg ${
                  day === highlight
                    ? "bg-gradient-to-b from-emerald-300 to-emerald-700"
                    : "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
          <div className="mt-3 flex gap-3 sm:gap-4">
            {week.map(({ day }) => (
              <span key={day} className="flex-1 text-center text-sm text-zinc-500">
                {day}
              </span>
            ))}
          </div>
        </section>

        {/* Today's focus */}
        <section className={`${card} p-6`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium">Today&apos;s focus</h2>
              <p className="text-zinc-500">
                {completed} of {tasks.length + 1} complete
              </p>
            </div>
            <button aria-label="Add focus item" className="text-zinc-500 transition-colors hover:text-white">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <ul className="mt-6 space-y-3">
            {tasks.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => toggle(t.id)}
                  aria-pressed={t.done}
                  className="flex w-full items-center gap-4 rounded-2xl bg-white/[0.04] px-4 py-4 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      t.done ? "border-emerald-500 bg-emerald-500 text-emerald-950" : "border-white/20"
                    }`}
                  >
                    {t.done && <Check className="h-4 w-4" strokeWidth={3} />}
                  </span>
                  <span className="leading-tight">
                    <span className={`block ${t.done ? "text-zinc-500 line-through" : "text-zinc-100"}`}>
                      {t.title}
                    </span>
                    <span className="text-sm text-zinc-600">{t.tag}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, iconColor, bar, pct }) => (
          <button
            key={label}
            className={`${card} group p-6 text-left transition-colors hover:bg-[#1a1d20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60`}
          >
            <div className="flex items-center justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
                <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={1.6} />
              </span>
              <ChevronRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-300" />
            </div>
            <p className="mt-6 text-zinc-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
            <p className="mt-1 text-sm text-zinc-600">{note}</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
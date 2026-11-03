// The layout of the main is going to be a server, with all of its small components the client

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { getUser } from "@/lib/user/getUser_server";
import { getDashboardData } from "@/constants/temp/logic";
import { toggleTask } from "@/constants/temp/toggleTask";
import { formatDate, today } from "@/lib/mics/date";
import {
CARD,
GOALS,
HIGHLIGHT_DAY,
MAX_FOCUS_TASKS,
RING,
STAT_META,
WEEK,
} from "@/constants/temp/temp";
import DailyProgress from "./components/dailyProgress";


const pctOf = (value: number, goal: number) =>
  Math.min(100, Math.round((value / goal) * 100));

const fmtMins = (m: number) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
};

const sleepQuality = (hrs: number) =>
  hrs >= 7 ? "Well rested" : hrs >= 6 ? "Fair rest" : "Short night";

function greetingFor(hour: number) {
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard() {
  const [user, { tasks, stats, error }] = await Promise.all([
    getUser(),
    getDashboardData(),
  ]);
  const { lessons, activity, recipes, sleep } = stats;
  const meta = user?.user_metadata ?? {};
  const firstName: string = (
    meta.full_name ??
    meta.name ??
    user?.email?.split("@")[0] ??
    "there"
  ).split(" ")[0];

  // Today's tasks
  const completed = tasks.filter((t) => t.completed).length;
  const visible = tasks.slice(0, MAX_FOCUS_TASKS);
  const hiddenCount = tasks.length - visible.length;

  // Stat cards
  const yesterday = formatDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const sleepWhen =
    sleep.date === today() || sleep.date === yesterday
      ? "Last night"
      : `Logged ${sleep.date}`;
  const failed = "Couldn't load";

  const cards = [
    {
      ...STAT_META.lessons,
      value: `${lessons.count}`,
      note: error
        ? failed
        : `Learned this week${lessons.topCategory ? ` · ${lessons.topCategory}` : ""}`,
      pct: pctOf(lessons.count, GOALS.lessons),
    },
    {
      ...STAT_META.activity,
      value: `${activity.workouts}`,
      note: error ? failed : `Workouts · ${fmtMins(activity.totalMins)} total`,
      pct: pctOf(activity.workouts, GOALS.workouts),
    },
    {
      ...STAT_META.recipes,
      value: `${recipes.saved}`,
      note: error ? failed : `Saved recipes · ${recipes.plannedToday} planned today`,
      pct: pctOf(recipes.cookedThisWeek, GOALS.cooks),
    },
    {
      ...STAT_META.sleep,
      value: sleep.hours === null ? "—" : fmtMins(Math.round(sleep.hours * 60)),
      note: error
        ? failed
        : sleep.hours === null
          ? "No sleep logged yet"
          : `${sleepWhen} · ${sleepQuality(sleep.hours)}`,
      pct: sleep.hours === null ? 0 : pctOf(sleep.hours, GOALS.sleepHours),
    },
  ];

  return (
    <div className="px-10 py-6">
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            Daily overview
          </p>
          <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
            {greetingFor(new Date().getHours())}, {user?.user_metadata.name}.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A little progress every day adds up to big results.
          </p>
        </div>

          <DailyProgress tasks={tasks} />
      </header>

      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          {/* Weekly rhythm */}
          <section className={`${CARD} flex flex-col p-6`}>
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
              {WEEK.map(({ day, value }) => (
                <div
                  key={day}
                  role="img"
                  aria-label={`${day}: ${value}%`}
                  style={{ height: `${value}%` }}
                  className={`flex-1 rounded-t-lg ${
                    day === HIGHLIGHT_DAY
                      ? "bg-gradient-to-b from-emerald-300 to-emerald-700"
                      : "bg-white/[0.08]"
                  }`}
                />
              ))}
            </div>
            <div className="mt-3 flex gap-3 sm:gap-4">
              {WEEK.map(({ day }) => (
                <span key={day} className="flex-1 text-center text-sm text-zinc-500">
                  {day}
                </span>
              ))}
            </div>
          </section>

          {/* Today's focus */}
          <section className={`${CARD} min-w-0 p-6`}>
            <h2 className="text-lg font-medium">Today&apos;s focus</h2>
            <p className="text-zinc-500">
              {completed} of {tasks.length} complete
            </p>

            {tasks.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-white/[0.04] px-4 py-8 text-center text-zinc-500">
                No tasks for today yet.
              </p>
            ) : (
              <ul className="mt-6 max-h-[22rem] space-y-3 overflow-y-auto overscroll-contain pr-1 [scrollbar-width:thin]">
                {visible.map((t) => (
                  <li key={t.id}>
                    <form action={toggleTask}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="completed" value={String(!t.completed)} />
                      <button
                        type="submit"
                        aria-pressed={t.completed}
                        className="flex w-full items-center gap-4 rounded-2xl bg-white/[0.04] px-4 py-4 text-left transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                            t.completed
                              ? "border-emerald-500 bg-emerald-500 text-emerald-950"
                              : "border-white/20"
                          }`}
                        >
                          {t.completed && <Check className="h-4 w-4" strokeWidth={3} />}
                        </span>
                        <span className="min-w-0 leading-tight">
                          <span
                            className={`block truncate ${
                              t.completed ? "text-zinc-500 line-through" : "text-zinc-100"
                            }`}
                          >
                            {t.title}
                          </span>
                          {t.description && (
                            <span className="block truncate text-sm text-zinc-600">
                              {t.description}
                            </span>
                          )}
                        </span>
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}

            {hiddenCount > 0 && (
              <Link
                href="/todos"
                className="mt-4 flex items-center justify-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
              >
                Show more (+{hiddenCount})
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
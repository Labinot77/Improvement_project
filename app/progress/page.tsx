import type { ReactNode } from "react";
import { Flame } from "lucide-react";
import { getTodosData } from "@/lib/progress/getTodos";
import {
  CARD,
  EYEBROW_COLOR,
} from "@/constants/progress/template";
import { TaskList } from "./components/List";
import ProgressTracker from "./components/Util/ProgressTracker";
import FocusTip from "./components/Util/FocusTip";

function SectionHeading({
  title,
  count,
  action,
}: {
  title: string;
  count: number;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="flex items-baseline gap-2 text-lg font-medium">
        {title}
        <span className="text-zinc-600">{count}</span>
      </h2>
      {action}
    </div>
  );
}

export default async function TodosPage() {
  const { todayTasks, upcoming, streak, error } = await getTodosData();

  const total = todayTasks.length;
  const done = todayTasks.filter((t) => t.completed).length;

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`mb-4 text-sm font-medium uppercase tracking-[0.3em] ${EYEBROW_COLOR}`}>
              Daily focus
            </p>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">To-dos</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              A clear place for everything that needs your attention.
            </p>
          </div>

          <div className={`${CARD} flex items-center gap-4 rounded-2xl px-5 py-4`}>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-orange-400/10 text-orange-300">
              <Flame className="size-6" />
            </span>
            <div>
              <p className="text-xl font-medium leading-tight">{streak} day streak</p>
              <p className="text-zinc-500">Keep the momentum going</p>
            </div>
          </div>
        </header>

        {error && (
          <p className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
            Couldn&apos;t load your tasks: {error}
          </p>
        )}

          
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">

          {/* Lists */}
          <div className="space-y-10">
            <section>
              <div className={`${CARD} divide-y divide-white/[0.06] overflow-hidden`}>
                {total === 0 ? (
                  <p className="px-6 py-8 text-center text-zinc-500">
                    No tasks for today yet.
                  </p>
                ) : (
                  <TaskList tasks={todayTasks} />
                )}
              </div>
            </section>

            {upcoming.length > 0 && (
              <section>
                <SectionHeading title="Upcoming" count={upcoming.length} />
                <div className={`${CARD} overflow-hidden`}>
                  <TaskList tasks={upcoming} showDate />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar cards */}
          <aside className="space-y-6">
          <ProgressTracker total={total} done={done} />
          <FocusTip/>
          </aside>
        </div>
      </div>
  );
}
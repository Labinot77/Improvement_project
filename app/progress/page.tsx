import { Flame } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import { getTodosData } from "@/app/progress/store/main";
import { CARD, EYEBROW_COLOR } from "@/constants/progress/template";
import { TodayProvider } from "./components/TodayProvider";
import { TodayTasks } from "./components/TodayTasks";
import { UpcomingTasks } from "./components/UpcomingTasks";
import ProgressTracker from "./components/Util/ProgressTracker";
import FocusTip from "./components/Util/FocusTip";
import { StatTiles } from "./components/Insights/StatTiles";
import { InsightsSection } from "./components/Insights/InsightsSection";

// To-dos page: today's tasks, live progress and insights
export default async function TodosPage() {
  const { todayTasks, upcoming, stats, error } = await getTodosData();
  const streak = stats?.streak ?? 0;

  return (
    <div className="space-y-12 px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Daily focus"
        eyebrowClass={EYEBROW_COLOR}
        title="To-dos"
        subtitle="A clear place for everything that needs your attention."
        aside={
          <div className={`${CARD} flex items-center gap-4 rounded-2xl px-5 py-4`}>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-orange-400/10 text-orange-300">
              <Flame className={`size-6 ${streak > 0 ? "animate-pulse" : ""}`} />
            </span>
            <div>
              <p className="text-xl font-medium leading-tight">{streak} day streak</p>
              <p className="text-zinc-500">{streak > 0 ? "Keep the momentum going" : "Finish today to start one"}</p>
            </div>
          </div>
        }
      />

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your tasks: {error}
        </p>
      )}

      {stats && <StatTiles stats={stats} />}

      <TodayProvider tasks={todayTasks}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
          <div className="space-y-10">
            <TodayTasks />
            <UpcomingTasks tasks={upcoming} />
          </div>

          <aside className="space-y-6">
            <ProgressTracker />
            <FocusTip />
          </aside>
        </div>
      </TodayProvider>

      {stats && <InsightsSection stats={stats} />}
    </div>
  );
}

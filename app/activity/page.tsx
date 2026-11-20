import { Clock, Flame, Timer, Trophy } from "lucide-react";
import { ACTIVITY_META, WEEKLY_GOAL } from "@/constants/fitness";
import { FILTERS, byDate, dateLabel, dayKey, formatMinutes, getStats, lastDays, type Filter } from "@/app/activity/data/main";
import { getActivities } from "@/app/activity/store/main";
import { ActivityButton } from "@/app/activity/components/Button";
import { FilterTabs } from "@/app/activity/components/FilterTabs";
import { Heatmap } from "@/app/activity/components/Heatmap";
import { MotionItem, MotionList } from "@/app/recipes/Motion";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/50";
const card = "rounded-[2rem] border border-white/10 bg-[#11131a] p-8";

// Server-rendered activity overview, filtered by ?filter=
export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  const all = await getActivities();

  // Only show tabs for types the user has logged
  const filters = FILTERS.filter((f) => f === "All activities" || all.some((a) => a.type === f));
  const active: Filter = filters.includes(filter as Filter) ? (filter as Filter) : "All activities";
  const activities = active === "All activities" ? all : all.filter((a) => a.type === active);

  const stats = getStats(activities);
  const map = byDate(activities);
  const today = dayKey();
  const color = active === "All activities" ? "#fda4af" : ACTIVITY_META[active].color;
  const progress = Math.min(stats.weekCount / WEEKLY_GOAL, 1);

  const tiles = [
    { label: "Total sessions", value: stats.total, Icon: Trophy },
    { label: "Total time", value: formatMinutes(stats.totalMins), Icon: Clock },
    { label: "Avg duration", value: formatMinutes(stats.avg), Icon: Timer },
    { label: "Day streak", value: stats.streak, Icon: Flame },
  ];

  return (
    <main className="px-10 py-6">
      <p className="text-sm font-medium tracking-[0.3em] text-rose-300">TRAINING LOG</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Activity</h1>
      <p className="mt-4 text-lg text-zinc-500">Log sessions, keep the streak alive, and watch consistency build.</p>

      <FilterTabs active={active} filters={filters} />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* This week */}
        <article
          className="flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-8 lg:col-span-7"
          style={{ background: `radial-gradient(120% 120% at 0% 0%, ${color}33, transparent 60%), #11131a` }}
        >
          <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">This week</span>
          <div>
            <p className="text-lg text-zinc-300/80">{formatMinutes(stats.weekMins)} trained · goal {WEEKLY_GOAL} sessions</p>
            <h2 className="mt-3 text-6xl font-semibold tracking-tight tabular-nums">
              {stats.weekCount}<span className="text-zinc-500">/{WEEKLY_GOAL}</span>
            </h2>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress * 100}%`, background: color }} />
            </div>
            <div className="mt-8 grid grid-cols-7 gap-2">
              {lastDays(7).map((d) => {
                const sessions = map[d] ?? [];
                return (
                  <ActivityButton key={d} mode="day" date={d} sessions={sessions}
                    className={`flex flex-col items-center gap-2 rounded-2xl py-3 transition hover:bg-white/[0.06] ${focus}`}>
                    <span className={`grid size-11 place-items-center rounded-xl text-lg ${
                      sessions.length ? "bg-white/10" : d === today ? "border border-dashed border-white/20" : "bg-white/[0.03]"
                    }`}>
                      {sessions[0] ? ACTIVITY_META[sessions[0].type].icon : ""}
                    </span>
                    <span className={`text-sm ${d === today ? "text-zinc-200" : "text-zinc-500"}`}>{dateLabel(d, { weekday: "short" })}</span>
                  </ActivityButton>
                );
              })}
            </div>
          </div>
        </article>

        {/* Stats */}
        <section aria-label="Stats" className="grid grid-cols-2 gap-6 lg:col-span-5">
          {tiles.map(({ label, value, Icon }) => (
            <div key={label} className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#11131a] p-6">
              <Icon className="size-6 text-rose-300" aria-hidden />
              <div className="mt-6">
                <p className="text-4xl font-semibold tabular-nums">{value}</p>
                <p className="mt-1.5 text-zinc-500">{label}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Heatmap */}
      <section aria-labelledby="history-title" className={`${card} mt-6`}>
        <h2 id="history-title" className="text-xl font-semibold">Activity history</h2>
        <p className="mb-6 mt-1.5 text-zinc-500">Last 20 weeks · shaded by intensity</p>
        <Heatmap activities={activities} color={color} />
      </section>

      {/* Sessions */}
      <h2 className="mt-12 text-xl font-semibold">Recent sessions</h2>
      {activities.length === 0 && (
        <p className={`${card} mt-6 text-center text-zinc-500`}>No sessions logged yet. Use “Add Activity” above to log your first one.</p>
      )}
      <MotionList className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activities.slice(0, 24).map((a) => (
          <MotionItem key={a.id}>
            <ActivityButton mode="day" date={a.date} sessions={map[a.date]}
              className={`block w-full rounded-[1.75rem] border border-white/10 bg-[#11131a] p-6 text-left transition hover:border-white/20 ${focus}`}>
              <span className="grid size-12 place-items-center rounded-xl text-2xl" style={{ background: `${ACTIVITY_META[a.type].color}1f` }} aria-hidden>
                {ACTIVITY_META[a.type].icon}
              </span>
              <p className="mt-5 text-sm" style={{ color: ACTIVITY_META[a.type].color }}>{dateLabel(a.date)}</p>
              <h3 className="mt-1 text-xl font-semibold">{a.type}</h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm text-zinc-500">{a.notes || "No notes."}</p>
              <p className="mt-4 flex items-center gap-2 text-zinc-400">
                <Clock className="size-4" aria-hidden /> {formatMinutes(a.durationMins)}
              </p>
            </ActivityButton>
          </MotionItem>
        ))}
      </MotionList>
    </main>
  );
}

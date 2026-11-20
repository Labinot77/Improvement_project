import { CalendarCheck, Flame, Moon, Sun, Trophy, Timer } from "lucide-react";
import { TARGET_HOURS } from "@/constants/sleep/main";
import { dateLabel, formatDuration, getStats, sleepStatus } from "@/app/sleep/data/main";
import { getSleepEntries } from "@/app/sleep/store/main";
import { SleepButton } from "@/app/sleep/components/Button";
import { SleepChart } from "@/app/sleep/components/SleepChart";
import { MotionItem, MotionList } from "@/app/recipes/Motion";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/50";
const card = "rounded-[2rem] border border-white/10 bg-[#11131a] p-8";

// Server-rendered sleep overview
export default async function SleepPage() {
  const entries = await getSleepEntries();
  const last = entries[0];
  const stats = getStats(entries);

  const tiles = [
    { label: "Avg duration", value: stats.avg ? formatDuration(stats.avg) : "—", Icon: Timer },
    { label: "Night streak", value: stats.streak, Icon: Flame },
    { label: "Consistency (30d)", value: `${stats.consistency}%`, Icon: CalendarCheck },
    { label: "Best night", value: stats.best ? formatDuration(stats.best) : "—", Icon: Trophy },
  ];

  return (
    <main className="px-10 py-6">
      <p className="text-sm font-medium tracking-[0.3em] text-indigo-300">REST &amp; RECOVERY</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Sleep</h1>
      <p className="mt-4 text-lg text-zinc-500">Track your nights, hit your {TARGET_HOURS}h target, and build a steady rhythm.</p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Last night */}
        <article
          className="flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-8 lg:col-span-7"
          style={{ background: "radial-gradient(120% 120% at 0% 0%, #a5b4fc33, transparent 60%), #11131a" }}
        >
          <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">Latest night</span>
          {last ? (
            <div>
              <p className="text-lg text-zinc-300/80">{dateLabel(last.date, { weekday: "long", month: "long", day: "numeric" })}</p>
              <h2 className="mt-3 text-6xl font-semibold tracking-tight tabular-nums">{formatDuration(last.durationHours)}</h2>
              <p className="mt-4 flex flex-wrap items-center gap-5 text-lg text-zinc-400">
                <span className="flex items-center gap-2"><Moon className="size-5 text-indigo-300" aria-hidden /> {last.bedtime}</span>
                <span className="flex items-center gap-2"><Sun className="size-5 text-amber-300" aria-hidden /> {last.wakeTime}</span>
                <span className="rounded-full px-3 py-1 text-sm" style={{ color: sleepStatus(last.durationHours).color, background: `${sleepStatus(last.durationHours).color}1a` }}>
                  {sleepStatus(last.durationHours).label}
                </span>
              </p>
              <SleepButton entry={last}
                className={`mt-8 rounded-full bg-white px-7 py-3.5 text-base font-medium text-zinc-900 transition hover:bg-zinc-200 ${focus}`}>
                View night
              </SleepButton>
            </div>
          ) : (
            <p className="text-lg text-zinc-400">No nights logged yet. Use “Add Sleep” above to log your first one.</p>
          )}
        </article>

        {/* Stats */}
        <section aria-label="Stats" className="grid grid-cols-2 gap-6 lg:col-span-5">
          {tiles.map(({ label, value, Icon }) => (
            <div key={label} className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-[#11131a] p-6">
              <Icon className="size-6 text-indigo-300" aria-hidden />
              <div className="mt-6">
                <p className="text-4xl font-semibold tabular-nums">{value}</p>
                <p className="mt-1.5 text-zinc-500">{label}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Trend */}
      <section aria-labelledby="trend-title" className={`${card} mt-6`}>
        <h2 id="trend-title" className="text-xl font-semibold">Duration trend</h2>
        <p className="mb-6 mt-1.5 text-zinc-500">Last 14 nights · dashed line is your {TARGET_HOURS}h target</p>
        <SleepChart entries={entries} />
      </section>

      {/* Recent nights */}
      <h2 className="mt-12 text-xl font-semibold">Recent nights</h2>
      <MotionList className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {entries.slice(0, 24).map((e) => {
          const status = sleepStatus(e.durationHours);
          return (
            <MotionItem key={e.id}>
              <SleepButton entry={e}
                className={`block w-full rounded-[1.75rem] border border-white/10 bg-[#11131a] p-6 text-left transition hover:border-white/20 ${focus}`}>
                <p className="text-sm text-indigo-300">{dateLabel(e.date)}</p>
                <h3 className="mt-2 text-3xl font-semibold tabular-nums">{formatDuration(e.durationHours)}</h3>
                <p className="mt-2 text-sm tabular-nums text-zinc-500">{e.bedtime} → {e.wakeTime}</p>
                <p className="mt-4 line-clamp-2 min-h-10 text-sm text-zinc-500">{e.notes || "No notes."}</p>
                <span className="mt-4 inline-block rounded-full px-2.5 py-0.5 text-xs" style={{ color: status.color, background: `${status.color}1a` }}>
                  {status.label}
                </span>
              </SleepButton>
            </MotionItem>
          );
        })}
      </MotionList>
    </main>
  );
}

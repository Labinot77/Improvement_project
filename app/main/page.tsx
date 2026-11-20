import Link from "next/link";
import { ArrowUpRight, Check, Dumbbell, BookOpen, Moon, ListChecks } from "lucide-react";
import { getUser } from "@/lib/user/getUser_server";
import { getDashboard } from "@/app/main/store/main";
import { toggleTask } from "@/app/main/actions/main";
import { AREA, summarize } from "@/app/main/data/main";
import { dateLabel, formatMinutes } from "@/app/activity/data/main";
import { formatDuration } from "@/lib/sleep/calc";
import { moodOf, MOODS } from "@/constants/journal";
import { BalanceRings, BodyRestChart, LearningBars, TaskBars, TrainingMix } from "@/app/main/components/Charts";

const panel = "rounded-3xl border border-white/[0.07] bg-[#101216] p-6";

// Greeting by hour
const greeting = (h: number) => (h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");

// Panel header with optional link to the area page
function Head({ title, sub, href, color }: { title: string; sub: string; href?: string; color?: string }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-medium">
          {color && <span className="size-2 rounded-full" style={{ background: color }} />}
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{sub}</p>
      </div>
      {href && (
        <Link href={href} aria-label={`Open ${title}`} className="grid size-9 place-items-center rounded-full bg-white/[0.05] text-zinc-400 transition hover:bg-white/10 hover:text-zinc-100">
          <ArrowUpRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

// Server-rendered dashboard: one summary of every area
export default async function Dashboard() {
  const [user, raw] = await Promise.all([getUser(), getDashboard()]);
  const s = summarize(raw);
  const name: string = (user?.user_metadata?.name ?? user?.user_metadata?.user_name ?? "").split(" ")[0];
  const done = s.todayTasks.filter((t) => t.completed).length;

  const kpis = [
    { label: "Active this week", value: formatMinutes(s.kpis.weekMinutes), Icon: Dumbbell, color: AREA.activity },
    { label: "Avg sleep (7d)", value: s.kpis.sleepAvg ? formatDuration(Math.round(s.kpis.sleepAvg * 10) / 10) : "—", Icon: Moon, color: AREA.sleep },
    { label: "Lessons (7d)", value: s.kpis.lessons, Icon: BookOpen, color: AREA.lessons },
    { label: "To-dos done (7d)", value: s.kpis.tasksDone, Icon: ListChecks, color: AREA.tasks },
  ];

  return (
    <main className="px-10 py-6">
      {/* Header + KPI ribbon */}
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">Command center</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
        {greeting(new Date().getHours())}{name && <>, <span className="bg-gradient-to-r from-sky-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">{name}</span></>}.
      </h1>
      {raw.error && <p role="alert" className="mt-4 text-red-400">Some data couldn&apos;t load: {raw.error}</p>}

      <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/[0.07] lg:grid-cols-4">
        {kpis.map(({ label, value, Icon, color }) => (
          <div key={label} className="flex items-center gap-4 border-white/[0.07] bg-[#101216] p-5 [&:not(:last-child)]:border-r">
            <span className="grid size-11 place-items-center rounded-2xl" style={{ background: `${color}1f`, color }}>
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
              <p className="text-sm text-zinc-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Weekly balance */}
        <section className={`${panel} lg:col-span-4`}>
          <Head title="Weekly balance" sub="Progress toward each goal, last 7 days" />
          <BalanceRings data={s.balance} score={s.score} />
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {s.balance.map((b) => (
              <li key={b.key} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: b.fill }} />
                <span className="text-zinc-400">{b.name}</span>
                <span className="ml-auto tabular-nums text-zinc-200">{b.value}%</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Body & rest */}
        <section className={`${panel} lg:col-span-8`}>
          <Head title="Body & rest" sub="Active minutes vs hours slept, last 14 days" href="/activity" />
          <BodyRestChart data={s.bodyRest} />
          <div className="mt-3 flex gap-5 text-sm text-zinc-500">
            <span className="flex items-center gap-2"><span className="size-2.5 rounded-sm" style={{ background: AREA.activity }} /> Active minutes</span>
            <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded" style={{ background: AREA.sleep }} /> Sleep hours</span>
          </div>
        </section>

        {/* Today's focus */}
        <section className={`${panel} lg:col-span-5`}>
          <Head title="Today's focus" sub={`${done} of ${s.todayTasks.length} complete`} href="/progress" color={AREA.tasks} />
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full" style={{ width: `${s.todayTasks.length ? (done / s.todayTasks.length) * 100 : 0}%`, background: AREA.tasks }} />
          </div>
          {s.todayTasks.length === 0 ? (
            <p className="rounded-2xl bg-white/[0.03] p-6 text-center text-zinc-500">No to-dos for today. Use Quick add above.</p>
          ) : (
            <ul className="max-h-72 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {s.todayTasks.map((t) => (
                <li key={t.id}>
                  <form action={toggleTask}>
                    <input type="hidden" name="id" value={t.id} />
                    <input type="hidden" name="completed" value={String(!t.completed)} />
                    <button type="submit" aria-pressed={t.completed}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50">
                      <span className={`grid size-6 shrink-0 place-items-center rounded-lg border ${t.completed ? "border-sky-300 bg-sky-300 text-sky-950" : "border-white/20"}`}>
                        {t.completed && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span className={`block truncate ${t.completed ? "text-zinc-500 line-through" : "text-zinc-100"}`}>{t.title}</span>
                        {t.description && <span className="block truncate text-sm text-zinc-600">{t.description}</span>}
                      </span>
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Task completion */}
        <section className={`${panel} lg:col-span-4`}>
          <Head title="Follow-through" sub="Done vs open to-dos, last 7 days" color={AREA.tasks} />
          <TaskBars data={s.taskDays} />
        </section>

        {/* Mood */}
        <section className={`${panel} lg:col-span-3`}>
          <Head title="Mood" sub="Journal, last 14 days" href="/journal" color={AREA.journal} />
          <p className="text-4xl">{s.moodAvg ? MOODS[5 - Math.round(s.moodAvg)]?.emoji : "—"}</p>
          <p className="mt-1 text-sm text-zinc-500">
            {s.moodAvg ? `Avg ${s.moodAvg.toFixed(1)} / 5 this week` : "No entries this week"}
          </p>
          <div className="mt-6 grid grid-cols-7 gap-1.5">
            {s.moods.map(({ date, mood }) => (
              <span key={date} title={`${dateLabel(date)}${mood ? ` · ${moodOf(mood).label}` : ""}`}
                className="grid aspect-square place-items-center rounded-lg bg-white/[0.04] text-sm">
                {mood ? moodOf(mood).emoji : ""}
              </span>
            ))}
          </div>
        </section>

        {/* Training mix */}
        <section className={`${panel} lg:col-span-4`}>
          <Head title="Training mix" sub="Minutes by type, last 30 days" href="/activity" color={AREA.activity} />
          <TrainingMix data={s.training} />
        </section>

        {/* Learning */}
        <section className={`${panel} lg:col-span-4`}>
          <Head title="What you're learning" sub="Lessons by category, last 30 days" href="/lessons" color={AREA.lessons} />
          <LearningBars data={s.learning} />
        </section>

        {/* Meals */}
        <section className={`${panel} lg:col-span-4`}>
          <Head title="On the menu" sub="Planned meals, next 7 days" href="/recipes" color="#bef264" />
          {s.meals.length === 0 ? (
            <p className="rounded-2xl bg-white/[0.03] p-6 text-center text-zinc-500">Nothing planned yet.</p>
          ) : (
            <ol className="relative space-y-4 border-l border-white/10 pl-5">
              {s.meals.slice(0, 5).map((m) => (
                <li key={m.id} className="relative">
                  <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full bg-lime-300" />
                  <p className="text-xs uppercase tracking-wider text-zinc-500">{dateLabel(m.date)} · {m.mealType}</p>
                  <p className="truncate text-zinc-200">{m.title}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}

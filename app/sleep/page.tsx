import { Moon, Sun } from "lucide-react";
import { TARGET_BEDTIME, TARGET_HOURS } from "@/constants/sleep/main";
import { AXIS_TICKS, axisPct, dateLabel, formatDuration, getRhythm, getStats, lastDays, sleepStatus } from "@/app/sleep/data/main";
import { getSleepEntries } from "@/app/sleep/store/main";
import { SleepButton } from "@/app/sleep/components/Button";
import { SleepChart } from "@/app/sleep/components/SleepChart";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/50";
const panel = "rounded-[1.75rem] border border-indigo-300/10 bg-[#0d0e1a] p-7";
const RING = 2 * Math.PI * 70;

// Fixed star positions for the hero backdrop
const STARS = [[8, 18], [16, 62], [27, 30], [38, 78], [47, 14], [58, 52], [66, 24], [74, 70], [83, 40], [91, 16], [95, 80], [52, 88]];

// Server-rendered sleep page: night-sky hero, sleep windows, rhythm and log
export default async function SleepPage() {
  const entries = await getSleepEntries();
  const stats = getStats(entries);
  const rhythm = getRhythm(entries.slice(0, 14));
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const nights = lastDays(14).reverse();
  const avgPct = Math.min(stats.avg / TARGET_HOURS, 1);
  const targetEnd = `${String((Number(TARGET_BEDTIME.slice(0, 2)) + TARGET_HOURS) % 24).padStart(2, "0")}${TARGET_BEDTIME.slice(2)}`;

  return (
    <main className="px-10 py-6">
      {/* Night-sky hero */}
      <section className="relative overflow-hidden rounded-[2.25rem] border border-indigo-300/15 bg-gradient-to-br from-[#1b1d4a] via-[#0f1030] to-[#07070f] p-10">
        {STARS.map(([x, y], i) => (
          <span key={i} aria-hidden className="absolute size-1 rounded-full bg-white/60" style={{ left: `${x}%`, top: `${y}%`, opacity: 0.25 + (i % 4) * 0.15 }} />
        ))}
        <div className="relative flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-md text-center lg:text-left">
            <p className="flex items-center justify-center gap-2 text-sm font-medium tracking-[0.3em] text-indigo-200/80 lg:justify-start">
              <Moon className="size-4" aria-hidden /> NIGHT LOG
            </p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Sleep</h1>
            <p className="mt-4 text-lg text-indigo-100/50">Your nights at a glance: how long, how regular, and how close to {TARGET_HOURS}h.</p>
          </div>

          {/* Average vs target ring */}
          <div className="relative size-44 shrink-0">
            <svg viewBox="0 0 160 160" className="size-44 -rotate-90" aria-hidden>
              <circle cx="80" cy="80" r="70" fill="none" strokeWidth="10" stroke="rgba(165,180,252,0.12)" />
              <circle cx="80" cy="80" r="70" fill="none" strokeWidth="10" strokeLinecap="round" stroke="#a5b4fc"
                strokeDasharray={RING} strokeDashoffset={RING * (1 - avgPct)} />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-3xl font-semibold tabular-nums">{stats.avg ? formatDuration(Math.round(stats.avg * 10) / 10) : "—"}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-indigo-200/60">avg / night</p>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-8 text-center lg:grid-cols-1 lg:gap-4 lg:text-right">
            {[
              ["Night streak", stats.streak],
              ["Consistency (30d)", `${stats.consistency}%`],
              ["Best night", stats.best ? formatDuration(stats.best) : "—"],
            ].map(([k, v]) => (
              <div key={k}>
                <dd className="text-3xl font-semibold tabular-nums">{v}</dd>
                <dt className="text-sm text-indigo-100/50">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Sleep windows timeline */}
      <section aria-labelledby="windows-title" className={`${panel} mt-6`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="windows-title" className="text-xl font-semibold">Sleep windows</h2>
            <p className="mt-1 text-zinc-500">Last 14 nights · shaded band is your target {TARGET_BEDTIME}–{targetEnd}</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="ml-28 flex justify-between pb-2 text-xs text-zinc-600">
              {AXIS_TICKS.map((t) => <span key={t}>{t}</span>)}
            </div>
            <div className="relative space-y-1.5">
              {/* Target band */}
              <div aria-hidden className="pointer-events-none absolute inset-y-0 ml-28 right-0">
                <div className="absolute inset-y-0 rounded-lg bg-indigo-300/[0.06]"
                  style={{ left: `${axisPct(TARGET_BEDTIME)}%`, width: `${axisPct(targetEnd) - axisPct(TARGET_BEDTIME)}%` }} />
              </div>
              {nights.map((d) => {
                const e = byDate.get(d);
                const start = e ? axisPct(e.bedtime) : 0;
                const end = e ? axisPct(e.wakeTime) : 0;
                const row = (
                  <>
                    <span className="w-28 shrink-0 text-left text-sm text-zinc-400">{dateLabel(d)}</span>
                    <span className="relative h-7 flex-1 rounded-lg bg-white/[0.02]">
                      {e && (
                        <span className="absolute inset-y-1 flex items-center justify-center rounded-md text-xs font-medium text-[#0d0e1a]"
                          style={{ left: `${start}%`, width: `${Math.max(end - start, 2)}%`, background: sleepStatus(e.durationHours).color }}>
                          {formatDuration(e.durationHours)}
                        </span>
                      )}
                    </span>
                  </>
                );
                return e ? (
                  <SleepButton key={d} entry={e} className={`relative flex w-full items-center rounded-lg transition hover:bg-white/[0.03] ${focus}`}>{row}</SleepButton>
                ) : (
                  <div key={d} className="relative flex items-center opacity-60">{row}</div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Durations */}
        <section aria-labelledby="dur-title" className={`${panel} lg:col-span-8`}>
          <h2 id="dur-title" className="text-xl font-semibold">Hours per night</h2>
          <p className="mb-6 mt-1 text-zinc-500">Last 30 entries · green on target, red short, orange long</p>
          <SleepChart entries={entries} />
        </section>

        {/* Rhythm */}
        <section aria-labelledby="rhythm-title" className={`${panel} lg:col-span-4`}>
          <h2 id="rhythm-title" className="text-xl font-semibold">Rhythm</h2>
          <p className="mt-1 text-zinc-500">Averages over the last 14 entries</p>
          {rhythm ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-indigo-300/[0.06] p-4">
                <span className="flex items-center gap-2 text-zinc-400"><Moon className="size-4 text-indigo-300" /> Usual bedtime</span>
                <span className="text-2xl font-semibold tabular-nums">{rhythm.bedtime}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-amber-300/[0.06] p-4">
                <span className="flex items-center gap-2 text-zinc-400"><Sun className="size-4 text-amber-300" /> Usual wake-up</span>
                <span className="text-2xl font-semibold tabular-nums">{rhythm.wakeTime}</span>
              </div>
              <div className="rounded-2xl bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Bedtime drift</span>
                  <span className="text-2xl font-semibold tabular-nums">±{rhythm.spread}m</span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {rhythm.spread <= 30 ? "Very regular. Keep it up." : rhythm.spread <= 60 ? "Fairly regular." : "Irregular. Try a fixed bedtime."}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-6 rounded-2xl bg-white/[0.04] p-5 text-zinc-500">No nights logged yet.</p>
          )}
        </section>
      </div>

      {/* Night log */}
      <section aria-labelledby="log-title" className={`${panel} mt-6`}>
        <h2 id="log-title" className="text-xl font-semibold">Night log</h2>
        {entries.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-white/[0.04] p-5 text-zinc-500">Nothing yet. Use “Add Sleep” above to log your first night.</p>
        ) : (
          <ul className="mt-4 divide-y divide-white/[0.06]">
            {entries.slice(0, 30).map((e) => {
              const st = sleepStatus(e.durationHours);
              return (
                <li key={e.id}>
                  <SleepButton entry={e} className={`grid w-full grid-cols-[8rem_7rem_5rem_1fr_auto] items-center gap-4 rounded-xl px-2 py-3.5 text-left transition hover:bg-white/[0.03] ${focus}`}>
                    <span className="text-zinc-300">{dateLabel(e.date)}</span>
                    <span className="tabular-nums text-zinc-500">{e.bedtime} → {e.wakeTime}</span>
                    <span className="font-semibold tabular-nums">{formatDuration(e.durationHours)}</span>
                    <span className="truncate text-sm text-zinc-500">{e.notes}</span>
                    <span className="size-2.5 rounded-full" style={{ background: st.color }} title={st.label} />
                  </SleepButton>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

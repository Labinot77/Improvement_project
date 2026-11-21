import { Flame, PenLine } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import { CARD } from "@/constants/ui";
import { moodOf, promptForDate, streak, todayISO, weekDays, weekdayShort } from "@/constants/journal";
import { getEntriesBetween, getJournalMeta } from "../store/main";
import { JournalButton } from "./Button";
import { MoodChart } from "./MoodChart";

// Header, today's prompt, this week and the mood chart (not re-fetched on page changes)
export async function JournalHero() {
  const today = todayISO();
  const week = weekDays();
  const [meta, weekEntries] = await Promise.all([getJournalMeta(), getEntriesBetween(week[0], week[6])]);
  const byDate = new Map(weekEntries.map((e) => [e.date, e]));
  const todayEntry = byDate.get(today);
  const run = streak(meta.recent.map((e) => e.date));

  return (
    <>
      <PageHeader
        eyebrow="Daily journal"
        eyebrowClass="text-emerald-300"
        title="Journal"
        subtitle="A few honest lines a day. Patterns show up faster than you think."
        aside={
          <div className={`${CARD} flex items-center gap-4 rounded-2xl px-5 py-4`}>
            <span className="grid size-12 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
              <Flame className="size-5" />
            </span>
            <div>
              <p className="text-xl font-medium leading-tight">{run} day streak</p>
              <p className="text-zinc-500">{meta.total} entries in total</p>
            </div>
          </div>
        }
      />

      {/* Prompt + week/mood */}
      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/[0.12] via-[#13161a] to-[#16181b] p-6 ring-1 ring-emerald-300/10 sm:p-8">
          <PenLine className="pointer-events-none absolute -right-6 -top-6 size-40 text-emerald-300/[0.06]" />
          <div className="relative">
            <p className="text-xs tracking-[0.25em] text-emerald-300/70">TODAY&apos;S PROMPT</p>
            <p className="mt-4 font-serif text-2xl leading-snug text-zinc-100 sm:text-3xl">“{promptForDate(today)}”</p>
          </div>
          <div className="relative mt-8">
            <JournalButton
              entry={todayEntry}
              date={today}
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-medium text-black transition hover:bg-emerald-300"
            >
              {todayEntry ? "Open today's entry" : "Write today's entry"}
            </JournalButton>
          </div>
        </div>

        <div className={`${CARD} p-6`}>
          <p className="text-sm font-medium text-zinc-100">This week</p>
          <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
            {week.map((d) => {
              const e = byDate.get(d);
              const future = d > today;
              const cls = `flex flex-col items-center gap-0.5 rounded-xl py-2.5 text-xs transition ${
                e ? "bg-emerald-400/15 text-emerald-200" : "bg-white/[0.03] text-zinc-500"
              } ${d === today ? "ring-1 ring-emerald-300/60" : ""}`;
              const inner = (
                <>
                  <span>{weekdayShort(d)}</span>
                  <span className="text-base">{e ? moodOf(e.mood).emoji : Number(d.slice(8))}</span>
                </>
              );
              return future ? (
                <div key={d} className={`${cls} opacity-40`}>
                  {inner}
                </div>
              ) : (
                <JournalButton key={d} entry={e} date={d} className={`${cls} hover:bg-emerald-400/25`}>
                  {inner}
                </JournalButton>
              );
            })}
          </div>
          <p className="mt-6 text-sm font-medium text-zinc-100">Mood · last 90 days</p>
          <MoodChart rows={meta.recent} />
        </div>
      </section>

    </>
  );
}

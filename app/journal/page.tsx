import { Flame } from "lucide-react";
import { getEntries } from "./store/main";
import {
  filterEntries,
  formatDay,
  isFilter,
  promptForDate,
  streak,
  todayISO,
  weekDays,
  weekdayShort,
  wordCount,
} from "@/constants/journal";
import { JournalButton } from "./components/Button";
import { FilterTabs } from "./components/FilterTabs";
import { MoodChip } from "./components/MoodChips";
import { MotionItem, MotionList } from "./components/Motion";

const PILL =
  "rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const active = isFilter(filter) ? filter : "all";

  const all = await getEntries();
  const entries = filterEntries(all, active);

  const today = todayISO();
  const todayEntry = all.find((e) => e.date === today);
  const byDate = new Map(all.map((e) => [e.date, e]));
  const run = streak(all.map((e) => e.date));

  return (
    <main className="px-4 py-6 sm:px-8 sm:py-10">
      <header>
        <p className="text-xs tracking-[0.2em] text-emerald-300/80">DAILY JOURNAL</p>
        <h1 className="mt-1 text-4xl font-semibold text-zinc-100">Journal</h1>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col justify-between rounded-[2rem] bg-[#11131a] p-8 ring-1 ring-white/5">
          <div>
            <p className="text-xs tracking-[0.2em] text-zinc-500">TODAY&apos;S PROMPT</p>
            <p className="mt-4 text-2xl font-medium leading-snug text-zinc-100">
              {promptForDate(today)}
            </p>
          </div>
          <div className="mt-8">
            {todayEntry ? (
              <JournalButton entry={todayEntry} className={PILL}>
                Open today&apos;s entry
              </JournalButton>
            ) : (
              <JournalButton date={today} className={PILL}>
                Write today&apos;s entry
              </JournalButton>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#11131a] p-6 ring-1 ring-white/5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-100">This week</p>
            <p className="flex items-center gap-1.5 text-sm text-emerald-300">
              <Flame className="size-4" />
              {run} day streak
            </p>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {weekDays().map((d) => {
              const e = byDate.get(d);
              const cls = `flex flex-col items-center gap-1 rounded-2xl py-3 text-xs ${
                e ? "bg-emerald-400/15 text-emerald-300" : "bg-[#16181b] text-zinc-500"
              } ${d === today ? "ring-1 ring-emerald-300/60" : ""}`;
              const inner = (
                <>
                  <span>{weekdayShort(d)}</span>
                  <span className="text-base font-medium">{Number(d.slice(8))}</span>
                </>
              );

              return d > today ? (
                <div key={d} className={`${cls} opacity-40`}>
                  {inner}
                </div>
              ) : (
                <JournalButton
                  key={d}
                  entry={e}
                  date={d}
                  className={`${cls} transition hover:bg-emerald-400/25`}
                >
                  {inner}
                </JournalButton>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-zinc-500">
            {all.length} {all.length === 1 ? "entry" : "entries"} in total
          </p>
        </div>
      </section>

      <FilterTabs active={active} />

      {entries.length === 0 ? (
        <div className="rounded-[2rem] bg-[#11131a] p-10 text-center ring-1 ring-white/5">
          <p className="text-zinc-300">No entries here yet.</p>
          <p className="mt-1 text-sm text-zinc-500">
            {active === "all" ? "Write your first one above." : "Try another filter."}
          </p>
        </div>
      ) : (
        <MotionList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((e) => (
            <MotionItem key={e.id} className="flex">
              <JournalButton
                entry={e}
                className="flex w-full flex-col rounded-[2rem] bg-[#11131a] p-6 text-left ring-1 ring-white/5 transition hover:ring-emerald-300/30"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-zinc-100">{formatDay(e.date)}</span>
                  <MoodChip mood={e.mood} />
                </span>
                {e.prompt && (
                  <span className="mt-3 line-clamp-1 block text-xs italic text-zinc-500">
                    {e.prompt}
                  </span>
                )}
                <span className="mt-3 line-clamp-5 block flex-1 text-sm leading-relaxed text-zinc-300">
                  {e.content}
                </span>
                <span className="mt-4 block text-xs text-zinc-500">
                  {wordCount(e.content)} words
                </span>
              </JournalButton>
            </MotionItem>
          ))}
        </MotionList>
      )}
    </main>
  );
}
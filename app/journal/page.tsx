import { Flame, PenLine } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import { CARD } from "@/constants/ui";
import { formatDay, isFilter, moodOf, promptForDate, streak, todayISO, weekDays, weekdayShort, wordCount } from "@/constants/journal";
import { PAGE_SIZE, getEntriesBetween, getEntriesPage, getJournalMeta } from "./store/main";
import { JournalButton } from "./components/Button";
import { FilterTabs } from "./components/FilterTabs";
import { SearchBar } from "./components/SearchBar";
import { MoodChart } from "./components/MoodChart";
import { MoodChip } from "./components/MoodChips";
import { MotionItem, MotionList } from "./components/Motion";
import { JournalPagination } from "./components/JournalPagination";

type Search = { filter?: string; q?: string; page?: string };

// Journal: today's prompt, week + mood overview, searchable paginated entries
export default async function JournalPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filter = isFilter(sp.filter) ? sp.filter : "all";
  const q = (sp.q ?? "").slice(0, 80);
  const page = Math.max(1, Number(sp.page) || 1);

  const today = todayISO();
  const week = weekDays();
  const [{ entries, total }, meta, weekEntries] = await Promise.all([
    getEntriesPage({ filter, q, page }),
    getJournalMeta(),
    getEntriesBetween(week[0], week[6]),
  ]);
  const byDate = new Map(weekEntries.map((e) => [e.date, e]));
  const todayEntry = byDate.get(today);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const run = streak(meta.recent.map((e) => e.date));

  return (
    <main className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
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

      {/* Toolbar */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs active={filter} />
          <SearchBar />
        </div>

        <p className="text-sm text-zinc-500">
          {total} {total === 1 ? "entry" : "entries"}
          {q && <> matching “{q}”</>}
          {pages > 1 && <> · page {page} of {pages}</>}
        </p>

        {entries.length === 0 ? (
          <div className={`${CARD} p-10 text-center`}>
            <p className="text-zinc-300">Nothing here.</p>
            <p className="mt-1 text-sm text-zinc-500">
              {q ? "Try a different search." : filter === "all" ? "Write your first entry above." : "Try another filter."}
            </p>
          </div>
        ) : (
          <MotionList className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((e) => (
              <MotionItem key={e.id} className="flex">
                <JournalButton
                  entry={e}
                  className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-[#16181b] p-6 text-left transition hover:-translate-y-0.5 hover:border-emerald-300/25"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-zinc-100">{formatDay(e.date)}</span>
                    <MoodChip mood={e.mood} />
                  </span>
                  {e.prompt && <span className="mt-3 line-clamp-1 block text-xs italic text-zinc-500">{e.prompt}</span>}
                  <span className="mt-3 line-clamp-5 block flex-1 text-sm leading-relaxed text-zinc-300">{e.content}</span>
                  <span className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                    {wordCount(e.content)} words
                    <span className="text-emerald-300 opacity-0 transition group-hover:opacity-100">Open →</span>
                  </span>
                </JournalButton>
              </MotionItem>
            ))}
          </MotionList>
        )}

        <JournalPagination page={Math.min(page, pages)} pages={pages} params={{ filter: sp.filter, q: sp.q }} />
      </section>
    </main>
  );
}

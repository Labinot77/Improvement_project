import { Flame, Feather, Quote } from "lucide-react";
import { getEntriesPage, getOverview } from "./store/main";
import { MOODS, formatDay, isFilter, moodOf, parseISO, promptForDate, streak, toISO, todayISO, wordCount } from "@/constants/journal";
import { JournalButton } from "./components/Button";
import { FilterTabs } from "./components/FilterTabs";
import { Search } from "./components/Search";
import { Pager } from "./components/Pager";
import { MotionItem, MotionList } from "./components/Motion";

const serif = "font-serif";

// Last 35 days (5 weeks), oldest first
function last35() {
  return Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return toISO(d);
  });
}

// Server-rendered journal: today's prompt, mood calendar, searchable paginated list
export default async function JournalPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const filter = isFilter(sp.filter) ? sp.filter : "all";
  const q = (sp.q ?? "").slice(0, 100);
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);

  const [overview, list] = await Promise.all([getOverview(), getEntriesPage({ page, filter, q })]);
  const today = todayISO();
  const moodBy = new Map(overview.marks.map((m) => [m.date, m.mood]));
  const run = streak(overview.marks.map((m) => m.date));
  const days = last35();

  return (
    <main className="px-10 py-6">
      <p className="flex items-center gap-2 text-sm font-medium tracking-[0.3em] text-amber-200/80">
        <Feather className="size-4" aria-hidden /> DAILY JOURNAL
      </p>
      <h1 className={`${serif} mt-3 text-5xl tracking-tight sm:text-6xl`}>Journal</h1>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Today's prompt */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-amber-100/10 bg-gradient-to-br from-[#2a2216] via-[#17140f] to-[#0f0e0c] p-9">
          <Quote className="absolute -right-4 -top-4 size-40 text-amber-100/[0.04]" aria-hidden />
          <div className="relative">
            <p className="text-xs tracking-[0.25em] text-amber-200/60">TODAY&apos;S PROMPT · {formatDay(today).toUpperCase()}</p>
            <p className={`${serif} mt-5 max-w-xl text-3xl italic leading-snug text-amber-50`}>&ldquo;{promptForDate(today)}&rdquo;</p>
          </div>
          <div className="relative mt-10 flex flex-wrap items-center gap-4">
            <JournalButton entry={overview.today ?? undefined} date={today}
              className="rounded-full bg-amber-100 px-6 py-3 text-sm font-medium text-[#1a1510] transition hover:bg-amber-50">
              {overview.today ? "Read today’s entry" : "Start writing"}
            </JournalButton>
            {overview.today && <span className="text-sm text-amber-100/50">{moodOf(overview.today.mood).emoji} {wordCount(overview.today.content)} words written</span>}
          </div>
        </div>

        {/* Mood calendar */}
        <div className="rounded-[2rem] border border-amber-100/10 bg-[#12110e] p-7">
          <div className="flex items-center justify-between">
            <p className="font-medium">Mood, last 5 weeks</p>
            <p className="flex items-center gap-1.5 text-sm text-amber-200"><Flame className="size-4" aria-hidden /> {run} day streak</p>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {days.map((d) => {
              const mood = moodBy.get(d);
              return (
                <span key={d}
                  title={`${formatDay(d)}${mood ? ` · ${moodOf(mood).label}` : ""}`}
                  className={`aspect-square rounded-md ${d === today ? "ring-1 ring-amber-100/60" : ""}`}
                  style={{ background: mood ? moodOf(mood).color : "rgba(255,255,255,0.04)", opacity: mood ? 0.85 : 1 }} />
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
            {MOODS.map((m) => (
              <span key={m.value} className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: m.color }} />{m.label}</span>
            ))}
          </div>
          <p className="mt-5 border-t border-white/5 pt-4 text-sm text-zinc-500">
            <span className="text-zinc-200">{overview.total}</span> {overview.total === 1 ? "entry" : "entries"} written
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Search q={q} filter={filter} />
        <FilterTabs active={filter} q={q} />
      </div>
      <p className="mt-4 text-sm text-zinc-500">
        {list.total} {list.total === 1 ? "entry" : "entries"}{q && <> matching &ldquo;{q}&rdquo;</>} · page {Math.min(page, list.pages)} of {list.pages}
      </p>

      {/* Entries */}
      {list.entries.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border border-dashed border-amber-100/10 p-12 text-center">
          <p className={`${serif} text-xl text-zinc-300`}>{q || filter !== "all" ? "Nothing matches." : "Your journal is empty."}</p>
          <p className="mt-1 text-sm text-zinc-500">{q || filter !== "all" ? "Try another search or filter." : "Start with today's prompt above."}</p>
        </div>
      ) : (
        <MotionList className="mt-6 border-l border-amber-100/10">
          {list.entries.map((e) => {
            const d = parseISO(e.date);
            const mood = moodOf(e.mood);
            return (
              <MotionItem key={e.id} className="relative pl-8">
                <span className="absolute -left-[7px] top-8 size-3.5 rounded-full ring-4 ring-[#0b0b0c]" style={{ background: mood.color }} />
                <JournalButton entry={e}
                  className="group grid w-full grid-cols-[4.5rem_1fr] gap-6 rounded-3xl p-5 text-left transition hover:bg-amber-100/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/40">
                  <span className="text-center">
                    <span className={`${serif} block text-4xl leading-none text-amber-50`}>{d.getDate()}</span>
                    <span className="mt-1 block text-xs uppercase tracking-wider text-zinc-500">
                      {d.toLocaleDateString("en-GB", { month: "short" })} · {d.toLocaleDateString("en-GB", { weekday: "short" })}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm text-zinc-500">
                      <span>{mood.emoji} {mood.label}</span>
                      <span aria-hidden>·</span>
                      <span>{wordCount(e.content)} words</span>
                    </span>
                    {e.prompt && <span className={`${serif} mt-2 block truncate italic text-amber-100/60`}>{e.prompt}</span>}
                    <span className={`${serif} mt-2 line-clamp-3 block text-lg leading-relaxed text-zinc-300 group-hover:text-zinc-100`}>{e.content}</span>
                  </span>
                </JournalButton>
              </MotionItem>
            );
          })}
        </MotionList>
      )}

      <Pager page={page} pages={list.pages} filter={filter} q={q} />
    </main>
  );
}

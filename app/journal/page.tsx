import { Suspense } from "react";
import ListSkeleton from "@/app/components/ListSkeleton";
import UrlPagination from "@/app/components/UrlPagination";
import { CARD } from "@/constants/ui";
import { formatDay, isFilter, wordCount } from "@/constants/journal";
import type { JournalFilter } from "@/types/journal";
import { PAGE_SIZE, getEntriesPage } from "./store/main";
import { JournalButton } from "./components/Button";
import { MoodChip } from "./components/MoodChips";
import { MotionItem, MotionList } from "./components/Motion";

type Search = { filter?: string; q?: string; page?: string };

// One page of entries for the current filter + search
async function Entries({ filter, q, page }: { filter: JournalFilter; q: string; page: number }) {
  const { entries, total } = await getEntriesPage({ filter, q, page });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <p className="text-sm text-zinc-500">
        {total} {total === 1 ? "entry" : "entries"}
        {q && <> matching “{q}”</>}
        {pages > 1 && <> · page {Math.min(page, pages)} of {pages}</>}
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

      <UrlPagination
        basePath="/journal"
        page={Math.min(page, pages)}
        pages={pages}
        params={{ filter: filter === "all" ? undefined : filter, q: q || undefined }}
      />
    </>
  );
}

// Journal results; the hero lives in the layout so it isn't re-fetched here
export default async function JournalPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const filter = isFilter(sp.filter) ? sp.filter : "all";
  const q = (sp.q ?? "").slice(0, 80);
  const page = Math.max(1, Number(sp.page) || 1);

  return (
    <Suspense key={`${filter}|${q}|${page}`} fallback={<ListSkeleton />}>
      <Entries filter={filter} q={q} page={page} />
    </Suspense>
  );
}

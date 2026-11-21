import { Suspense } from "react";
import ListSkeleton from "@/app/components/ListSkeleton";
import UrlPagination from "@/app/components/UrlPagination";
import { ALL_CATEGORIES } from "./constants/Main";
import { LessonList } from "./components/List";
import { PAGE_SIZE, getLessonsPage } from "./store/main";

type Search = { category?: string; q?: string; page?: string };

// One page of lessons for the current category + search
async function Results({ category, q, page }: { category: string; q: string; page: number }) {
  const { lessons, total, error } = await getLessonsPage({ category, q, page });
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your lessons: {error}
        </p>
      )}
      <p className="text-sm text-zinc-500">
        {total} {total === 1 ? "lesson" : "lessons"}
        {q && <> matching “{q}”</>}
        {pages > 1 && <> · page {Math.min(page, pages)} of {pages}</>}
      </p>
      <LessonList lessons={lessons} emptyText={q ? "No lessons match that search." : category !== "All" ? "No lessons in this category yet." : "No lessons yet. Add your first one."} />
      <UrlPagination
        basePath="/lessons"
        page={Math.min(page, pages)}
        pages={pages}
        params={{ category: category === "All" ? undefined : category, q: q || undefined }}
      />
    </div>
  );
}

// Lessons results; the hero and filters live in the layout
export default async function LessonsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const category = (ALL_CATEGORIES as readonly string[]).includes(sp.category ?? "") ? (sp.category as string) : "All";
  const q = (sp.q ?? "").slice(0, 80);
  const page = Math.max(1, Number(sp.page) || 1);

  return (
    <Suspense key={`${category}|${q}|${page}`} fallback={<ListSkeleton count={4} className="sm:grid-cols-2" height="h-48" />}>
      <Results category={category} q={q} page={page} />
    </Suspense>
  );
}

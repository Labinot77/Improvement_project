import { ALL_CATEGORIES } from "@/constants/lessons/lessons";
import LessonSkeleton from "./components/Skeleton";

const bar = "animate-pulse rounded-lg bg-white/[0.06]";

// Mirrors the lessons page: static text is real, dynamic parts are placeholders,
// so nothing jumps when the real page replaces this.
export default function Loading() {
  return (
    <main className="space-y-6 lg:px-32 px-10 py-6" aria-busy="true">
      <span className="sr-only" role="status">Loading lessons…</span>

      <header>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">Wisdom archive</p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">Lessons learned</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Capture the ideas life teaches you, while they are still fresh.
        </p>
      </header>

      {/* Reflection prompt + stats */}
      <section className="flex flex-col justify-between gap-6 rounded-3xl border border-white/[0.06] bg-[#16181b] p-6 sm:p-8 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">Reflection prompt</p>
          <div className="mt-4 space-y-2.5">
            <div className={`${bar} h-7 w-full max-w-xl`} />
            <div className={`${bar} h-7 w-2/3`} />
          </div>
          <p className="mt-3 text-zinc-500">Turn experience into something you can return to.</p>
        </div>

        <div className="flex shrink-0 items-center gap-6 self-start rounded-2xl bg-white/[0.04] px-6 py-5 md:self-auto">
          <div>
            <div className={`${bar} h-8 w-10`} />
            <p className="mt-1 text-sm text-zinc-500">Lessons</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <div className={`${bar} h-8 w-10`} />
            <p className="mt-1 text-sm text-zinc-500">Categories</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2.5" aria-hidden>
          {ALL_CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="h-12 animate-pulse rounded-full border border-white/[0.1] bg-white/[0.03]"
              style={{ width: `${cat.length * 9 + 52}px` }}
            />
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
        </div>
      </div>
    </main>
  );
}
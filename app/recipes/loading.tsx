import { Utensils } from "lucide-react";
import { FILTERS } from "@/app/recipes/data/main";

const pulse = "animate-pulse bg-white/[0.06]";

// Mirrors the recipes page. Static text is real, data-driven parts are placeholders,
// so nothing jumps when the real page replaces this.
export default function Loading() {
  return (
    <main className="px-10 py-6 " aria-busy="true">
      <span className="sr-only" role="status">Loading recipes…</span>

      <p className="text-sm font-medium tracking-[0.3em] text-emerald-300">KITCHEN COLLECTION</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Recipes</h1>
      <p className="mt-4 text-lg text-zinc-500">Save favorites, plan meals, and make healthy choices easier.</p>

      {/* Filter pills, widths follow the real labels */}
      <div className="mt-9 flex flex-wrap gap-3" aria-hidden>
        {FILTERS.map((f) => (
          <div
            key={f}
            className="h-[50px] animate-pulse rounded-full border border-white/10 bg-white/[0.03]"
            style={{ width: `${f.length * 9 + 52}px` }}
          />
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12" aria-hidden>
        {/* Featured card */}
        <article className="flex min-h-[28rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#11131a] p-8 lg:col-span-7">
          <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">Tonight&apos;s pick</span>
          <div>
            <div className={`${pulse} h-5 w-36 rounded-md`} />
            <div className={`${pulse} mt-4 h-9 w-full max-w-md rounded-lg`} />
            <div className={`${pulse} mt-8 h-[52px] w-36 rounded-full`} />
          </div>
        </article>

        {/* Weekly plan */}
        <section className="rounded-[2rem] border border-white/10 bg-[#11131a] p-8 lg:col-span-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">Weekly plan</h2>
              <div className={`${pulse} mt-2.5 h-4 w-32 rounded-md`} />
            </div>
            <Utensils className="size-6 text-emerald-300" aria-hidden />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl bg-white/[0.045] p-4">
                <div className={`${pulse} size-12 shrink-0 rounded-xl`} />
                <div className={`${pulse} h-5 w-2/3 rounded-md`} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Recipe cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11131a]">
            <div className={`${pulse} h-52`} />
            <div className="p-6">
              <div className={`${pulse} h-4 w-16 rounded-md`} />
              <div className={`${pulse} mt-3 h-6 w-4/5 rounded-md`} />
              <div className="mt-4 flex items-center justify-between">
                <div className={`${pulse} h-4 w-20 rounded-md`} />
                <div className={`${pulse} h-4 w-12 rounded-md`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
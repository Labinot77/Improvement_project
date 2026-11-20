import { Feather } from "lucide-react";

const pulse = "animate-pulse bg-white/[0.05]";

// Mirrors the journal layout while data loads
export default function Loading() {
  return (
    <main className="px-10 py-6" aria-busy="true">
      <span className="sr-only" role="status">Loading journal…</span>
      <p className="flex items-center gap-2 text-sm font-medium tracking-[0.3em] text-amber-200/80"><Feather className="size-4" aria-hidden /> DAILY JOURNAL</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight sm:text-6xl">Journal</h1>
      <section className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]" aria-hidden>
        <div className="h-72 rounded-[2rem] border border-amber-100/10 bg-gradient-to-br from-[#2a2216] via-[#17140f] to-[#0f0e0c]" />
        <div className={`${pulse} h-72 rounded-[2rem]`} />
      </section>
      <div className="mt-12 flex justify-between gap-4" aria-hidden>
        <div className={`${pulse} h-12 w-full max-w-sm rounded-full`} />
        <div className={`${pulse} h-10 w-96 rounded-full`} />
      </div>
      <div className="mt-10 space-y-4 border-l border-amber-100/10 pl-8" aria-hidden>
        {[0, 1, 2, 3].map((i) => <div key={i} className={`${pulse} h-28 rounded-3xl`} />)}
      </div>
    </main>
  );
}

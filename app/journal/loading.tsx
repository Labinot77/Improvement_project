export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6 md:p-10">
      <header>
        <p className="text-xs tracking-[0.2em] text-emerald-300/80">DAILY JOURNAL</p>
        <h1 className="mt-1 text-4xl font-semibold text-zinc-100">Journal</h1>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="h-52 animate-pulse rounded-[2rem] bg-[#11131a] ring-1 ring-white/5" />
        <div className="rounded-[2rem] bg-[#11131a] p-6 ring-1 ring-white/5">
          <p className="text-sm font-medium text-zinc-100">This week</p>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#16181b]" />
            ))}
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-[#11131a]" />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-[2rem] bg-[#11131a] ring-1 ring-white/5" />
        ))}
      </div>
    </main>
  );
}
const pulse = "animate-pulse bg-white/[0.06]";

// Mirrors the activity page so nothing jumps on load
export default function Loading() {
  return (
    <main className="px-10 py-6" aria-busy="true">
      <span className="sr-only" role="status">Loading activity…</span>
      <p className="text-sm font-medium tracking-[0.3em] text-rose-300">TRAINING LOG</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Activity</h1>
      <p className="mt-4 text-lg text-zinc-500">Log sessions, keep the streak alive, and watch consistency build.</p>

      <div className="mt-9 flex gap-3" aria-hidden>
        {[150, 110, 120].map((w) => <div key={w} className="h-[50px] animate-pulse rounded-full border border-white/10 bg-white/[0.03]" style={{ width: w }} />)}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12" aria-hidden>
        <div className="min-h-[24rem] rounded-[2rem] border border-white/10 bg-[#11131a] p-8 lg:col-span-7">
          <div className={`${pulse} h-9 w-28 rounded-full`} />
          <div className={`${pulse} mt-32 h-14 w-32 rounded-lg`} />
          <div className={`${pulse} mt-6 h-2 w-full rounded-full`} />
        </div>
        <div className="grid grid-cols-2 gap-6 lg:col-span-5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-[2rem] border border-white/10 bg-[#11131a] p-6">
              <div className={`${pulse} size-6 rounded-md`} />
              <div className={`${pulse} mt-10 h-9 w-20 rounded-lg`} />
              <div className={`${pulse} mt-2 h-4 w-24 rounded-md`} />
            </div>
          ))}
        </div>
      </div>

      <div className={`${pulse} mt-6 h-64 rounded-[2rem]`} aria-hidden />
    </main>
  );
}

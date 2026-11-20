const pulse = "animate-pulse bg-white/[0.06]";

// Mirrors the sleep page layout while data loads
export default function Loading() {
  return (
    <main className="px-10 py-6" aria-busy="true">
      <span className="sr-only" role="status">Loading sleep…</span>
      <div className="h-[19rem] rounded-[2.25rem] border border-indigo-300/15 bg-gradient-to-br from-[#1b1d4a] via-[#0f1030] to-[#07070f] p-10">
        <p className="text-sm font-medium tracking-[0.3em] text-indigo-200/80">NIGHT LOG</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Sleep</h1>
      </div>
      <div className={`${pulse} mt-6 h-[30rem] rounded-[1.75rem]`} aria-hidden />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12" aria-hidden>
        <div className={`${pulse} h-80 rounded-[1.75rem] lg:col-span-8`} />
        <div className={`${pulse} h-80 rounded-[1.75rem] lg:col-span-4`} />
      </div>
    </main>
  );
}

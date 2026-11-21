import { CARD } from "@/constants/ui";

type Stat = { label: string; value: string; foot: string; accent?: boolean };

// One wide card split into stat segments
export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <div className={`${CARD} grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.06]`}>
      {stats.map((s) => (
        <div key={s.label} className="p-5 sm:p-6">
          <p className="text-sm text-zinc-500">{s.label}</p>
          <p className={`mt-2 text-3xl font-semibold tabular-nums ${s.accent ? "text-[#f97362]" : ""}`}>{s.value}</p>
          <p className="mt-1 text-sm text-zinc-500">{s.foot}</p>
        </div>
      ))}
    </div>
  );
}

import { EYEBROW, CARD } from "@/constants/ui";
import { CONNECTION_DAYS, MIN_SAMPLE } from "@/constants/main/overview";
import type { Connection } from "@/app/main/data/main";

// Format a compared value
const show = (v: number, unit: "%" | "h") => (unit === "%" ? `${Math.round(v)}%` : `${v.toFixed(1)}h`);

// Two-bar comparison card per discovered pattern
export function Connections({ items }: { items: Connection[] }) {
  return (
    <section className="space-y-6">
      <div>
        <p className={`${EYEBROW} text-[#e9a25c]`}>Connections</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">How your days affect each other</h2>
        <p className="mt-2 text-zinc-500">Patterns from your last {CONNECTION_DAYS} days.</p>
      </div>

      {items.length === 0 ? (
        <p className={`${CARD} p-6 text-zinc-500`}>
          Not enough overlap yet. Each pattern needs at least {MIN_SAMPLE} days on both sides, so keep logging sleep,
          sessions and to-dos.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((c) => {
            const max = Math.max(c.a.value, c.b.value, c.unit === "%" ? 100 : 1);
            return (
              <div key={c.title} className={`${CARD} p-6`}>
                <p className="text-sm font-medium text-zinc-400">{c.title}</p>
                <p className="mt-2 text-lg leading-snug text-zinc-100">{c.verdict}</p>
                <div className="mt-5 space-y-3">
                  {[c.a, c.b].map((side, i) => (
                    <div key={side.label}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-zinc-500">{side.label}</span>
                        <span className="tabular-nums text-zinc-300">{show(side.value, c.unit)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className={`h-full rounded-full ${i === 0 ? "bg-[#7c6cf0]" : "bg-zinc-600"}`}
                          style={{ width: `${(side.value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

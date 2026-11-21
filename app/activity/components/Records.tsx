import { Trophy } from "lucide-react";
import { CARD } from "@/constants/ui";
import type { personalRecords } from "@/app/activity/data/main";

// Best estimated 1RM per exercise; recent ones get a badge
export function Records({ records }: { records: ReturnType<typeof personalRecords> }) {
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="flex items-center gap-2 text-lg font-medium">
        <Trophy className="size-4 text-amber-300" /> Personal records
      </h2>
      <p className="text-sm text-zinc-500">Best estimated 1RM per lift</p>
      {records.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">Your records will show up here.</p>
      ) : (
        <ul className="mt-5 max-h-80 space-y-2 overflow-y-auto pr-1">
          {records.map((r) => (
            <li key={r.exercise} className="flex items-center gap-3 rounded-2xl bg-white/[0.02] px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-zinc-100">
                  {r.exercise}
                  {r.isNew && <span className="ml-2 rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-medium text-amber-300">NEW</span>}
                </p>
                <p className="text-xs text-zinc-500">
                  {r.weightKg}kg × {r.reps} ·{" "}
                  {new Date(`${r.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
              <span className="shrink-0 text-lg font-semibold tabular-nums">{r.e1rm}kg</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

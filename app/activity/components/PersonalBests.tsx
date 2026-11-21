import { Medal } from "lucide-react";
import { ACTIVITY_META } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import { formatMins, type personalBests } from "@/app/activity/data/main";

// Records: longest session, biggest week, favourite activity
export function PersonalBests({ bests }: { bests: ReturnType<typeof personalBests> }) {
  const rows = bests
    ? [
        {
          label: "Longest session",
          value: formatMins(bests.longest.durationMins),
          foot: `${bests.longest.type} · ${new Date(`${bests.longest.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          icon: ACTIVITY_META[bests.longest.type].icon,
        },
        {
          label: "Biggest week",
          value: formatMins(bests.bestWeekMins),
          foot: `week of ${new Date(`${bests.bestWeek}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          icon: "📅",
        },
        {
          label: "Go-to activity",
          value: bests.favorite,
          foot: `${bests.favoriteCount} of ${bests.total} sessions`,
          icon: ACTIVITY_META[bests.favorite].icon,
        },
      ]
    : [];

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="flex items-center gap-2 text-lg font-medium">
        <Medal className="size-4 text-amber-300" /> Personal bests
      </h2>
      <p className="text-sm text-zinc-500">Last 6 months</p>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-zinc-500">Your records will show up here.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/[0.04] text-xl">{r.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-500">{r.label}</p>
                <p className="truncate text-lg font-medium">{r.value}</p>
              </div>
              <span className="hidden shrink-0 text-right text-xs text-zinc-500 sm:block">{r.foot}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { CARDIO_META } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import { formatMins, type cardioSummary } from "@/app/activity/data/main";

// Cardio done in the gym, per machine, last 30 days
export function CardioCard({ rows }: { rows: ReturnType<typeof cardioSummary> }) {
  const total = rows.reduce((s, r) => s + r.mins, 0);
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Cardio</h2>
      <p className="text-sm text-zinc-500">{total ? `${formatMins(total)} in the last 30 days` : "Last 30 days"}</p>
      {rows.length === 0 ? (
        <p className="py-10 text-center text-zinc-500">Add a cardio block to a workout to track it here.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((r) => (
            <li key={r.type} className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl text-lg" style={{ background: `${CARDIO_META[r.type].color}1f` }}>
                {CARDIO_META[r.type].icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-zinc-200">{r.type}</p>
                <p className="text-xs text-zinc-500">{r.sessions} {r.sessions === 1 ? "session" : "sessions"}</p>
              </div>
              <div className="text-right">
                <p className="tabular-nums text-zinc-100">{formatMins(r.mins)}</p>
                {r.km > 0 && <p className="text-xs tabular-nums text-zinc-500">{r.km} km</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { SleepEntry } from "@/types/sleep";
import { SLEEP_QUALITY_COLORS, SLEEP_QUALITY_LABELS } from "../sleep";

interface SleepHistoryTableProps {
  data: SleepEntry[];
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function SleepHistoryTable({ data }: SleepHistoryTableProps) {
  const recent = [...data].reverse().slice(0, 7);

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="grid grid-cols-5 gap-2 px-1 mb-1">
        {["Date", "Bedtime", "Wake", "Duration", "Quality"].map((h) => (
          <span
            key={h}
            className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest"
          >
            {h}
          </span>
        ))}
      </div>

      {recent.map((entry, i) => {
        const hrs = Math.floor(entry.duration_hours);
        const mins = Math.round((entry.duration_hours - hrs) * 60);
        const color = SLEEP_QUALITY_COLORS[entry.quality];
        const dateLabel = new Date(entry.date).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "numeric",
          month: "short",
        });

        return (
          <div
            key={entry.id}
            className="grid grid-cols-5 gap-2 rounded-xl border border-white/[0.04] bg-[#131313] px-3 py-3 items-center"
            style={{
              borderLeft: i === 0 ? `2px solid ${color}` : undefined,
            }}
          >
            <span className="text-xs text-zinc-400">{dateLabel}</span>
            <span className="text-xs text-zinc-300">
              {formatTime(entry.bedtime)}
            </span>
            <span className="text-xs text-zinc-300">
              {formatTime(entry.wake_time)}
            </span>
            <span className="text-xs font-semibold text-zinc-100">
              {hrs}h {mins}m
            </span>
            <span
              className="text-xs font-medium rounded-full px-2 py-0.5 text-center w-fit"
              style={{
                background: `${color}20`,
                color,
              }}
            >
              {SLEEP_QUALITY_LABELS[entry.quality]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
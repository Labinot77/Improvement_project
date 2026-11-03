"use client";

import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/mics/date";
import type { Activity } from "@/types/fitness";

interface Props {
  selected: Date;
  onSelect: (date: Date) => void;
  activities: Activity[];
}

export function FitnessCalendar({ selected, onSelect, activities }: Props) {
  const activeDates = new Set(activities.map((a) => a.date));

  return (
    <div
      className="rounded-2xl self-start sticky top-8 border border-white/[0.06] bg-[#0f0f0f] p-5"
      style={{
        "--background": "transparent",
        "--foreground": "#f4f4f5",
        "--muted": "rgba(255,255,255,0.05)",
        "--muted-foreground": "#71717a",
        "--primary": "#f4f4f5",
        "--primary-foreground": "#09090b",
        "--accent": "rgba(255,255,255,0.07)",
        "--accent-foreground": "#f4f4f5",
        "--border": "rgba(255,255,255,0.06)",
        "--ring": "#ef4444",
      } as React.CSSProperties}
    >
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => { if (date) onSelect(date); }}
        className="rounded-md w-full [&_.rdp-day_button]:relative"
        modifiers={{
          hasSession: (date) => activeDates.has(formatDate(date)),
        }}
        modifiersClassNames={{
          today:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-yellow-400 after:rounded-full",
          hasSession:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-red-500 after:rounded-full",
        }}
      />

      {/* Legend */}
      <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
        {[
          { color: "#eab308", label: "Today" },
          { color: "#ef4444", label: "Session logged" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[11px] text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import SectionCard from "@/app/components/SectionCard";
import { Calendar } from "@/components/ui/calendar";
import { ACCENT_COLOR } from "@/constants/progress/template";
import { formatDate } from "@/lib/mics/date";
import type { Days } from "@/types/progress";

type Props = {
  selected: Date;
  onSelect: (date: Date) => void;
  days: Days;
};

function isAllDone(days: Days, date: Date): boolean {
  const d = days[formatDate(date)];
  if (!d || d.tasks.length === 0) return false;
  return d.tasks.every((t) => t.completed);
}

function hasAnyTask(days: Days, date: Date): boolean {
  const d = days[formatDate(date)];
  return !!d && d.tasks.length > 0;
}

export function CalendarView({ selected, onSelect, days }: Props) {
  return (
    <SectionCard accentGlow={ACCENT_COLOR}>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => { if (date) onSelect(date); }}
        className="rounded-md w-full [&_.rdp-day_button]:relative bg-transparent"
        modifiers={{
          completed: (date) => isAllDone(days, date),
          partial:   (date) => hasAnyTask(days, date) && !isAllDone(days, date),
               
        }}
        modifiersClassNames={{
          today:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-yellow-400 after:rounded-full",
          completed:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-indigo-500 after:rounded-full",
          partial:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-zinc-500 after:rounded-full",
        }}
      />
      {/* Legend */}
      <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
        {[
          { color: "#eab308", label: "Today" },
          { color: "#6366f1", label: "All tasks done" },
          { color: "#52525b", label: "Partial / in progress" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[11px] text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
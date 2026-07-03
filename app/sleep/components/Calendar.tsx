"use client";

import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/mics/date";
import type { SleepDays } from "@/types/sleep";
import { ACCENT } from "@/constants/sleep/main";
import SectionCard from "../../components/SectionCard";

interface Props {
  selected: Date;
  onSelect: (date: Date) => void;
  days: SleepDays;
}

export function SleepCalendar({ selected, onSelect, days }: Props) {
  return (
    <SectionCard accentGlow={ACCENT}>
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => { if (date) onSelect(date); }}
        className="rounded-md w-full [&_.rdp-day_button]:relative bg-transparent"
        modifiers={{
          logged: (date) => !!days[formatDate(date)],
        }}
        modifiersClassNames={{
          today:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-yellow-400 after:rounded-full",
          logged:
            "after:absolute after:bottom-0.5 after:right-0.5 after:w-2 after:h-2 after:bg-indigo-500 after:rounded-full",
        }}
      />

      <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-white/[0.05]">
        {[
          { color: "#eab308", label: "Today" },
          { color: "#6366f1", label: "Sleep logged" },
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
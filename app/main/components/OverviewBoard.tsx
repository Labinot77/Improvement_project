"use client";

import { useState } from "react";
import type { DayFacts } from "@/app/main/data/main";
import { ScoreChart } from "./ScoreChart";
import { DayBreakdown } from "./DayBreakdown";

// Score chart and breakdown share the selected day
export function OverviewBoard({ days, avg }: { days: DayFacts[]; avg: number | null }) {
  const [selected, setSelected] = useState(days[days.length - 1].date);
  const day = days.find((d) => d.date === selected) ?? days[days.length - 1];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
      <ScoreChart days={days} avg={avg} selected={selected} onSelect={setSelected} />
      <DayBreakdown day={day} />
    </div>
  );
}

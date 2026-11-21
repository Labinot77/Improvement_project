"use client";

import { useState } from "react";
import { today } from "@/lib/mics/date";
import { durationTrend, sleepWindows } from "@/app/sleep/data/main";
import type { SleepEntry } from "@/types/sleep";
import { WindowChart } from "./WindowChart";
import { DurationTrend } from "./DurationTrend";
import { NightList } from "./NightList";
import { NightForm } from "./NightForm";

// Chart, list and form share the selected night
export function SleepBoard({ entries }: { entries: SleepEntry[] }) {
  const [selected, setSelected] = useState(today());
  const entry = entries.find((e) => e.date === selected);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
      <div className="space-y-8">
        <WindowChart rows={sleepWindows(entries)} selected={selected} onSelect={setSelected} />
        <DurationTrend rows={durationTrend(entries)} />
        <NightList entries={entries} selected={selected} onSelect={setSelected} />
      </div>
      <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
        <NightForm key={`${selected}-${entry?.id ?? "new"}`} date={selected} entry={entry} onDateChange={setSelected} />
      </aside>
    </div>
  );
}

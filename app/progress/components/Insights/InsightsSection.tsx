"use client";

import { useState } from "react";
import { EYEBROW_COLOR } from "@/constants/progress/template";
import type { ProgressStats } from "@/types/Progress/progress";
import { CompletionChart } from "./CompletionChart";
import { InsightsCard } from "./InsightsCard";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { DayDetail } from "./DayDetail";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { WeekdayRhythm } from "./WeekdayRhythm";

// Analytics area; chart and heatmap share the selected day
export function InsightsSection({ stats }: { stats: ProgressStats }) {
  const [selected, setSelected] = useState(stats.days[stats.days.length - 1]?.date ?? "");
  const day = stats.days.find((d) => d.date === selected);

  return (
    <section className="space-y-6">
      <div>
        <p className={`text-sm font-medium uppercase tracking-[0.3em] ${EYEBROW_COLOR}`}>Insights</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">How you&apos;re really doing</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
        <CompletionChart days={stats.days} selected={selected} onSelect={setSelected} />
        <InsightsCard insights={stats.insights} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
        <ActivityHeatmap days={stats.days} selected={selected} onSelect={setSelected} />
        <DayDetail day={day} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryBreakdown categories={stats.categories} />
        <WeekdayRhythm weekdays={stats.weekdays} />
      </div>
    </section>
  );
}

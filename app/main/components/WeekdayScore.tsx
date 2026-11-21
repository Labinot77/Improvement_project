"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AXIS_TICK, CARD } from "@/constants/ui";
import type { weekdayScores } from "@/app/main/data/main";

const config = { score: { label: "Avg score", color: "#7c6cf0" } } satisfies ChartConfig;

// Average day score per weekday, best day highlighted
export function WeekdayScore({ rows }: { rows: ReturnType<typeof weekdayScores> }) {
  const best = rows.reduce((a, b) => (b.score > a.score ? b : a), rows[0]);
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Your week shape</h2>
      <p className="mb-6 text-sm text-zinc-500">
        {best.score ? `${best.label} tends to be your best day` : "Average day score by weekday"}
      </p>
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={rows} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent />} />
          <Bar dataKey="score" radius={[8, 8, 8, 8]} fill="var(--color-score)">
            {rows.map((r) => (
              <Cell key={r.label} fillOpacity={r.label === best.label ? 1 : 0.35} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </section>
  );
}

"use client";

import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ACTIVITY_COLOR } from "@/constants/fitness";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import type { weeklyStrength } from "@/app/activity/data/main";

const config = {
  volume: { label: "Kilos lifted", color: ACTIVITY_COLOR },
  cardio: { label: "Cardio minutes", color: "#facc15" },
} satisfies ChartConfig;

// Weekly tonnage (bars) with cardio minutes (line)
export function VolumeChart({ rows }: { rows: ReturnType<typeof weeklyStrength> }) {
  const empty = rows.every((r) => !r.volume && !r.cardio);
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Weekly volume</h2>
      <p className="mb-6 text-sm text-zinc-500">Total kilos lifted per week, with cardio minutes</p>
      {empty ? (
        <p className="py-16 text-center text-zinc-500">No workouts in the last {rows.length} weeks.</p>
      ) : (
        <ChartContainer config={config} className="h-64 w-full">
          <ComposedChart data={rows} margin={{ top: 4, right: 0, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="week" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={12} />
            <YAxis yAxisId="kg" tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}t` : v)} />
            <YAxis yAxisId="min" orientation="right" hide />
            <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent />} />
            <Bar yAxisId="kg" dataKey="volume" fill="var(--color-volume)" radius={[6, 6, 0, 0]} />
            <Line yAxisId="min" dataKey="cardio" type="monotone" stroke="var(--color-cardio)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ChartContainer>
      )}
    </section>
  );
}

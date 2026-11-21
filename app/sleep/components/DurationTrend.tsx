"use client";

import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import type { durationTrend } from "@/app/sleep/data/main";

const config = {
  hours: { label: "Slept", color: SLEEP_COLOR },
  avg: { label: "7-night avg", color: "#e9a25c" },
} satisfies ChartConfig;

// Hours per night with a rolling average and the target line
export function DurationTrend({ rows }: { rows: ReturnType<typeof durationTrend> }) {
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Duration trend</h2>
      <p className="mb-6 text-sm text-zinc-500">Last {rows.length} nights · dashed line is your {TARGET_HOURS}h target</p>

      {rows.length < 2 ? (
        <p className="py-12 text-center text-zinc-500">A couple of nights will start the trend.</p>
      ) : (
        <ChartContainer config={config} className="h-52 w-full">
          <ComposedChart data={rows} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SLEEP_COLOR} stopOpacity={0.35} />
                <stop offset="95%" stopColor={SLEEP_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={16} />
            <YAxis domain={[0, 12]} tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
            <ReferenceLine y={TARGET_HOURS} stroke={SLEEP_COLOR} strokeDasharray="4 4" strokeOpacity={0.5} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area type="monotone" dataKey="hours" stroke="var(--color-hours)" fill="url(#sleepFill)" strokeWidth={2} />
            <Line type="monotone" dataKey="avg" stroke="var(--color-avg)" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ChartContainer>
      )}
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CARD, CHART_RANGES, DONE_COLOR, MOMENTUM_COLOR, OPEN_COLOR } from "@/constants/progress/template";
import type { DayStat } from "@/types/Progress/progress";

const config = {
  done: { label: "Done", color: DONE_COLOR },
  open: { label: "Left open", color: OPEN_COLOR },
  rate: { label: "Completion %", color: MOMENTUM_COLOR },
} satisfies ChartConfig;

type Props = {
  days: DayStat[];
  selected: string;
  onSelect: (date: string) => void;
};

// Daily done vs open bars with completion-rate line; click a bar to inspect the day
export function CompletionChart({ days, selected, onSelect }: Props) {
  const [range, setRange] = useState<number>(CHART_RANGES[1]);

  const data = useMemo(
    () =>
      days.slice(-range).map((d) => ({
        date: d.date,
        label: new Date(`${d.date}T12:00:00`).toLocaleDateString("en-US", {
          weekday: range === 7 ? "short" : undefined,
          day: "numeric",
          month: range === 7 ? undefined : "short",
        }),
        done: d.done,
        open: d.total - d.done,
        rate: d.total ? Math.round((d.done / d.total) * 100) : null,
      })),
    [days, range],
  );

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">Completions</h2>
          <p className="text-sm text-zinc-500">Tap a day to see what happened.</p>
        </div>
        <ToggleGroup
          type="single"
          value={String(range)}
          onValueChange={(v) => v && setRange(Number(v))}
          className="rounded-full border border-white/[0.06] bg-white/[0.02] p-1"
        >
          {CHART_RANGES.map((r) => (
            <ToggleGroupItem
              key={r}
              value={String(r)}
              className="h-7 rounded-full px-3 text-xs text-zinc-500 data-[state=on]:bg-white/[0.08] data-[state=on]:text-zinc-100"
            >
              {r}d
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <ChartContainer config={config} className="h-64 w-full">
        <ComposedChart data={data} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#71717a", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={12}
          />
          <YAxis yAxisId="count" allowDecimals={false} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="rate" orientation="right" domain={[0, 100]} hide />
          <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent />} />
          <Bar
            yAxisId="count"
            dataKey="done"
            stackId="tasks"
            fill="var(--color-done)"
            className="cursor-pointer"
            onClick={(d) => onSelect((d.payload as { date: string }).date)}
          >
            {data.map((d) => (
              <Cell key={d.date} fillOpacity={d.date === selected ? 1 : 0.7} />
            ))}
          </Bar>
          <Bar
            yAxisId="count"
            dataKey="open"
            stackId="tasks"
            fill="var(--color-open)"
            radius={[6, 6, 0, 0]}
            className="cursor-pointer"
            onClick={(d) => onSelect((d.payload as { date: string }).date)}
          />
          <Line
            yAxisId="rate"
            dataKey="rate"
            type="monotone"
            stroke="var(--color-rate)"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ChartContainer>
    </section>
  );
}

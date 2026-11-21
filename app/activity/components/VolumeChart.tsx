"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ACTIVITY_META, ALL_ACTIVITY_TYPES, VOLUME_RANGES } from "@/constants/fitness";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import { weeklyVolume } from "@/app/activity/data/main";
import type { Activity } from "@/types/fitness";

// Labels only (type names have spaces, so colours are set on each Bar)
const config = Object.fromEntries(ALL_ACTIVITY_TYPES.map((t) => [t, { label: t }])) satisfies ChartConfig;

// Weekly minutes stacked by activity type
export function VolumeChart({ activities }: { activities: Activity[] }) {
  const [weeks, setWeeks] = useState<number>(VOLUME_RANGES[1]);
  const data = useMemo(() => weeklyVolume(activities, weeks), [activities, weeks]);
  const used = ALL_ACTIVITY_TYPES.filter((t) => data.some((w) => (w[t] as number) > 0));

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">Weekly volume</h2>
          <p className="text-sm text-zinc-500">Minutes trained, split by type</p>
        </div>
        <ToggleGroup
          type="single"
          value={String(weeks)}
          onValueChange={(v) => v && setWeeks(Number(v))}
          className="rounded-full border border-white/[0.06] bg-white/[0.02] p-1"
        >
          {VOLUME_RANGES.map((r) => (
            <ToggleGroupItem
              key={r}
              value={String(r)}
              className="h-7 rounded-full px-3 text-xs text-zinc-500 data-[state=on]:bg-white/[0.08] data-[state=on]:text-zinc-100"
            >
              {r}w
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {used.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">No sessions in this range yet.</p>
      ) : (
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="week" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={12} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent />} />
            {used.map((t, i) => (
              <Bar
                key={t}
                dataKey={t}
                stackId="mins"
                fill={ACTIVITY_META[t].color}
                radius={i === used.length - 1 ? [6, 6, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ChartContainer>
      )}
    </section>
  );
}

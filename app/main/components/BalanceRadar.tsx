"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { CARD } from "@/constants/ui";
import type { weeklyBalance } from "@/app/main/data/main";

const config = {
  thisWeek: { label: "This week", color: "#7c6cf0" },
  lastWeek: { label: "Last week", color: "#71717a" },
} satisfies ChartConfig;

// Radar of each area this week vs last week
export function BalanceRadar({ rows }: { rows: ReturnType<typeof weeklyBalance> }) {
  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Weekly balance</h2>
      <p className="text-sm text-zinc-500">Each area scored 0–100. Purple is this week.</p>
      <ChartContainer config={config} className="mx-auto mt-4 aspect-square max-h-72 w-full">
        <RadarChart data={rows} outerRadius="72%">
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis dataKey="area" tick={{ fill: "#a1a1aa", fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Radar dataKey="lastWeek" stroke="var(--color-lastWeek)" fill="var(--color-lastWeek)" fillOpacity={0.12} />
          <Radar dataKey="thisWeek" stroke="var(--color-thisWeek)" fill="var(--color-thisWeek)" fillOpacity={0.35} />
        </RadarChart>
      </ChartContainer>
    </section>
  );
}

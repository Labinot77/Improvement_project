"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import type { SleepDays } from "@/types/sleep";
import { TARGET_HOURS } from "@/constants/sleep/main";

interface Props {
  days: SleepDays;
}

export function SleepChart({ days }: Props) {
  const data = Object.values(days)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map((entry) => ({
      day: new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
      hours: entry.durationHours,
    }));

  if (data.length === 0) {
    return (
      <p className="text-xs text-zinc-600 py-8 text-center">
        Log sleep entries to see your trend.
      </p>
    );
  }

  return (
    <ChartContainer
      config={{ hours: { label: "Hours slept", color: "#6366f1" } }}
      className="h-44 w-full"
    >
      <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis
          domain={[0, 12]}
          tick={{ fill: "#71717a", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <ReferenceLine
          y={TARGET_HOURS}
          stroke="#6366f1"
          strokeDasharray="4 4"
          strokeOpacity={0.4}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#6366f1"
          fill="url(#sleepGrad)"
          strokeWidth={2}
          dot={{ fill: "#6366f1", r: 3 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SleepEntry } from "@/types/sleep";

interface SleepChartProps {
  data: SleepEntry[];
  targetHours: number;
}

const chartConfig = {
  duration_hours: {
    label: "Duration",
    color: "#6366f1",
  },
} satisfies ChartConfig;

export default function SleepChart({ data, targetHours }: SleepChartProps) {
  const chartData = data.map((entry) => ({
    ...entry,
    day: new Date(entry.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[220px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fill: "#52525b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          domain={[4, 10]}
          tick={{ fill: "#52525b", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}h`}
        />
        <ChartTooltip
          cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              formatter={(value) => {
                const h = Math.floor(Number(value));
                const m = Math.round((Number(value) - h) * 60);
                return [`${h}h ${m}m`, "Sleep"];
              }}
              labelClassName="text-zinc-400 text-xs"
              className="rounded-xl border border-white/[0.08] bg-[#161616] text-sm shadow-xl"
            />
          }
        />
        <ReferenceLine
          y={targetHours}
          stroke="#6366f1"
          strokeDasharray="4 4"
          strokeOpacity={0.45}
          label={{
            value: `Goal ${targetHours}h`,
            fill: "#818cf8",
            fontSize: 10,
            position: "insideTopRight",
          }}
        />
        <Area
          type="monotone"
          dataKey="duration_hours"
          stroke="var(--color-duration_hours)"
          strokeWidth={2}
          fill="url(#sleepGradient)"
          dot={{ fill: "#6366f1", r: 3, strokeWidth: 0 }}
          activeDot={{ fill: "#818cf8", r: 5, strokeWidth: 0 }}
          isAnimationActive={true}
          animationDuration={900}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ChartContainer>
  );
}
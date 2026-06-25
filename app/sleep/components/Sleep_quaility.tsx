"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SleepEntry } from "@/types/sleep";
import { SLEEP_QUALITY_COLORS, SLEEP_QUALITY_LABELS } from "../sleep";

interface SleepQualityBarProps {
  data: SleepEntry[];
}

const chartConfig = {
  quality: {
    label: "Quality",
    color: "#6366f1",
  },
} satisfies ChartConfig;

export default function SleepQualityBar({ data }: SleepQualityBarProps) {
  const chartData = data.slice(-14).map((entry) => ({
    ...entry,
    day: new Date(entry.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    qualityLabel: SLEEP_QUALITY_LABELS[entry.quality],
    fill: SLEEP_QUALITY_COLORS[entry.quality],
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[120px] w-full">
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(255,255,255,0.04)"
          vertical={false}
        />
        <XAxis
          dataKey="day"
          tick={{ fill: "#52525b", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <ChartTooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => [
                item.payload.qualityLabel,
                "Quality",
              ]}
              labelClassName="text-zinc-400 text-xs"
              className="rounded-xl border border-white/[0.08] bg-[#161616] text-sm shadow-xl"
            />
          }
        />
        <Bar
          dataKey="quality"
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
          isAnimationActive={true}
          animationDuration={700}
          animationEasing="ease-out"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.75} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
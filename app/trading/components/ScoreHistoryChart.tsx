"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScoreHistoryPoint } from "@/types/trading";
import { Bar, BarChart, XAxis, ReferenceLine, Cell } from "recharts";

interface Props {
  history: ScoreHistoryPoint[];
}

export function ScoreHistoryChart({ history }: Props) {
  const data = history.map((h) => ({
    ...h,
    label: new Date(h.date + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ChartContainer
      config={{ score: { label: "Score", color: "#6366f1" } }}
      className="h-40 w-full"
    >
      <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: "#52525b", fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" />
        <ChartTooltip
          content={<ChartTooltipContent hideLabel={false} labelKey="label" />}
        />
        <Bar dataKey="score" radius={[2, 2, 2, 2]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.score >= 0 ? "#6366f1" : "#ef4444"} fillOpacity={d.score >= 0 ? 0.85 : 0.8} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

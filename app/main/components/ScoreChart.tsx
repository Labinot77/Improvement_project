"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import type { DayFacts } from "@/app/main/data/main";

const config = { value: { label: "Day score", color: "#7c6cf0" } } satisfies ChartConfig;

// Bar colour by score band
function bandColor(score: number | null) {
  if (score === null) return "rgba(255,255,255,0.06)";
  if (score >= 75) return "#7c6cf0";
  if (score >= 50) return "#a39af5";
  return "#e9a25c";
}

type Props = { days: DayFacts[]; avg: number | null; selected: string; onSelect: (date: string) => void };

// Daily score bars; tap a day to see what made it up
export function ScoreChart({ days, avg, selected, onSelect }: Props) {
  const data = days.map((d) => ({
    ...d,
    label: new Date(`${d.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: d.score ?? 0,
  }));

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Day score</h2>
      <p className="mb-6 text-sm text-zinc-500">
        To-dos, sleep, movement and learning in one number. {avg !== null && `Your ${days.length}-day average is ${avg}.`}
      </p>
      <ChartContainer config={config} className="h-64 w-full">
        <BarChart data={data} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={16} />
          <YAxis domain={[0, 100]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          {avg !== null && <ReferenceLine y={avg} stroke="#e9a25c" strokeDasharray="4 4" strokeOpacity={0.5} />}
          <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent hideIndicator />} />
          <Bar
            dataKey="value"
            radius={[6, 6, 2, 2]}
            className="cursor-pointer"
            onClick={(d) => onSelect((d.payload as DayFacts).date)}
          >
            {data.map((d) => (
              <Cell key={d.date} fill={bandColor(d.score)} fillOpacity={d.date === selected ? 1 : 0.6} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </section>
  );
}

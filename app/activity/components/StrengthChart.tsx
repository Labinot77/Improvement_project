"use client";

import { useMemo, useState } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTIVITY_COLOR } from "@/constants/fitness";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import { exerciseHistory } from "@/app/activity/data/main";
import type { Activity } from "@/types/fitness";

const config = {
  e1rm: { label: "Est. 1RM (kg)", color: ACTIVITY_COLOR },
  topWeight: { label: "Top set (kg)", color: "rgba(255,255,255,0.12)" },
} satisfies ChartConfig;

// Pick an exercise, see estimated 1RM and top set over time
export function StrengthChart({ activities, exercises }: { activities: Activity[]; exercises: string[] }) {
  const [exercise, setExercise] = useState(exercises[0] ?? "");
  const data = useMemo(() => exerciseHistory(activities, exercise), [activities, exercise]);
  const first = data[0]?.e1rm;
  const latest = data.at(-1)?.e1rm;
  const change = first && latest ? Math.round((latest - first) * 10) / 10 : null;

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-medium">Strength progress</h2>
          <p className="text-sm text-zinc-500">
            {change === null
              ? "Estimated one-rep max per session"
              : `${change >= 0 ? "+" : ""}${change}kg est. 1RM over ${data.length} sessions`}
          </p>
        </div>
        {exercises.length > 0 && (
          <Select value={exercise} onValueChange={setExercise}>
            <SelectTrigger className="h-10 w-full rounded-full border-white/10 bg-white/[0.04] sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72 border-white/10 bg-[#1d1e24] text-zinc-100">
              {exercises.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {data.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">Log a workout with sets to see your progress.</p>
      ) : (
        <ChartContainer config={config} className="h-64 w-full">
          <ComposedChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={16} />
            <YAxis tick={AXIS_TICK} axisLine={false} tickLine={false} domain={["dataMin - 10", "dataMax + 5"]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="topWeight" fill="var(--color-topWeight)" radius={[6, 6, 0, 0]} />
            <Line dataKey="e1rm" type="monotone" stroke="var(--color-e1rm)" strokeWidth={2.5} dot={{ r: 3, fill: ACTIVITY_COLOR }} />
          </ComposedChart>
        </ChartContainer>
      )}
    </section>
  );
}

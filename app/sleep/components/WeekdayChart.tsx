"use client";

import { Bar, BarChart, Cell, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { AXIS_TICK, CARD } from "@/constants/ui";
import type { weekdayAverages } from "@/app/sleep/data/main";

const config = { hours: { label: "Avg hours", color: SLEEP_COLOR } } satisfies ChartConfig;

// Average sleep per weekday; weekend drift shows as a gap
export function WeekdayChart({ rows }: { rows: ReturnType<typeof weekdayAverages> }) {
  const logged = rows.filter((r) => r.nights);
  const weekday = logged.filter((r) => !["Sat", "Sun"].includes(r.label));
  const weekend = logged.filter((r) => ["Sat", "Sun"].includes(r.label));
  const mean = (xs: typeof rows) => xs.reduce((s, r) => s + r.hours, 0) / (xs.length || 1);
  const drift = weekday.length && weekend.length ? Math.round((mean(weekend) - mean(weekday)) * 10) / 10 : null;

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">By weekday</h2>
      <p className="mb-6 text-sm text-zinc-500">
        {drift === null
          ? "Average hours per night of the week"
          : drift > 0.4
            ? `Weekends run ${drift}h longer: you're catching up on sleep debt.`
            : drift < -0.4
              ? `Weekends are ${Math.abs(drift)}h shorter than weekdays.`
              : "Weekdays and weekends are balanced."}
      </p>
      {logged.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">No nights yet.</p>
      ) : (
        <ChartContainer config={config} className="h-52 w-full">
          <BarChart data={rows} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 12]} tick={AXIS_TICK} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
            <ReferenceLine y={TARGET_HOURS} stroke={SLEEP_COLOR} strokeDasharray="4 4" strokeOpacity={0.5} />
            <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent />} />
            <Bar dataKey="hours" radius={[8, 8, 8, 8]}>
              {rows.map((r) => (
                <Cell key={r.label} fill={["Sat", "Sun"].includes(r.label) ? "#e9a25c" : SLEEP_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </section>
  );
}

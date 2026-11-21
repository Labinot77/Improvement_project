"use client";

import { Bar, BarChart, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ACCENT, CARD } from "@/constants/progress/template";
import type { WeekdayStat } from "@/types/Progress/progress";

const config = { rate: { label: "Avg. completion %", color: ACCENT } } satisfies ChartConfig;

// Average completion by weekday, best day highlighted
export function WeekdayRhythm({ weekdays }: { weekdays: WeekdayStat[] }) {
  const best = weekdays.reduce((a, b) => (b.rate > a.rate ? b : a), weekdays[0]);
  const hasData = weekdays.some((w) => w.days > 0);

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Weekly rhythm</h2>
      <p className="text-sm text-zinc-500">
        {hasData ? `${best.label} is your strongest day` : "Average completion by weekday"}
      </p>

      {hasData ? (
        <ChartContainer config={config} className="mt-6 h-48 w-full">
          <BarChart data={weekdays} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<ChartTooltipContent />} />
            <Bar dataKey="rate" radius={[6, 6, 6, 6]} fill="var(--color-rate)">
              {weekdays.map((w) => (
                <Cell key={w.label} fillOpacity={w.label === best.label ? 1 : 0.35} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      ) : (
        <p className="mt-6 text-zinc-500">A couple of weeks of tasks will reveal your rhythm.</p>
      )}
    </section>
  );
}

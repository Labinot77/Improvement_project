"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceArea, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { SLEEP_COLOR, TARGET_BEDTIME } from "@/constants/sleep/main";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import { clockOffset, formatDuration, offsetToClock, sleepWindows } from "@/app/sleep/data/main";

type Row = ReturnType<typeof sleepWindows>[number];
const config = { window: { label: "Asleep", color: SLEEP_COLOR } } satisfies ChartConfig;

// Tooltip: bed -> wake and duration
function WindowTip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#161616] px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-zinc-200">{r.label}</p>
      <p className="text-zinc-400">
        {r.bedtime} → {r.wakeTime} · {formatDuration(r.hours)}
      </p>
    </div>
  );
}

type Props = { rows: Row[]; selected: string; onSelect: (date: string) => void };

// Floating bars from bedtime to wake time; the band marks the target bedtime
export function WindowChart({ rows, selected, onSelect }: Props) {
  const target = clockOffset(TARGET_BEDTIME);

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Sleep window</h2>
      <p className="mb-6 text-sm text-zinc-500">When you slept, night by night. Tap a night to edit it.</p>

      {rows.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">Log a night to see your window.</p>
      ) : (
        <ChartContainer config={config} className="h-72 w-full">
          <BarChart data={rows} margin={{ top: 4, right: 0, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
            <ReferenceArea y1={target - 0.25} y2={target + 0.25} fill={SLEEP_COLOR} fillOpacity={0.12} />
            <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} />
            <YAxis
              reversed
              domain={[2, 18]}
              ticks={[2, 4, 6, 8, 10, 12, 14, 16, 18]}
              tickFormatter={(v) => offsetToClock(v)}
              tick={AXIS_TICK}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.03)" }} content={<WindowTip />} />
            <Bar
              dataKey="window"
              radius={8}
              className="cursor-pointer"
              onClick={(d) => onSelect((d.payload as Row).date)}
            >
              {rows.map((r) => (
                <Cell key={r.date} fill={SLEEP_COLOR} fillOpacity={r.date === selected ? 1 : 0.55} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </section>
  );
}

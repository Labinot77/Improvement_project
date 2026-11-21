"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceArea, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { useModal } from "@/providers/Modalprovider";
import { SLEEP_COLOR, TARGET_BEDTIME } from "@/constants/sleep/main";
import { AXIS_TICK, GRID_STROKE } from "@/constants/ui";
import { clockOffset, formatDuration, offsetToClock, sleepWindows } from "@/app/sleep/data/main";
import type { SleepEntry } from "@/types/sleep";

type Row = ReturnType<typeof sleepWindows>[number];
const config = { window: { label: "Asleep", color: SLEEP_COLOR } } satisfies ChartConfig;

// Fixed star positions for the hero background
const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 60}%`,
  size: i % 3 === 0 ? 2 : 1,
}));

// Tooltip: bed -> wake and duration
function WindowTip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#12142a] px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-zinc-200">{r.label}</p>
      <p className="text-zinc-400">
        {r.bedtime} → {r.wakeTime} · {formatDuration(r.hours)}
      </p>
    </div>
  );
}

// Night-sky hero: floating bars from bedtime to wake time; tap one to edit
export function WindowChart({ entries }: { entries: SleepEntry[] }) {
  const { open } = useModal();
  const rows = sleepWindows(entries);
  const target = clockOffset(TARGET_BEDTIME);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#8b9cf7]/15 bg-gradient-to-b from-[#141733] via-[#11132a] to-[#16181b] p-5 sm:p-8">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="pointer-events-none absolute animate-pulse rounded-full bg-white/60"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: `${i * 0.3}s` }}
        />
      ))}

      <div className="relative">
        <h2 className="text-lg font-medium">Sleep window</h2>
        <p className="mb-6 text-sm text-zinc-400">
          The last {rows.length || 14} nights. The band marks your {TARGET_BEDTIME} target bedtime. Tap a night to edit it.
        </p>

        {rows.length === 0 ? (
          <p className="py-16 text-center text-zinc-400">Log a night to see your window.</p>
        ) : (
          <ChartContainer config={config} className="h-64 w-full sm:h-80">
            <BarChart data={rows} margin={{ top: 4, right: 0, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
              <ReferenceArea y1={target - 0.25} y2={target + 0.25} fill={SLEEP_COLOR} fillOpacity={0.15} />
              <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={8} />
              <YAxis
                reversed
                domain={[2, 18]}
                ticks={[2, 6, 10, 14, 18]}
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
                onClick={(d) => {
                  const entry = entries.find((e) => e.date === (d.payload as Row).date);
                  if (entry) open("sleep_form", { entry });
                }}
              >
                {rows.map((r) => (
                  <Cell key={r.date} fill={SLEEP_COLOR} fillOpacity={0.75} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>
    </section>
  );
}

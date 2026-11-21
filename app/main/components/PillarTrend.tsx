"use client";

import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { PILLARS, type PillarKey } from "@/constants/main/overview";
import { AXIS_TICK, CARD, GRID_STROKE } from "@/constants/ui";
import type { pillarTrend } from "@/app/main/data/main";

const KEYS = Object.keys(PILLARS) as PillarKey[];
const config = Object.fromEntries(KEYS.map((k) => [k, { label: PILLARS[k].label, color: PILLARS[k].color }])) satisfies ChartConfig;

// 7-day rolling line per area; tap a chip to hide or show it
export function PillarTrend({ rows }: { rows: ReturnType<typeof pillarTrend> }) {
  const [hidden, setHidden] = useState<Set<PillarKey>>(new Set());

  // Show/hide one line
  function toggle(k: PillarKey) {
    setHidden((h) => {
      const next = new Set(h);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Area trends</h2>
          <p className="text-sm text-zinc-500">7-day rolling average per area</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => toggle(k)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                hidden.has(k) ? "border-white/[0.06] text-zinc-600" : "border-white/[0.12] text-zinc-300"
              }`}
            >
              <span className="size-2 rounded-full" style={{ background: hidden.has(k) ? "#3f3f46" : PILLARS[k].color }} />
              {PILLARS[k].label}
            </button>
          ))}
        </div>
      </div>
      <ChartContainer config={config} className="h-64 w-full">
        <LineChart data={rows} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
          <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={16} />
          <YAxis domain={[0, 100]} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          {KEYS.filter((k) => !hidden.has(k)).map((k) => (
            <Line key={k} dataKey={k} type="monotone" stroke={`var(--color-${k})`} strokeWidth={2} dot={false} connectNulls />
          ))}
        </LineChart>
      </ChartContainer>
    </section>
  );
}

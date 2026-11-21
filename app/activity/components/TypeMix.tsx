"use client";

import { useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ACTIVITY_META } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import { formatMins } from "@/app/activity/data/main";
import type { ActivityType } from "@/types/fitness";

type Slice = { type: ActivityType; mins: number };

// Donut of minutes per type; hover a slice or row to focus it
export function TypeMix({ mix }: { mix: Slice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const total = mix.reduce((s, m) => s + m.mins, 0);
  const focus = active !== null ? mix[active] : null;

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Training mix</h2>
      <p className="text-sm text-zinc-500">Last 30 days</p>

      {total === 0 ? (
        <p className="py-16 text-center text-zinc-500">Nothing logged in the last 30 days.</p>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row lg:flex-col xl:flex-row">
          <div className="relative size-44 shrink-0">
            <ChartContainer config={{} satisfies ChartConfig} className="size-44">
              <PieChart>
                <Pie
                  data={mix}
                  dataKey="mins"
                  nameKey="type"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                  onMouseLeave={() => setActive(null)}
                >
                  {mix.map((m, i) => (
                    <Cell
                      key={m.type}
                      fill={ACTIVITY_META[m.type].color}
                      fillOpacity={active === null || active === i ? 1 : 0.25}
                      onMouseEnter={() => setActive(i)}
                      className="cursor-pointer transition-opacity"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
              <p className="text-xl font-semibold tabular-nums">{formatMins(focus?.mins ?? total)}</p>
              <p className="text-xs text-zinc-500">{focus ? focus.type : "total"}</p>
            </div>
          </div>

          <ul className="w-full space-y-2">
            {mix.map((m, i) => (
              <li
                key={m.type}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                  active === i ? "bg-white/[0.05]" : ""
                }`}
              >
                <span className="size-2.5 rounded-full" style={{ background: ACTIVITY_META[m.type].color }} />
                <span className="flex-1 text-zinc-300">{m.type}</span>
                <span className="tabular-nums text-zinc-500">{Math.round((m.mins / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

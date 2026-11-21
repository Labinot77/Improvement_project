"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { MOODS, moodOf } from "@/constants/journal";
import { AXIS_TICK, GRID_STROKE } from "@/constants/ui";
import type { Mood } from "@/types/journal";

const config = { value: { label: "Mood", color: "#34d399" } } satisfies ChartConfig;
const SCORE: Record<Mood, number> = { rough: 1, low: 2, okay: 3, good: 4, great: 5 };

type Row = { date: string; mood: Mood };

// Tooltip: date + mood emoji
function MoodTip({ active, payload }: { active?: boolean; payload?: { payload: Row & { label: string } }[] }) {
  if (!active || !payload?.length) return null;
  const r = payload[0].payload;
  const m = moodOf(r.mood);
  return (
    <div className="rounded-lg border border-white/[0.08] bg-[#161616] px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-300">{r.label}</p>
      <p className="text-zinc-400">
        {m.emoji} {m.label}
      </p>
    </div>
  );
}

// Mood over recent entries (1 = rough … 5 = great)
export function MoodChart({ rows }: { rows: Row[] }) {
  const data = rows.map((r) => ({
    ...r,
    value: SCORE[r.mood],
    label: new Date(`${r.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  if (data.length < 2) return <p className="py-10 text-center text-sm text-zinc-500">A few entries will draw your mood line.</p>;

  return (
    <ChartContainer config={config} className="h-40 w-full">
      <AreaChart data={data} margin={{ top: 6, right: 4, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={GRID_STROKE} />
        <XAxis dataKey="label" tick={AXIS_TICK} axisLine={false} tickLine={false} minTickGap={20} />
        <YAxis
          domain={[1, 5]}
          ticks={[1, 3, 5]}
          tickFormatter={(v) => [...MOODS].reverse()[v - 1]?.emoji ?? ""}
          tick={{ fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <ChartTooltip content={<MoodTip />} />
        <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#moodFill)" strokeWidth={2} />
      </AreaChart>
    </ChartContainer>
  );
}

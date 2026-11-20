"use client";

import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SleepEntry } from "@/types/sleep";
import { TARGET_HOURS } from "@/constants/sleep/main";
import { sleepStatus } from "@/app/sleep/data/main";

// Bars for the last 30 nights, coloured by status vs target
export function SleepChart({ entries }: { entries: SleepEntry[] }) {
  const data = [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map((e) => ({
      day: new Date(`${e.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      hours: e.durationHours,
      fill: sleepStatus(e.durationHours).color,
    }));

  if (!data.length) return <p className="rounded-2xl bg-white/[0.04] p-5 text-zinc-500">Log a few nights to see your durations.</p>;

  return (
    <ResponsiveContainer height={240}>
      <BarChart data={data} margin={{ top: 8, right: 0, left: -24, bottom: 0 }}>
        <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={16} />
        <YAxis domain={[0, 12]} tick={{ fill: "#71717a", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
        <ReferenceLine y={TARGET_HOURS} stroke="#a5b4fc" strokeDasharray="4 4" strokeOpacity={0.5} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.04)" }}
          contentStyle={{ background: "#14152b", border: "1px solid rgba(165,180,252,0.2)", borderRadius: 14 }}
          formatter={(v) => [`${v}h`, "Slept"]}
        />
        <Bar dataKey="hours" radius={[6, 6, 6, 6]} barSize={10}>
          {data.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

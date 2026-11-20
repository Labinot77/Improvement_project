"use client";

import {
  Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, Pie, PieChart, PolarAngleAxis,
  RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { Summary } from "@/app/main/data/main";
import { AREA } from "@/app/main/data/main";

const tip = {
  contentStyle: { background: "#191a1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "#e4e4e7" },
  itemStyle: { color: "#e4e4e7" },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};
const axis = { tick: { fill: "#71717a", fontSize: 12 }, axisLine: false, tickLine: false } as const;

// Empty-state text for charts with no data
const Empty = ({ text }: { text: string }) => (
  <p className="grid h-full place-items-center rounded-2xl bg-white/[0.03] p-6 text-center text-zinc-500">{text}</p>
);

// Concentric rings: weekly progress per area, overall score in the middle
export function BalanceRings({ data, score }: { data: Summary["balance"]; score: number }) {
  return (
    <div className="relative h-72">
      <ResponsiveContainer>
        <RadialBarChart data={[...data].reverse()} innerRadius="28%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={11}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "rgba(255,255,255,0.05)" }} />
          <Tooltip {...tip} formatter={(v) => [`${v}%`, "Progress"]} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-4xl font-semibold tabular-nums">{score}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">score</p>
        </div>
      </div>
    </div>
  );
}

// Activity minutes (bars) against hours slept (line), 14 days
export function BodyRestChart({ data }: { data: Summary["bodyRest"] }) {
  if (data.every((d) => !d.minutes && d.sleep == null)) return <Empty text="Log activity and sleep to see how they relate." />;
  return (
    <ResponsiveContainer height={260}>
      <ComposedChart data={data} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="day" {...axis} interval={1} />
        <YAxis yAxisId="m" {...axis} tickFormatter={(v) => `${v}m`} />
        <YAxis yAxisId="h" orientation="right" domain={[0, 12]} {...axis} tickFormatter={(v) => `${v}h`} />
        <Tooltip {...tip} />
        <Bar yAxisId="m" dataKey="minutes" name="Active min" fill={AREA.activity} radius={[6, 6, 0, 0]} barSize={14} />
        <Line yAxisId="h" dataKey="sleep" name="Sleep h" stroke={AREA.sleep} strokeWidth={2.5} dot={{ r: 3, fill: AREA.sleep }} connectNulls type="monotone" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// Done vs open to-dos per day, 7 days
export function TaskBars({ data }: { data: Summary["taskDays"] }) {
  if (data.every((d) => !d.done && !d.open)) return <Empty text="No to-dos this week." />;
  return (
    <ResponsiveContainer height={200}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
        <XAxis dataKey="day" {...axis} />
        <YAxis allowDecimals={false} {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="done" name="Done" stackId="t" fill={AREA.tasks} />
        <Bar dataKey="open" name="Open" stackId="t" fill="rgba(255,255,255,0.1)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Minutes per activity type, last 30 days
export function TrainingMix({ data }: { data: Summary["training"] }) {
  if (!data.length) return <Empty text="No sessions in the last 30 days." />;
  return (
    <div className="flex items-center gap-4">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="100%" paddingAngle={3} stroke="none">
              {data.map((d) => <Cell key={d.name} fill={d.fill} />)}
            </Pie>
            <Tooltip {...tip} formatter={(v) => [`${v} min`, ""]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="min-w-0 flex-1 space-y-2 text-sm">
        {data.slice(0, 5).map((d) => (
          <li key={d.name} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.fill }} />
            <span className="truncate text-zinc-300">{d.name}</span>
            <span className="ml-auto tabular-nums text-zinc-500">{d.value}m</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Lessons per category, last 30 days
export function LearningBars({ data }: { data: Summary["learning"] }) {
  if (!data.length) return <Empty text="No lessons in the last 30 days." />;
  return (
    <ResponsiveContainer height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={96} {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="value" name="Lessons" fill={AREA.lessons} radius={[0, 6, 6, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  );
}

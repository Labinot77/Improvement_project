"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { LOAD_ZONES } from "@/constants/fitness";
import { CARD } from "@/constants/ui";

type Props = {
  ratio: number | null;
  acute: number;
  chronic: number;
  zone: (typeof LOAD_ZONES)[number] | null;
};

const MAX = 2; // gauge spans ratio 0..2
const R = 80;

// Point on the half circle for a ratio
function point(ratio: number) {
  const a = Math.PI * (1 - Math.min(ratio, MAX) / MAX);
  return { x: 100 + R * Math.cos(a), y: 100 - R * Math.sin(a) };
}

// Half-circle gauge for acute:chronic training load
export function LoadGauge({ ratio, acute, chronic, zone }: Props) {
  const needle = point(ratio ?? 0);

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Training load</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button type="button" aria-label="About training load" className="text-zinc-600 hover:text-zinc-300">
              <Info className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">
            Load = minutes × intensity. This compares your last 7 days with your 4-week weekly average. 0.8 to 1.3
            is the sweet spot.
          </TooltipContent>
        </Tooltip>
      </div>

      <svg viewBox="0 0 200 112" className="mx-auto mt-4 w-full max-w-64" aria-hidden>
        {/* Zone bands */}
        {LOAD_ZONES.map((z, i) => {
          const from = point(i === 0 ? 0 : LOAD_ZONES[i - 1].max);
          const to = point(Math.min(z.max, MAX));
          return (
            <path
              key={z.label}
              d={`M ${from.x} ${from.y} A ${R} ${R} 0 0 1 ${to.x} ${to.y}`}
              fill="none"
              stroke={z.color}
              strokeOpacity={zone?.label === z.label ? 0.9 : 0.18}
              strokeWidth={12}
            />
          );
        })}
        <motion.circle
          r={7}
          fill="#16181b"
          stroke="white"
          strokeWidth={3}
          initial={{ cx: point(0).x, cy: point(0).y }}
          animate={{ cx: needle.x, cy: needle.y }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        />
        <text x="100" y="96" textAnchor="middle" className="fill-zinc-100 text-[26px] font-semibold">
          {ratio === null ? "—" : ratio.toFixed(2)}
        </text>
      </svg>

      <p className="mt-2 text-center font-medium" style={{ color: zone?.color }}>
        {zone?.label ?? "Not enough data"}
      </p>
      <p className="mt-1 text-center text-sm text-zinc-500">
        {zone?.tip ?? "Log a few weeks of sessions to see your load."}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl bg-white/[0.03] py-3">
          <p className="text-xl font-semibold tabular-nums">{acute}</p>
          <p className="text-xs text-zinc-500">7-day load</p>
        </div>
        <div className="rounded-2xl bg-white/[0.03] py-3">
          <p className="text-xl font-semibold tabular-nums">{chronic}</p>
          <p className="text-xs text-zinc-500">Weekly norm</p>
        </div>
      </div>
    </section>
  );
}

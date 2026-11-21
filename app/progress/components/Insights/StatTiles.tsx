"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCheck, Info, Trophy, TrendingDown, TrendingUp, CalendarRange } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CARD } from "@/constants/progress/template";
import type { ProgressStats } from "@/types/Progress/progress";
import { CountUp } from "./CountUp";

// Small +/- badge
function Delta({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0) return <span className="text-xs text-zinc-600">No change</span>;
  const up = value > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        up ? "bg-emerald-400/10 text-emerald-300" : "bg-red-400/10 text-red-300"
      }`}
    >
      <Icon className="size-3" />
      {up ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

type TileProps = {
  icon: ReactNode;
  tint: string;
  label: string;
  value: number;
  unit?: string;
  foot: ReactNode;
  hint?: string;
  index: number;
};

// One KPI tile
function Tile({ icon, tint, label, value, unit, foot, hint, index }: TileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={`${CARD} flex flex-col gap-4 rounded-2xl p-5 transition-colors hover:border-white/[0.12]`}
    >
      <div className="flex items-center justify-between">
        <span className={`grid size-9 place-items-center rounded-xl ${tint}`}>{icon}</span>
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" aria-label={`About ${label}`} className="text-zinc-600 hover:text-zinc-300">
                <Info className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-60">{hint}</TooltipContent>
          </Tooltip>
        )}
      </div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="mt-1 text-3xl font-semibold">
          <CountUp value={value} />
          {unit && <span className="ml-1 text-lg font-normal text-zinc-500">{unit}</span>}
        </p>
      </div>
      <div className="text-sm text-zinc-500">{foot}</div>
    </motion.div>
  );
}

// KPI row: best streak, week rate, momentum, 30-day completions
export function StatTiles({ stats }: { stats: ProgressStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Tile
        index={0}
        icon={<Trophy className="size-4" />}
        tint="bg-amber-400/10 text-amber-300"
        label="Best streak"
        value={stats.bestStreak}
        unit="days"
        foot={stats.streak >= stats.bestStreak && stats.streak > 0 ? "You're on it now" : `Current: ${stats.streak}`}
      />
      <Tile
        index={1}
        icon={<CalendarRange className="size-4" />}
        tint="bg-violet-400/10 text-violet-300"
        label="This week"
        value={stats.weekRate}
        unit="%"
        foot={<Delta value={stats.weekRate - stats.prevWeekRate} suffix="%" />}
      />
      <Tile
        index={2}
        icon={<Activity className="size-4" />}
        tint="bg-orange-400/10 text-orange-300"
        label="Momentum"
        value={stats.momentum}
        unit="/100"
        hint="A smoothed score of your daily completion rate. Recent days weigh more, and days without tasks slowly cool it down."
        foot={<Delta value={stats.momentumDelta} />}
      />
      <Tile
        index={3}
        icon={<CheckCheck className="size-4" />}
        tint="bg-emerald-400/10 text-emerald-300"
        label="Completed"
        value={stats.completed30}
        unit="tasks"
        foot="Last 30 days"
      />
    </div>
  );
}

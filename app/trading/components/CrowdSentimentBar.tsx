"use client";

import { SIGNAL_META } from "@/constants/trading";
import { Signal } from "@/types/trading";
import { motion } from "framer-motion";

interface Props {
  bullishPct: number;
  signal: Signal;
}

export function CrowdSentimentBar({ bullishPct, signal }: Props) {
  const bearishPct = 100 - bullishPct;
  const meta = SIGNAL_META[signal];

  return (
    <div className="flex flex-col gap-1.5 min-w-[160px]">
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">Crowd sentiment signal</span>
        <span
          className="rounded-md px-2 py-0.5 text-xs font-semibold"
          style={{ background: meta.bg, color: meta.color }}
        >
          {meta.label}
        </span>
      </div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${bullishPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-indigo-500"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${bearishPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-red-500"
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-zinc-600">
        <span>Bullish sentiment · {bullishPct}%</span>
        <span>Bearish sentiment · {bearishPct}%</span>
      </div>
    </div>
  );
}

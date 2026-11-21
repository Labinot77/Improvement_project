"use client";

import { motion } from "framer-motion";
import { CARD } from "@/constants/ui";

// Header badge: today's day score as a ring
export function ScoreRing({ score, weekAvg }: { score: number | null; weekAvg: number | null }) {
  const C = 2 * Math.PI * 24;
  return (
    <div className={`${CARD} flex items-center gap-4 rounded-2xl px-5 py-4`}>
      <div className="relative size-14 shrink-0">
        <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden>
          <circle cx="28" cy="28" r="24" fill="none" strokeWidth="6" className="stroke-white/[0.06]" />
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            stroke="url(#scoreGrad)"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - (score ?? 0) / 100) }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7c6cf0" />
              <stop offset="100%" stopColor="#e9a25c" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 grid place-content-center text-sm font-semibold tabular-nums">
          {score ?? "—"}
        </span>
      </div>
      <div>
        <p className="text-xl font-medium leading-tight">Today&apos;s score</p>
        <p className="text-zinc-500">{weekAvg === null ? "Log something to start" : `7-day average ${weekAvg}`}</p>
      </div>
    </div>
  );
}

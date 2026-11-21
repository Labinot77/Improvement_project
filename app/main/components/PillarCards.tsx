"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PILLARS, type PillarKey } from "@/constants/main/overview";
import { CARD } from "@/constants/ui";
import type { pillarCards } from "@/app/main/data/main";

// Tiny inline sparkline (no axes)
function Spark({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => `${(i / (values.length - 1 || 1)) * 100},${30 - (v / max) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-10 w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

// One card per area with a 14-day sparkline; links to the page
export function PillarCards({ cards }: { cards: ReturnType<typeof pillarCards> }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {(Object.keys(PILLARS) as PillarKey[]).map((k, i) => {
        const p = PILLARS[k];
        const c = cards[k];
        return (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -3 }}
          >
            <Link href={p.href} className={`${CARD} group block rounded-2xl p-5 transition-colors hover:border-white/[0.12]`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="size-2 rounded-full" style={{ background: p.color }} />
                  {p.label}
                </span>
                <ArrowUpRight className="size-4 text-zinc-600 transition group-hover:text-zinc-300" />
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums">{c.value}</p>
              <p className="mt-1 truncate text-sm text-zinc-500">{c.foot}</p>
              <div className="mt-3">
                <Spark values={c.spark} color={p.color} />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { SET_TARGET } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import type { muscleSets } from "@/app/activity/data/main";

const SCALE = 26; // sets that fill the bar

// Sets per muscle this week against the 10-20 set target band
export function MuscleSets({ rows }: { rows: ReturnType<typeof muscleSets> }) {
  const under = rows.filter((r) => r.name !== "Other" && r.sets < SET_TARGET.min).map((r) => r.name);

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Sets per muscle</h2>
      <p className="text-sm text-zinc-500">
        Last 7 days · shaded band is {SET_TARGET.min}–{SET_TARGET.max} sets
      </p>
      <ul className="mt-6 space-y-4">
        {rows.map((r, i) => (
          <li key={r.name}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="text-zinc-300">{r.name}</span>
              <span className="tabular-nums text-zinc-500">{r.sets} sets</span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.05]">
              <div
                className="absolute inset-y-0 bg-white/[0.07]"
                style={{ left: `${(SET_TARGET.min / SCALE) * 100}%`, width: `${((SET_TARGET.max - SET_TARGET.min) / SCALE) * 100}%` }}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (r.sets / SCALE) * 100)}%` }}
                transition={{ duration: 0.7, delay: i * 0.05 }}
                className="relative h-full rounded-full"
                style={{ background: r.color }}
              />
            </div>
          </li>
        ))}
      </ul>
      {under.length > 0 && rows.some((r) => r.sets > 0) && (
        <p className="mt-5 text-sm text-amber-300/90">Under target: {under.join(", ")}</p>
      )}
    </section>
  );
}

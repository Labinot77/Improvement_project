"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ACTIVITY_META } from "@/constants/fitness";
import type { Filter } from "@/app/activity/data/main";

// URL-driven filter pills (only types the user has logged)
export function FilterTabs({ active, filters }: { active: Filter; filters: Filter[] }) {
  return (
    <nav aria-label="Filter activities" className="mt-9 flex flex-wrap gap-3">
      {filters.map((f) => (
        <Link
          key={f}
          href={f === "All activities" ? "/activity" : `/activity?filter=${encodeURIComponent(f)}`}
          scroll={false}
          aria-current={active === f ? "page" : undefined}
          className={`relative rounded-full px-6 py-3 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/50 ${
            active === f ? "font-medium text-rose-300" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {active === f && (
            <motion.span
              layoutId="activity-filter-pill"
              className="absolute inset-0 rounded-full bg-rose-400/15 ring-1 ring-rose-300/40"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">
            {f !== "All activities" && <span aria-hidden>{ACTIVITY_META[f].icon} </span>}
            {f}
          </span>
        </Link>
      ))}
    </nav>
  );
}

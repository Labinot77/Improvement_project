"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FILTERS, type Filter } from "@/app/recipes/data/main";

export function FilterTabs({ active }: { active: Filter }) {
  return (
    <nav aria-label="Filter recipes" className="mt-9 flex flex-wrap gap-3">
      {FILTERS.map((f) => (
        <Link
          key={f}
          href={f === "All recipes" ? "/recipes" : `/recipes?filter=${encodeURIComponent(f)}`}
          scroll={false}
          aria-current={active === f ? "page" : undefined}
          className={`relative rounded-full px-6 py-3 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50 ${
            active === f
              ? "font-medium text-emerald-300"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {active === f && (
            <motion.span
              layoutId="recipe-filter-pill"
              className="absolute inset-0 rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/40"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">{f}</span>
        </Link>
      ))}
    </nav>
  );
}
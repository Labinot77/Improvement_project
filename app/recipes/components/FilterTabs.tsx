"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FILTERS, type Filter } from "@/app/recipes/data/main";

// The active pill slides between tabs. `active` updates on click so the pill moves
// immediately, then syncs with the server's `filter` once the page re-renders.
export function FilterTabs({ filter }: { filter: Filter }) {
  const [active, setActive] = useState(filter);
  useEffect(() => setActive(filter), [filter]);

  return (
    <nav aria-label="Filter recipes" className="mt-9 flex flex-wrap gap-3">
      {FILTERS.map((f) => (
        <Link
          key={f}
          href={f === "All recipes" ? "?" : `?filter=${encodeURIComponent(f)}`}
          scroll={false}
          onClick={() => setActive(f)}
          aria-current={active === f ? "page" : undefined}
          className={`relative rounded-full border px-6 py-3 text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50 ${
            active === f
              ? "border-transparent font-medium text-zinc-900"
              : "border-white/10 text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"
          }`}
        >
          {active === f && (
            <motion.span
              layoutId="filter-pill"
              className="absolute -inset-px rounded-full bg-white"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative">{f}</span>
        </Link>
      ))}
    </nav>
  );
}
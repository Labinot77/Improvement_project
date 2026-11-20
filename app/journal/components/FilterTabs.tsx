"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FILTERS } from "@/constants/journal";
import type { JournalFilter } from "@/types/journal";
import { journalHref } from "../url";

// Filter chips; keep the search term, reset the page
export function FilterTabs({ active, q }: { active: JournalFilter; q: string }) {
  return (
    <nav aria-label="Filter entries" className="flex flex-wrap gap-1.5">
      {FILTERS.map((f) => (
        <Link
          key={f.key}
          href={journalHref({ filter: f.key, q })}
          scroll={false}
          aria-current={active === f.key ? "page" : undefined}
          className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
            active === f.key ? "text-amber-100" : "text-zinc-500 hover:text-zinc-200"
          }`}
        >
          {active === f.key && (
            <motion.span
              layoutId="journal-filter-pill"
              className="absolute inset-0 rounded-full bg-amber-200/10 ring-1 ring-amber-200/30"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">{f.label}</span>
        </Link>
      ))}
    </nav>
  );
}

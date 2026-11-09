"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FILTERS } from "@/constants/journal";
import type { JournalFilter } from "@/types/journal";

export function FilterTabs({ active }: { active: JournalFilter }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {FILTERS.map((f) => (
        <Link
          key={f.key}
          href={f.key === "all" ? "/journal" : `/journal?filter=${encodeURIComponent(f.key)}`}
          scroll={false}
          className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
            active === f.key ? "text-emerald-300" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {active === f.key && (
            <motion.span
              layoutId="journal-filter-pill"
              className="absolute inset-0 rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/40"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative">{f.label}</span>
        </Link>
      ))}
    </div>
  );
}
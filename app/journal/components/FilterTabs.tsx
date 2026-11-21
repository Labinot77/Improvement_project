"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FILTERS, isFilter } from "@/constants/journal";
import type { JournalFilter } from "@/types/journal";

// Filter pills that keep the current search and reset the page
export function FilterTabs() {
  const params = useSearchParams();
  const raw = params.get("filter") ?? undefined;
  const active: JournalFilter = isFilter(raw) ? raw : "all";

  // URL for a filter, preserving ?q
  function href(key: JournalFilter) {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    if (key === "all") next.delete("filter");
    else next.set("filter", key);
    const qs = next.toString();
    return qs ? `/journal?${qs}` : "/journal";
  }

  return (
    <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
      {FILTERS.map((f) => (
        <Link
          key={f.key}
          href={href(f.key)}
          scroll={false}
          className={`relative shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
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

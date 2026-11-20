"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search as SearchIcon, X } from "lucide-react";
import type { JournalFilter } from "@/types/journal";
import { journalHref } from "../url";

// Debounced search box; updates ?q= and resets to page 1
export function Search({ q, filter }: { q: string; filter: JournalFilter }) {
  const router = useRouter();
  const [value, setValue] = useState(q);
  const [pending, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(() => {
      startTransition(() => router.replace(journalHref({ filter, q: value }), { scroll: false }));
    }, 300);
    return () => clearTimeout(t);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative w-full sm:max-w-sm">
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search your entries…"
        aria-label="Search entries"
        className="h-12 w-full rounded-full border border-amber-100/10 bg-[#14120f] pl-11 pr-11 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-200/30 [&::-webkit-search-cancel-button]:hidden"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        {pending ? (
          <Loader2 className="size-4 animate-spin text-zinc-500" aria-label="Searching" />
        ) : value ? (
          <button type="button" aria-label="Clear search" onClick={() => setValue("")}
            className="grid size-7 place-items-center rounded-full text-zinc-500 hover:bg-white/5 hover:text-zinc-200">
            <X className="size-4" />
          </button>
        ) : null}
      </span>
    </div>
  );
}

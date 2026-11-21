"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ALL_CATEGORIES } from "@/app/lessons/constants/Main";

// Category filter links that keep the search and reset the page
export function CategoryChips() {
  const params = useSearchParams();
  const active = (ALL_CATEGORIES as readonly string[]).includes(params.get("category") ?? "")
    ? params.get("category")
    : "All";

  // URL for a category
  function href(cat: string) {
    const next = new URLSearchParams(params.toString());
    next.delete("page");
    if (cat === "All") next.delete("category");
    else next.set("category", cat);
    const qs = next.toString();
    return qs ? `/lessons?${qs}` : "/lessons";
  }

  return (
    <nav aria-label="Filter lessons" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2.5 sm:px-0">
      {ALL_CATEGORIES.map((cat) => (
        <Link
          key={cat}
          href={href(cat)}
          scroll={false}
          aria-current={active === cat ? "page" : undefined}
          className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-sm transition-colors sm:h-11 sm:px-5 ${
            active === cat
              ? "border-white bg-white font-medium text-zinc-900"
              : "border-white/[0.1] text-zinc-400 hover:border-white/20 hover:text-zinc-100"
          }`}
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}

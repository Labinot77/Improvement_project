"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import type { JournalFilter } from "@/types/journal";
import { journalHref } from "../url";

// Page numbers with ellipses: 1 … 4 5 6 … 10
function pageList(page: number, pages: number): (number | "…")[] {
  const keep = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const sorted = [...keep].sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i && n - sorted[i - 1] > 1 ? ["…" as const, n] : [n]));
}

// shadcn pagination; each click fetches only that page from the server
export function Pager({ page, pages, filter, q }: { page: number; pages: number; filter: JournalFilter; q: string }) {
  const router = useRouter();
  if (pages <= 1) return null;

  const href = (n: number) => journalHref({ filter, q, page: n });
  // Client-side navigation instead of a full reload
  const go = (n: number) => (e: MouseEvent) => {
    e.preventDefault();
    if (n >= 1 && n <= pages && n !== page) router.push(href(n), { scroll: false });
  };
  const off = "pointer-events-none opacity-40";

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={href(Math.max(1, page - 1))} onClick={go(page - 1)} aria-disabled={page === 1} className={page === 1 ? off : ""} />
        </PaginationItem>
        {pageList(page, pages).map((n, i) => (
          <PaginationItem key={`${n}-${i}`}>
            {n === "…" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink href={href(n)} onClick={go(n)} isActive={n === page}>{n}</PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={href(Math.min(pages, page + 1))} onClick={go(page + 1)} aria-disabled={page === pages} className={page === pages ? off : ""} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

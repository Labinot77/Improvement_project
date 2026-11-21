import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = { page: number; pages: number; params: Record<string, string | undefined> };

// Page numbers to show: first, last, and neighbours of the current page
function pageList(page: number, pages: number): (number | "…")[] {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? (["…", p] as const) : [p]));
}

// ShadCN pagination that keeps the filter and search in the URL
export function JournalPagination({ page, pages, params }: Props) {
  if (pages <= 1) return null;

  // URL for a page number
  const href = (p: number) => {
    const next = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => !!e[1]));
    if (p > 1) next.set("page", String(p));
    else next.delete("page");
    const qs = next.toString();
    return qs ? `/journal?${qs}` : "/journal";
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={href(Math.max(1, page - 1))} aria-disabled={page === 1} className={page === 1 ? "pointer-events-none opacity-40" : ""} />
        </PaginationItem>
        {pageList(page, pages).map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`e${i}`} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href={href(p)} isActive={p === page}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext href={href(Math.min(pages, page + 1))} aria-disabled={page === pages} className={page === pages ? "pointer-events-none opacity-40" : ""} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

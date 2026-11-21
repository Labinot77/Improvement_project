import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  basePath: string;
  page: number;
  pages: number;
  params: Record<string, string | undefined>; // other query params to keep
};

// First, last and neighbours of the current page
function pageList(page: number, pages: number): (number | "…")[] {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages));
  const sorted = [...set].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i && p - sorted[i - 1] > 1 ? (["…", p] as const) : [p]));
}

// ShadCN pagination using <Link>, so changing page is a soft navigation
export default function UrlPagination({ basePath, page, pages, params }: Props) {
  if (pages <= 1) return null;

  // URL for a page, keeping the other params
  const href = (p: number) => {
    const next = new URLSearchParams(Object.entries(params).filter((e): e is [string, string] => !!e[1]));
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const edge = (disabled: boolean) =>
    cn(buttonVariants({ variant: "ghost" }), "gap-1 px-2.5", disabled && "pointer-events-none opacity-40");

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Link href={href(page - 1)} scroll={false} aria-label="Previous page" aria-disabled={page === 1} className={edge(page === 1)}>
            <ChevronLeftIcon className="size-4" />
            <span className="hidden sm:block">Previous</span>
          </Link>
        </PaginationItem>
        {pageList(page, pages).map((p, i) =>
          p === "…" ? (
            <PaginationItem key={`e${i}`} className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <Link
                href={href(p)}
                scroll={false}
                aria-current={p === page ? "page" : undefined}
                className={buttonVariants({ variant: p === page ? "outline" : "ghost", size: "icon" })}
              >
                {p}
              </Link>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <Link href={href(page + 1)} scroll={false} aria-label="Next page" aria-disabled={page === pages} className={edge(page === pages)}>
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon className="size-4" />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

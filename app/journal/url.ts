import type { JournalFilter } from "@/types/journal";

// Build /journal URL, dropping defaults
export function journalHref({ filter = "all", q = "", page = 1 }: { filter?: JournalFilter; q?: string; page?: number }) {
  const p = new URLSearchParams();
  if (filter !== "all") p.set("filter", filter);
  if (q.trim()) p.set("q", q.trim());
  if (page > 1) p.set("page", String(page));
  const s = p.toString();
  return s ? `/journal?${s}` : "/journal";
}

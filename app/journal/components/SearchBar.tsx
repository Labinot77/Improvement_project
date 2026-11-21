"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Debounced search that writes ?q= to the URL (and resets to page 1)
export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const [pending, startTransition] = useTransition();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set("q", value.trim());
      else next.delete("q");
      next.delete("page");
      startTransition(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search your entries…"
        aria-label="Search entries"
        className="h-11 rounded-full border-white/[0.08] bg-white/[0.03] pl-11 pr-10"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          value && (
            <button type="button" aria-label="Clear search" onClick={() => setValue("")} className="hover:text-zinc-200">
              <X className="size-4" />
            </button>
          )
        )}
      </span>
    </div>
  );
}

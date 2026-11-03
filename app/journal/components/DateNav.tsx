"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

function shift(dateKey: string, days: number) {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

interface DateNavProps {
  selected: string;
  today: string;
}

export function DateNav({ selected, today }: DateNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  function go(date: string) {
    if (!date || date > today) return;
    router.push(date === today ? pathname : `${pathname}?date=${date}`, {
      scroll: false,
    });
  }

  const btn =
    "grid size-9 place-items-center rounded-xl bg-white/[0.04] text-zinc-300 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={btn}
        onClick={() => go(shift(selected, -1))}
        aria-label="Previous day"
      >
        <ChevronLeft className="size-4" />
      </button>

      <input
        type="date"
        value={selected}
        max={today}
        onChange={(e) => go(e.target.value)}
        aria-label="Select journal date"
        className="h-9 rounded-xl bg-white/[0.04] px-3 text-sm text-zinc-200 [color-scheme:dark] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
      />

      <button
        type="button"
        className={btn}
        onClick={() => go(shift(selected, 1))}
        disabled={selected >= today}
        aria-label="Next day"
      >
        <ChevronRight className="size-4" />
      </button>

      {selected !== today && (
        <button
          type="button"
          onClick={() => go(today)}
          className="h-9 rounded-xl bg-violet-400/10 px-3 text-sm font-medium text-violet-300 transition hover:bg-violet-400/20"
        >
          Today
        </button>
      )}
    </div>
  );
}
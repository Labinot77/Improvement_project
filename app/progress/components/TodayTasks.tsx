"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CARD } from "@/constants/progress/template";
import { TaskList } from "./List";
import { useToday } from "./TodayProvider";

const FILTERS = ["all", "open", "done"] as const;
type Filter = (typeof FILTERS)[number];

// Today's list with All / Open / Done filter
export function TodayTasks() {
  const { items, toggle, remove } = useToday();
  const [filter, setFilter] = useState<Filter>("all");

  const counts = {
    all: items.length,
    open: items.filter((t) => !t.completed).length,
    done: items.filter((t) => t.completed).length,
  };
  const shown = items.filter((t) =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed,
  );

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-baseline gap-2 text-lg font-medium">
          Today
          <span className="text-zinc-600">{items.length}</span>
        </h2>
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(v) => v && setFilter(v as Filter)}
          className="rounded-full border border-white/[0.06] bg-white/[0.02] p-1"
        >
          {FILTERS.map((f) => (
            <ToggleGroupItem
              key={f}
              value={f}
              className="h-7 rounded-full px-3 text-xs capitalize text-zinc-500 data-[state=on]:bg-white/[0.08] data-[state=on]:text-zinc-100"
            >
              {f}
              <span className="ml-1 tabular-nums text-zinc-600">{counts[f]}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className={`${CARD} overflow-hidden`}>
        {shown.length === 0 ? (
          <p className="px-6 py-8 text-center text-zinc-500">
            {items.length === 0
              ? "No tasks for today yet."
              : filter === "done"
                ? "Nothing finished yet. Pick the smallest one."
                : "All clear. Every task is done."}
          </p>
        ) : (
          <TaskList tasks={shown} onToggle={toggle} onRemove={remove} />
        )}
      </div>
    </section>
  );
}

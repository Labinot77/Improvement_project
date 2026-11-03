"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import type { Activity } from "@/types/fitness";
import { ActivityCard } from "./Card";
interface Props {
  activities: Activity[];
  onDelete: (id: string) => void;
}


export function ActivityHistory({ activities, onDelete }: Props) {
  const INITIAL_LIMIT = 14;
  const [limit, setLimit] = useState(INITIAL_LIMIT);
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = activities.slice(0, limit);
  const hasMore = activities.length > limit;

  if (activities.length === 0) {
    return (
      <p className="text-sm text-zinc-600 py-4 text-center">
        No sessions logged yet — add your first one.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {visible.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isOpen={expanded === activity.id}
              onToggle={() =>
                setExpanded((prev) =>
                  prev === activity.id ? null : activity.id,
                )
              }
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>

        {hasMore && (
          <button
            onClick={() => setLimit((l) => l + INITIAL_LIMIT)}
            className="mt-1 w-full rounded-xl border border-white/[0.06] py-2 text-xs font-medium
              text-zinc-500 hover:text-zinc-300 hover:border-white/[0.12] transition-all"
          >
            Load more ({activities.length - limit} remaining)
          </button>
        )}
      </div>
    </>
  );
}

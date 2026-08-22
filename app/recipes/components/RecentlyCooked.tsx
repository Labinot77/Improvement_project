"use client";

import { Clock, ImageIcon } from "lucide-react";
import { MEAL_META, DIFFICULTY_META } from "@/constants/recipes";
import { useCookLog } from "@/lib/recipies/RecentlyCooked";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const RecentlyCooked = () => {
  const { entries, loading } = useCookLog(8);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
        Recently cooked
      </p>

      {loading ? (
        <div className="flex flex-col gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-zinc-600 py-3 text-center">
          Nothing cooked yet — mark a recipe as Made from its preview.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {entries.map((entry) => {
            const meal = entry.recipe.mealType ? MEAL_META[entry.recipe.mealType] : null;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/[0.04]">
                  {entry.recipe.imageUrl ? (
                    <img
                      src={entry.recipe.imageUrl}
                      alt={entry.recipe.title}
                      className="size-8 rounded-md object-cover"
                    />
                  ) : (
                    <span className="text-xs">{meal?.icon ?? <ImageIcon className="size-3.5 text-zinc-700" />}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{entry.recipe.title}</p>
                  <p className="flex items-center gap-1 text-[11px] text-zinc-600">
                    <Clock className="size-3" /> {timeAgo(entry.cookedAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentlyCooked;
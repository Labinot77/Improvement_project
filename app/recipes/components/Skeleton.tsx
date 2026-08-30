"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RecipeSkeleton() {
  return (
    <div
      className="rounded-xl border border-white/[0.06] bg-white/[0.02]
        flex h-full min-h-40 overflow-hidden"
    >
      <Skeleton className="w-40 shrink-0 self-stretch rounded-none" />

      <div className="px-4 py-3 flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="size-6 shrink-0 rounded" />
        </div>

        <Skeleton className="h-[18px] w-3/4" />
        <Skeleton className="h-[18px] w-1/2" />

        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        <div className="mt-auto flex items-center gap-3">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-[14px] w-10" />
          <Skeleton className="h-[14px] w-16" />
        </div>
      </div>
    </div>
  );
}

export default RecipeSkeleton;
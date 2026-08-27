"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div
      className="
        shrink-0
        rounded-xl
        border
        border-white/[0.06]
        bg-[#0f0f0f]/75
        overflow-hidden"
    >
      <div className="flex w-full items-start gap-3 px-4 py-3">
        {/* Category icon */}
        <Skeleton className="size-4 shrink-0 mt-0.5 rounded" />

        {/* Title + meta */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <Skeleton className="h-[18px] w-40" />

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category badge */}
            <Skeleton className="h-5 w-16 rounded-full" />

            {/* Impact dot + label */}
            <div className="flex items-center gap-1">
              <Skeleton className="size-1.5 rounded-full" />
              <Skeleton className="h-[14px] w-16" />
            </div>

            {/* Date */}
            <Skeleton className="h-[14px] w-20" />
          </div>
        </div>

        {/* Chevron */}
        <Skeleton className="size-4 shrink-0 mt-1 rounded" />
      </div>
    </div>
  );
}

export default LessonSkeleton;
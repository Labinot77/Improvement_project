"use client"

import { Skeleton } from "@/components/ui/skeleton";

const TemplateSkeleton = () => {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#161616] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 justify-start text-left">
          <Skeleton className="h-4.5 w-28" />
          <Skeleton className="mt-1 h-3.5 w-40" />
        </div>
        <Skeleton className="size-3.5 shrink-0 rounded" />
      </div>
    </div>
  )
}

export default TemplateSkeleton
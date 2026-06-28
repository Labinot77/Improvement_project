
import { Skeleton } from "@/components/ui/skeleton";

export function TaskSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#131313] px-3 py-3">
      <Skeleton className="mt-0.5 size-4 shrink-0 rounded-md bg-white/[0.06]" />

      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-3.5 w-2/5 rounded bg-white/[0.06]" />
        </div>
        <Skeleton className="h-3 w-3/5 rounded bg-white/[0.06]" />
      </div>
    </div>
  );
}
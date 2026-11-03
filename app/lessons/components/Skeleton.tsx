import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/[0.06] bg-[#16181b] p-6">
      <div className="flex items-start justify-between">
        <Skeleton className="h-8 w-20 rounded-full" />
        <div className="flex gap-1">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
      <Skeleton className="mt-5 h-6 w-3/4" />
      <div className="mt-4 space-y-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="mt-6 h-4 w-20" />
    </div>
  );
}

export default LessonSkeleton;
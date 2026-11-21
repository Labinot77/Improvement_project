import { Skeleton } from "@/components/ui/skeleton";

// Placeholder grid shown while a page of results loads
export default function ListSkeleton({ count = 6, className = "sm:grid-cols-2 xl:grid-cols-3", height = "h-56" }: { count?: number; className?: string; height?: string }) {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-4 w-40" />
      <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: count }, (_, i) => (
          <Skeleton key={i} className={`${height} rounded-3xl`} />
        ))}
      </div>
    </div>
  );
}

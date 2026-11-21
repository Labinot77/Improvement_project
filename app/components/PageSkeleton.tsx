import { Skeleton } from "@/components/ui/skeleton";

type Props = { blocks: string[] }; // tailwind grid/height classes per row

// Generic page placeholder: header, then rows of card-shaped blocks
export default function PageSkeleton({ blocks }: Props) {
  return (
    <div className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-14 w-56" />
          <Skeleton className="h-5 w-72 max-w-full" />
        </div>
        <Skeleton className="h-20 w-60 rounded-2xl" />
      </div>
      {blocks.map((row, i) => {
        const [cols, height] = row.split("|");
        const count = Number(cols.match(/cols-(\d)/g)?.pop()?.slice(5) ?? 1);
        return (
          <div key={i} className={`grid gap-6 ${cols}`}>
            {Array.from({ length: count }, (_, j) => (
              <Skeleton key={j} className={`${height} rounded-3xl`} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

import PageSkeleton from "@/app/components/PageSkeleton";

// Journal placeholder: prompt + week card, then the entry grid
export default function Loading() {
  return <PageSkeleton blocks={["lg:grid-cols-2|h-72", "grid-cols-1|h-11", "sm:grid-cols-2 xl:grid-cols-3|h-56"]} />;
}

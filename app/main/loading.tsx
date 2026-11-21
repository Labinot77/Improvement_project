import PageSkeleton from "@/app/components/PageSkeleton";

// Overview placeholder: quick add, area cards, score chart, charts
export default function Loading() {
  return <PageSkeleton blocks={["grid-cols-3 lg:grid-cols-6|h-20", "grid-cols-2 lg:grid-cols-4|h-40", "lg:grid-cols-2|h-80", "lg:grid-cols-2|h-72"]} />;
}

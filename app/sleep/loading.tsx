import PageSkeleton from "@/app/components/PageSkeleton";

// Sleep placeholder: hero chart, summary cards, trends, calendar
export default function Loading() {
  return <PageSkeleton blocks={["grid-cols-1|h-96", "md:grid-cols-3|h-40", "lg:grid-cols-2|h-72", "grid-cols-1|h-80"]} />;
}

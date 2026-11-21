import PageSkeleton from "@/app/components/PageSkeleton";

// Activity placeholder: week planner, three cards, volume chart
export default function Loading() {
  return <PageSkeleton blocks={["grid-cols-1|h-80", "md:grid-cols-3|h-80", "grid-cols-1|h-72"]} />;
}

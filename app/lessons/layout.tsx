import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/app/components/SearchBar";
import { LessonsHero } from "./components/Hero";
import { CategoryChips } from "./components/CategoryChips";

// Lessons shell: hero + filters stay mounted; only the page (results) changes with the URL
export default function LessonsLayout({ children }: { children: ReactNode }) {
  return (
    <main className="space-y-6 px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      <Suspense fallback={<Skeleton className="h-72 rounded-3xl" />}>
        <LessonsHero />
      </Suspense>
      <Suspense>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CategoryChips />
          <SearchBar placeholder="Search lessons…" />
        </div>
      </Suspense>
      {children}
    </main>
  );
}

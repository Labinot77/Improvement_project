import { Suspense, type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/app/components/SearchBar";
import { JournalHero } from "./components/Hero";
import { FilterTabs } from "./components/FilterTabs";

// Journal shell: hero + toolbar stay mounted; only the page (results) changes with the URL
export default function JournalLayout({ children }: { children: ReactNode }) {
  return (
    <main className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
      <Suspense fallback={<Skeleton className="h-[28rem] rounded-3xl" />}>
        <JournalHero />
      </Suspense>
      <section className="space-y-6">
        <Suspense>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <FilterTabs />
            <SearchBar placeholder="Search your entries…" />
          </div>
        </Suspense>
        {children}
      </section>
    </main>
  );
}

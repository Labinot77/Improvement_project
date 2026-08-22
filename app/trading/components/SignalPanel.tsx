"use client";

import SectionCard from "@/app/components/SectionCard";
import { SignalCategoryTable } from "./SignalCategoryTable";
import { CrowdSentimentBar } from "./CrowdSentimentBar";
import { MacroSnapshot } from "@/types/trading";
import { ACCENT } from "@/constants/trading";

interface Props {
  snapshot: MacroSnapshot;
}

export function SignalPanel({ snapshot }: Props) {
  return (
    <SectionCard accentGlow={ACCENT} className="p-4 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-zinc-100">Signal breakdown</h2>
          <CrowdSentimentBar
            bullishPct={snapshot.crowdSentiment.bullishPct}
            signal={snapshot.crowdSentiment.signal}
          />
        </div>

        <div className="flex flex-col gap-3">
          {snapshot.categories.map((category) => (
            <SignalCategoryTable key={category.key} category={category} />
          ))}
        </div>

        <p className="mt-1 text-center text-[10px] leading-relaxed text-zinc-700">
          These readings are for informational purposes only and do not constitute financial advice.
        </p>
      </div>
    </SectionCard>
  );
}

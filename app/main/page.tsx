import PageHeader from "@/app/components/PageHeader";
import { getOverviewData } from "@/app/main/store/main";
import { findConnections, pillarCards, scoreSummary } from "@/app/main/data/main";
import { ScoreRing } from "./components/ScoreRing";
import { PillarCards } from "./components/PillarCards";
import { OverviewBoard } from "./components/OverviewBoard";
import { Connections } from "./components/Connections";

// Good morning / afternoon / evening
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

// Overview: one score per day, per-area cards and cross-area patterns
export default async function OverviewPage() {
  const data = await getOverviewData();
  const score = scoreSummary(data);

  return (
    <div className="space-y-12 px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow={greeting()}
        eyebrowClass="text-[#e9a25c]"
        title="Overview"
        subtitle="How your days are actually going, across everything you track."
        aside={<ScoreRing score={score.today.score} weekAvg={score.weekAvg} />}
      />

      {data.error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Some data couldn&apos;t load: {data.error}
        </p>
      )}

      <PillarCards cards={pillarCards(score.days)} />
      <OverviewBoard days={score.days} avg={score.avg} />
      <Connections items={findConnections(data)} />
    </div>
  );
}

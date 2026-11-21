import PageHeader from "@/app/components/PageHeader";
import { getOverviewData } from "@/app/main/store/main";
import { CONNECTION_DAYS } from "@/constants/main/overview";
import {
  buildDays,
  coachNotes,
  findConnections,
  pillarCards,
  pillarTrend,
  scoreSummary,
  weekdayScores,
  weeklyBalance,
} from "@/app/main/data/main";
import { ScoreRing } from "./components/ScoreRing";
import { QuickAdd } from "./components/QuickAdd";
import { PillarCards } from "./components/PillarCards";
import { OverviewBoard } from "./components/OverviewBoard";
import { CoachNotes } from "./components/CoachNotes";
import { BalanceRadar } from "./components/BalanceRadar";
import { PillarTrend } from "./components/PillarTrend";
import { WeekdayScore } from "./components/WeekdayScore";
import { Connections } from "./components/Connections";

// Good morning / afternoon / evening
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

// Overview: quick add, day score, feedback, area charts and cross-area patterns
export default async function OverviewPage() {
  const data = await getOverviewData();
  const score = scoreSummary(data);
  const long = buildDays(data, CONNECTION_DAYS);

  return (
    <div className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
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

      <QuickAdd />
      <PillarCards cards={pillarCards(score.days)} />
      <OverviewBoard days={score.days} avg={score.avg} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <CoachNotes notes={coachNotes(data)} />
        <PillarTrend rows={pillarTrend(score.days)} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BalanceRadar rows={weeklyBalance(score.days)} />
        <WeekdayScore rows={weekdayScores(long)} />
      </div>

      <Connections items={findConnections(data)} />
    </div>
  );
}

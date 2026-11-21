import PageHeader from "@/app/components/PageHeader";
import { getActivities } from "@/app/activity/store/main";
import { activityKpis, formatMins, loadRatio, typeMix } from "@/app/activity/data/main";
import { WEEKLY_GOAL } from "@/constants/fitness";
import { StatStrip } from "./components/StatStrip";
import { WeekGoal } from "./components/WeekGoal";
import { SessionList } from "./components/SessionList";
import { LogForm } from "./components/LogForm";
import { LoadGauge } from "./components/LoadGauge";
import { VolumeChart } from "./components/VolumeChart";
import { TypeMix } from "./components/TypeMix";

// Activity page: log sessions, training load and volume
export default async function ActivityPage() {
  const { activities, error } = await getActivities();
  const k = activityKpis(activities);
  const load = loadRatio(activities);
  const minsDelta = k.minsThisWeek - k.minsLastWeek;

  return (
    <div className="space-y-12 px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Training"
        eyebrowClass="text-[#f97362]"
        title="Activity"
        subtitle="Every session counts. Keep the load steady and the streak alive."
        aside={<WeekGoal done={k.sessionsThisWeek} />}
      />

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your sessions: {error}
        </p>
      )}

      <StatStrip
        stats={[
          { label: "This week", value: formatMins(k.minsThisWeek), foot: `${minsDelta >= 0 ? "+" : "−"}${formatMins(Math.abs(minsDelta))} vs last week`, accent: true },
          { label: "Goal streak", value: `${k.goalStreak}w`, foot: `weeks with ${WEEKLY_GOAL}+ sessions` },
          { label: "Avg session", value: formatMins(k.avgSession), foot: "last 30 days" },
          { label: "Load ratio", value: load.ratio?.toFixed(2) ?? "—", foot: load.zone?.label ?? "needs more data" },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2.15fr)_minmax(0,1fr)]">
        <div className="space-y-8">
          <VolumeChart activities={activities} />
          <SessionList activities={activities} />
        </div>
        <aside className="space-y-6">
          <LogForm />
          <LoadGauge {...load} />
          <TypeMix mix={typeMix(activities)} />
        </aside>
      </div>
    </div>
  );
}

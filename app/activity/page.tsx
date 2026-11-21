import { Plus } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import OpenModalButton from "@/app/components/OpenModalButton";
import { getActivities } from "@/app/activity/store/main";
import { activityKpis, formatMins, loadRatio, personalBests, typeMix, weekPlan } from "@/app/activity/data/main";
import { ACTIVITY_COLOR, WEEKLY_GOAL } from "@/constants/fitness";
import { WeekPlanner } from "./components/WeekPlanner";
import { SessionList } from "./components/SessionList";
import { LoadGauge } from "./components/LoadGauge";
import { VolumeChart } from "./components/VolumeChart";
import { TypeMix } from "./components/TypeMix";
import { PersonalBests } from "./components/PersonalBests";

// Activity page: week planner, load, records, volume and the training log
export default async function ActivityPage() {
  const { activities, error } = await getActivities();
  const k = activityKpis(activities);
  const load = loadRatio(activities);
  const minsDelta = k.minsThisWeek - k.minsLastWeek;

  return (
    <div className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Training"
        eyebrowClass="text-[#f97362]"
        title="Activity"
        subtitle="Every session counts. Keep the load steady and the streak alive."
        aside={
          <OpenModalButton
            modal="activity_form"
            props={{}}
            className="inline-flex h-12 items-center gap-2 self-start rounded-full px-6 font-medium text-white transition hover:opacity-90 sm:self-auto"
            style={{ background: ACTIVITY_COLOR }}
          >
            <Plus className="size-5" /> Log session
          </OpenModalButton>
        }
      />

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your sessions: {error}
        </p>
      )}

      <WeekPlanner
        days={weekPlan(activities)}
        stats={[
          { label: "Minutes", value: formatMins(k.minsThisWeek), foot: `${minsDelta >= 0 ? "+" : "−"}${formatMins(Math.abs(minsDelta))} vs last week` },
          { label: "Goal streak", value: `${k.goalStreak}w`, foot: `weeks with ${WEEKLY_GOAL}+ sessions` },
          { label: "Avg session", value: formatMins(k.avgSession), foot: "last 30 days" },
          { label: "Load ratio", value: load.ratio?.toFixed(2) ?? "—", foot: load.zone?.label ?? "needs more data" },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <LoadGauge {...load} />
        <TypeMix mix={typeMix(activities)} />
        <div className="md:col-span-2 xl:col-span-1">
          <PersonalBests bests={personalBests(activities)} />
        </div>
      </div>

      <VolumeChart activities={activities} />
      <SessionList activities={activities} />
    </div>
  );
}

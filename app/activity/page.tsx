import { Plus } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import OpenModalButton from "@/app/components/OpenModalButton";
import { getActivities, getTemplates } from "@/app/activity/store/main";
import {
  cardioSummary,
  exerciseNames,
  formatKg,
  formatMins,
  gymKpis,
  lastPerformance,
  loadRatio,
  muscleSets,
  nextTemplate,
  personalRecords,
  weekPlan,
  weeklyStrength,
} from "@/app/activity/data/main";
import { ACTIVITY_COLOR, VOLUME_WEEKS, WEEKLY_GOAL } from "@/constants/fitness";
import { ProgramCard } from "./components/ProgramCard";
import { WeekPlanner } from "./components/WeekPlanner";
import { StrengthChart } from "./components/StrengthChart";
import { Records } from "./components/Records";
import { MuscleSets } from "./components/MuscleSets";
import { VolumeChart } from "./components/VolumeChart";
import { CardioCard } from "./components/CardioCard";
import { LoadGauge } from "./components/LoadGauge";
import { WorkoutLog } from "./components/WorkoutLog";

// Gym page: program, week, strength progress, muscle balance, volume, cardio, log
export default async function ActivityPage() {
  const [{ activities, error }, templates] = await Promise.all([getActivities(), getTemplates()]);
  const k = gymKpis(activities);
  const last = lastPerformance(activities);
  const known = exerciseNames(activities);
  const volDelta = k.volumeThisWeek - k.volumeLastWeek;

  return (
    <div className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Gym"
        eyebrowClass="text-[#f97362]"
        title="Training"
        subtitle="Follow the program, beat last time, keep every muscle in the zone."
        aside={
          <OpenModalButton
            modal="workout_form"
            props={{ last, known }}
            className="inline-flex h-12 items-center gap-2 self-start rounded-full px-6 font-medium text-white transition hover:opacity-90 sm:self-auto"
            style={{ background: ACTIVITY_COLOR }}
          >
            <Plus className="size-5" /> Log workout
          </OpenModalButton>
        }
      />

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your workouts: {error}
        </p>
      )}

      <ProgramCard templates={templates} next={nextTemplate(templates, activities)} last={last} known={known} />

      <WeekPlanner
        days={weekPlan(activities)}
        last={last}
        known={known}
        stats={[
          { label: "Workouts", value: `${k.sessionsThisWeek}/${WEEKLY_GOAL}`, foot: `goal streak ${k.goalStreak}w` },
          { label: "Volume", value: formatKg(k.volumeThisWeek), foot: `${volDelta >= 0 ? "+" : "−"}${formatKg(Math.abs(volDelta))} vs last week` },
          { label: "New PRs", value: String(k.prsThisMonth), foot: "this month" },
          { label: "Cardio", value: formatMins(k.cardioThisWeek), foot: "this week" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <StrengthChart activities={activities} exercises={known} />
        <Records records={personalRecords(activities)} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <MuscleSets rows={muscleSets(activities)} />
        <CardioCard rows={cardioSummary(activities)} />
        <div className="md:col-span-2 xl:col-span-1">
          <LoadGauge {...loadRatio(activities)} />
        </div>
      </div>

      <VolumeChart rows={weeklyStrength(activities, VOLUME_WEEKS)} />
      <WorkoutLog activities={activities} />
    </div>
  );
}

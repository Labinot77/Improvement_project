"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { WeeklyRing } from "./components/WeeklyRing";
import { ActivityForm } from "./components/ActivityForm";
import { ActivityHistory } from "./components/ActivityHistory";
import PageHeader from "@/app/components/header/Header";
import StatCard from "@/app/components/StatsCard";
import SectionCard from "@/app/components/SectionCard";
import { ACCENT, WEEKLY_GOAL } from "@/constants/fitness";
import { formatDate } from "@/lib/mics/date";
import { useActivities } from "@/lib/use_fitness";
import { FitnessCalendar } from "./components/Calendar";
import { ActivityHeatmap } from "./components/ActivityHeatMap";
import { container, fadeIn, fadeUp } from "@/constants/animations";


function useStats(activities: ReturnType<typeof useActivities>["activities"]) {
  return useMemo(() => {
    if (!activities.length)
      return { totalSessions: 0, totalMins: 0, thisWeek: 0, avgDuration: 0 };

    const totalSessions = activities.length;
    const totalMins = activities.reduce((s, a) => s + a.durationMins, 0);
    const avgDuration = Math.round(totalMins / totalSessions);
    const weekStart = formatDate(
      (() => {
        const d = new Date();
        d.setDate(d.getDate() - 6);
        return d;
      })(),
    );
    const thisWeek = activities.filter((a) => a.date >= weekStart).length;

    return { totalSessions, totalMins, thisWeek, avgDuration };
  }, [activities]);
}

export default function FitnessClient() {
  const { activities, loading, addActivity, deleteActivity } = useActivities();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const stats = useStats(activities);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader
            emoji="🔥"
            title="Physical Activity"
            subtitle="Train. Log. Improve."
            backHref="/"
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-5"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Stat cards */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            <StatCard
              label="This week"
              value={`${stats.thisWeek}/${WEEKLY_GOAL}`}
              sub="sessions vs goal"
              accentGlow={ACCENT}
            />
            <StatCard
              label="Total sessions"
              value={`${stats.totalSessions}`}
              sub="all time"
              accentGlow={ACCENT}
            />
            <StatCard
              label="Total time"
              value={
                stats.totalMins >= 60
                  ? `${Math.floor(stats.totalMins / 60)}h ${stats.totalMins % 60}m`
                  : `${stats.totalMins}m`
              }
              sub="all time"
              accentGlow={ACCENT}
            />
            <StatCard
              label="Avg duration"
              value={`${stats.avgDuration}m`}
              sub="per session"
              accentGlow={ACCENT}
            />
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <motion.div variants={fadeUp} className="lg:col-span-3">
              <FitnessCalendar
                selected={selectedDate}
                onSelect={setSelectedDate}
                activities={activities}
              />
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="lg:col-span-9 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <SectionCard
                    title="Sessions"
                    subtitle={`${activities.length} total`}
                    className="h-full"
                    accentGlow={ACCENT}
                  >
                    <ActivityHistory
                      activities={activities}
                      onDelete={deleteActivity}
                    />
                  </SectionCard>
                </div>
                <div className="lg:col-span-5">
                  {/* <SectionCard title="This week" subtitle="Weekly goal" accentGlow={ACCENT}>
                    <WeeklyRing activities={activities} />
                  </SectionCard> */}
                  <SectionCard title="Log session" accentGlow={ACCENT}>
                    <ActivityForm onSave={addActivity} />
                  </SectionCard>
                </div>
              </div>
            </motion.div>
            <SectionCard
              title="Activity history"
              subtitle="Last 20 weeks · intensity shading"
              accentGlow={ACCENT}
              className="lg:col-span-4"
            >
              <ActivityHeatmap activities={activities} />
            </SectionCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

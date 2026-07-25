"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useActivities } from "@/lib/use_fitness";
import { WeeklyRing } from "./components/WeeklyRing";
import { ActivityForm } from "./components/ActivityForm";
import { ActivityHistory } from "./components/ActivityHistory";
import PageHeader from "@/app/components/header/Header";
import StatCard from "@/app/components/StatsCard";
import SectionCard from "@/app/components/SectionCard";
import { ACCENT, WEEKLY_GOAL } from "@/constants/fitness";
import { ActivityHeatmap } from "./components/ActivityHeatMap";
import { formatDate } from "@/lib/mics/date";


const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } };

function useStats(activities: ReturnType<typeof useActivities>["activities"]) {
  return useMemo(() => {
    if (!activities.length) return { totalSessions: 0, totalMins: 0, thisWeek: 0, avgDuration: 0 };

    const totalSessions = activities.length;
    const totalMins     = activities.reduce((s, a) => s + a.durationMins, 0);
    const avgDuration   = Math.round(totalMins / totalSessions);

    const weekStart = formatDate((() => {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      return d;
    })());
    const thisWeek = activities.filter((a) => a.date >= weekStart).length;

    return { totalSessions, totalMins, thisWeek, avgDuration };
  }, [activities]);
}

export default function FitnessClient() {
  const { activities, loading, addActivity, deleteActivity } = useActivities();
  const stats = useStats(activities);

  if (loading) return <div className="min-h-screen bg-[#080808]" />;

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">

        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader emoji="🔥" title="Physical Activity" subtitle="Train. Log. Improve." backHref="/" />
        </motion.div>

        <motion.div className="flex flex-col gap-5" initial="hidden" animate="show" variants={container}>

          {/* Stat cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              value={stats.totalMins >= 60
                ? `${Math.floor(stats.totalMins / 60)}h ${stats.totalMins % 60}m`
                : `${stats.totalMins}m`}
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

          {/* Activity heatmap */}
          <motion.div variants={fadeUp}>
            <SectionCard title="Activity by type" subtitle="Last 12 weeks · intensity shading" accentGlow={ACCENT}>
              <ActivityHeatmap activities={activities} />
            </SectionCard>
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* LEFT — Weekly ring + Log form */}
            <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col gap-5">

              {/* Signature element */}
              <SectionCard
                title="This week"
                subtitle="Progress toward weekly goal"
                accentGlow={ACCENT}
              >
                <WeeklyRing activities={activities} />
              </SectionCard>

              <SectionCard title="Log session" accentGlow={ACCENT}>
                <ActivityForm onSave={addActivity} />
              </SectionCard>
            </motion.div>

            {/* RIGHT — Session history */}
            <motion.div variants={fadeUp} className="lg:col-span-8">
              <SectionCard
                title="Sessions"
                subtitle={`${activities.length} total`}
                accentGlow={ACCENT}
              >
                <div className="h-[600px] overflow-y-auto pr-1">
                  <ActivityHistory activities={activities} onDelete={deleteActivity} />
                </div>
              </SectionCard>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
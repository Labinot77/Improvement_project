"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useLessons } from "@/lib/use_lessons";
import { LessonForm } from "./components/Form";
import { LessonList } from "./components/List";
import { LessonSkeleton } from "./components/Skeleton";
import PageHeader from "@/app/components/header/Header";
import StatCard from "@/app/components/StatsCard";
import SectionCard from "@/app/components/SectionCard";
import { useUser } from "@/lib/use_user";
import { ACCENT, CATEGORY_META, ALL_CATEGORIES } from "@/constants/mental";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } };

function useStats(lessons: ReturnType<typeof useLessons>["lessons"]) {
  return useMemo(() => {
    if (!lessons.length) return { total: 0, thisMonth: 0, topCategory: "—", highImpact: 0 };

    const now = new Date();
    const thisMonth = lessons.filter((l) => {
      const d = new Date(l.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const catCount = ALL_CATEGORIES.reduce((acc, cat) => {
      acc[cat] = lessons.filter((l) => l.category === cat).length;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const highImpact  = lessons.filter((l) => l.impact === "high").length;

    return { total: lessons.length, thisMonth, topCategory, highImpact };
  }, [lessons]);
}

export default function LessonsClient() {
  const { lessons, addLesson, updateLesson, deleteLesson, pendingLessonIds, loading } = useLessons();
  const stats = useStats(lessons);

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
  //       <div className="mx-auto max-w-7xl flex flex-col gap-5">
  //         <PageHeader emoji="📖" title="Lessons" subtitle="Mistakes, insights & growth" backHref="/" />

  //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
  //           {Array.from({ length: 4 }).map((_, i) => (
  //             <div key={i} className="h-20 rounded-xl border border-white/[0.06] bg-[#111111] animate-pulse" />
  //           ))}
  //         </div>

  //         <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
  //           <div className="lg:col-span-4">
  //             <div className="h-64 rounded-xl border border-white/[0.06] bg-[#111111] animate-pulse" />
  //           </div>
  //           <div className="lg:col-span-8 flex flex-col gap-2">
  //             {Array.from({ length: 5 }).map((_, i) => (
  //               <LessonSkeleton key={i} />
  //             ))}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">

        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader emoji="📖" title="Lessons" subtitle="Mistakes, insights & growth" backHref="/" />
        </motion.div>

        <motion.div className="flex flex-col gap-5" initial="hidden" animate="show" variants={container}>

          {/* Stat cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Total lessons"
              value={`${stats.total}`}
              sub="recorded so far"
              accentGlow={ACCENT}
            />
            <StatCard
              label="This month"
              value={`${stats.thisMonth}`}
              sub="lessons this month"
              accentGlow={ACCENT}
            />
            <StatCard
              label="Top category"
              value={stats.topCategory !== "—" ? `${CATEGORY_META[stats.topCategory as keyof typeof CATEGORY_META]?.icon} ${stats.topCategory}` : "—"}
              sub="most recorded area"
              accentGlow={ACCENT}
            />
            <StatCard
              label="High impact"
              value={`${stats.highImpact}`}
              sub="critical lessons"
              accentGlow={ACCENT}
            />
          </motion.div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* LEFT — Add form */}
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <SectionCard title="New lesson" accentGlow={ACCENT}>
                <div className="relative">
                    <LessonForm onSave={addLesson} />
                </div>
              </SectionCard>
            </motion.div>

            {/* RIGHT — List */}
            <motion.div variants={fadeUp} className="lg:col-span-8">
              <LessonList
                lessons={lessons}
                pendingLessonIds={pendingLessonIds}
                onUpdate={updateLesson}
                onDelete={deleteLesson}
              />
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
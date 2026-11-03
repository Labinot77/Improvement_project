"use client"

import { motion } from "framer-motion"; 
import { fadeUp } from "@/constants/animations";

interface LessonStatsProps {
  totalLessons: number;
  categoryCount: number;
}

export function LessonStats({
  totalLessons,
  categoryCount,
}: LessonStatsProps) {
  return (
     <div className="flex shrink-0 items-center gap-6 self-start rounded-2xl bg-white/[0.04] px-6 py-5 md:self-auto">
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: 0.2, duration: 0.45 }}
    >
      <p className="text-3xl font-semibold tabular-nums">
        {totalLessons}
      </p>
      <p className="text-sm text-zinc-500">Lessons</p>
    </motion.div>

    <div className="h-10 w-px bg-white/10" />

    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ delay: 0.3, duration: 0.45 }}
    >
      <p className="text-3xl font-semibold tabular-nums">
        {categoryCount}
      </p>
      <p className="text-sm text-zinc-500">Categories</p>
    </motion.div>
  </div>
  );
}
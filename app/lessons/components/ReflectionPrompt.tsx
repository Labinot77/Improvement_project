"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { today } from "@/lib/mics/date";
import { REFLECTION_PROMPTS } from "@/constants/lessons/reflection_prompts";
import { fadeUp } from "@/constants/animations";
import { LessonStats } from "./LessonStats";

interface ReflectionPromptProps {
  totalLessons: number;
  categoryCount: number;
}

export function ReflectionPrompt({
  totalLessons,
  categoryCount,
}: ReflectionPromptProps) {
  const prompt = useMemo(() => {
    const currentDate = today();
    const dateSeed = currentDate
      .split("-")
      .reduce((sum, part) => sum + Number(part), 0);

    return REFLECTION_PROMPTS[
      dateSeed % REFLECTION_PROMPTS.length
    ];
  }, []);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-col justify-between gap-6 rounded-3xl border border-white/[0.06] bg-[#16181b] p-6 sm:p-8 md:flex-row md:items-center"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.1 }}
        className="max-w-2xl"
      >
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">
          Reflection prompt
        </p>

        <h2 className="mt-4 text-2xl font-medium leading-snug">
          {prompt}
        </h2>

        <p className="mt-3 text-zinc-500">
          Turn experience into something you can return to.
        </p>
      </motion.div>

        <LessonStats totalLessons={totalLessons} categoryCount={categoryCount} />
    </motion.section>
  );
}
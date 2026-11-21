"use client";

import { motion } from "framer-motion";
import { ACTIVITY_COLOR, WEEKLY_GOAL } from "@/constants/fitness";
import { CARD } from "@/constants/ui";

// Header badge: one pip per goal session this week
export function WeekGoal({ done }: { done: number }) {
  return (
    <div className={`${CARD} flex items-center gap-4 rounded-2xl px-5 py-4`}>
      <div className="flex items-end gap-1.5">
        {Array.from({ length: WEEKLY_GOAL }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0.3, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: i * 0.07 }}
            className="h-10 w-2.5 origin-bottom rounded-full"
            style={{ background: i < done ? ACTIVITY_COLOR : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
      <div>
        <p className="text-xl font-medium leading-tight">
          {done}/{WEEKLY_GOAL} sessions
        </p>
        <p className="text-zinc-500">{done >= WEEKLY_GOAL ? "Weekly goal hit" : "This week's goal"}</p>
      </div>
    </div>
  );
}

"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

import {
  ACCENT,
  CARD,
  RING,
} from "@/constants/progress/template";

interface Props {
  done: number;
  total: number;
}

export default function ProgressTracker({ done, total }: Props) {
  const WORDS = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];

  const pct = total ? Math.round((done / total) * 100) : 0;

  const progress = useSpring(0, {
    stiffness: 45,
    damping: 15,
    mass: 1,
  });

  const roundedProgress = useTransform(progress, (value) =>
    Math.round(value)
  );

  useEffect(() => {
    progress.set(pct);
  }, [pct, progress]);

  function progressMessage(total: number, remaining: number) {
    if (total === 0) return "Add a task to start your day.";
    if (remaining === 0) return "Every task is done. Nice work today.";
    if (remaining === 1) return "One more task and you've completed your day.";

    const n = remaining <= 9 ? WORDS[remaining] : String(remaining);

    return `${n} more tasks and you've completed your day.`;
  }

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Today's progress</h2>

      <motion.div
        // initial={{ opacity: 0, scale: 0.9 }}
        // animate={{ opacity: 1, scale: 1 }}
        // transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto mt-8 size-40"
      >
        <svg viewBox="0 0 100 100" className="size-40 -rotate-90" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={RING.radius}
            fill="none"
            strokeWidth={RING.stroke}
            className="stroke-white/[0.06]"
          />

          <motion.circle
            cx="50"
            cy="50"
            r={RING.radius}
            fill="none"
            strokeWidth={RING.stroke}
            stroke={ACCENT}
            strokeDasharray={RING.circumference}
            initial={{ strokeDashoffset: RING.circumference }}
            animate={{
              strokeDashoffset:
                RING.circumference * (1 - pct / 100),
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="text-4xl font-semibold tabular-nums">
            <motion.span>{roundedProgress}</motion.span>%
          </p>

          <p className="text-sm text-zinc-500">
            {done} of {total} done
          </p>
        </div>
      </motion.div>

      <motion.p
        key={progressMessage(total, total - done)}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 text-center leading-relaxed text-zinc-500"
      >
        {progressMessage(total, total - done)}
      </motion.p>
    </section>
  );
}
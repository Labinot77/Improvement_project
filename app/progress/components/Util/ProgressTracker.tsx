"use client";

import { AnimatePresence, motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ACCENT, CARD, MOMENTUM_COLOR, RING } from "@/constants/progress/template";
import { useToday } from "../TodayProvider";

const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const PARTICLES = 14;

// Encouraging line based on what's left
function progressMessage(total: number, remaining: number) {
  if (total === 0) return "Add a task to start your day.";
  if (remaining === 0) return "Every task is done. Nice work today.";
  if (remaining === 1) return "One more task and you've completed your day.";
  const n = remaining <= 9 ? WORDS[remaining] : String(remaining);
  return `${n} more tasks and you've completed your day.`;
}

// Burst of dots around the ring when the day is completed
function Celebration() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: PARTICLES }, (_, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * 110, y: Math.sin(angle) * 110, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: i % 2 ? ACCENT : MOMENTUM_COLOR }}
          />
        );
      })}
    </div>
  );
}

// Live ring for today's completion (reads optimistic tasks)
export default function ProgressTracker() {
  const { items } = useToday();
  const total = items.length;
  const done = items.filter((t) => t.completed).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  const progress = useSpring(0, { stiffness: 45, damping: 15, mass: 1 });
  const rounded = useTransform(progress, (v) => Math.round(v));

  // Celebrate only on the transition into "complete"
  const [burst, setBurst] = useState(0);
  const wasComplete = useRef(complete);

  useEffect(() => {
    progress.set(pct);
  }, [pct, progress]);

  useEffect(() => {
    if (complete && !wasComplete.current) setBurst((b) => b + 1);
    wasComplete.current = complete;
  }, [complete]);

  const message = progressMessage(total, total - done);

  return (
    <section className={`${CARD} relative overflow-hidden p-6 sm:p-8`}>
      {/* Soft glow once the day is complete */}
      <motion.div
        aria-hidden
        animate={{ opacity: complete ? 1 : 0 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,108,240,0.18),transparent_65%)]"
      />

      <h2 className="relative text-lg font-medium">Today&apos;s progress</h2>

      <motion.div
        animate={complete ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto mt-8 size-40"
      >
        <svg viewBox="0 0 100 100" className="size-40 -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r={RING.radius} fill="none" strokeWidth={RING.stroke} className="stroke-white/[0.06]" />
          <motion.circle
            cx="50"
            cy="50"
            r={RING.radius}
            fill="none"
            strokeWidth={RING.stroke}
            stroke={ACCENT}
            strokeDasharray={RING.circumference}
            initial={{ strokeDashoffset: RING.circumference }}
            animate={{ strokeDashoffset: RING.circumference * (1 - pct / 100) }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="text-4xl font-semibold tabular-nums">
            <motion.span>{rounded}</motion.span>%
          </p>
          <p className="text-sm text-zinc-500">
            {done} of {total} done
          </p>
        </div>

        <AnimatePresence>{burst > 0 && complete && <Celebration key={burst} />}</AnimatePresence>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.25 }}
          className="relative mt-8 text-center leading-relaxed text-zinc-500"
        >
          {message}
        </motion.p>
      </AnimatePresence>
    </section>
  );
}

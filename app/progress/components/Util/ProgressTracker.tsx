"use client"

import {
  ACCENT,
  CARD,
  EYEBROW_COLOR,
  FOCUS_TIPS,
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

  function progressMessage(total: number, remaining: number) {
    if (total === 0) return "Add a task to start your day.";
    if (remaining === 0) return "Every task is done. Nice work today.";
    if (remaining === 1) return "One more task and you've completed your day.";
    const n = remaining <= 9 ? WORDS[remaining] : String(remaining);
    return `${n} more tasks and you've completed your day.`;
  }

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Today&apos;s progress</h2>

      <div className="relative mx-auto mt-8 size-40">
        <svg viewBox="0 0 100 100" className="size-40 -rotate-90" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={RING.radius}
            fill="none"
            strokeWidth={RING.stroke}
            className="stroke-white/[0.06]"
          />
          <circle
            cx="50"
            cy="50"
            r={RING.radius}
            fill="none"
            strokeWidth={RING.stroke}
            stroke={ACCENT}
            strokeDasharray={RING.circumference}
            strokeDashoffset={RING.circumference * (1 - pct / 100)}
          />
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center">
          <p className="text-4xl font-semibold tabular-nums">{pct}%</p>
          <p className="text-sm text-zinc-500">
            {done} of {total} done
          </p>
        </div>
      </div>

      <p className="mt-8 text-center leading-relaxed text-zinc-500">
        {progressMessage(total, total - done)}
      </p>
    </section>
  );
}

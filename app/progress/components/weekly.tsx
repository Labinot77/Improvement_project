"use client";

import { motion } from "framer-motion";
import type { Days } from "@/types/progress";
import { getLast7Days } from "@/lib/mics/date";

type Props = { days: Days };

export function WeeklyBar({ days }: Props) {
  const week = getLast7Days();

  return (
    <div className="flex items-end gap-2 h-20">
      {week.map((date, i) => {
        const d = days[date];
        const total = d?.tasks.length ?? 0;
        const done = d?.tasks.filter((t) => t.completed).length ?? 0;
        const rate = total === 0 ? 0 : done / total;
        const dayLabel = new Date(date).toLocaleDateString("en-GB", { weekday: "short" });
        const isToday = date === new Date().toISOString().split("T")[0];

        return (
          <div key={date} className="group flex-1 flex flex-col items-center gap-1.5">
            <div className="relative w-full flex items-end justify-center h-14">
              <div className="absolute inset-x-0 bottom-0 h-full rounded-md bg-white/[0.04]" />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(rate * 100, total === 0 ? 0 : 4)}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.06 }}
                className="relative w-full rounded-md"
                style={{
                  background: rate === 1
                    ? "#6366f1"
                    : rate > 0
                    ? `rgba(99,102,241,${0.25 + rate * 0.45})`
                    : "transparent",
                  minHeight: total > 0 ? 4 : 0,
                }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none z-10 whitespace-nowrap">
                <div className="rounded-lg border border-white/[0.08] bg-[#161616] px-2.5 py-1.5 text-[10px] shadow-xl">
                  <p className="text-zinc-300 font-medium">{dayLabel}</p>
                  <p className="text-zinc-500">{total === 0 ? "No tasks" : `${done}/${total} done`}</p>
                </div>
              </div>
            </div>
            <span
              className="text-[10px] font-medium"
              style={{ color: isToday ? "#818cf8" : "#52525b" }}
            >
              {dayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
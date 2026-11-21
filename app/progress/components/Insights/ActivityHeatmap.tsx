"use client";

import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ACCENT, CARD } from "@/constants/progress/template";
import type { DayStat } from "@/types/Progress/progress";

const ROW_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

// Cell fill by completion rate
function cellColor(d: DayStat) {
  if (d.total === 0) return "rgba(255,255,255,0.04)";
  const rate = d.done / d.total;
  if (rate === 0) return "rgba(239,68,68,0.18)";
  return `color-mix(in srgb, ${ACCENT} ${Math.round(25 + rate * 75)}%, transparent)`;
}

// Week columns (Monday first)
function toWeeks(days: DayStat[]) {
  const weeks: DayStat[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

type Props = {
  days: DayStat[];
  selected: string;
  onSelect: (date: string) => void;
};

// GitHub-style consistency grid; click a day to inspect it
export function ActivityHeatmap({ days, selected, onSelect }: Props) {
  const weeks = toWeeks(days);

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="mb-6">
        <h2 className="text-lg font-medium">Consistency</h2>
        <p className="text-sm text-zinc-500">Last {weeks.length} weeks. Brighter means more finished.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {/* Weekday labels */}
        <div className="mt-5 grid shrink-0 grid-rows-7 gap-1 text-[10px] text-zinc-600">
          {ROW_LABELS.map((l, i) => (
            <span key={i} className="flex h-3.5 items-center sm:h-4">
              {l}
            </span>
          ))}
        </div>

        <div className="flex gap-1">
          {weeks.map((week, wi) => {
            const month = new Date(`${week[0].date}T12:00:00`).toLocaleDateString("en-US", { month: "short" });
            const prevMonth =
              wi > 0 && new Date(`${weeks[wi - 1][0].date}T12:00:00`).toLocaleDateString("en-US", { month: "short" });
            return (
              <div key={week[0].date} className="flex flex-col gap-1">
                <span className="h-4 text-[10px] text-zinc-600">{month !== prevMonth ? month : ""}</span>
                {week.map((d, di) => (
                  <Tooltip key={d.date}>
                    <TooltipTrigger asChild>
                      <motion.button
                        type="button"
                        aria-label={`${d.date}: ${d.done} of ${d.total} done`}
                        onClick={() => onSelect(d.date)}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.35 }}
                        transition={{ delay: (wi * 7 + di) * 0.003 }}
                        className={`size-3.5 rounded-[4px] sm:size-4 ${
                          d.date === selected ? "ring-2 ring-white/70 ring-offset-1 ring-offset-[#16181b]" : ""
                        }`}
                        style={{ background: cellColor(d) }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {new Date(`${d.date}T12:00:00`).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {d.total ? `${d.done}/${d.total} done` : "No tasks"}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-zinc-600">
        Less
        {[0, 0.25, 0.5, 0.75, 1].map((r) => (
          <span
            key={r}
            className="size-3 rounded-[3px]"
            style={{ background: cellColor({ date: "", total: r ? 4 : 0, done: r * 4, tasks: [] }) }}
          />
        ))}
        More
      </div>
    </section>
  );
}

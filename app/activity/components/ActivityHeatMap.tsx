"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Activity, ActivityType } from "@/types/fitness";
import { ACTIVITY_META, ALL_ACTIVITY_TYPES, INTENSITY_META } from "@/constants/fitness";
import { formatDate } from "@/lib/mics/date";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/providers/Modalprovider";

interface Props {
  activities: Activity[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLast84Days(): string[] {
  return Array.from({ length: 140 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (139 - i));
    return formatDate(d);
  });
}

function getWeeks(dates: string[]): string[][] {
  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) weeks.push(dates.slice(i, i + 7));
  return weeks;
}

function getMonthLabels(dates: string[]): { label: string; weekIndex: number }[] {
  const labels: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  dates.forEach((date, i) => {
    const m = new Date(date + "T12:00:00").getMonth();
    if (m !== lastMonth) {
      labels.push({
        label: new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "short" }),
        weekIndex: Math.floor(i / 7),
      });
      lastMonth = m;
    }
  });
  return labels;
}

function intensityToOpacity(intensity: number): number {
  return [0.2, 0.4, 0.6, 0.8, 1][intensity - 1] ?? 0.6;
}

export function ActivityHeatmap({ activities }: Props) {
  const [selectedType, setSelectedType] = useState<ActivityType | "All">("All");
  const { open } = useModal();

  const dates       = useMemo(() => getLast84Days(), []);
  const weeks       = useMemo(() => getWeeks(dates), [dates]);
  const monthLabels = useMemo(() => getMonthLabels(dates), [dates]);

  const dayMap = useMemo(() => {
    const map: Record<string, Activity[]> = {};
    for (const date of dates) map[date] = [];
    for (const a of activities) {
      if (map[a.date] === undefined) continue;
      if (selectedType === "All" || a.type === selectedType) {
        map[a.date].push(a);
      }
    }
    return map;
  }, [activities, dates, selectedType]);

  const accentColor = selectedType === "All"
    ? "#6366f1"
    : ACTIVITY_META[selectedType].color;

  const totalSessions = activities.filter(
    (a) => selectedType === "All" || a.type === selectedType
  ).length;

  // Active types for the dropdown (only show types with sessions)
  const activeTypes = ALL_ACTIVITY_TYPES.filter((type) =>
    activities.some((a) => a.type === type)
  );


  if (activities.length === 0) {
    return (
      <p className="text-sm text-zinc-600 py-6 text-center">
        Log your first session to see your activity history.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Select
            value={selectedType}
            onValueChange={(v) => setSelectedType(v as ActivityType | "All")}
          >
            <SelectTrigger className="w-44 rounded-xl border border-white/[0.08] bg-[#161616] text-sm text-zinc-100">
              <SelectValue>
                {selectedType === "All" ? (
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>All activities</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>{ACTIVITY_META[selectedType].icon}</span>
                    <span>{selectedType}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-white/[0.08] bg-[#161616] text-zinc-100">
              <SelectItem value="All" className="focus:bg-white/[0.06]">
                <span className="flex items-center gap-2">
                  <span>⚡</span>
                  <span className="text-zinc-300">All activities</span>
                </span>
              </SelectItem>
              {activeTypes.map((type) => (
                <SelectItem key={type} value={type} className="focus:bg-white/[0.06]">
                  <span className="flex items-center gap-2">
                    <span>{ACTIVITY_META[type].icon}</span>
                    <span style={{ color: ACTIVITY_META[type].color }}>{type}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-zinc-600">
            <span className="font-medium text-zinc-300 tabular-nums">{totalSessions}</span>{" "}
            {totalSessions === 1 ? "session" : "sessions"} in 12 weeks
          </span>
        </div>

        {/* Month labels */}
        <div className="flex gap-1 pl-1 overflow-x-auto">
          {monthLabels.map(({ label, weekIndex }, i) => (
            <div
              key={`${label}-${i}`}
              className="text-[10px] text-zinc-600 shrink-0"
              style={{ width: 14, marginLeft: weekIndex === 0 ? 0 : (weekIndex - (monthLabels[i - 1]?.weekIndex ?? 0) - 1) * 16 }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex gap-1 overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 shrink-0">
              {week.map((date) => {
                const sessions  = dayMap[date] ?? [];
                const hasData   = sessions.length > 0;
                const isToday   = date === formatDate(new Date());
                const maxInt    = hasData ? Math.max(...sessions.map((s) => s.intensity)) : 0;

                return (
                  <motion.div
                    key={date}
                    whileHover={{ scale: 1.4 }}
                    onClick={() => open("dayActivity", { date, sessions })}
                    className={`size-3.5 rounded-sm cursor-pointer transition-colors ${
                      isToday ? "ring-1 ring-yellow-400/50" : ""
                    }`}
                    style={{
                      backgroundColor: hasData ? accentColor : "rgba(255,255,255,0.04)",
                      opacity: hasData ? intensityToOpacity(maxInt) : 1,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">Less intense</span>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className="size-3 rounded-sm"
              style={{ backgroundColor: accentColor, opacity: intensityToOpacity(lvl) }}
            />
          ))}
          <span className="text-[10px] text-zinc-600">More intense</span>
        </div>
      </div>
  );
}
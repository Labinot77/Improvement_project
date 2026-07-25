"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Activity, ActivityType } from "@/types/fitness";
import { ACTIVITY_META, ALL_ACTIVITY_TYPES, INTENSITY_META } from "@/constants/fitness";
import { formatDate } from "@/lib/mics/date";

interface Props {
  activities: Activity[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLast84Days(): string[] {
  return Array.from({ length: 84 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (83 - i));
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

// ── Day sessions modal ────────────────────────────────────────────────────────
interface DayModalProps {
  date: string | null;
  sessions: Activity[];
  onClose: () => void;
}

function DayModal({ date, sessions, onClose }: DayModalProps) {
  const label = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
      })
    : "";

  return (
    <Dialog open={!!date} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{label}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-1">
          {sessions.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">No sessions on this day.</p>
          ) : (
            sessions.map((session) => {
              const meta    = ACTIVITY_META[session.type];
              const intMeta = INTENSITY_META[session.intensity];
              return (
                <div
                  key={session.id}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#131313] px-3 py-3"
                >
                  <span className="text-xl shrink-0">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-zinc-100">{session.type}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          color: intMeta.color,
                          borderColor: `${intMeta.color}40`,
                          background: `${intMeta.color}12`,
                        }}
                      >
                        {intMeta.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{session.durationMins} minutes</p>
                    {session.notes && (
                      <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{session.notes}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ActivityHeatmap({ activities }: Props) {
  const [selectedType, setSelectedType] = useState<ActivityType | "All">("All");
  const [selectedDay, setSelectedDay]   = useState<{ date: string; sessions: Activity[] } | null>(null);

  const dates       = useMemo(() => getLast84Days(), []);
  const weeks       = useMemo(() => getWeeks(dates), [dates]);
  const monthLabels = useMemo(() => getMonthLabels(dates), [dates]);

  // Build day map for the selected type
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
    <>
      <div className="flex flex-col gap-4">

        {/* Header row: dropdown + total */}
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

        {/* Grid */}
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
                    onClick={() => setSelectedDay({ date, sessions })}
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

        {/* Legend */}
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
          <span className="ml-3 text-[10px] text-zinc-600">· click any cell to see sessions</span>
        </div>
      </div>

      {/* Day modal */}
      <DayModal
        date={selectedDay?.date ?? null}
        sessions={selectedDay?.sessions ?? []}
        onClose={() => setSelectedDay(null)}
      />
    </>
  );
}
"use client";

import { useState } from "react";
import { DEFAULT_SLEEP_GOAL, MOCK_SLEEP_DATA, SLEEP_IMPROVEMENT_TIPS } from "./sleep";
import PageHeader from "../components/header/Header";
import StatCard from "./components/Statcard";
import SectionCard from "./components/SectionCartd";
import SleepChart from "./components/Chart/Sleep_chart";
import SleepQualityBar from "./components/Sleep_quaility";
import BedtimeGoalRing from "./components/Beadtime_goal";
import LogSleepForm from "./components/Log_sleep";
import SleepHistoryTable from "./components/Sleep_history_table";
import SleepTipCard from "./components/Sleep_tip";
import { SleepEntry } from "@/types/sleep";


const ACCENT = "rgba(99,102,241,0.2)";

function computeStats(data: SleepEntry[]) {
  if (!data.length)
    return { avg: 0, avgLabel: "—", best: 0, bestLabel: "—", onTimeStreak: 0 };

  const avg =
    data.reduce((sum, e) => sum + e.duration_hours, 0) / data.length;
  const avgHrs = Math.floor(avg);
  const avgMins = Math.round((avg - avgHrs) * 60);

  const best = Math.max(...data.map((e) => e.duration_hours));
  const bestHrs = Math.floor(best);
  const bestMins = Math.round((best - bestHrs) * 60);

  // Count consecutive on-time nights from most recent (within 30 min of target)
  const targetMins = 23 * 60; // 23:00
  let streak = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    const [h, m] = data[i].bedtime.split(":").map(Number);
    const actual = h * 60 + m < 360 ? h * 60 + m + 1440 : h * 60 + m;
    if (Math.abs(actual - targetMins) <= 30) streak++;
    else break;
  }

  return {
    avg,
    avgLabel: `${avgHrs}h ${avgMins}m`,
    bestLabel: `${bestHrs}h ${bestMins}m`,
    onTimeStreak: streak,
  };
}

export default function SleepPage() {
  const [entries, setEntries] = useState<SleepEntry[]>(MOCK_SLEEP_DATA);

  const stats = computeStats(entries);
  const latest = entries[entries.length - 1];
  const avgQuality =
    entries.reduce((sum, e) => sum + e.quality, 0) / entries.length;

  const lastBedtime = latest?.bedtime ?? DEFAULT_SLEEP_GOAL.target_bedtime;
  const [lh, lm] = lastBedtime.split(":").map(Number);
  const lastMins = lh * 60 + lm < 360 ? lh * 60 + lm + 1440 : lh * 60 + lm;
  const [th, tm] = DEFAULT_SLEEP_GOAL.target_bedtime.split(":").map(Number);
  const targetMins = th * 60 + tm;
  const isOnTime = Math.abs(lastMins - targetMins) <= 30;

  function handleLog(
    entry: Omit<SleepEntry, "id" | "duration_hours">
  ) {
    const [bh, bm] = entry.bedtime.split(":").map(Number);
    const [wh, wm] = entry.wake_time.split(":").map(Number);
    let duration = wh * 60 + wm - (bh * 60 + bm);
    if (duration < 0) duration += 1440; // crosses midnight
    const newEntry: SleepEntry = {
      ...entry,
      id: String(Date.now()),
      duration_hours: Math.round((duration / 60) * 10) / 10,
    };
    setEntries((prev) => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
  }

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <PageHeader
          emoji="😴"
          title="Sleep"
          subtitle="Recovery & rest tracking"
          backHref="/"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Avg duration"
            value={stats.avgLabel}
            sub="last 14 days"
            accentGlow={ACCENT}
          />
          <StatCard
            label="Avg quality"
            value={`${avgQuality.toFixed(1)} / 5`}
            sub="last 14 days"
            accentGlow={ACCENT}
          />
          <StatCard
            label="Best night"
            value={stats.bestLabel}
            accentGlow={ACCENT}
          />
          <StatCard
            label="Bedtime streak"
            value={`${stats.onTimeStreak}d`}
            sub="on-time nights"
            accentGlow={ACCENT}
          />
        </div>

        <SectionCard
          title="Sleep duration"
          subtitle="Hours of sleep per night over the last 14 days"
          accentGlow={ACCENT}
        >
          <SleepChart data={entries} targetHours={DEFAULT_SLEEP_GOAL.target_duration} />
        </SectionCard>

        <SectionCard
          title="Sleep quality"
          subtitle="Rated 1–5 each night"
          accentGlow={ACCENT}
        >
          <SleepQualityBar data={entries} />
          <div className="flex gap-4 mt-4 flex-wrap">
            {[
              { color: "#ef4444", label: "Terrible" },
              { color: "#f97316", label: "Poor" },
              { color: "#eab308", label: "Okay" },
              { color: "#22c55e", label: "Good" },
              { color: "#6366f1", label: "Excellent" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: color, opacity: 0.7 }}
                />
                <span className="text-xs text-zinc-500">{label}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SectionCard
            title="Bedtime accountability"
            subtitle="How closely you're hitting your target"
            accentGlow={ACCENT}
          >
            <BedtimeGoalRing
              targetBedtime={DEFAULT_SLEEP_GOAL.target_bedtime}
              actualBedtime={lastBedtime}
              onTime={isOnTime}
              streakDays={stats.onTimeStreak}
            />
          </SectionCard>

          <SectionCard
            title="Log tonight's sleep"
            subtitle="Track bedtime, wake time & quality"
            accentGlow={ACCENT}
          >
            <LogSleepForm onLog={handleLog} />
          </SectionCard>
        </div>

        <SectionCard
          title="Recent history"
          subtitle="Last 7 nights"
          accentGlow={ACCENT}
        >
          <SleepHistoryTable data={entries} />
        </SectionCard>

        <SectionCard
          title="Ways to improve"
          subtitle="Evidence-based habits for better sleep"
          accentGlow={ACCENT}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SLEEP_IMPROVEMENT_TIPS.map((tip) => (
              <SleepTipCard key={tip.title} {...tip} />
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
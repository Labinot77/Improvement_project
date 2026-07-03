"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/mics/date";
import { useSleep } from "@/lib/use_sleep";
import StatCard from "../components/StatsCard";
import PageHeader from "../components/header/Header";
import { ACCENT, TARGET_HOURS } from "@/constants/sleep/main";
import { formatDuration } from "@/lib/sleep/calc";
import SectionCard from "../components/SectionCard";
import { SleepLogForm } from "./components/SleepForm";
import { SleepHistory } from "./components/SleepHistory";
import { SleepChart } from "./components/SleepChart";
import { SleepCalendar } from "./components/Calendar";
import { container, fadeIn, fadeUp } from "@/constants/animations";


function useStats(days: ReturnType<typeof useSleep>["days"]) {
  return useMemo(() => {
    const entries = Object.values(days);
    if (!entries.length) return { avgDuration: 0, avgQuality: 0, streak: 0, consistency: 0 };

    const avgDuration = entries.reduce((s, e) => s + e.durationHours, 0) / entries.length;

    const today = formatDate(new Date());
    let streak = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    while (true) {
      const key = formatDate(d);
      if (!days[key]) break;
      streak++;
      d.setDate(d.getDate() - 1);
    }

    const last30 = Array.from({ length: 30 }, (_, i) => {
      const dd = new Date();
      dd.setDate(dd.getDate() - i - 1);
      return formatDate(dd);
    });
    const consistency = Math.round((last30.filter((k) => days[k]).length / 30) * 100);


    const longest = entries.reduce((max, e) => e.durationHours > max ? e.durationHours : max, 0);
    return { avgDuration, streak, consistency, longest };
  }, [days]);
}

const TABS = [
  { key: "log",      label: "Log" },
  { key: "history",  label: "History" },
  { key: "calendar", label: "Calendar" },
] as const;
type Tab = typeof TABS[number]["key"];

export default function SleepClient() {
  const { days, loading, upsertEntry, deleteEntry } = useSleep();
  const stats = useStats(days);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mobileTab, setMobileTab] = useState<Tab>("log");

  const dateKey = formatDate(selectedDate);
  const existing = days[dateKey];
  const selectedLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  function handleSelectFromHistory(date: string) {
    const [y, m, d] = date.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
    setMobileTab("log");
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">

        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader emoji="😴" title="Sleep" subtitle="Track your rest & recovery" backHref="/" />
        </motion.div>

        <motion.div className="flex flex-col gap-4" initial="hidden" animate="show" variants={container}>

          {/* ── Stat cards ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Avg duration"
              value={stats.avgDuration ? formatDuration(stats.avgDuration) : "—"}
              sub={`target ${TARGET_HOURS}h`}
              accentGlow={ACCENT}
            />
            <StatCard
              label="Streak"
              value={`${stats.streak}d`}
              sub="consecutive nights logged"
              accentGlow={ACCENT}
            />
            <StatCard
              label="Consistency"
              value={`${stats.consistency}%`}
              sub="last 30 days"
              accentGlow={ACCENT}
            />
            <StatCard
            label="Best night"
            value={stats.longest ? formatDuration(stats.longest) : "—"}
            sub="longest sleep logged"
            accentGlow={ACCENT}
          />
          </motion.div>

          {/* ── Mobile tab switcher ── */}
          <motion.div variants={fadeUp} className="flex lg:hidden rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMobileTab(tab.key)}
                className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all ${
                  mobileTab === tab.key
                    ? "bg-[#1a1a1a] text-zinc-100 border border-white/[0.08]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* ── Mobile selected date label ── */}
          <motion.div variants={fadeUp} className="flex lg:hidden flex-col">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Selected</p>
            <p className="text-sm font-semibold text-zinc-100 mt-0.5">{selectedLabel}</p>
          </motion.div>

          {/* ── Mobile panels ── */}
          <div className="flex lg:hidden flex-col gap-4">
            <AnimatePresence mode="wait">
              {mobileTab === "log" && (
                <motion.div key="log"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                  <SectionCard
                    title={existing ? "Edit sleep log" : "Log sleep"}
                    subtitle={selectedLabel}
                    accentGlow={ACCENT}
                  >
                    <SleepLogForm
                      date={dateKey}
                      existing={existing}
                      onSave={(fields) => upsertEntry(dateKey, fields)}
                      onDelete={existing ? () => deleteEntry(dateKey) : undefined}
                    />
                  </SectionCard>
                </motion.div>
              )}

              {mobileTab === "history" && (
                <motion.div key="history"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                  <SectionCard title="Recent nights" accentGlow={ACCENT}>
                    <SleepHistory
                      days={days}
                      selectedDate={dateKey}
                      onSelectDate={handleSelectFromHistory}
                    />
                  </SectionCard>
                </motion.div>
              )}

              {mobileTab === "calendar" && (
                <motion.div key="calendar"
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                  <SleepCalendar
                    selected={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setMobileTab("log"); }}
                    days={days}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">
            <motion.div variants={fadeUp} className="lg:col-span-3 flex flex-col gap-4">
              <SleepCalendar selected={selectedDate} onSelect={setSelectedDate} days={days} />
            </motion.div>
            <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col gap-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Selected</p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">{selectedLabel}</p>
              </div>

              <SectionCard
                title={existing ? "Edit sleep log" : "Log sleep"}
                accentGlow={ACCENT}
              >
                <SleepLogForm
                  date={dateKey}
                  existing={existing}
                  onSave={(fields) => upsertEntry(dateKey, fields)}
                  onDelete={existing ? () => deleteEntry(dateKey) : undefined}
                />
              </SectionCard>

              <SectionCard title="Duration trend" subtitle="Last 14 nights" accentGlow={ACCENT}>
                <SleepChart days={days} />
              </SectionCard>
            </motion.div>

            {/* RIGHT — History */}
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <SectionCard
                title="Recent nights"
                subtitle={`${Object.keys(days).length} nights logged`}
                accentGlow={ACCENT}
                className=""
              >
                <div className="overflow-y-auto min-h-[55vh] max-h-[55vh] pr-1">
                  <SleepHistory
                    days={days}
                    selectedDate={dateKey}
                    onSelectDate={handleSelectFromHistory}
                  />
                </div>
              </SectionCard>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
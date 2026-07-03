"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Days } from "@/types/progress";
import { formatDate, today } from "@/lib/mics/date";
import { useTasks } from "@/lib/progress/use_tasks";
import { computeStreak } from "@/lib/progress/streak";
import PageHeader from "../components/header/Header";
import StatCard from "../components/StatsCard";
import SectionCard from "../components/SectionCard";
import { CalendarView } from "./components/Calendar";
import { AddTaskForm } from "./components/TaskForm";
import { TaskCard } from "./components/TaskCard";
import { WeeklyBar } from "./components/WeeklyBar";
import { JournalSection } from "./components/Journal";
import { fadeUp, container, fadeIn } from "@/constants/animations";
import { ACCENT_COLOR } from "@/constants/progress/template";
import { TaskSkeleton } from "./components/TaskCard_skeleton";

function computeGlobalStats(days: Days) {
  const allTasks = Object.values(days).flatMap((d) => d.tasks);
  const completed = allTasks.filter((t) => t.completed).length;
  const activeDays = Object.values(days).filter((d) => d.tasks.length > 0).length;
  return {
    completionRate: allTasks.length ? Math.round((completed / allTasks.length) * 100) : 0,
    activeDays,
  };
}

export default function ProgressPage() {
  const { days, addTask, updateTask, deleteTask, updateJournal, pendingTaskIds } = useTasks();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [mobileTab, setMobileTab] = useState<"tasks" | "calendar" | "week">("tasks");

  const dateKey = formatDate(selectedDate);
  const dayData = days[dateKey] ?? { tasks: [], journal: "" };
  const isToday = dateKey === today();

  const streak = useMemo(() => computeStreak(days), [days]);
  const gStats = useMemo(() => computeGlobalStats(days), [days]);

  const completedCount = dayData.tasks.filter((t) => t.completed).length;
  const total = dayData.tasks.length;
  const incompleteTasks = dayData.tasks.filter((t) => !t.completed);
  const completedTasks = dayData.tasks.filter((t) => t.completed);

  async function handleAddTask(title: string, description: string) {
    await addTask(dateKey, {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }

  const selectedLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const tabs = [
    { key: "tasks", label: "Tasks" },
    { key: "calendar", label: "Calendar" },
    { key: "week", label: "This week" },
  ] as const;

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">

        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader emoji="📈" title="Progress" subtitle="Goals & daily plan" backHref="/" />
        </motion.div>

        <motion.div className="flex flex-col gap-4" initial="hidden" animate="show" variants={container}>

          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard
              label="Tasks today"
              value={total === 0 ? "—" : `${completedCount}/${total}`}
              sub={total > 0 ? `${Math.round((completedCount / total) * 100)}% done` : "No tasks yet"}
              accentGlow={ACCENT_COLOR}
            />
            <StatCard label="Overall rate" value={`${gStats.completionRate}%`} sub="all-time completion" accentGlow={ACCENT_COLOR} />
            <StatCard label="Day streak" value={`${streak}d`} sub="consecutive full days" accentGlow={ACCENT_COLOR} />
            <StatCard label="Active days" value={`${gStats.activeDays}`} sub="days with tasks logged" accentGlow={ACCENT_COLOR} />
          </motion.div>

          {/* ── Mobile tab switcher (hidden on lg) ── */}
          <motion.div variants={fadeUp} className="flex lg:hidden rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-1 gap-1">
            {tabs.map((tab) => (
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

          {/* ── Selected date label (mobile only) ── */}
          <motion.div variants={fadeUp} className="flex lg:hidden flex-col">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              {isToday ? "Today" : "Selected day"}
            </p>
            <p className="text-sm font-semibold text-zinc-100 mt-0.5">{selectedLabel}</p>
          </motion.div>

          {/* ── Mobile: tab panels ── */}
          <div className="flex lg:hidden flex-col gap-4">
            <AnimatePresence mode="wait">
              {mobileTab === "tasks" && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  <SectionCard title="New task" accentGlow={ACCENT_COLOR}>
                    <AddTaskForm onAdd={handleAddTask} />
                  </SectionCard>

                  <SectionCard
                    title="Tasks"
                    subtitle={total === 0 ? "No tasks yet — add one above" : undefined}
                    accentGlow={ACCENT_COLOR}
                  >
                    <div className="flex flex-col gap-2">
                      <AnimatePresence initial={false}>
                        {total === 0 ? (
                          <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-sm text-zinc-600 py-4 text-center">
                            Nothing here yet.
                          </motion.p>
                        ) : (
                          <>
                            {incompleteTasks.map((task) =>
                              pendingTaskIds.has(task.id) ? (
                                <TaskSkeleton key={task.id} />
                              ) : (
                                <TaskCard key={task.id} task={task}
                                  onUpdate={(updated) => updateTask(dateKey, updated)}
                                  onDelete={() => deleteTask(dateKey, task.id)}
                                />
                              )
                            )}
                            {completedTasks.map((task) => (
                              <TaskCard key={task.id} task={task}
                                onUpdate={(updated) => updateTask(dateKey, updated)}
                                onDelete={() => deleteTask(dateKey, task.id)}
                              />
                            ))}
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </SectionCard>
                </motion.div>
              )}

              {mobileTab === "calendar" && (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <CalendarView selected={selectedDate} onSelect={(d) => { setSelectedDate(d); setMobileTab("tasks"); }} days={days} />
                </motion.div>
              )}

              {mobileTab === "week" && (
                <motion.div
                  key="week"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <SectionCard title="This week" subtitle="Daily task completion" accentGlow={ACCENT_COLOR}>
                    <WeeklyBar days={days} />
                  </SectionCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Desktop: 12-col grid (hidden on mobile) ── */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-5 items-start">

            <motion.div variants={fadeUp} className="lg:col-span-3">
              <CalendarView selected={selectedDate} onSelect={setSelectedDate} days={days} />
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-5 flex flex-col gap-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                  {isToday ? "Today" : "Selected day"}
                </p>
                <p className="text-sm font-semibold text-zinc-100 mt-0.5">{selectedLabel}</p>
              </div>

              <SectionCard title="New task" accentGlow={ACCENT_COLOR}>
                <AddTaskForm onAdd={handleAddTask} />
              </SectionCard>

              <SectionCard title="This week" subtitle="Daily task completion" accentGlow={ACCENT_COLOR}>
                <WeeklyBar days={days} />
              </SectionCard>
            </motion.div>

            {/* Task list */}
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <SectionCard
                title="Tasks"
                subtitle={total === 0 ? "No tasks yet — add one above" : undefined}
                accentGlow={ACCENT_COLOR}
              >
                <div className="flex flex-col gap-2  overflow-y-auto pr-1 min-h-102.5 max-h-102.5">
                  <AnimatePresence initial={false}>
                    {total === 0 ? (
                      <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-sm my-auto text-zinc-600 py-4 text-center">
                        Nothing here yet.
                      </motion.p>
                    ) : (
                      <>
                        {incompleteTasks.map((task) =>
                          pendingTaskIds.has(task.id) ? (
                            <TaskSkeleton key={task.id} />
                          ) : (
                            <TaskCard key={task.id} task={task}
                              onUpdate={(updated) => updateTask(dateKey, updated)}
                              onDelete={() => deleteTask(dateKey, task.id)}
                            />
                          )
                        )}
                        {completedTasks.map((task) => (
                          <TaskCard key={task.id} task={task}
                            onUpdate={(updated) => updateTask(dateKey, updated)}
                            onDelete={() => deleteTask(dateKey, task.id)}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </SectionCard>
            </motion.div>
          </div>

          {/* Journal — full width on both */}
          <motion.div variants={fadeUp}>
            <JournalSection
              value={dayData.journal}
              onChange={(journal) => updateJournal(dateKey, journal)}
            />
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
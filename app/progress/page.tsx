"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Days } from "@/types/progress";
import { formatDate, today } from "@/lib/mics/date";
import { useTasks } from "@/lib/progress/use_tasks";
import { computeStreak } from "@/lib/progress/streak";
import PageHeader from "../components/header/Header";
import StatCard from "../sleep/components/Statcard";
import SectionCard from "../sleep/components/SectionCartd";
import { CalendarView } from "./components/Calendar_view";
import { AddTaskForm } from "./components/Task_form";
import { TaskCard } from "./components/task_card";
import { TaskSkeleton } from "./components/Task_skeleton";
import { WeeklyBar } from "./components/weekly";
import { JournalSection } from "./components/Journal";
import { fadeUp,container, fadeIn } from "@/constants/progress/animations";
import { ACCENT_COLOR } from "@/constants/progress/template";

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

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">

        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader emoji="📈" title="Progress" subtitle="Goals & daily plan" backHref="/" />
        </motion.div>

        <motion.div className="flex flex-col gap-5" initial="hidden" animate="show" variants={container}>

          {/* Stats row */}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

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

            <motion.div variants={fadeUp} className="lg:col-span-4">
              <SectionCard
                title="Tasks"
                subtitle={total === 0 ? "No tasks yet — add one above" : undefined}
                accentGlow={ACCENT_COLOR}
              >
                <div className="flex flex-col gap-2 min-h-102.5 max-h-102.5 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {total === 0 ? (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm my-auto text-zinc-600 py-4 text-center"
                      >
                        Nothing here yet.
                      </motion.p>
                    ) : (
                      <>
                        {incompleteTasks.map((task) =>
                          pendingTaskIds.has(task.id) ? (
                            <TaskSkeleton key={task.id} />
                          ) : (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onUpdate={(updated) => updateTask(dateKey, updated)}
                              onDelete={() => deleteTask(dateKey, task.id)}
                            />
                          )
                        )}

                        {completedTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
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

          <JournalSection
            value={dayData.journal}
            onChange={(journal) => updateJournal(dateKey, journal)}
          />
        </motion.div>
      </div>
    </div>
  );
}
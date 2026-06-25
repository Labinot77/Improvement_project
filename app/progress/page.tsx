"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

import PageHeader from "../components/Header/Page_header"

import { formatDate } from "@/lib/mics/date"
// import { calcStreak } from "@/lib/streak"
import { CalendarView } from "./components/Calendar_view"
import { DayView } from "./components/Day_view"
import { Task } from "@/types/progress"
import { useUser } from "@/lib/use_user"
import { useTasks } from "@/lib/progress/use_tasks"

const Page = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const {
    days,
    addTask,
    updateTask,
    deleteTask,
    updateJournal,
    updateDayRating,
  } = useTasks()

  const { isLoggedIn, loading } = useUser()
  const router = useRouter()

  const formattedDate = formatDate(selectedDate)
  const currentDay = days[formattedDate]
  // const streak = calcStreak(days)

  function handleAddTask(title: string, description: string) {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      reflection: "",
      createdAt: new Date().toISOString(),
    }

    addTask(formattedDate, task)
  }

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login")
    }
  }, [loading, isLoggedIn, router])

  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">

        <PageHeader
          emoji="📈"
          title="Progress"
          subtitle="Goals & milestones"
          backHref="/"
        />

        <div className="flex-1 overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            >
              <CalendarView
                selected={selectedDate}
                onSelect={setSelectedDate}
                days={days}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
              className="min-h-0"
            >
              <DayView
                tasks={currentDay?.tasks || []}
                journal={currentDay?.journal || ""}
                dayRating={currentDay?.dayRating || 0}
                onAddTask={handleAddTask}
                onUpdateTask={(task) => updateTask(formattedDate, task)}
                onDeleteTask={(id) => deleteTask(formattedDate, id)}
                onJournalChange={(journal) =>
                  updateJournal(formattedDate, journal)
                }
                onRatingChange={(rating) =>
                  updateDayRating(formattedDate, rating)
                }
                streak={1}
              />
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Page
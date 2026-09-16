"use client"

import { useCallback, useEffect, useState } from "react"
import type { DayData, Task } from "@/types/Progress/progress"

import {
  getTasks,
  createTask,
  updateTask as updateTaskServer,
  deleteTask as deleteTaskServer,
  updateJournal as updateJournalServer,
} from "./actions"

export function useTasks() {
  const [days, setDays] = useState<Record<string, DayData>>({})
  const [loading, setLoading] = useState(true)
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(
    new Set()
  )

  function setDayTasks(
    date: string,
    updater: (tasks: Task[]) => Task[]
  ) {
    setDays((prev) => ({
      ...prev,
      [date]: {
        date,
        journal: prev[date]?.journal ?? "",
        tasks: updater(prev[date]?.tasks ?? []),
      },
    }))
  }

  function setPending(id: string, pending: boolean) {
    setPendingTaskIds((prev) => {
      const next = new Set(prev)

      if (pending) {
        next.add(id)
      } else {
        next.delete(id)
      }

      return next
    })
  }

  const fetchAll = useCallback(async () => {
    try {
      const data = await getTasks()
      setDays(data)
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function addTask(date: string, task: Task) {
    // Optimistic UI
    setDayTasks(date, (tasks) => [...tasks, task])
    setPending(task.id, true)

    try {
      const created = await createTask(date, task)

      if (!created) {
        setDayTasks(date, (tasks) =>
          tasks.filter((t) => t.id !== task.id)
        )
        return
      }

      // Replace temporary ID with database ID
      setDayTasks(date, (tasks) =>
        tasks.map((t) => (t.id === task.id ? created : t))
      )
    } catch (error) {
      console.error("Failed to create task:", error)

      setDayTasks(date, (tasks) =>
        tasks.filter((t) => t.id !== task.id)
      )
    } finally {
      setPending(task.id, false)
    }
  }

  async function updateTask(date: string, updatedTask: Task) {
    // Optimistic UI
    setDayTasks(date, (tasks) =>
      tasks.map((t) =>
        t.id === updatedTask.id ? updatedTask : t
      )
    )

    const success = await updateTaskServer(
      updatedTask.id,
      updatedTask
    )

    if (!success) {
      await fetchAll()
    }
  }

  async function deleteTask(date: string, taskId: string) {
    // Optimistic UI
    setDayTasks(date, (tasks) =>
      tasks.filter((t) => t.id !== taskId)
    )

    const success = await deleteTaskServer(taskId)

    if (!success) {
      await fetchAll()
    }
  }

  async function updateJournal(date: string, journal: string) {
    // Optimistic UI
    setDays((prev) => ({
      ...prev,
      [date]: {
        date,
        journal,
        tasks: prev[date]?.tasks ?? [],
      },
    }))

    const success = await updateJournalServer(date, journal)

    if (!success) {
      await fetchAll()
    }
  }

  return {
    days,
    addTask,
    updateTask,
    deleteTask,
    updateJournal,
    loading,
    pendingTaskIds,
  }
}
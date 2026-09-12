// "use client"

// // dayRating is broken I dont have it in the front end, but is setup in the back end

// import { useEffect, useState, useCallback } from "react"
// import { createClient } from "@/lib/supabase/client"
// import { DayData, Task } from "@/types/Progress/progress"

// const supabase = createClient()

// export function useTasks() {
//   const [days, setDays] = useState<Record<string, DayData>>({})
//   const [loading, setLoading] = useState(true)
//   const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set())

//   function setDayTasks(date: string, updater: (tasks: Task[]) => Task[]) {
//     setDays((prev) => ({
//       ...prev,
//       [date]: {
//         date,
//         journal: prev[date]?.journal ?? "",
//         tasks: updater(prev[date]?.tasks ?? []),
//       },
//     }))
//   }

//   function setPending(id: string, isPending: boolean) {
//     setPendingTaskIds((prev) => {
//       const next = new Set(prev)
//       isPending ? next.add(id) : next.delete(id)
//       return next
//     })
//   }

//   const fetchAll = useCallback(async () => {
//     const { data: dayRows, error: dayErr } = await supabase
//       .from("days")
//       .select("id, date, journal")

//     if (dayErr || !dayRows) {
//       setLoading(false)
//       return
//     }

//     const { data: taskRows } = await supabase
//       .from("tasks")
//       .select("id, day_id, title, description, completed, reflection, created_at")

//     const next: Record<string, DayData> = {}
//     for (const row of dayRows) {
//       next[row.date] = {
//         date: row.date,
//         journal: row.journal ?? "",
//         tasks: (taskRows ?? [])
//           .filter((t) => t.day_id === row.id)
//           .map((t) => ({
//             id: t.id,
//             title: t.title,
//             description: t.description ?? "",
//             completed: t.completed,
//             reflection: t.reflection ?? "",
//             createdAt: t.created_at,
//           })),
//       }
//     }

//     setDays(next)
//     setLoading(false)
//   }, [])

//   useEffect(() => {
//     fetchAll()
//   }, [fetchAll])

//   // ── Ensure a `days` row exists, return its id ────────────────────────────
//   async function ensureDayId(date: string): Promise<string | null> {
//     const { data: existing } = await supabase
//       .from("days")
//       .select("id")
//       .eq("date", date)
//       .maybeSingle()

//     if (existing) return existing.id

//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) return null

//     const { data: created, error } = await supabase
//       .from("days")
//       .insert({ date, user_id: user.id })
//       .select("id")
//       .single()

//     return error || !created ? null : created.id
//   }

//   async function addTask(date: string, task: Task) {
//     // Optimistic insert
//     setDayTasks(date, (tasks) => [...tasks, task])
//     setPending(task.id, true)

//     const dayId = await ensureDayId(date)
//     const { data: { user } } = await supabase.auth.getUser()

//     if (!dayId || !user) {
//       setDayTasks(date, (tasks) => tasks.filter((t) => t.id !== task.id))
//       setPending(task.id, false)
//       return
//     }

//     const { data, error } = await supabase
//       .from("tasks")
//       .insert({
//         day_id: dayId,
//         user_id: user.id,
//         title: task.title,
//         description: task.description,
//         completed: task.completed,
//         reflection: task.reflection ?? "",
//       })
//       .select()
//       .single()

//     if (error || !data) {
//       setDayTasks(date, (tasks) => tasks.filter((t) => t.id !== task.id))
//       setPending(task.id, false)
//       return
//     }

//     // Swap temp id for real DB id
//     setDayTasks(date, (tasks) =>
//       tasks.map((t) =>
//         t.id === task.id
//           ? {
//               id: data.id,
//               title: data.title,
//               description: data.description,
//               completed: data.completed,
//               reflection: data.reflection ?? "",
//               createdAt: data.created_at,
//             }
//           : t
//       )
//     )
//     setPending(task.id, false)
//   }

//   async function updateTask(date: string, updatedTask: Task) {
//     setDayTasks(date, (tasks) =>
//       tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
//     )

//     await supabase
//       .from("tasks")
//       .update({
//         title: updatedTask.title,
//         description: updatedTask.description,
//         completed: updatedTask.completed,
//         reflection: updatedTask.reflection ?? "",
//       })
//       .eq("id", updatedTask.id)
//   }

//   async function deleteTask(date: string, taskId: string) {
//     setDayTasks(date, (tasks) => tasks.filter((t) => t.id !== taskId))
//     await supabase.from("tasks").delete().eq("id", taskId)
//   }

//   async function updateJournal(date: string, journal: string) {
//     const dayId = await ensureDayId(date)
//     if (!dayId) return

//     setDays((prev) => ({
//       ...prev,
//       [date]: { date, journal, tasks: prev[date]?.tasks ?? [] },
//     }))

//     await supabase.from("days").update({ journal }).eq("id", dayId)
//   }

//   return { days, addTask, updateTask, deleteTask, updateJournal, loading, pendingTaskIds }
// }


"use client"

import { useCallback, useEffect, useState } from "react"
import type { DayData, Task } from "@/types/Progress/progress"

import {
  getTasks,
  createTask,
  updateTask as updateTaskServer,
  deleteTask as deleteTaskServer,
  updateJournal as updateJournalServer,
} from "./tasks.server"

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
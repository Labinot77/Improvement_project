"use client"

import { Calendar } from "@/components/ui/calendar"
import { formatDate } from "@/lib/mics/date"
import { DayData } from "@/types/progress"

type Props = {
  selected: Date
  onSelect: (date: Date) => void
  days: Record<string, DayData>
}

export function CalendarView({ selected, onSelect, days }: Props) {
  const isAllTasksCompleted = (dayData: DayData | undefined) => {
    if (!dayData || dayData.tasks.length === 0) return false
    return dayData.tasks.every((task) => task.completed)
  }

  const isDateCompleted = (date: Date) => {
    const dateStr = formatDate(date)
    return isAllTasksCompleted(days[dateStr])
  }

    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)


  return (
    <div
      className="rounded-2xl self-start sticky top-8 border border-border bg-card/40 backdrop-blur-sm p-5"
      style={{
        "--background": "transparent",
        "--foreground": "var(--foreground)",
        "--muted": "oklch(1 0 0 / 6%)",
        "--muted-foreground": "oklch(1 0 0 / 45%)",
        "--primary": "oklch(0.95 0 0)",
        "--primary-foreground": "oklch(0.13 0.015 240)",
        "--accent": "oklch(1 0 0 / 8%)",
        "--accent-foreground": "oklch(0.95 0 0)",
        "--border": "oklch(1 0 0 / 8%)",
        "--ring": "oklch(0.95 0 0)",
      } as React.CSSProperties}
    >
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(date) => { if (date) onSelect(date)}}
        className="rounded-md w-full [&_.rdp-day_button]:relative"
        modifiers={{ completed: (date) => isDateCompleted(date) }}
        modifiersClassNames={{
          today: "after:absolute after:bottom-0.5 after:right-0.5 after:w-2.5 after:h-2.5 after:bg-yellow-500 after:rounded-full after:flex after:items-center after:justify-center",
          completed: "after:absolute after:bottom-0.5 after:right-0.5 after:w-2.5 after:h-2.5 after:bg-green-500 after:rounded-full after:flex after:items-center after:justify-center",
        }}
      />
    </div>
  )
}
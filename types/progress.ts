export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  reflection?: string
  createdAt: string
}

export interface DayData {
  date: string
  tasks: Task[]
  journal: string
  dayRating?: number
}
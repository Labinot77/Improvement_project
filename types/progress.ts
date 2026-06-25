// export interface Task {
//   id: string
//   title: string
//   description: string
//   completed: boolean
//   reflection?: string
//   createdAt: string
// }

// export interface DayData {
//   date: string
//   tasks: Task[]
//   journal: string
//   dayRating?: number
// }

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reflection?: string;
  priority?: "low" | "medium" | "high";
  createdAt: string; // ISO
}

export interface DayData {
  tasks: Task[];
  journal: string;
  rating: number; // 1–5
}

export type Days = Record<string, DayData>; // key = "YYYY-MM-DD"
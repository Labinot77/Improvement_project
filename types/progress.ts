export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reflection?: string;
  createdAt: string; // ISO
}

export interface DayData {
  date: string
  tasks: Task[];
  journal: string;
}

export type Days = Record<string, DayData>; // key = "YYYY-MM-DD"
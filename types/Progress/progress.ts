export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  reflection?: string;
  createdAt: string; // ISO
}

// A task as shown on the Progress page
export interface TodoTask {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

// --- Insights (Progress page analytics) ---

export interface DayStatTask {
  title: string;
  category: string;
  completed: boolean;
}

export interface DayStat {
  date: string; // YYYY-MM-DD
  total: number;
  done: number;
  tasks: DayStatTask[];
}

export interface CategoryStat {
  name: string;
  done: number;
  total: number;
}

export interface WeekdayStat {
  label: string; // Mon..Sun
  rate: number; // 0-100
  days: number; // active days sampled
}

export interface ProgressStats {
  days: DayStat[]; // heatmap window, Monday-aligned, ends today
  streak: number;
  bestStreak: number;
  weekRate: number; // 0-100, last 7 days
  prevWeekRate: number; // 0-100, the 7 days before
  momentum: number; // 0-100, smoothed daily completion
  momentumDelta: number; // vs 7 days ago
  completed30: number;
  categories: CategoryStat[];
  weekdays: WeekdayStat[];
  insights: string[];
}

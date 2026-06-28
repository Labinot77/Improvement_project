export interface SleepEntry {
  id: string;
  date: string;          // "YYYY-MM-DD"
  bedtime: string;       // "HH:MM" 24h
  wakeTime: string;      // "HH:MM" 24h
  durationHours: number; // auto-calculated
  notes: string;
  createdAt: string;
}

export type SleepDays = Record<string, SleepEntry>;
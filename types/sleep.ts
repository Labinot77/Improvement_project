export interface SleepEntry {
  id: string;
  date: string;         // ISO date string "YYYY-MM-DD"
  bedtime: string;      // "HH:MM" 24h
  wake_time: string;    // "HH:MM" 24h
  duration_hours: number;
  quality: 1 | 2 | 3 | 4 | 5; // Migth remove
  notes?: string;
}

export interface SleepGoal {
  target_bedtime: string;   // "HH:MM" 24h
  target_duration: number;  // hours
}

export type SleepQualityLabel = "Terrible" | "Poor" | "Okay" | "Good" | "Excellent";
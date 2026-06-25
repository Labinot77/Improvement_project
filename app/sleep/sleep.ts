import { SleepEntry, SleepGoal, SleepQualityLabel } from "@/types/sleep";

export const SLEEP_QUALITY_LABELS: Record<number, SleepQualityLabel> = {
  1: "Terrible",
  2: "Poor",
  3: "Okay",
  4: "Good",
  5: "Excellent",
};

export const SLEEP_QUALITY_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#22c55e",
  5: "#6366f1",
};

export const DEFAULT_SLEEP_GOAL: SleepGoal = {
  target_bedtime: "23:00",
  target_duration: 8,
};

export const SLEEP_IMPROVEMENT_TIPS = [
  {
    icon: "📵",
    title: "No screens 1 hour before bed",
    description:
      "Blue light suppresses melatonin production. Put the phone down at least 60 minutes before your target bedtime.",
  },
  {
    icon: "🌡️",
    title: "Keep your room cool",
    description:
      "Core body temperature needs to drop to initiate sleep. Aim for 16–19°C (60–67°F) for optimal conditions.",
  },
  {
    icon: "☀️",
    title: "Get morning sunlight",
    description:
      "10–20 minutes of natural light within an hour of waking resets your circadian clock and improves sleep pressure at night.",
  },
  {
    icon: "☕",
    title: "Cut caffeine after 2pm",
    description:
      "Caffeine has a half-life of ~5–6 hours. A 3pm coffee can still be 50% active in your system at 9pm.",
  },
  {
    icon: "🧘",
    title: "Wind-down routine",
    description:
      "A consistent 20–30 min pre-sleep routine signals your brain that sleep is coming. Reading, light stretching, or breathing exercises work well.",
  },
  {
    icon: "🕐",
    title: "Same wake time every day",
    description:
      "Your wake time anchors your entire circadian rhythm. Keeping it consistent — even on weekends — is the single highest-leverage sleep habit.",
  },
];

// Mock data for 14 days — replace with Supabase fetches
export const MOCK_SLEEP_DATA: SleepEntry[] = [
  { id: "1",  date: "2026-06-12", bedtime: "23:15", wake_time: "07:10", duration_hours: 7.9, quality: 4 },
  { id: "2",  date: "2026-06-13", bedtime: "00:30", wake_time: "07:45", duration_hours: 7.3, quality: 3 },
  { id: "3",  date: "2026-06-14", bedtime: "22:45", wake_time: "06:50", duration_hours: 8.1, quality: 5 },
  { id: "4",  date: "2026-06-15", bedtime: "23:50", wake_time: "07:20", duration_hours: 7.5, quality: 4 },
  { id: "5",  date: "2026-06-16", bedtime: "01:15", wake_time: "08:00", duration_hours: 6.8, quality: 2 },
  { id: "6",  date: "2026-06-17", bedtime: "23:00", wake_time: "07:00", duration_hours: 8.0, quality: 5 },
  { id: "7",  date: "2026-06-18", bedtime: "23:30", wake_time: "07:15", duration_hours: 7.8, quality: 4 },
  { id: "8",  date: "2026-06-19", bedtime: "00:00", wake_time: "07:30", duration_hours: 7.5, quality: 3 },
  { id: "9",  date: "2026-06-20", bedtime: "22:30", wake_time: "06:30", duration_hours: 8.0, quality: 5 },
  { id: "10", date: "2026-06-21", bedtime: "23:45", wake_time: "07:00", duration_hours: 7.3, quality: 3 },
  { id: "11", date: "2026-06-22", bedtime: "01:00", wake_time: "08:15", duration_hours: 7.3, quality: 2 },
  { id: "12", date: "2026-06-23", bedtime: "23:10", wake_time: "07:05", duration_hours: 7.9, quality: 4 },
  { id: "13", date: "2026-06-24", bedtime: "22:50", wake_time: "06:55", duration_hours: 8.1, quality: 5 },
  { id: "14", date: "2026-06-25", bedtime: "23:20", wake_time: "07:10", duration_hours: 7.8, quality: 4 },
];
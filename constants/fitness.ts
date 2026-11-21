import type { ActivityType, IntensityLevel } from "@/types/fitness";

export const ACCENT = "rgba(239,68,68,0.22)";

export const WEEKLY_GOAL = 5; // sessions per week

export const ACTIVITY_META: Record<ActivityType, { icon: string; color: string }> = {
  "Martial Arts": { icon: "🥋", color: "#ef4444" },
  "Gym":          { icon: "🏋️", color: "#f97316" },
  "Running":      { icon: "🏃", color: "#eab308" },
  "Cycling":      { icon: "🚴", color: "#22c55e" },
  "Swimming":     { icon: "🏊", color: "#06b6d4" },
  "Yoga":         { icon: "🧘", color: "#8b5cf6" },
  "Other":        { icon: "⚡", color: "#71717a" },
};

export const INTENSITY_META: Record<IntensityLevel, { label: string; color: string }> = {
  1: { label: "Easy",     color: "#22c55e" },
  2: { label: "Light",    color: "#86efac" },
  3: { label: "Moderate", color: "#eab308" },
  4: { label: "Hard",     color: "#f97316" },
  5: { label: "Max",      color: "#ef4444" },
};

export const ALL_ACTIVITY_TYPES: ActivityType[] = [
  "Martial Arts", "Gym", "Running", "Cycling", "Swimming", "Yoga", "Other",
];

export const ALL_INTENSITIES: IntensityLevel[] = [1, 2, 3, 4, 5];
// --- Activity page ---

// Page accent (warm red/orange)
export const ACTIVITY_COLOR = "#f97362";

// Weeks offered by the volume chart
export const VOLUME_RANGES = [8, 12, 26] as const;

// Acute:chronic load zones (upper bounds)
export const LOAD_ZONES = [
  { max: 0.8, label: "Detraining", tip: "Load is well below your usual. Add a session.", color: "#60a5fa" },
  { max: 1.3, label: "Sweet spot", tip: "Training in line with what you're used to.", color: "#4ade80" },
  { max: 1.5, label: "Pushing", tip: "Ramping up fast. Watch recovery.", color: "#facc15" },
  { max: Infinity, label: "Spike", tip: "A big jump over your norm. Injury risk rises here.", color: "#f87171" },
] as const;

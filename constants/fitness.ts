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
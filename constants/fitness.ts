import type { ActivityType, CardioType, IntensityLevel } from "@/types/fitness";

export const ACCENT = "rgba(239,68,68,0.22)";

export const WEEKLY_GOAL = 5; // sessions per week

export const ACTIVITY_META: Record<ActivityType, { icon: string; color: string }> = {
  "Gym":          { icon: "🏋️", color: "#f97362" },
  "Martial Arts": { icon: "🥋", color: "#ef4444" },
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
  "Gym", "Martial Arts", "Running", "Cycling", "Swimming", "Yoga", "Other",
];

export const ALL_INTENSITIES: IntensityLevel[] = [1, 2, 3, 4, 5];
// --- Activity page ---

// Page accent (warm red/orange)
export const ACTIVITY_COLOR = "#f97362";


// Acute:chronic load zones (upper bounds)
export const LOAD_ZONES = [
  { max: 0.8, label: "Detraining", tip: "Load is well below your usual. Add a session.", color: "#60a5fa" },
  { max: 1.3, label: "Sweet spot", tip: "Training in line with what you're used to.", color: "#4ade80" },
  { max: 1.5, label: "Pushing", tip: "Ramping up fast. Watch recovery.", color: "#facc15" },
  { max: Infinity, label: "Spike", tip: "A big jump over your norm. Injury risk rises here.", color: "#f87171" },
] as const;

// --- Gym ---

export const CARDIO_TYPES: CardioType[] = ["Running", "Cycling", "Stairs", "Rowing", "Elliptical"];

export const CARDIO_META: Record<CardioType, { icon: string; color: string }> = {
  Running:    { icon: "🏃", color: "#facc15" },
  Cycling:    { icon: "🚴", color: "#4ade80" },
  Stairs:     { icon: "🪜", color: "#fb923c" },
  Rowing:     { icon: "🚣", color: "#38bdf8" },
  Elliptical: { icon: "⚙️", color: "#a78bfa" },
};

// Weeks shown in the volume chart
export const VOLUME_WEEKS = 12;

// Hard sets per muscle per week that most programs aim for
export const SET_TARGET = { min: 10, max: 20 };

// Muscle groups, matched by whole words in the exercise name (first match wins)
export const MUSCLES: { name: string; color: string; keywords: string[] }[] = [
  { name: "Chest", color: "#f97362", keywords: ["bench", "chest", "fly", "pec", "push-up", "pushup", "dip"] },
  { name: "Back", color: "#60a5fa", keywords: ["row", "pull", "lat", "deadlift", "chin", "shrug"] },
  { name: "Core", color: "#2dd4bf", keywords: ["plank", "crunch", "ab", "core", "sit-up", "situp", "leg raise"] },
  { name: "Legs", color: "#4ade80", keywords: ["squat", "leg", "lunge", "calf", "hamstring", "quad", "glute", "hip thrust", "rdl"] },
  { name: "Shoulders", color: "#facc15", keywords: ["overhead", "shoulder", "lateral", "military", "ohp", "delt", "face pull"] },
  { name: "Arms", color: "#c084fc", keywords: ["curl", "tricep", "extension", "skull", "pushdown", "hammer"] },
];

// Starter suggestions for the exercise field
export const COMMON_EXERCISES = [
  "Bench press", "Incline dumbbell press", "Overhead press", "Lateral raise", "Tricep pushdown",
  "Pull-up", "Barbell row", "Lat pulldown", "Face pull", "Bicep curl",
  "Squat", "Romanian deadlift", "Deadlift", "Leg press", "Leg curl", "Calf raise", "Plank",
];

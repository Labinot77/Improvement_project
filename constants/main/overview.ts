// --- Overview page ---

// Days shown in the daily score chart
export const SCORE_DAYS = 28;

// Days used to look for connections between areas
export const CONNECTION_DAYS = 60;

// Minimum days on each side before a connection is shown
export const MIN_SAMPLE = 3;

// Minutes that count as a "full" active day
export const ACTIVE_MINS = 45;

// Hours that count as a "good" night
export const GOOD_NIGHT_HOURS = 7;

// Each area's weight in the daily score (missing areas are skipped)
export const PILLARS = {
  tasks: { label: "To-dos", weight: 0.4, color: "#7c6cf0", href: "/progress" },
  sleep: { label: "Sleep", weight: 0.3, color: "#8b9cf7", href: "/sleep" },
  move: { label: "Activity", weight: 0.2, color: "#f97362", href: "/activity" },
  learn: { label: "Lessons", weight: 0.1, color: "#4ade80", href: "/lessons" },
} as const;

export type PillarKey = keyof typeof PILLARS;

export const TEMPLATE = `## What went well today?


## What could have been better?


## Top 3 wins:
1. 
2. 
3. 

## Tomorrow's focus:

`;
export const ACCENT = "#7c6cf0";
export const EYEBROW_COLOR = "text-[#e9a25c]";

export { CARD } from "@/constants/ui";

export const CATEGORIES = [
  "Personal",
  "Lessons",
  "Activity",
  "Recipes",
  "Health",
  "Planning",
] as const;
export const DEFAULT_CATEGORY = "Personal";

// How many days ahead the "Due" dropdown offers (today included)
export const DUE_DAYS = 7;

// Upcoming tasks shown before the list is cut off
export const MAX_UPCOMING = 8;

// Progress ring geometry (viewBox 0 0 100 100)
const RING_RADIUS = 42;
export const RING = {
  radius: RING_RADIUS,
  stroke: 10,
  circumference: 2 * Math.PI * RING_RADIUS,
};

// Two short lines per tip; one is picked per day
export const FOCUS_TIPS: [string, string][] = [
  ["Pick the smallest next action.", "Momentum follows clarity."],
  ["Do the hard thing first.", "Everything else gets lighter."],
  ["Finish one task fully", "before starting the next."],
  ["Write tomorrow's first step", "before you close the day."],
  ["Done beats perfect.", "Ship the rough version."],
];
// --- Insights ---

// Weeks shown in the activity heatmap
export const HEATMAP_WEEKS = 18;

// Momentum: weight of the newest day, and decay for days with no tasks
export const MOMENTUM_ALPHA = 0.35;
export const MOMENTUM_DECAY = 0.9;

// Range options for the completion chart (days)
export const CHART_RANGES = [7, 14, 30] as const;

// Chart palette
export const DONE_COLOR = ACCENT;
export const OPEN_COLOR = "rgba(255,255,255,0.08)";
export const MOMENTUM_COLOR = "#e9a25c";

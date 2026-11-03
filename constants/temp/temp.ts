import { Activity, BookOpen, Moon, UtensilsCrossed } from "lucide-react";

// Mock data for the weekly chart — replace once it's computed from the DB
export const WEEK = [
  { day: "Mon", value: 36 },
  { day: "Tue", value: 56 },
  { day: "Wed", value: 42 },
  { day: "Thu", value: 68 },
  { day: "Fri", value: 50 },
  { day: "Sat", value: 76 },
  { day: "Sun", value: 55 },
];
export const HIGHLIGHT_DAY = "Sat";

// Tasks shown in "Today's focus" before linking to the full to-do page
export const MAX_FOCUS_TASKS = 6;

// Weekly targets that drive the stat card progress bars
export const GOALS = { lessons: 5, workouts: 4, cooks: 5, sleepHours: 8 };

// Daily progress ring geometry
const RING_RADIUS = 26;
export const RING = {
  radius: RING_RADIUS,
  circumference: 2 * Math.PI * RING_RADIUS,
};

export const CARD = "rounded-3xl border border-white/[0.06] bg-[#16181b]";

export const STAT_META = {
  lessons: {
    label: "Lessons",
    href: "/lessons",
    icon: BookOpen,
    iconColor: "text-emerald-400",
    bar: "bg-emerald-400",
  },
  activity: {
    label: "Activity",
    href: "/activity",
    icon: Activity,
    iconColor: "text-orange-400",
    bar: "bg-orange-400",
  },
  recipes: {
    label: "Recipes",
    href: "/recipes",
    icon: UtensilsCrossed,
    iconColor: "text-emerald-400",
    bar: "bg-emerald-500",
  },
  sleep: {
    label: "Sleep",
    href: "/sleep",
    icon: Moon,
    iconColor: "text-blue-400",
    bar: "bg-blue-500",
  },
} as const;
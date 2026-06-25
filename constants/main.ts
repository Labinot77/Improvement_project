import { DashboardCardProps } from "@/types/main";

export const cards: Omit<DashboardCardProps, "index">[] = [
  {
    title: "Main",
    subtitle: "Goals & daily plan",
    emoji: "🏠",
    href: "/main",
    accentGlow: "rgba(52,211,153,0.22)",
    size: "large",
    className: "row-span-2",
  },
  {
    title: "Fitness",
    subtitle: "Workouts, splits, sessions",
    emoji: "💪",
    href: "/fitness",
    accentGlow: "rgba(234,179,8,0.28)",
    size: "medium",
    className: "col-span-2",
  },
  {
    title: "Health",
    subtitle: "Supplements & vitals",
    emoji: "💊",
    href: "/health",
    accentGlow: "rgba(239,68,68,0.25)",
    size: "medium",
  },
    {
    title: "Sleep",
    subtitle: "Recovery & rest",
    emoji: "😴",
    href: "/sleep",
    accentGlow: "rgba(14,165,233,0.22)",
  },
  {
    title: "Finance",
    subtitle: "Net worth & spending",
    emoji: "📊",
    href: "/finance",
    accentGlow: "rgba(251,146,60,0.22)",
    size: "medium",
  },
  {
    title: "Progress",
    subtitle: "Goals & milestones",
    emoji: "📈",
    href: "/progress",
    accentGlow: "rgba(34,197,94,0.22)",
    size: "medium",
  },
 
  {
    title: "Caffeine",
    subtitle: "Intake & timing",
    emoji: "☕",
    href: "/caffeine",
    accentGlow: "rgba(180,120,60,0.22)",
    size: "medium",
  },

     {
    title: "Trading",
    subtitle: "Workouts, splits, sessions",
    emoji: "☕",
    href: "/trading",
    accentGlow: "rgba(100,55,38,0.28)",
    size: "medium",
    // className: "col-span-2",
  },
];

import type { LessonCategory, LessonImpact } from "../types/lessons";

export const ACCENT = "rgba(234,179,8,0.2)"; // amber

export const CATEGORY_META: Record<LessonCategory, { color: string; icon: string }> = {
  Trading:       { color: "#f59e0b", icon: "📈" },
  Life:          { color: "#6366f1", icon: "🌱" },
  Mindset:       { color: "#8b5cf6", icon: "🧠" },
  Health:        { color: "#10b981", icon: "💪" },
  Relationships: { color: "#ec4899", icon: "🤝" },
  Finance:       { color: "#22c55e", icon: "💰" },
  Mistake:       { color: "#ef4444", icon: "⚠️" },
  Other:         { color: "#71717a", icon: "📝" },
};

export const IMPACT_META: Record<LessonImpact, { label: string; color: string }> = {
  low:    { label: "Low",    color: "#71717a" },
  medium: { label: "Medium", color: "#f59e0b" },
  high:   { label: "High",   color: "#ef4444" },
};

export const ALL_CATEGORIES: LessonCategory[] = [
  "Trading", "Life", "Mindset", "Health", "Relationships", "Finance", "Mistake", "Other",
];

export const ALL_IMPACTS: LessonImpact[] = ["low", "medium", "high"];
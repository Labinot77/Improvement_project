import { Category } from "../types/main";

export const ACCENT = "rgba(251,146,60,0.22)"; // orange — matches dashboard card

export const CATEGORY_META: Record<Category, { color: string; icon: string }> = {
  Food:          { color: "#f97316", icon: "🍔" },
  Transport:     { color: "#3b82f6", icon: "🚗" },
  Housing:       { color: "#8b5cf6", icon: "🏠" },
  Shopping:      { color: "#ec4899", icon: "🛍️" },
  Entertainment: { color: "#f59e0b", icon: "🎬" },
  Health:        { color: "#10b981", icon: "💊" },
  Income:        { color: "#22c55e", icon: "💰" },
  Savings:       { color: "#06b6d4", icon: "🏦" },
  Other:         { color: "#71717a", icon: "📦" },
};

export const ALL_CATEGORIES: Category[] = [
  "Food", "Transport", "Housing", "Shopping",
  "Entertainment", "Health", "Income", "Savings", "Other",
];
import type { MealType, Difficulty } from "../types/Recipies/main";

export const ACCENT = "rgba(245,158,11,0.2)"; // amber, matches Trading/Breakfast accent

export const MEAL_META: Record<MealType, { color: string; icon: string }> = {
  Breakfast: { color: "#f59e0b", icon: "🍳" },
  Lunch:     { color: "#22c55e", icon: "🥪" },
  Dinner:    { color: "#6366f1", icon: "🍽️" },
  Snack:     { color: "#71717a", icon: "🥨" },
  Dessert:   { color: "#ec4899", icon: "🍰" },
  Drink:     { color: "#0ea5e9", icon: "🥤" },
};

export const DIFFICULTY_META: Record<Difficulty, { label: string; color: string }> = {
  easy:   { label: "Easy",   color: "#22c55e" },
  medium: { label: "Medium", color: "#f59e0b" },
  hard:   { label: "Hard",   color: "#ef4444" },
};

export const ALL_MEAL_TYPES: MealType[] = [
  "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink",
];

export const ALL_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
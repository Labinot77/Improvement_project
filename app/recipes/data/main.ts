import type { Difficulty, MealType, Recipe } from "@/types/Recipies/main";

export const MEAL_TYPES: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Drink"];
export const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export const FILTERS = ["All recipes", "Breakfast", "Lunch", "Dinner", "Quick meals"] as const;
export type Filter = (typeof FILTERS)[number];

export function matchesFilter(r: Recipe, f: Filter) {
  if (f === "All recipes") return true;
  if (f === "Quick meals") return r.cookMinutes <= 30 && !r.needsOvernightRest;
  return r.mealType === f;
}

export function formatTime({ cookMinutes: m, needsOvernightRest }: Pick<Recipe, "cookMinutes" | "needsOvernightRest">) {
  if (needsOvernightRest) return "Overnight";
  if (m < 60) return `${m} min`;
  return m % 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m / 60}h`;
}

/** "YYYY-MM-DD" for today + offset days (server's local time). */
export function dayKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
}

export const weekday = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" });

// Recipes without a photo get a stable colour based on their id.
const PALETTE = ["#b5654b", "#6b8a5a", "#7d5878", "#a88a55", "#5b7f95", "#8a6a5a"];

export function cover(r: Recipe) {
  const hash = [...r.id].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const url = r.imageUrl?.[0];
  return {
    backgroundColor: PALETTE[hash % PALETTE.length],
    backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.45))${url ? `, url(${url})` : ""}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/** "€12.50", or null when there's no cost. Prices are always in euros. */
export function formatCost({ estimatedCost }: Pick<Recipe, "estimatedCost">) {
  if (estimatedCost == null) return null;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR" }).format(estimatedCost);
}
import type { MealType } from "./main";

/** User-configured limits, e.g. { "Chicken Stir Fry": 2 } — keyed by recipe id. */
export type RepeatLimits = Record<string, number>;

export interface MealPlanGenerateInput {
  weekStart: string;         // "YYYY-MM-DD" — Monday of the target week
  budget: number;
  mealsPerDay: number;
  mealTypes: MealType[];     // which meal types to fill each day, in order (e.g. ["Breakfast","Lunch","Dinner"])
  repeatLimits: RepeatLimits; // per-recipe max uses across the week; recipes not listed default to 1
}

export interface MealPlanEntry {
  id: string;
  date: string;              // "YYYY-MM-DD"
  mealType: MealType;
  slotIndex: number;         // position within the day (0-based), supports multiple same-type meals/day
  recipeId: string;
}

export interface MealPlan {
  id: string;
  weekStart: string;
  budget: number;
  mealsPerDay: number;
  totalCost: number;
  currency: string | null;
  warnings: string[];
  entries: MealPlanEntry[];
  createdAt: string;
}

export interface GeneratePlanResult {
  entries: Omit<MealPlanEntry, "id">[];
  totalCost: number;
  currency: string | null;
  warnings: string[];
}
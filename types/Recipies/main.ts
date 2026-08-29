export type MealType =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Snack"
  | "Dessert"
  | "Drink";

export type Difficulty = "easy" | "medium" | "hard";

export interface Ingredient {
  id: string;
  name: string;
  amount: string; 
}

export interface Recipe {
  id: string;
  title: string;
  notes: string;
  mealType: MealType;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  cookMinutes: number;
  needsOvernightRest: boolean;
  servings: number | null;
  imageUrl?: string[]; // Array for future-proofing, in case we want to support multiple images per recipe
  date: string;
  createdAt: string;
  estimatedCost?: number | null;   // NEW
  costCurrency?: string | null;    // NEW
}

export interface RecipeFilters {
  mealType: MealType | "All";
  overnightOnly: boolean;
  ingredients: string[];
}

export const EMPTY_RECIPE_FILTERS: RecipeFilters = {
  mealType: "All",
  overnightOnly: false,
  ingredients: [],
};
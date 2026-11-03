import "server-only";
import { createClient } from "@/lib/supabase/server"; // adjust to your server client path
import type { Recipe, RecipeFormValues } from "@/types/Recipies/main";

// DB row (snake_case) -> your Recipe type. If your column names differ, change them here and in toRow.
// Assumed table "recipes": id, user_id, title, notes, meal_type, difficulty, ingredients (jsonb),
// cook_minutes, needs_overnight_rest, servings, image_url (text[]), date, created_at,
// estimated_cost. (cost_currency is no longer used: prices are always euros.)
function toRecipe(r: any): Recipe {
  return {
    id: r.id,
    title: r.title,
    notes: r.notes ?? "",
    mealType: r.meal_type,
    difficulty: r.difficulty,
    ingredients: r.ingredients ?? [],
    cookMinutes: r.cook_minutes,
    needsOvernightRest: r.needs_overnight_rest ?? false,
    servings: r.servings ?? null,
    imageUrl: r.image_url ?? undefined,
    date: r.date,
    createdAt: r.created_at,
    estimatedCost: r.estimated_cost ?? null,
  };
}

// Only the fields the form edits, so images and createdAt are never overwritten.
function toRow(v: RecipeFormValues) {
  return {
    title: v.title,
    notes: v.notes,
    meal_type: v.mealType,
    difficulty: v.difficulty,
    ingredients: v.ingredients,
    cook_minutes: v.cookMinutes,
    needs_overnight_rest: v.needsOvernightRest,
    servings: v.servings,
    date: v.date,
    estimated_cost: v.estimatedCost ?? null,
  };
}

export async function getRecipes(): Promise<Recipe[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(toRecipe);
}

/** Creates the recipe if the id is new, otherwise updates it. Relies on RLS so users only touch their own rows. */
export async function upsertRecipe(id: string, values: RecipeFormValues) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  const { data: existing } = await supabase.from("recipes").select("id").eq("id", id).maybeSingle();

  const { error } = existing
    ? await supabase.from("recipes").update(toRow(values)).eq("id", id).eq("user_id", user.id)
    : await supabase.from("recipes").insert({ id, user_id: user.id, ...toRow(values) });

  if (error) throw new Error(error.message);
}

export async function removeRecipe(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  const { error } = await supabase.from("recipes").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}
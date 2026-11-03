
"use server";

import { revalidatePath } from "next/cache";
import type { RecipeFormValues } from "@/types/Recipies/main";
import { removeRecipe, upsertRecipe } from "@/app/recipes/store/main";

export async function saveRecipe(id: string, v: RecipeFormValues) {
  if (!v.title.trim()) {
    return { error: "Enter a recipe name." };
  }

  await upsertRecipe(id, {
    title: v.title.trim(),
    notes: v.notes,
    mealType: v.mealType,
    difficulty: v.difficulty,
    ingredients: v.ingredients,
    cookMinutes: Number(v.cookMinutes),
    needsOvernightRest: v.needsOvernightRest,
    servings: v.servings ? Number(v.servings) : null,
    date: v.date,
    estimatedCost: v.estimatedCost ? Number(v.estimatedCost) : null,
  });

  revalidatePath("/recipes");

  return {};
}


export async function deleteRecipe(id: string): Promise<{ error?: string }> {
  if (!/^[\w-]{1,64}$/.test(String(id))) return { error: "Invalid recipe id." };
 
  const failure = await removeRecipe(id).then(() => null, (e: Error) => e.message);
  if (failure) return { error: failure };
 
  revalidatePath("/recipes"); // change to this page's route
  return {};
}
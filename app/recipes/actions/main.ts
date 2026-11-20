
"use server";

import { revalidatePath } from "next/cache";
import type { RecipeFormValues, RecipeImageChange } from "@/types/Recipies/main";
import { clearRecipeImage, removeRecipe, setRecipeImage, upsertRecipe } from "@/app/recipes/store/main";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Validate and save a recipe, then apply the photo change (if any)
export async function saveRecipe(id: string, v: RecipeFormValues, image: RecipeImageChange = null) {
  if (!/^[\w-]{1,64}$/.test(String(id))) return { error: "Invalid recipe id." };

  // Check the photo before writing anything
  const file = image instanceof FormData ? image.get("file") : null;
  if (image instanceof FormData) {
    if (!(file instanceof File) || !file.size) return { error: "Choose an image file." };
    if (!IMAGE_TYPES.includes(file.type)) return { error: "Use a JPG, PNG or WebP image." };
    if (file.size > MAX_IMAGE_BYTES) return { error: "Image must be 5 MB or smaller." };
  }

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

  // Recipe is saved; a failed upload is reported but doesn't undo it
  try {
    if (file instanceof File) await setRecipeImage(id, file);
    if (image === "remove") await clearRecipeImage(id);
  } catch (e) {
    revalidatePath("/recipes");
    return { error: `Recipe saved, but the photo failed: ${e instanceof Error ? e.message : "unknown error"}` };
  }

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
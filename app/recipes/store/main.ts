import "server-only";
import { createClient } from "@/lib/supabase/server"; // adjust to your server client path
import type { Recipe, RecipeFormValues } from "@/types/Recipies/main";

// Public Storage bucket for recipe photos; files live under <user_id>/
export const IMAGE_BUCKET = "recipe-images";

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

  const { data: row } = await supabase.from("recipes").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("recipes").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  await deleteFiles(supabase, row?.image_url);
}

// Public URL -> path inside the bucket
function pathOf(url: string) {
  const marker = `/${IMAGE_BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

// Best-effort removal of old photo files
async function deleteFiles(supabase: Awaited<ReturnType<typeof createClient>>, urls?: string[] | null) {
  const paths = (urls ?? []).map(pathOf).filter((p): p is string => !!p);
  if (paths.length) await supabase.storage.from(IMAGE_BUCKET).remove(paths);
}

// Upload a photo and make it the recipe's cover, replacing the old one
export async function setRecipeImage(id: string, file: File) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  const { data: row, error: readError } = await supabase
    .from("recipes").select("image_url").eq("id", id).eq("user_id", user.id).maybeSingle();
  if (readError) throw new Error(readError.message);
  if (!row) throw new Error("Recipe not found.");

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const path = `${user.id}/${id}-${Date.now()}.${ext}`;
  const { error: upError } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, { contentType: file.type });
  if (upError) throw new Error(`Upload failed: ${upError.message}`);

  const { data: { publicUrl } } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  const { error } = await supabase.from("recipes").update({ image_url: [publicUrl] }).eq("id", id).eq("user_id", user.id);
  if (error) {
    await supabase.storage.from(IMAGE_BUCKET).remove([path]);
    throw new Error(error.message);
  }
  await deleteFiles(supabase, row.image_url);
}

// Remove the recipe's photo
export async function clearRecipeImage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You need to be signed in.");

  const { data: row } = await supabase.from("recipes").select("image_url").eq("id", id).eq("user_id", user.id).maybeSingle();
  const { error } = await supabase.from("recipes").update({ image_url: null }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  await deleteFiles(supabase, row?.image_url);
}
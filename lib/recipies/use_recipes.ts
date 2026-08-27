"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Recipe, Ingredient, MealType, Difficulty } from "../../types/Recipies/main";

const supabase = createClient();

export type RecipeInput = {
  title: string;
  notes: string;
  mealType: MealType;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  cookMinutes: number;
  needsOvernightRest: boolean;
  servings: number | null;
  imageUrl?: string[]; // real Supabase Storage public URLs, persisted in image_url (jsonb)
  date: string;
};

function toRecipe(r: any): Recipe {
  return {
    id: r.id,
    title: r.title,
    notes: r.notes ?? "",
    mealType: r.meal_type as MealType,
    difficulty: r.difficulty as Difficulty,
    ingredients: (r.ingredients ?? []) as Ingredient[],
    cookMinutes: r.cook_minutes ?? 0,
    needsOvernightRest: r.needs_overnight_rest ?? false,
    servings: r.servings ?? null,
    imageUrl: (r.image_url ?? []) as string[],
    date: r.date,
    createdAt: r.created_at,
  };
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRecipeIds, setPendingRecipeIds] = useState<Set<string>>(new Set());

  const setPending = (id: string, isPending: boolean) =>
    setPendingRecipeIds((prev) => {
      const next = new Set(prev);
      isPending ? next.add(id) : next.delete(id);
      return next;
    });

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) setRecipes(data.map(toRecipe));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function addRecipe(input: RecipeInput): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(input)
    if (!user) return;
    
    const tempId = crypto.randomUUID();
    const optimistic: Recipe = { id: tempId, ...input, createdAt: new Date().toISOString() };

    setPending(tempId, true);
    setRecipes((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from("recipes")
      .insert({
        user_id: user.id,
        title: input.title,
        notes: input.notes,
        meal_type: input.mealType,
        difficulty: input.difficulty,
        ingredients: input.ingredients,
        cook_minutes: input.cookMinutes,
        needs_overnight_rest: input.needsOvernightRest,
        servings: input.servings,
        image_url: input.imageUrl ?? [],
        date: input.date,
      })
      .select()
      .single();

    if (error || !data) {
      setRecipes((prev) => prev.filter((r) => r.id !== tempId));
      setPending(tempId, false);
      return;
    }

    setRecipes((prev) =>
      prev.map((r) => (r.id === tempId ? { ...r, id: data.id, createdAt: data.created_at } : r))
    );
    setPending(tempId, false);
  }

  async function updateRecipe(id: string, input: RecipeInput) {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...input } : r)));

    await supabase
      .from("recipes")
      .update({
        title: input.title,
        notes: input.notes,
        meal_type: input.mealType,
        difficulty: input.difficulty,
        ingredients: input.ingredients,
        cook_minutes: input.cookMinutes,
        needs_overnight_rest: input.needsOvernightRest,
        servings: input.servings,
        image_url: input.imageUrl ?? [],
        date: input.date,
      })
      .eq("id", id);
  }

  async function deleteRecipe(id: string) {
    const recipeToDelete = recipes.find((r) => r.id === id);
    if (!recipeToDelete) return;

    const originalIndex = recipes.findIndex((r) => r.id === id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));

    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) {
      // Delete failed — restore the optimistically removed recipe
      setRecipes((prev) => {
        const restored = [...prev];
        restored.splice(originalIndex, 0, recipeToDelete);
        return restored;
      });
      console.error("Failed to delete recipe:", error);
    }
  }

  return { recipes, loading, pendingRecipeIds, addRecipe, updateRecipe, deleteRecipe };
}
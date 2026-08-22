"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MealType, Difficulty } from "@/types/Recipies/main";

const supabase = createClient();

export interface CookLogEntry {
  id: string;
  recipeId: string;
  cookedAt: string;
  recipe: {
    title: string;
    mealType: MealType;
    difficulty: Difficulty;
    imageUrl: string | null; // always null from DB today — see use_recipes.ts note
  };
}

function toCookLogEntry(r: any): CookLogEntry {
  return {
    id: r.id,
    recipeId: r.recipe_id,
    cookedAt: r.cooked_at,
    recipe: {
      title: r.recipes?.title ?? "Deleted recipe",
      mealType: r.recipes?.meal_type as MealType,
      difficulty: r.recipes?.difficulty as Difficulty,
      imageUrl: null,
    },
  };
}

export function useCookLog(limit = 10) {
  const [entries, setEntries] = useState<CookLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("cook_log")
      .select("id, recipe_id, cooked_at, recipes(title, meal_type, difficulty)")
      .order("cooked_at", { ascending: false })
      .limit(limit);

    if (!error && data) setEntries(data.map(toCookLogEntry));
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function logCooked(recipeId: string, recipeSnapshot: CookLogEntry["recipe"]) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tempId = crypto.randomUUID();
    const optimistic: CookLogEntry = {
      id: tempId,
      recipeId,
      cookedAt: new Date().toISOString(),
      recipe: recipeSnapshot,
    };

    // Newest first, capped at `limit` so the list doesn't grow unbounded in memory
    setEntries((prev) => [optimistic, ...prev].slice(0, limit));

    const { data, error } = await supabase
      .from("cook_log")
      .insert({ user_id: user.id, recipe_id: recipeId })
      .select()
      .single();

    if (error || !data) {
      setEntries((prev) => prev.filter((e) => e.id !== tempId));
      return;
    }

    setEntries((prev) =>
      prev.map((e) => (e.id === tempId ? { ...e, id: data.id, cookedAt: data.cooked_at } : e))
    );
  }

  return { entries, loading, logCooked };
}
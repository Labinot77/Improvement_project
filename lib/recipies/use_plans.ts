"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/types/Recipies/main";
import { MealPlan, MealPlanGenerateInput } from "@/types/Recipies/Plan";
import { generateWeeklyPlan } from "./generate";

const supabase = createClient();

function toMealPlan(row: any, entryRows: any[]): MealPlan {
  return {
    id: row.id,
    weekStart: row.week_start,
    budget: Number(row.budget),
    mealsPerDay: row.meals_per_day,
    totalCost: Number(row.total_cost),
    currency: row.currency ?? null,
    warnings: row.warnings ?? [],
    createdAt: row.created_at,
    entries: entryRows
      .filter((e) => e.plan_id === row.id)
      .map((e) => ({
        id: e.id,
        date: e.date,
        mealType: e.meal_type,
        slotIndex: e.slot_index,
        recipeId: e.recipe_id,
      })),
  };
}

export function useMealPlans() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchAll = useCallback(async () => {
    const { data: planRows, error: planErr } = await supabase
      .from("meal_plans")
      .select("*")
      .order("week_start", { ascending: false });

    if (planErr || !planRows) {
      console.error("Failed to fetch meal plans:", planErr);
      setLoading(false);
      return;
    }

    const planIds = planRows.map((p) => p.id);
    const { data: entryRows, error: entryErr } = await supabase
      .from("meal_plan_entries")
      .select("*")
      .in("plan_id", planIds.length > 0 ? planIds : ["00000000-0000-0000-0000-000000000000"]);

    if (entryErr) {
      console.error("Failed to fetch meal plan entries:", entryErr);
    }

    setPlans(planRows.map((row) => toMealPlan(row, entryRows ?? [])));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function generateAndSavePlan(
    recipes: Recipe[],
    input: MealPlanGenerateInput,
  ): Promise<MealPlan | null> {
    setGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error("Cannot save meal plan: no authenticated user.");
        return null;
      }

      const result = generateWeeklyPlan(recipes, input);

      const { data: planRow, error: planErr } = await supabase
        .from("meal_plans")
        .insert({
          user_id: user.id,
          week_start: input.weekStart,
          budget: input.budget,
          meals_per_day: input.mealsPerDay,
          total_cost: result.totalCost,
          currency: result.currency,
          warnings: result.warnings,
        })
        .select()
        .single();

      if (planErr || !planRow) {
        console.error("Failed to save meal plan:", planErr);
        return null;
      }

      if (result.entries.length > 0) {
        const { error: entriesErr } = await supabase.from("meal_plan_entries").insert(
          result.entries.map((e) => ({
            plan_id: planRow.id,
            date: e.date,
            meal_type: e.mealType,
            slot_index: e.slotIndex,
            recipe_id: e.recipeId,
          })),
        );

        if (entriesErr) {
          console.error("Failed to save meal plan entries:", entriesErr);
          // Roll back the orphaned plan row so we don't leave an empty plan behind.
          await supabase.from("meal_plans").delete().eq("id", planRow.id);
          return null;
        }
      }

      const newPlan = toMealPlan(
        planRow,
        result.entries.map((e, i) => ({
          id: `local-${i}`,
          plan_id: planRow.id,
          date: e.date,
          meal_type: e.mealType,
          slot_index: e.slotIndex,
          recipe_id: e.recipeId,
        })),
      );

      setPlans((prev) => [newPlan, ...prev]);
      return newPlan;
    } finally {
      setGenerating(false);
    }
  }

  async function deletePlan(id: string) {
    const planToDelete = plans.find((p) => p.id === id);
    if (!planToDelete) return;

    const originalIndex = plans.findIndex((p) => p.id === id);
    setPlans((prev) => prev.filter((p) => p.id !== id));

    const { error } = await supabase.from("meal_plans").delete().eq("id", id);

    if (error) {
      setPlans((prev) => {
        const restored = [...prev];
        restored.splice(originalIndex, 0, planToDelete);
        return restored;
      });
      console.error("Failed to delete meal plan:", error);
    }
  }

  return { plans, loading, generating, generateAndSavePlan, deletePlan };
}
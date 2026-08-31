"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import DefaultButton from "@/app/components/DefaultButton";
import { useRecipes } from "@/lib/recipies/use_recipes";
import { useMealPlans } from "@/lib/recipies/use_plans";
import { MealPlanSchedule } from "./MealPlanSchedule";
import { MealPlanFormModal } from "./MealPlanForm";

export default function MealPlanSection() {
  const { recipes } = useRecipes();
  const { plans, loading, generating, generateAndSavePlan, deletePlan } = useMealPlans();
  const [formOpen, setFormOpen] = useState(false);

  const recipesById = useMemo(() => new Map(recipes.map((r) => [r.id, r])), [recipes]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-100">Weekly meal plan</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Budget-aware schedules built from your saved recipes
          </p>
        </div>
        <DefaultButton
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
        >
          <Sparkles className="size-3.5" />
          Generate
        </DefaultButton>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-600 py-6 text-center">Loading plans…</p>
      ) : plans.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0b0b0b] px-4 py-8 text-center">
          <p className="text-sm text-zinc-500">No meal plans yet.</p>
          <p className="text-xs text-zinc-600 mt-1">
            Set a budget and generate your first week.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {plans.map((plan) => (
            <MealPlanSchedule
              key={plan.id}
              plan={plan}
              recipesById={recipesById}
              onDelete={() => deletePlan(plan.id)}
            />
          ))}
        </div>
      )}

      <MealPlanFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        recipes={recipes}
        generating={generating}
        onGenerate={async (input) => {
          await generateAndSavePlan(recipes, input);
        }}
      />
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import DefaultButton from "@/app/components/DefaultButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Recipe, MealType } from "@/types/Recipies/main";
import { ALL_MEAL_TYPES, MEAL_META } from "@/constants/recipes";
import { formatDate } from "@/lib/mics/date";
import { MealPlanGenerateInput, RepeatLimits } from "@/types/Recipies/Plan";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipes: Recipe[];
  generating: boolean;
  onGenerate: (input: MealPlanGenerateInput) => Promise<void>;
}

function nextMonday(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sun
  const diff = day === 1 ? 0 : ((8 - day) % 7) || 7;
  d.setDate(d.getDate() + (day === 1 ? 0 : diff));
  return formatDate(d);
}

export function MealPlanFormModal({ open, onOpenChange, recipes, generating, onGenerate }: Props) {
  const [budget, setBudget] = useState("60");
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([
    "Breakfast",
    "Lunch",
    "Dinner",
  ]);
  const [repeatLimits, setRepeatLimits] = useState<RepeatLimits>({});
  const [weekStart, setWeekStart] = useState(nextMonday());

  // Only meal types that actually have recipes can be offered as slots.
  const availableMealTypes = useMemo(
    () => ALL_MEAL_TYPES.filter((mt) => recipes.some((r) => r.mealType === mt)),
    [recipes],
  );

  function toggleMealType(mt: MealType) {
    setSelectedMealTypes((prev) =>
      prev.includes(mt) ? prev.filter((m) => m !== mt) : [...prev, mt],
    );
  }

  // Repeat limit editing is per-recipe. Show recipes matching selected meal types.
  const relevantRecipes = useMemo(
    () => recipes.filter((r) => selectedMealTypes.includes(r.mealType)),
    [recipes, selectedMealTypes],
  );

  function setLimit(recipeId: string, value: number) {
    setRepeatLimits((prev) => ({ ...prev, [recipeId]: Math.max(0, value) }));
  }

  const isReady = selectedMealTypes.length > 0 && Number(budget) > 0 && mealsPerDay > 0;

  async function handleGenerate() {
    if (!isReady) return;
    await onGenerate({
      weekStart,
      budget: Number(budget),
      mealsPerDay,
      mealTypes: selectedMealTypes,
      repeatLimits,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] w-full lg:max-w-lg min-w-[90dvw] lg:min-w-0 flex-col gap-0 overflow-hidden
          rounded-2xl border border-white/[0.08] bg-zinc-950 p-0 shadow-2xl"
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0 border-b border-white/[0.06] px-6 py-4">
          <div className="text-left">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-zinc-100">
              <Sparkles className="size-4 text-amber-500" />
              Generate weekly plan
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-0.5">
              Set your budget and meal structure — we'll build the week
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            disabled={generating}
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Week start + budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
                Week starting
              </p>
              <Input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="border border-white/[0.08] bg-[#161616] text-sm text-zinc-100"
              />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
                Weekly budget
              </p>
              <Input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 60"
                className="border border-white/[0.08] bg-[#161616] text-sm text-zinc-100"
              />
            </div>
          </div>

          {/* Meals per day */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
              Meals per day
            </p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setMealsPerDay(n)}
                  className="flex-1 rounded-lg border py-1.5 text-sm font-medium transition-all"
                  style={{
                    borderColor: mealsPerDay === n ? "#f59e0b" : "rgba(255,255,255,0.06)",
                    background: mealsPerDay === n ? "rgba(245,158,11,0.15)" : "transparent",
                    color: mealsPerDay === n ? "#f59e0b" : "#71717a",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Meal types to fill */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
              Which meal types to schedule
            </p>
            {availableMealTypes.length === 0 ? (
              <p className="text-xs text-zinc-600">
                No recipes yet — add recipes with a meal type before generating a plan.
              </p>
            ) : (
              <div className="flex gap-1.5 flex-wrap">
                {availableMealTypes.map((mt) => {
                  const selected = selectedMealTypes.includes(mt);
                  return (
                    <button
                      key={mt}
                      onClick={() => toggleMealType(mt)}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all"
                      style={{
                        borderColor: selected ? MEAL_META[mt].color : "rgba(255,255,255,0.06)",
                        background: selected ? `${MEAL_META[mt].color}20` : "transparent",
                        color: selected ? MEAL_META[mt].color : "#52525b",
                      }}
                    >
                      {MEAL_META[mt].icon} {mt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Per-recipe repeat limits */}
          {relevantRecipes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                  Repeat limits this week
                </p>
                <span className="text-[11px] text-zinc-600">defaults to 1x if unset</span>
              </div>
              <div className="flex flex-col gap-1 max-h-52 overflow-y-auto rounded-lg border border-white/[0.06] p-2">
                {relevantRecipes.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-3 px-1.5 py-1.5 rounded-md hover:bg-white/[0.03]"
                  >
                    <span className="text-sm text-zinc-300 truncate min-w-0">{r.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setLimit(r.id, (repeatLimits[r.id] ?? 1) - 1)}
                        className="size-6 rounded-md border border-white/[0.08] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm text-zinc-200 tabular-nums">
                        {repeatLimits[r.id] ?? 1}
                      </span>
                      <button
                        onClick={() => setLimit(r.id, (repeatLimits[r.id] ?? 1) + 1)}
                        className="size-6 rounded-md border border-white/[0.08] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
                      >
                        <Plus className="size-3 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end border-t border-white/[0.06] px-6 py-4">
          <DefaultButton
            variant="ghost"
            disabled={generating}
            onClick={() => onOpenChange(false)}
            className="text-zinc-500 hover:text-zinc-200"
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            onClick={handleGenerate}
            disabled={!isReady || generating}
            className="flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 disabled:opacity-40"
          >
            <Sparkles className="size-3.5" />
            {generating ? "Generating…" : "Generate plan"}
          </DefaultButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
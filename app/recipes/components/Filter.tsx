"use client";

import { useMemo, useState } from "react";
import { X, Moon, Search, Check } from "lucide-react";
import type { Recipe, RecipeFilters } from "@/types/Recipies/main";
import { EMPTY_RECIPE_FILTERS } from "@/types/Recipies/main";
import { ALL_MEAL_TYPES, MEAL_META } from "@/constants/recipes";
import { Input } from "@/components/ui/input";
import DefaultButton from "@/app/components/DefaultButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/providers/Modalprovider";

interface Props {
  onOpenChange: (open: boolean) => void;
  value: RecipeFilters;
  onApply: (value: RecipeFilters) => void;
  recipes: Recipe[]; // used to derive the list of ingredients actually in use
}

/**
 * CONTENT ONLY — no Dialog wrapper. ModalProvider wraps this in
 * <ResponsiveModal> (Dialog on desktop, Drawer on mobile), the same way
 * it wraps RecipeForm.
 *
 * Note: unlike RecipeForm, apply()/clear() here are synchronous today, so
 * setDismissLocked never actually blocks a close in practice. It's wired
 * in anyway to match the provider's convention and to make this safe by
 * default if apply/clear ever become async (e.g. persisting filters).
 */
export function RecipeFilterModal({ onOpenChange, value, onApply, recipes }: Props) {
  const { setDismissLocked } = useModal();
  const { close } = useModal();

  const [draft, setDraft] = useState<RecipeFilters>(value);
  const [ingredientSearch, setIngredientSearch] = useState("");

  // Unique ingredient names across every saved recipe, so the list only ever
  // shows ingredients that actually exist in the user's dishes.
  const availableIngredients = useMemo(() => {
    const names = new Set<string>();
    for (const r of recipes) {
      for (const ing of r.ingredients) {
        const trimmed = ing.name.trim();
        if (trimmed) names.add(trimmed);
      }
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [recipes]);

  const visibleIngredients = useMemo(() => {
    const q = ingredientSearch.trim().toLowerCase();
    if (!q) return availableIngredients;
    return availableIngredients.filter((name) => name.toLowerCase().includes(q));
  }, [availableIngredients, ingredientSearch]);

  function toggleIngredient(name: string) {
    setDraft((d) => ({
      ...d,
      ingredients: d.ingredients.includes(name)
        ? d.ingredients.filter((i) => i !== name)
        : [...d.ingredients, name],
    }));
  }

  function apply() {
    setDismissLocked(true);
    try {
      onApply(draft);
    } finally {
      setDismissLocked(false);
      onOpenChange(false); 
    }
  }

function clear() {
  setDismissLocked(true);
  try {
    setDraft(EMPTY_RECIPE_FILTERS);
    onApply(EMPTY_RECIPE_FILTERS);
  } finally {
    setDismissLocked(false);
    onOpenChange(false); 
  }
}

  return (
    <div
      className="flex flex-col gap-0 overflow-hidden w-full"
    >
      <div className="flex flex-row items-center justify-between border-b border-white/[0.06] px-6 py-4">
        <div className="text-left">
          <h2 className="text-base font-semibold text-zinc-100">Filter recipes</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Meal type, timing &amp; ingredients</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-6 py-5 max-h-[70vh] overflow-y-auto">
        {/* Meal type dropdown */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
            Meal type
          </p>
          <Select
            value={draft.mealType}
            onValueChange={(v) =>
              setDraft((d) => ({ ...d, mealType: v as RecipeFilters["mealType"] }))
            }
          >
            <SelectTrigger
              className="w-full border border-white/[0.08] text-sm text-zinc-100
                focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            >
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border border-white/[0.08]">
              <SelectItem value="All">All</SelectItem>
              {ALL_MEAL_TYPES.map((m) => (
                <SelectItem key={m} value={m}>
                  <span style={{ color: MEAL_META[m].color }}>
                    {MEAL_META[m].icon} {m}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Overnight rest */}
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
            Timing
          </p>
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, overnightOnly: !d.overnightOnly }))}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all w-fit ${
              draft.overnightOnly
                ? "border-indigo-400/30 bg-indigo-400/10 text-indigo-400"
                : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Moon className="size-3.5" />
            Needs overnight rest
          </button>
        </div>

        {/* Ingredients — searchable, selectable list, only what's actually used */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
              Ingredients
            </p>
            {draft.ingredients.length > 0 && (
              <button
                type="button"
                onClick={() => setDraft((d) => ({ ...d, ingredients: [] }))}
                className="text-[11px] font-medium text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                Clear ({draft.ingredients.length})
              </button>
            )}
          </div>

          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
            <Input
              value={ingredientSearch}
              onChange={(e) => setIngredientSearch(e.target.value)}
              placeholder="Search ingredients…"
              className="w-full border border-white/[0.08] pl-8 pr-3 py-2 text-sm text-zinc-100
                placeholder-zinc-600 focus:outline-none focus:border-amber-500/50
                focus:ring-1 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {availableIngredients.length === 0 ? (
            <p className="text-xs text-zinc-600 py-2">
              No ingredients yet — add some recipes first.
            </p>
          ) : visibleIngredients.length === 0 ? (
            <p className="text-xs text-zinc-600 py-2">No ingredients match "{ingredientSearch}".</p>
          ) : (
            <div className="flex flex-col gap-0.5 max-h-44 overflow-y-auto rounded-lg border border-white/[0.06]">
              {visibleIngredients.map((name) => {
                const selected = draft.ingredients.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleIngredient(name)}
                    className={`flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${
                      selected
                        ? "bg-amber-500/10 text-amber-500"
                        : "text-zinc-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    {name}
                    {selected && <Check className="size-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-between border-t border-white/[0.06] px-6 py-4">
        <DefaultButton
          type="button"
          variant="ghost"
          onClick={clear}
          className="text-zinc-500 hover:text-zinc-200"
        >
          Clear all
        </DefaultButton>
        <DefaultButton
          type="button"
          onClick={apply}
          className="border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
        >
          Apply filters
        </DefaultButton>
      </div>
    </div>
  );
}
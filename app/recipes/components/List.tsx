"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LayersPlus, Moon } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { Input } from "@/components/ui/input";
import { RecipeCard } from "./Card";
import {
  Recipe,
  RecipeFilters,
  EMPTY_RECIPE_FILTERS,
} from "@/types/Recipies/main";
import { MEAL_META } from "@/constants/recipes";
import { Button } from "@/components/ui/button";
import type { RecipeFormValues } from "./modal/Form";
import RecipeSkeleton from "./Card_skeleton";
import { useRecipes } from "@/lib/recipies/use_recipes";

interface Props {
  recipes: Recipe[];
  onAdd: (values: RecipeFormValues) => void;
  loading: boolean;
  onUpdate: (id: string, values: RecipeFormValues) => void;
  onDelete: (id: string) => void;
  pendingRecipeIds: Set<string>;
}

export function RecipeList({}) {
  const { recipes, saveRecipe, loading, updateRecipe, deleteRecipe, pendingRecipeIds } = useRecipes();
  // const { recipes, pendingRecipeIds, updateRecipe, deleteRecipe, addRecipe} = useRecipes(initialRecipies)
  const { open } = useModal();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_RECIPE_FILTERS);
  
  const hasActiveFilters =
    filters.mealType !== "All" ||
    filters.overnightOnly ||
    filters.ingredients.length > 0;

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesMeal =
        filters.mealType === "All" || r.mealType === filters.mealType;
      const matchesOvernight = !filters.overnightOnly || r.needsOvernightRest;
      // ALL selected ingredients must be present in the recipe
      const recipeIngredientNames = r.ingredients.map((i) =>
        i.name.toLowerCase(),
      );
      const matchesIngredients =
        filters.ingredients.length === 0 ||
        filters.ingredients.every((sel) =>
          recipeIngredientNames.includes(sel.toLowerCase()),
        );
      const matchesSearch =
        !search.trim() ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.notes.toLowerCase().includes(search.toLowerCase());
      return (
        matchesMeal && matchesOvernight && matchesIngredients && matchesSearch
      );
    });
  }, [recipes, filters, search]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={() =>
            open("recipe_filter", {
              value: filters,
              onApply: setFilters,
              recipes,
            })
          }
          className="border border-white/[0.08] text-zinc-500 hover:text-zinc-200"
        >
          Filter
        </Button>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-600" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="w-full border border-white/[0.08] pl-8 pr-3 py-2
              text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none
              focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          {search.length !== 0 && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Button
          onClick={() =>
            open("recipe_form", {
              recipe: undefined,
              onSave: saveRecipe,
            })
          }
          className="border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
        >
          <LayersPlus className="size-4" />
        </Button>
      </div>

      {/* Active filters */}
      <div className="flex gap-1.5 flex-wrap min-h-[30px]">
  {hasActiveFilters && (
    <>
      {filters.mealType !== "All" && (
        <button
          onClick={() => setFilters((f) => ({ ...f, mealType: "All" }))}
          className="flex items-center gap-1.5 rounded-full pl-2.5 pr-1.5 py-1 text-xs font-medium border transition-all"
          style={{
            borderColor: MEAL_META[filters.mealType].color,
            background: `${MEAL_META[filters.mealType].color}20`,
            color: MEAL_META[filters.mealType].color,
          }}
        >
          {MEAL_META[filters.mealType].icon} {filters.mealType}
          <X className="size-3" />
        </button>
      )}
      {filters.overnightOnly && (
        <button
          onClick={() =>
            setFilters((f) => ({ ...f, overnightOnly: false }))
          }
          className="flex items-center gap-1.5 rounded-full pl-2.5 pr-1.5 py-1 text-xs font-medium border
            border-indigo-400/30 bg-indigo-400/10 text-indigo-400 transition-all"
        >
          <Moon className="size-3" /> Overnight
          <X className="size-3" />
        </button>
      )}
      {filters.ingredients.map((name) => (
        <button
          key={name}
          onClick={() =>
            setFilters((f) => ({
              ...f,
              ingredients: f.ingredients.filter((i) => i !== name),
            }))
          }
          className="flex items-center gap-1.5 rounded-full pl-2.5 pr-1.5 py-1 text-xs font-medium border
            border-amber-500/30 bg-amber-500/10 text-amber-500 transition-all"
        >
          {name}
          <X className="size-3" />
        </button>
      ))}
    </>
  )}
</div>

      <motion.div
        layoutScroll
        layout
        className="grid grid-cols-1 xl:grid-cols-2 gap-3 h-[70dvh] overflow-y-auto content-start pr-1"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {loading ? (
            <>
              <RecipeSkeleton />
              <RecipeSkeleton />
              <RecipeSkeleton />
            </>
          ) : filtered.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-sm text-zinc-600 py-12 text-center"
            >
              {search || hasActiveFilters
                ? "No recipes match your filter."
                : "No recipes yet — add your first one."}
            </motion.p>
          ) : (
            filtered.map((recipe) =>
              pendingRecipeIds.has(recipe.id) ? (
                <RecipeSkeleton key={recipe.id} />
              ) : (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 25, scale: 0.5 }}
                  transition={{ duration: 0.25 }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={() =>
                      open("recipe_preview", {
                        recipe,
                        onSave: (id: string, values: RecipeFormValues) =>
                          updateRecipe(id, values),
                      })
                    }
                    onDelete={() => deleteRecipe(recipe.id)}
                  />
                </motion.div>
              ),
            )
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

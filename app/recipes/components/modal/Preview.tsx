"use client";

import { useState } from "react";
import { Clock, Moon, X, Pencil, ImageIcon, ChefHat, Check, Users } from "lucide-react";
import type { Recipe } from "@/types/Recipies/main";
import { MEAL_META, DIFFICULTY_META } from "@/constants/recipes";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import DefaultButton from "@/app/components/DefaultButton";
import { useModal } from "@/providers/Modalprovider";
import type { RecipeFormValues } from "./Form";
import { useCookLog } from "@/lib/recipies/RecentlyCooked";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
  onSave: (id: string, values: RecipeFormValues) => void;
}

function formatMinutes(mins: number) {
  if (mins <= 0) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function RecipePreviewModal({ open, onOpenChange, recipe, onSave }: Props) {
  const { open: openModal } = useModal();
  const { logCooked } = useCookLog();
  const [justMade, setJustMade] = useState(false);
  const [logging, setLogging] = useState(false);
  const meal = MEAL_META[recipe.mealType];
  const difficulty = DIFFICULTY_META[recipe.difficulty];
  const totalLabel = formatMinutes(recipe.cookMinutes);
  const hasIngredients = recipe.ingredients.length > 0;

  async function handleMade() {
    if (logging || justMade) return;
    setLogging(true);
    await logCooked(recipe.id, {
      title: recipe.title,
      mealType: recipe.mealType,
      difficulty: recipe.difficulty,
      imageUrl: recipe.imageUrl?.[0] ?? null,
    });
    setLogging(false);
    setJustMade(true);
    setTimeout(() => setJustMade(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] w-full lg:max-w-2xl min-w-[90dvw] lg:min-w-0 flex-col gap-0 overflow-hidden
          rounded-2xl border border-white/[0.08] bg-zinc-950 p-0 shadow-2xl"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-1.5 text-zinc-200
            hover:bg-black/70 hover:text-white backdrop-blur-sm transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex gap-5 px-6 pt-6 pb-5">
            <div className="relative size-28 sm:size-52 shrink-0 overflow-hidden rounded-2xl bg-white/[0.03] flex items-center justify-center">
              {recipe.imageUrl?.[0] ? (
                <img
                  src={recipe.imageUrl[0]}
                  alt={recipe.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="size-8 text-zinc-700" />
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
              <div>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border"
                  style={{
                    borderColor: meal.color,
                    background: `${meal.color}20`,
                    color: meal.color,
                  }}
                >
                  {meal.icon} {recipe.mealType}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-zinc-100 leading-tight pr-8 border-b border-white/[0.08] -mb-0.5 break-words">
                {recipe.title}
              </h2>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
                  Difficulty
                </p>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border"
                  style={{
                    borderColor: difficulty.color,
                    background: `${difficulty.color}20`,
                    color: difficulty.color,
                  }}
                >
                  {difficulty.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                {totalLabel && (
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-400 bg-white/[0.04]">
                    <Clock className="size-3" /> {totalLabel}
                  </span>
                )}
                {recipe.servings && (
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-400 bg-white/[0.04]">
                    <Users className="size-3" /> {recipe.servings}
                  </span>
                )}
                {recipe.needsOvernightRest && (
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-indigo-400 bg-indigo-400/10">
                    <Moon className="size-3" /> Overnight
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {recipe.notes && (
            <div className="px-6 pb-5 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-2">
                Notes
              </p>
              <div className="border-l-2 border-white/[0.08] pl-3 min-w-0">
                <p className="text-sm text-zinc-400 leading-relaxed min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                  {recipe.notes}
                </p>
              </div>
            </div>
          )}

          {/* Ingredients — matches RecipeForm's row layout, read-only */}
          {hasIngredients && (
            <div className="border-t border-white/[0.06] px-6 py-5 min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-2">
                Ingredients
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 min-w-0">
                {recipe.ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center justify-between gap-2 border-b border-white/[0.04] py-1.5 min-w-0"
                  >
                    <span className="text-sm text-zinc-300 truncate min-w-0">{ing.name}</span>
                    <span className="text-sm text-zinc-500 shrink-0">{ing.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end border-t border-white/[0.06] px-6 py-4">
          <DefaultButton
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-500 hover:text-zinc-200"
          >
            Close
          </DefaultButton>
          <DefaultButton
            type="button"
            onClick={handleMade}
            disabled={logging}
            className={`flex items-center gap-1.5 border transition-all ${
              justMade
                ? "border-green-500/30 bg-green-500/10 text-green-400"
                : "border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
            }`}
          >
            {justMade ? <Check className="size-3.5" /> : <ChefHat className="size-3.5" />}
            {justMade ? "Logged" : logging ? "Logging…" : "Made"}
          </DefaultButton>
          <DefaultButton
            type="button"
            onClick={() => {
              openModal("recipe_form", { recipe, onSave });
            }}
            className="flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
          >
            <Pencil className="size-3.5" /> Edit
          </DefaultButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
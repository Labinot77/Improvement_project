"use client";

import { Clock, Moon, Trash2, ImageIcon } from "lucide-react";
import type { Recipe } from "@/types/Recipies/main";
import { MEAL_META, DIFFICULTY_META } from "@/constants/recipes";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/Modalprovider";

interface Props {
  recipe: Recipe;
  onClick: () => void;
  onDelete: () => void;
}

function formatMinutes(mins: number) {
  if (mins <= 0) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function RecipeCard({ recipe, onClick, onDelete }: Props) {
  const meal = MEAL_META[recipe.mealType];
  const difficulty = DIFFICULTY_META[recipe.difficulty];
  const totalLabel = formatMinutes(recipe.cookMinutes);
  const { open } = useModal();
  const previewIngredients = recipe.ingredients.slice(0, 3);
  const remainingCount = recipe.ingredients.length - previewIngredients.length;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02]
        hover:border-white/[0.1] transition-all flex h-full min-h-40 overflow-hidden"
    >
      {/* Image / placeholder — left column, fills card height */}
      <div className="relative w-40 shrink-0 self-stretch bg-white/[0.03] flex items-center justify-center">
        {recipe.imageUrl?.[0] ? (
          <img
            src={recipe.imageUrl[0]}
            alt={recipe.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="size-7 text-zinc-700" />
        )}
      </div>

      <div className="px-4 py-3 flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ color: meal.color, background: `${meal.color}1a` }}
            >
              {meal.icon} {recipe.mealType}
            </span>
            {recipe.needsOvernightRest && (
              <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-indigo-400 bg-indigo-400/10">
                <Moon className="size-3" />
              </span>
            )}
          </div>
          <Button
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
            open("delete", {
              onConfirm() {
                onDelete();
              },
            }
            )}}
            className="text-zinc-600 hover:text-red-400 transition-colors shrink-0"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        <h3 className="text-sm font-medium text-zinc-100 line-clamp-2">{recipe.title}</h3>

        {previewIngredients.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {previewIngredients.map((ing) => (
              <span
                key={ing.id}
                className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[11px] text-zinc-400"
              >
                {ing.name}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[11px] text-zinc-600">
                +{remainingCount}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
          <span
            className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
            style={{ color: difficulty.color, background: `${difficulty.color}1a` }}
          >
            {difficulty.label}
          </span>
          {totalLabel && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" /> {totalLabel}
            </span>
          )}
          {recipe.servings && <span>{recipe.servings} servings</span>}
        </div>
      </div>
    </div>
  );
}
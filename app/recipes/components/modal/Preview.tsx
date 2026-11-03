"use client";

import { Pencil, Trash2, Utensils } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { cover, formatCost, formatTime } from "@/app/recipes/data/main";
import type { Recipe, RecipeFormValues } from "@/types/Recipies/main";

// Content only. The shell (PREVIEW_SHELL in the provider) draws the rounded panel and
// the built-in close button, so the header leaves room for it on the right.
interface RecipePreviewModalProps {
  recipe: Recipe;
  onSave: (id: string, values: RecipeFormValues) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-center">
      <p className="text-sm font-semibold capitalize">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[.12em] text-white/25">{label}</p>
    </div>
  );
}

export function RecipePreviewModal({ recipe, onSave, onDelete, onOpenChange }: RecipePreviewModalProps) {
  const { open, closeAll } = useModal();

  function edit() {
    onOpenChange(false); // close the preview, then open the form with the same onSave
    open("recipe_form", { recipe, onSave });
  }

  function remove() {
    open("confirm", {
      title: "Delete recipe?",
      description: "This can't be undone.",
      itemName: recipe.title,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: async () => {
        await onDelete(recipe.id);
        closeAll(); // closes the confirm dialog and this preview
      },
    });
  }

  const meta = [
    recipe.mealType,
    recipe.difficulty[0].toUpperCase() + recipe.difficulty.slice(1),
    recipe.needsOvernightRest ? "needs an overnight rest" : `ready in ${formatTime(recipe)}`,
  ].join(" · ");

  return (
    <div className="relative text-white">
      <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#55c487]/15 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-white/[0.07] p-5 pr-16">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#55c487]/10 text-[#72d9a0]">
          <Utensils className="h-[18px] w-[18px]" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold">{recipe.title}</h2>
          <p className="mt-0.5 truncate text-[10px] text-white/30">{meta}</p>
        </div>
      </div>

      <div className="max-h-[72vh] overflow-y-auto">
        {/* Cover */}
        <div className="relative h-56 overflow-hidden" style={cover(recipe)}>
          {!recipe.imageUrl?.[0] && (
            <div className="grid h-full place-items-center">
              <Utensils className="h-12 w-12 text-white/15" aria-hidden />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#191a1f] via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5">
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] text-white/80 backdrop-blur-md">
              {recipe.mealType}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-3 gap-2">
            <Stat value={formatTime(recipe)} label="Cook time" />
            <Stat value={formatCost(recipe) ?? "—"} label="Est. cost" />
            <Stat value={recipe.difficulty} label="Difficulty" />
          </div>

          <div className="mt-7 grid gap-8 sm:grid-cols-[.8fr_1.2fr]">
            <section>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Ingredients</h3>
                <span className="text-[10px] text-white/25">
                  {recipe.ingredients.length} {recipe.ingredients.length === 1 ? "item" : "items"}
                </span>
              </div>
              {recipe.ingredients.length === 0 ? (
                <p className="mt-4 text-xs text-white/30">No ingredients saved yet.</p>
              ) : (
                <div className="mt-4 divide-y divide-white/[0.06]">
                  {recipe.ingredients.map((i) => (
                    <div key={i.id} className="flex items-center justify-between gap-4 py-3 first:pt-0">
                      <div className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#55c487]" />
                        <span className="text-xs text-white/65">{i.name}</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-white/30">{i.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h3 className="text-sm font-semibold">Method</h3>
              <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="whitespace-pre-line text-sm leading-7 text-white/50">
                  {recipe.notes || "No method saved yet."}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-t border-white/[0.07] bg-black/10 px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={remove}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs text-red-300/70 transition hover:bg-red-400/10 hover:text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-2.5 text-xs text-white/40 hover:bg-white/[0.05]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={edit}
            className="flex items-center gap-2 rounded-xl bg-[#ecf7f0] px-4 py-2.5 text-xs font-semibold text-[#143522]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit recipe
          </button>
        </div>
      </footer>
    </div>
  );
}
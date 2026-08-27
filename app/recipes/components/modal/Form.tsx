"use client";

import { useState } from "react";
import { Plus, X, Moon, Clock, Users, ImageIcon, Upload, Loader2, Trash2 } from "lucide-react";
import type { MealType, Difficulty, Ingredient, Recipe } from "@/types/Recipies/main";
import { ALL_MEAL_TYPES, ALL_DIFFICULTIES, MEAL_META, DIFFICULTY_META } from "@/constants/recipes";
import { Input } from "@/components/ui/input";
import DefaultButton from "@/app/components/DefaultButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PhotoDropzone } from "../DropZone";

export type RecipeFormValues = {
  title: string;
  notes: string;
  mealType: MealType;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  cookMinutes: number;
  needsOvernightRest: boolean;
  servings: number | null;
  imageUrl?: string[];
  date: string;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe?: Recipe;
  onSave: (id: string, values: RecipeFormValues) => void;
}

const emptyIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  name: "",
  amount: "",
});

function formatMinutes(mins: number) {
  if (mins <= 0) return null;
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function RecipeForm({ open, onOpenChange, recipe, onSave }: Props) {
  const isEdit = !!recipe;
  const [draftId] = useState(() => recipe?.id ?? crypto.randomUUID());

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [notes, setNotes] = useState(recipe?.notes ?? "");
  const [mealType, setMealType] = useState<MealType>(recipe?.mealType ?? "Dinner");
  const [difficulty, setDifficulty] = useState<Difficulty>(recipe?.difficulty ?? "easy");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients?.length ? recipe.ingredients : [emptyIngredient()]
  );
  const [cookMinutes, setCookMinutes] = useState(recipe?.cookMinutes ?? 0);
  const [needsOvernightRest, setNeedsOvernightRest] = useState(
    recipe?.needsOvernightRest ?? false
  );
  const [servings, setServings] = useState<number | "">(recipe?.servings ?? "");
  const [date, setDate] = useState(recipe?.date ?? new Date().toISOString().slice(0, 10));
  const [imageUrls, setImageUrls] = useState<string[]>(recipe?.imageUrl ?? []);

  const totalLabel = formatMinutes(Number(cookMinutes) || 0);

  function updateIngredient(id: string, field: "name" | "amount", value: string) {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  }

  function addIngredientRow() {
    setIngredients((prev) => [...prev, emptyIngredient()]);
  }

  function removeIngredientRow(id: string) {
    setIngredients((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(draftId, {
      title: title.trim(),
      notes: notes.trim(),
      mealType,
      difficulty,
      ingredients: ingredients.filter((i) => i.name.trim()),
      cookMinutes: Number(cookMinutes) || 0,
      needsOvernightRest,
      servings: servings === "" ? null : Number(servings),
      imageUrl: imageUrls,
      date,
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[90vh] w-full lg:min-w-[45dvw] min-w-[85dvw] flex-col gap-0 overflow-hidden
          rounded-2xl border border-white/[0.08] bg-zinc-950 p-0 shadow-2xl"
      >
        <DialogHeader className="flex-row items-center justify-between space-y-0 border-b border-white/[0.06] px-6 py-4">
          <div className="text-left">
            <DialogTitle className="text-base font-semibold text-zinc-100">
              {isEdit ? "Edit recipe" : "New recipe"}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 mt-0.5">
              Ingredients, timing & notes
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
          >
            <X className="size-4" />
          </button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
          {/* Hero — photo placeholder IS the dropzone; meal type / title / difficulty / badges on the right */}
          <div className="flex gap-5 px-6 pt-6 pb-5">
          <PhotoDropzone recipeId={draftId} value={imageUrls} onChange={setImageUrls}>
  {(dropzone) => (
    <div
      {...dropzone.getRootProps()}
      className={`relative size-28 sm:size-52 shrink-0 overflow-hidden rounded-2xl
        bg-white/[0.03] flex items-center justify-center cursor-pointer select-none
        border-2 border-dashed transition-all group
        ${dropzone.isDragActive ? "border-amber-500/50 bg-amber-500/[0.05]" : "border-white/[0.06] hover:border-white/[0.14]"}
        ${dropzone.uploading ? "pointer-events-none" : ""}`}
    >
      <input {...dropzone.getInputProps()} />

      {imageUrls[0] && (
        <img
          src={imageUrls[0]}
          alt={title || "Recipe photo"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {dropzone.uploading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="size-6 text-white animate-spin" />
        </div>
      ) : imageUrls[0] ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
          <Upload className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-zinc-700 group-hover:text-zinc-500 transition-colors">
          <ImageIcon className="size-7" />
          <span className="text-[10px] font-medium">Add photo</span>
        </div>
      )}

      {imageUrls[0] && !dropzone.uploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dropzone.removeImage();
          }}
          className="absolute top-2 right-2 z-10 rounded-md bg-black/60 p-1.5 text-white
            transition-colors hover:bg-red-500/80"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )}
</PhotoDropzone>

            <div className="flex-1 min-w-0 flex flex-col gap-2 pt-1">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
                  Meal type
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {ALL_MEAL_TYPES.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMealType(m)}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition-all"
                      style={{
                        borderColor: mealType === m ? MEAL_META[m].color : "rgba(255,255,255,0.06)",
                        background: mealType === m ? `${MEAL_META[m].color}20` : "transparent",
                        color: mealType === m ? MEAL_META[m].color : "#52525b",
                      }}
                    >
                      {MEAL_META[m].icon} {m}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Recipe name — e.g. Sourdough loaf"
                className="w-full min-w-0 border-0 border-b border-white/[0.08] rounded-md bg-transparent px-1.5 pb-1.5
                  text-xl font-semibold text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-none
                  focus:border-amber-500/50 transition-all break-words"
              />

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5">
                  Difficulty
                </p>
                <div className="flex gap-1.5">
                  {ALL_DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className="rounded-full px-2.5 py-1 text-xs font-medium border transition-all"
                      style={{
                        borderColor:
                          difficulty === d ? DIFFICULTY_META[d].color : "rgba(255,255,255,0.06)",
                        background: difficulty === d ? `${DIFFICULTY_META[d].color}20` : "transparent",
                        color: difficulty === d ? DIFFICULTY_META[d].color : "#52525b",
                      }}
                    >
                      {DIFFICULTY_META[d].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                {totalLabel && (
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-400 bg-white/[0.04]">
                    <Clock className="size-3" /> {totalLabel}
                  </span>
                )}
                {servings !== "" && Number(servings) > 0 && (
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-zinc-400 bg-white/[0.04]">
                    <Users className="size-3" /> {servings}
                  </span>
                )}
                {needsOvernightRest && (
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-indigo-400 bg-indigo-400/10">
                    <Moon className="size-3" /> Overnight
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-6 pb-5 min-w-0">
            {/* Time + servings */}
            <div className="grid grid-cols-3 gap-3 min-w-0">
              <div className="min-w-0">
                <label className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5 block">
                  Cook (min)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={cookMinutes}
                  onChange={(e) => setCookMinutes(Number(e.target.value))}
                  className="w-full min-w-0 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100
                    focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
              <div className="min-w-0">
                <label className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-1.5 block">
                  Servings
                </label>
                <Input
                  type="number"
                  min={0}
                  value={servings}
                  onChange={(e) => setServings(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="—"
                  className="w-full min-w-0 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100
                    placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Overnight rest toggle */}
            <button
              type="button"
              onClick={() => setNeedsOvernightRest((v) => !v)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all w-fit ${
                needsOvernightRest
                  ? "border-indigo-400/30 bg-indigo-400/10 text-indigo-400"
                  : "border-white/[0.06] text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Moon className="size-3.5" />
              Needs to sit overnight
            </button>
          </div>

          {/* Notes */}
          <div className="px-6 pb-5 min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600 mb-2">
              Notes
            </p>
            <div className="border-l-2 border-white/[0.08] pl-3 min-w-0">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Method, tips, adjustments for next time…"
                rows={3}
                className="w-full min-w-0 bg-transparent text-sm text-zinc-400 leading-relaxed
                  placeholder-zinc-600 focus:outline-none resize-none break-words [overflow-wrap:anywhere]"
              />
            </div>
          </div>

          {/* Ingredients — editable rows styled exactly like the preview modal's <li> list */}
          <div className="border-t border-white/[0.06] px-6 py-5 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                Ingredients
              </p>
              <button
                type="button"
                onClick={addIngredientRow}
                className="flex items-center gap-1 text-xs font-medium text-amber-500 hover:text-amber-400 transition-colors"
              >
                <Plus className="size-3" /> Add ingredient
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 min-w-0">
              {ingredients.map((ing) => (
                <div
                  key={ing.id}
                  className="flex items-center gap-2 border-b border-white/[0.04] py-1.5 group min-w-0"
                >
                  <Input
                    value={ing.name}
                    onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                    placeholder="Ingredient — e.g. Flour"
                    className="flex-1 min-w-0 truncate border-0 bg-transparent px-0 py-0 text-sm text-zinc-300
                      placeholder-zinc-600 focus:outline-none"
                  />
                  <Input
                    value={ing.amount}
                    onChange={(e) => updateIngredient(ing.id, "amount", e.target.value)}
                    placeholder="Amount"
                    className="w-24 shrink-0 border-0 bg-transparent px-0 py-0 text-right text-sm text-zinc-500
                      placeholder-zinc-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(ing.id)}
                    className="shrink-0 text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-2 justify-end border-t border-white/[0.06] px-6 py-4">
          <DefaultButton
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-500 hover:text-zinc-200"
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            type="submit"
            onClick={handleSubmit}
            className="border border-amber-500/30 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
          >
            {isEdit ? "Save changes" : "Save recipe"}
          </DefaultButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
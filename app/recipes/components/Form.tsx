"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { DIFFICULTIES, MEAL_TYPES, dayKey } from "@/app/recipes/data/main";
import type { Difficulty, Ingredient, MealType, Recipe, RecipeFormValues, RecipeImageChange } from "@/types/Recipies/main";

const MAX_SIDE = 1600; // px, longest edge after resize
const ACCEPT = "image/jpeg,image/png,image/webp";

// Downscale to MAX_SIDE and re-encode as WebP so uploads stay small
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".webp", { type: "image/webp" });
}

// Content only: ResponsiveModal (from your provider) is the shell.
interface RecipeFormProps {
  recipe?: Recipe; // present = edit, absent = create
  onSave: (id: string, values: RecipeFormValues, image?: RecipeImageChange) => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-300/40 [color-scheme:dark]";
const label = "mb-1.5 block text-sm font-medium text-zinc-300";

export function RecipeForm({ recipe, onSave, onOpenChange }: RecipeFormProps) {
  const { setDismissLocked } = useModal();
  const editing = Boolean(recipe);

  const [title, setTitle] = useState(recipe?.title ?? "");
  const [mealType, setMealType] = useState<MealType>(recipe?.mealType ?? "Dinner");
  const [difficulty, setDifficulty] = useState<Difficulty>(recipe?.difficulty ?? "easy");
  const [cookMinutes, setCookMinutes] = useState(String(recipe?.cookMinutes ?? 30));
  const [overnight, setOvernight] = useState(recipe?.needsOvernightRest ?? false);
  const [servings, setServings] = useState(recipe?.servings?.toString() ?? "");
  const [date, setDate] = useState(recipe?.date ?? dayKey());
  const [cost, setCost] = useState(recipe?.estimatedCost?.toString() ?? "");
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients ?? []);
  const [notes, setNotes] = useState(recipe?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null); // new file to upload
  const [removed, setRemoved] = useState(false); // existing photo cleared
  const [preview, setPreview] = useState<string | null>(recipe?.imageUrl?.[0] ?? null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Free the object URL when it changes or the form closes
  useEffect(() => () => { if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  // Validate, shrink and preview a chosen file
  async function pick(file?: File | null) {
    if (!file) return;
    if (!ACCEPT.split(",").includes(file.type)) return setError("Use a JPG, PNG or WebP image.");
    if (file.size > 20 * 1024 * 1024) return setError("That image is too large (max 20 MB before resizing).");
    setError(null);
    try {
      const small = await shrink(file);
      setPhoto(small);
      setRemoved(false);
      setPreview(URL.createObjectURL(small));
    } catch {
      setError("Couldn't read that image.");
    }
  }

  // Clear the new or existing photo
  function clearPhoto() {
    setPhoto(null);
    setRemoved(Boolean(recipe?.imageUrl?.[0]));
    setPreview(null);
    if (fileInput.current) fileInput.current.value = "";
  }
  const [pending, startTransition] = useTransition();

  const updateIngredient = (id: string, patch: Partial<Ingredient>) =>
    setIngredients((list) => list.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  function submit() {
    const minutes = Number(cookMinutes);
    if (!title.trim()) return setError("Add a recipe name.");
    if (!minutes || minutes <= 0) return setError("Enter a cook time greater than 0.");
    setError(null);

    const values: RecipeFormValues = {
      title: title.trim(),
      notes,
      mealType,
      difficulty,
      ingredients: ingredients.filter((i) => i.name.trim()),
      cookMinutes: Math.round(minutes),
      needsOvernightRest: overnight,
      servings: servings.trim() ? Number(servings) : null,
      date,
      estimatedCost: cost.trim() ? Number(cost) : null,
    };

    startTransition(async () => {
      let saved = false;
      setDismissLocked(true); // block overlay click / Esc while saving
      try {
        let image: RecipeImageChange = null;
        if (photo) {
          image = new FormData();
          image.append("file", photo);
        } else if (removed) image = "remove";
        await onSave(recipe?.id ?? crypto.randomUUID(), values, image);
        saved = true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't save the recipe.");
      } finally {
        setDismissLocked(false); // always unlock, or the modal can't be closed
      }
      if (saved) onOpenChange(false);
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100">{editing ? "Edit recipe" : "Add recipe"}</h2>

      <div className="mt-5 max-h-[60dvh] space-y-5 overflow-y-auto px-0.5 pb-1">
        {/* Photo: click or drop to upload */}
        <div>
          <span className={label}>Photo</span>
          <input ref={fileInput} type="file" accept={ACCEPT} className="sr-only" id="r-photo"
            onChange={(e) => pick(e.target.files?.[0])} />
          {preview ? (
            <div className="group relative h-48 overflow-hidden rounded-2xl border border-white/10">
              <img src={preview} alt="Recipe photo preview" className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/70 to-transparent p-3">
                <label htmlFor="r-photo" className="cursor-pointer rounded-full bg-white/15 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/25">
                  Replace
                </label>
                <button type="button" onClick={clearPhoto} aria-label="Remove photo"
                  className="grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-red-500/60">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ) : (
            <label htmlFor="r-photo"
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0]); }}
              className={`flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-sm transition ${
                dragging ? "border-emerald-300/60 bg-emerald-300/10 text-emerald-200" : "border-white/15 text-zinc-500 hover:border-white/30 hover:text-zinc-300"
              }`}>
              <ImagePlus className="size-6" aria-hidden />
              <span>Click or drop a photo</span>
              <span className="text-xs text-zinc-600">JPG, PNG or WebP · resized automatically</span>
            </label>
          )}
        </div>

        <div>
          <label htmlFor="r-title" className={label}>Recipe name</label>
          <input id="r-title" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sheet-pan harissa chicken" className={field} autoFocus />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="r-meal" className={label}>Meal type</label>
            <select id="r-meal" value={mealType} onChange={(e) => setMealType(e.target.value as MealType)} className={field}>
              {MEAL_TYPES.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="r-diff" className={label}>Difficulty</label>
            <select id="r-diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className={`${field} capitalize`}>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="r-time" className={label}>Cook (min)</label>
            <input id="r-time" type="number" min={1} value={cookMinutes} onChange={(e) => setCookMinutes(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="r-serv" className={label}>Servings</label>
            <input id="r-serv" type="number" min={1} value={servings} onChange={(e) => setServings(e.target.value)} placeholder="–" className={field} />
          </div>
          <div>
            <label htmlFor="r-date" className={label}>Planned for</label>
            <input id="r-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
          </div>
        </div>

        <div>
          <label htmlFor="r-cost" className={label}>Estimated cost (€)</label>
          <input id="r-cost" type="number" min={0} step="0.01" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="e.g. 12.50" className={field} />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-zinc-300">
          <input type="checkbox" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} className="size-4 accent-emerald-300" />
          Needs an overnight rest
        </label>

        <div>
          <span className={label}>Ingredients</span>
          <div className="space-y-2">
            {ingredients.map((i) => (
              <div key={i.id} className="flex gap-2">
                <input aria-label="Amount" value={i.amount} onChange={(e) => updateIngredient(i.id, { amount: e.target.value })}
                  placeholder="200 g" className={`${field} w-28`} />
                <input aria-label="Ingredient" value={i.name} onChange={(e) => updateIngredient(i.id, { name: e.target.value })}
                  placeholder="White miso" className={field} />
                <button type="button" aria-label="Remove ingredient" onClick={() => setIngredients((l) => l.filter((x) => x.id !== i.id))}
                  className="grid size-10 shrink-0 place-items-center rounded-xl text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-200">
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setIngredients((l) => [...l, { id: crypto.randomUUID(), name: "", amount: "" }])}
            className="mt-2 flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200">
            <Plus className="size-4" /> Add ingredient
          </button>
        </div>

        <div>
          <label htmlFor="r-notes" className={label}>Notes</label>
          <textarea id="r-notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Steps, tips, swaps…" className={`${field} resize-y`} />
        </div>

        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={() => onOpenChange(false)} disabled={pending}
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] disabled:opacity-60">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={pending}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-60">
          {pending ? "Saving…" : editing ? "Save changes" : "Save recipe"}
        </button>
      </div>
    </div>
  );
}
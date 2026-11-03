"use client";

import type { ReactNode } from "react";
import type { Recipe } from "@/types/Recipies/main";
import { useRecipeModals } from "./UseRecipeModal";

interface RecipeButtonProps {
  mode: "preview" | "form"; // form without a recipe = create, with a recipe = edit
  recipe?: Recipe;
  className?: string;
  children: ReactNode;
}

// The only client piece the server page needs. `onSave` is a function, so it can't be
// passed from the server; this builds it on the client and calls your modal provider.
export function RecipeButton({ mode, recipe, className, children }: RecipeButtonProps) {
  const { openForm, openPreview } = useRecipeModals();

  return (
    <button
      type="button"
      className={className}
      onClick={() => (mode === "preview" && recipe ? openPreview(recipe) : openForm(recipe))}
    >
      {children}
    </button>
  );
}
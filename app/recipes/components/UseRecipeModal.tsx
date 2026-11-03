import { deleteRecipe, saveRecipe } from "@/app/recipes/actions/main";
import { useModal } from "@/providers/Modalprovider";
import type { Recipe, RecipeFormValues } from "@/types/Recipies/main";

// Same handlers for the form and the preview. Thrown errors are shown by the modals.
async function onSave(id: string, values: RecipeFormValues) {
  const res = await saveRecipe(id, values);
  if (res.error) throw new Error(res.error);
}

async function onDelete(id: string) {
  const res = await deleteRecipe(id);
  if (res.error) throw new Error(res.error);
}

export function useRecipeModals() {
  const { open } = useModal();
  return {
    openForm: (recipe?: Recipe) => open("recipe_form", { recipe, onSave }),
    openPreview: (recipe: Recipe) => open("recipe_preview", { recipe, onSave, onDelete }),
  };
}
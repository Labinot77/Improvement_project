"use client";

import { motion } from "framer-motion";
import PageHeader from "@/app/components/header/Header";
import SectionCard from "@/app/components/SectionCard";
import { ACCENT } from "@/constants/mental";
import { container, fadeIn, fadeUp } from "@/constants/animations";
import { RecipeList } from "./components/List";
import { useRecipes } from "@/lib/recipies/use_recipes";
import ShoppingList from "./components/ShoppingList";
import RecentlyCooked from "./components/RecentlyCooked";

// * Not sure if I should call useRecipes here or in the list file. 

export default function Recipes() {
  const { recipes, addRecipe, loading, updateRecipe, deleteRecipe, pendingRecipeIds } = useRecipes();

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader
            emoji="🍳"
            title="Food Recipes"
            subtitle="Ingredients, timing & notes"
            backHref="/"
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div variants={fadeUp} className="lg:col-span-9">
            <SectionCard className="lg:col-span-9" accentGlow={ACCENT}>
              <RecipeList
                recipes={recipes}
                onAdd={addRecipe}
                loading={loading}
                onUpdate={updateRecipe}
                onDelete={deleteRecipe}
                pendingRecipeIds={pendingRecipeIds}
              />
            </SectionCard>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-3 flex flex-col gap-5">
            <SectionCard accentGlow={ACCENT}>
              <ShoppingList />
            </SectionCard>

            <SectionCard accentGlow={ACCENT}>
              <RecentlyCooked />
            </SectionCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
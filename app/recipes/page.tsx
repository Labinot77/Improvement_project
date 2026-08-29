
import { motion } from "framer-motion";
import PageHeader from "@/app/components/header/Header";
import SectionCard from "@/app/components/SectionCard";
import { ACCENT } from "@/constants/mental";
import { container, fadeIn, fadeUp } from "@/constants/animations";
import { RecipeList } from "./components/List";
import ShoppingList from "./components/ShoppingList";
import RecentlyCooked from "./components/RecentlyCooked";
import { useRecipes } from "@/lib/recipies/use_recipes";
import { createClient } from "@/lib/supabase/server";
import { Recipe } from "@/types/Recipies/main";

// * Not sure if I should call useRecipes here or in the list file.

// TODO: Build my own algorithm for selecting foods to eat, during the week, based on my BUDGET and FILTERs - specific foods.
// TODO: Fix the lib structure but protect user data and load data from the server instead from user browser.

// function toRecipe(r: any): Recipe {
//   return {
//     id: r.id,
//     title: r.title,
//     notes: r.notes ?? "",
//     mealType: r.meal_type,
//     difficulty: r.difficulty,
//     ingredients: r.ingredients ?? [],
//     cookMinutes: r.cook_minutes ?? 0,
//     needsOvernightRest: r.needs_overnight_rest ?? false,
//     servings: r.servings ?? null,
//     imageUrl: r.image_url ?? [],
//     date: r.date,
//     createdAt: r.created_at,
//   };
// }

export default function Recipes() {
// const supabase = await createClient();

  // const { data, error } = await supabase
  //   .from("recipes")
  //   .select("*")
  //   .order("date", { ascending: false });

  // const initialRecipes: Recipe[] = !error && data ? data.map(toRecipe) : [];

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        {/* <motion.div initial="hidden" animate="show" variants={fadeIn}> */}
          <PageHeader
            emoji="🍳"
            title="Food Recipes"
            subtitle="Ingredients, timing & notes"
            backHref="/"
          />
        {/* </motion.div> */}

        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start"
          // initial="hidden"
          // animate="show"
          // variants={container}
        >
          <div 
          // variants={fadeUp} 
          className="lg:col-span-9">
            <SectionCard className="lg:col-span-9" accentGlow={ACCENT}>
              <RecipeList
              // initialRecipies={initialRecipes}
               />
            </SectionCard>
          </div>

          <div
            // variants={fadeUp}
            className="lg:col-span-3 flex flex-col gap-5"
          >
            <SectionCard accentGlow={ACCENT}>
              <ShoppingList />
            </SectionCard>

            <SectionCard accentGlow={ACCENT}>
              <RecentlyCooked />
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

import PageHeader from "@/app/components/header/Header";
import SectionCard from "@/app/components/SectionCard";
import { ACCENT } from "@/constants/mental";
import { RecipeList } from "./components/List";
import ShoppingList from "./components/ShoppingList";
import MealPlanSection from "./MealPlan";

export default function Recipes() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        {/* <PageHeader
          emoji="🍳"
          title="Food Recipes"
          subtitle="Ingredients, timing & notes"
          backHref="/"
        /> */}


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <SectionCard className="lg:col-span-9" accentGlow={ACCENT}>
              <RecipeList />
            </SectionCard>

          {/* <div className="lg:col-span-3 flex flex-col gap-5"> */}
            <SectionCard accentGlow={ACCENT} className="lg:col-span-3 flex flex-col gap-5">
              <ShoppingList />
            </SectionCard>
          {/* </div> */}

        
        {/* <SectionCard accentGlow={ACCENT} className="col-span-12">
          <MealPlanSection />
        </SectionCard> */}
        </div>
      </div>
    </div>
  );
}
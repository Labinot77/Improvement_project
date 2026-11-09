import { Clock, Utensils } from "lucide-react";
import { FILTERS, cover, dayKey, formatCost, formatTime, matchesFilter, weekday, type Filter } from "@/app/recipes/data/main";
import { getRecipes } from "@/app/recipes/store/main";
import { RecipeButton } from "@/app/recipes/components/Button";
import { FilterTabs } from "@/app/recipes/components/FilterTabs";
import { MotionItem, MotionList } from "@/app/recipes/Motion";

const focus = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50";

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
const { filter } = await searchParams;
const active: Filter = FILTERS.includes(filter as Filter)
  ? (filter as Filter)
  : "All recipes";

  const recipes = await getRecipes();
  const today = dayKey();

  const dinners = recipes.filter((r) => r.mealType === "Dinner");
  const featured = dinners.find((r) => r.date === today) ?? dinners[0];
  const visible = recipes.filter(
    (r) => r.id !== featured?.id && matchesFilter(r, active)
  );

  // Weekly plan = recipes planned for the next 7 days
  const plan = recipes
    .filter((r) => r.date >= today && r.date <= dayKey(7))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
      <main className="px-10 py-6">
        <p className="text-sm font-medium tracking-[0.3em] text-emerald-300">KITCHEN COLLECTION</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">Recipes</h1>
        <p className="mt-4 text-lg text-zinc-500">Save favorites, plan meals, and make healthy choices easier.</p>

        <FilterTabs active={active} />

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {featured && (
            <article
              className="flex min-h-[28rem] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 p-8 lg:col-span-7"
              style={cover(featured)}
            >
              <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">Tonight&apos;s pick</span>
              <div>
                <p className="text-lg text-zinc-300/80">{featured.mealType} · {formatTime(featured)}</p>
                <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-tight">{featured.title}</h2>
                <RecipeButton
                  mode="preview"
                  recipe={featured}
                  className={`mt-8 rounded-full bg-white px-7 py-3.5 text-base font-medium text-zinc-900 transition hover:bg-zinc-200 ${focus}`}
                >
                  View recipe
                </RecipeButton>
              </div>
            </article>
          )}

          <section
            aria-labelledby="plan-title"
            className={`rounded-[2rem] border border-white/10 bg-[#11131a] p-8 ${featured ? "lg:col-span-5" : "lg:col-span-12"}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 id="plan-title" className="text-xl font-semibold">Weekly plan</h2>
                <p className="mt-1.5 text-zinc-500">
                  {plan.length} {plan.length === 1 ? "meal" : "meals"} scheduled
                </p>
              </div>
              <Utensils className="size-6 text-emerald-300" aria-hidden />
            </div>

            {plan.length === 0 && (
              <p className="mt-8 rounded-2xl bg-white/[0.04] p-5 text-zinc-500">Nothing planned yet. Add a recipe with a date.</p>
            )}

            {/* <MotionList className="mt-8 flex flex-col gap-4">
              {plan.map((r) => (
                <MotionItem key={r.id}>
                  <RecipeButton
                    mode="preview"
                    recipe={r}
                    className={`flex w-full items-center gap-4 rounded-2xl bg-white/[0.045] p-4 text-left transition hover:bg-white/[0.07] ${focus}`}
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-300/10 text-sm font-semibold text-emerald-300">
                      {weekday(r.date)}
                    </span>
                    <span className="truncate text-lg text-zinc-200">{r.title}</span>
                  </RecipeButton>
                </MotionItem>
              ))}
            </MotionList> */}
          </section>
        </div>

        {visible.length === 0 && (
          <p className="mt-6 rounded-[2rem] border border-white/10 bg-[#11131a] p-10 text-center text-zinc-500">
            No recipes in this category yet.
          </p>
        )}

        <MotionList className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((r) => (
            <MotionItem key={r.id}>
              <RecipeButton
                mode="preview"
                recipe={r}
                className={`block w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#11131a] text-left transition hover:border-white/20 ${focus}`}
              >
                <div className="h-52" style={cover(r)} />
                <div className="p-6">
                  <p className="text-sm text-emerald-300">{r.mealType}</p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug">{r.title}</h3>
                  <p className="mt-4 flex items-center justify-between gap-2 text-zinc-500">
                    <span className="flex items-center gap-2">
                      <Clock className="size-4" aria-hidden /> {formatTime(r)}
                    </span>
                    {formatCost(r) && <span>{formatCost(r)}</span>}
                  </p>
                </div>
              </RecipeButton>
            </MotionItem>
          ))}
        </MotionList>
      </main>
  );
}
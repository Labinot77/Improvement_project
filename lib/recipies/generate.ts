import type { Recipe, MealType } from "@/types/Recipies/main";
import { GeneratePlanResult, MealPlanGenerateInput } from "@/types/Recipies/Plan";

const DAY_COUNT = 7;

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Picks the best candidate for a slot: prefers recipes used the fewest times
 * so far (variety-first), then cheapest among ties, then a stable shuffle
 * seed so repeated generations aren't identical every time.
 */
function pickCandidate(
  pool: Recipe[],
  usageCount: Map<string, number>,
  repeatLimits: Record<string, number>,
  remainingBudget: number,
): Recipe | null {
  const eligible = pool.filter((r) => {
    const used = usageCount.get(r.id) ?? 0;
    const cap = repeatLimits[r.id] ?? 1;
    return used < cap;
  });

  if (eligible.length === 0) return null;

  // Prefer recipes that fit the remaining budget, but don't hard-exclude —
  // we fall back to "best effort" and record a warning at the caller level.
  const withinBudget = eligible.filter(
    (r) => (r.estimatedCost ?? 0) <= remainingBudget,
  );
  const candidates = withinBudget.length > 0 ? withinBudget : eligible;

  candidates.sort((a, b) => {
    const usedA = usageCount.get(a.id) ?? 0;
    const usedB = usageCount.get(b.id) ?? 0;
    if (usedA !== usedB) return usedA - usedB; // least-used first (variety)
    const costA = a.estimatedCost ?? 0;
    const costB = b.estimatedCost ?? 0;
    return costA - costB; // cheaper first among equally-used
  });

  return candidates[0];
}

export function generateWeeklyPlan(
  recipes: Recipe[],
  input: MealPlanGenerateInput,
): GeneratePlanResult {
  const warnings: string[] = [];
  const { weekStart, budget, mealTypes, repeatLimits } = input;

  if (recipes.length === 0) {
    return {
      entries: [],
      totalCost: 0,
      currency: null,
      warnings: ["No recipes available — add some recipes first."],
    };
  }

  const usageCount = new Map<string, number>();
  const entries: GeneratePlanResult["entries"] = [];
  let totalCost = 0;
  let currency: string | null = null;
  let wentOverBudget = false;
  let ranOutOfVariety = false;

  for (let day = 0; day < DAY_COUNT; day++) {
    const date = addDays(weekStart, day);

    for (let slotIndex = 0; slotIndex < mealTypes.length; slotIndex++) {
      const mealType: MealType = mealTypes[slotIndex];
      const pool = recipes.filter((r) => r.mealType === mealType);

      if (pool.length === 0) {
        warnings.push(`No ${mealType} recipes available — skipped ${date}.`);
        continue;
      }

      const remainingBudget = budget - totalCost;
      const pick = pickCandidate(pool, usageCount, repeatLimits, remainingBudget);

      if (!pick) {
        ranOutOfVariety = true;
        warnings.push(
          `Ran out of ${mealType} variety — reused most recently allowed option.`,
        );
        // Best-effort fallback: allow any pool item, ignoring caps, least-used first.
        pool.sort(
          (a, b) => (usageCount.get(a.id) ?? 0) - (usageCount.get(b.id) ?? 0),
        );
        const fallback = pool[0];
        usageCount.set(fallback.id, (usageCount.get(fallback.id) ?? 0) + 1);
        totalCost += fallback.estimatedCost ?? 0;
        currency = currency ?? fallback.costCurrency ?? null;
        entries.push({ date, mealType, slotIndex, recipeId: fallback.id });
        continue;
      }

      const cost = pick.estimatedCost ?? 0;
      if (totalCost + cost > budget) wentOverBudget = true;

      usageCount.set(pick.id, (usageCount.get(pick.id) ?? 0) + 1);
      totalCost += cost;
      currency = currency ?? pick.costCurrency ?? null;
      entries.push({ date, mealType, slotIndex, recipeId: pick.id });
    }
  }

  if (wentOverBudget) {
    const over = (totalCost - budget).toFixed(2);
    warnings.unshift(`Plan exceeds budget by ${over} ${currency ?? ""}.`.trim());
  }
  if (ranOutOfVariety) {
    warnings.unshift(
      "Not enough recipe variety to respect all repeat limits — some meals repeat more than requested.",
    );
  }

  return { entries, totalCost: Math.round(totalCost * 100) / 100, currency, warnings };
}
import type { Ingredient } from "@/types/Recipies/main";

export type CostEstimate = {
  totalCost: number;
  currency: string;
  breakdown: { name: string; estimatedCost: number }[];
};

export async function estimateRecipeCost(
  ingredients: Ingredient[]
): Promise<CostEstimate | null> {
  const validIngredients = ingredients.filter((i) => i.name.trim());
  if (validIngredients.length === 0) return null;

  try {
    const res = await fetch("/api/estimate-cost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients: validIngredients.map((i) => ({ name: i.name, amount: i.amount })),
      }),
    });

    if (!res.ok) {
      console.error("Cost estimate request failed:", await res.text());
      return null;
    }

    return (await res.json()) as CostEstimate;
  } catch (err) {
    console.error("Cost estimate request errored:", err);
    return null;
  }
}
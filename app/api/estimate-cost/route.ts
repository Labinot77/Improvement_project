import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type IngredientInput = {
  name: string;
  amount: string; // e.g. "200g", "2 cups" — whatever the user typed
};

type EstimateRequestBody = {
  ingredients: IngredientInput[];
};

type EstimateResponse = {
  totalCost: number;
  currency: string;
  breakdown: { name: string; estimatedCost: number }[];
};

const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    currency: { type: "string", enum: ["EUR"], description: "Always EUR (Bulgaria's currency)" },
    breakdown: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          estimatedCost: { type: "number" },
        },
        required: ["name", "estimatedCost"],
      },
    },
    totalCost: { type: "number" },
  },
  required: ["currency", "breakdown", "totalCost"],
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: EstimateRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { ingredients } = body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return NextResponse.json(
      { error: "At least one ingredient is required." },
      { status: 400 }
    );
  }

  const ingredientList = ingredients
    .filter((i) => i.name?.trim())
    .map((i) => `- ${i.name.trim()}${i.amount?.trim() ? ` — ${i.amount.trim()}` : ""}`)
    .join("\n");

  const prompt = `You are a strict grocery cost estimator for Bulgaria. Given a list of recipe ingredients with their amounts (always in grams, even if the g is not present), estimate the realistic cost to buy each ingredient, then sum them into a total.

LOCATION AND CURRENCY (mandatory, do not deviate):
- Location is always Bulgaria.
- Bulgaria's currency is the EURO (EUR) — do NOT use Bulgarian Lev (BGN) under any circumstances, even though Lev has historically been used there. Always return "currency": "EUR".
- Base all prices ONLY on typical prices from Lidl Bulgaria or Kaufland Bulgaria. Do not reference any other store, country, or generic "average grocery store" pricing.

STRICTNESS RULES (mandatory):
- Be as accurate as possible to real Lidl/Kaufland Bulgaria shelf prices for each ingredient, based on your knowledge of these chains.
- Never guess wildly or round to convenient numbers — reason about the actual typical unit price (e.g. price per kg/liter) at Lidl or Kaufland, then scale it to the exact amount used in the recipe.
- Estimate the cost of the EXACT AMOUNT USED in the recipe, not a whole package (e.g. if a recipe needs 200g of chicken breast, price 200g at the per-kg rate, not a whole pack).
- If an amount is vague or missing, assume a reasonable typical quantity for a home-cooked recipe.
- Round each estimated cost to 2 decimal places.
- Do not inflate or deflate prices — give your single best, most realistic estimate for each ingredient.

Ingredients:
${ingredientList}

Return the per-ingredient cost breakdown (in EUR) and the total (in EUR).`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.2,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return NextResponse.json(
        { error: "Failed to get cost estimate from Gemini." },
        { status: 502 }
      );
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Unexpected Gemini response shape:", JSON.stringify(data));
      return NextResponse.json(
        { error: "Gemini returned an unexpected response." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(text) as {
      currency: string;
      breakdown: { name: string; estimatedCost: number }[];
      totalCost: number;
    };

    const result: EstimateResponse = {
      totalCost: Math.round(parsed.totalCost * 100) / 100,
      currency: parsed.currency,
      breakdown: parsed.breakdown,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Cost estimation failed:", err);
    return NextResponse.json(
      { error: "Something went wrong estimating the cost." },
      { status: 500 }
    );
  }
}
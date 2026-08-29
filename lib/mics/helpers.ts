export function capitalizeFirstLetter(str: string) {
    if (!str) return str;
    return str.at(0)?.toUpperCase() + str.slice(1);
}

export async function wait(seconds: number) {
    await new Promise((res) => setTimeout(res, seconds))
}


export function formatCurrency(amount: number, currency?: string | null) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency ?? ""}`.trim();
  }
}
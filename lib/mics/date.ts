import { format } from "date-fns"

// export function formatDate(date: Date) {
//   return format(date, "yyyy-MM-dd")
// }

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function today(): string {
  return formatDate(new Date());
}

export function getLast84Days(): string[] {
  const days: string[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 83; i >= 0; i--) {
    const t = new Date(d);
    t.setDate(d.getDate() - i);
    days.push(formatDate(t));
  }
  return days;
}

export function getLast7Days(): string[] {
  const days: string[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const t = new Date(d);
    t.setDate(d.getDate() - i);
    days.push(formatDate(t));
  }
  return days;
}


import { format } from "date-fns"

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd"); 
}

export function today(): string {
  return formatDate(new Date());
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return formatDate(d)
  })
}


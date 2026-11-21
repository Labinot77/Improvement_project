import { format } from "date-fns"

// Date -> "YYYY-MM-DD"
export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd"); 
}

// Today as "YYYY-MM-DD"
export function today(): string {
  return formatDate(new Date());
}

import { Days } from "@/types/progress";
import { formatDate } from "../mics/date";

export function computeStreak(days: Days): number {
  let streak = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);

  d.setDate(d.getDate() - 1);

  while (true) {
    const key = formatDate(d);
    const day = days[key];
    const allDone = day && day.tasks.length > 0 && day.tasks.every((t) => t.completed);
    if (!allDone) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

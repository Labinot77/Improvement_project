import "server-only";
import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { formatDate } from "@/lib/mics/date";
import { getTodosData } from "@/app/progress/store/main";
import { getActivities } from "@/app/activity/store/main";
import { getSleepEntries } from "@/app/sleep/store/main";
import { CONNECTION_DAYS } from "@/constants/main/overview";

// Lesson dates in the window (one entry per lesson)
async function getLessonDates(days: number): Promise<string[]> {
  const user = await getUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("date")
    .eq("user_id", user.id)
    .gte("date", formatDate(subDays(new Date(), days)));
  return (data ?? []).map((r) => r.date as string);
}

// Everything the overview needs, fetched in parallel
export async function getOverviewData() {
  const [todos, activity, sleep, lessonDates] = await Promise.all([
    getTodosData(),
    getActivities(CONNECTION_DAYS),
    getSleepEntries(CONNECTION_DAYS),
    getLessonDates(CONNECTION_DAYS),
  ]);

  return {
    taskDays: todos.stats?.days ?? [],
    todayTasks: todos.todayTasks,
    streak: todos.stats?.streak ?? 0,
    activities: activity.activities,
    sleep: sleep.entries,
    lessonDates,
    error: todos.error ?? activity.error ?? sleep.error,
  };
}

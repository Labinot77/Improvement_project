import "server-only";
import { subDays } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/user/getUser_server";
import { formatDate } from "@/lib/mics/date";
import type { SleepEntry } from "@/types/sleep";

// Table: sleep_entries (id, user_id, date, bedtime, wake_time, duration_hours, notes, created_at)
// One row per user per date (unique user_id,date)

type Row = {
  id: string;
  date: string;
  bedtime: string;
  wake_time: string;
  duration_hours: number | string;
  notes: string | null;
  created_at: string;
};

// DB row -> SleepEntry ("HH:MM:SS" trimmed to "HH:MM")
function toEntry(r: Row): SleepEntry {
  return {
    id: r.id,
    date: r.date,
    bedtime: r.bedtime.slice(0, 5),
    wakeTime: r.wake_time.slice(0, 5),
    durationHours: Number(r.duration_hours),
    notes: r.notes ?? "",
    createdAt: r.created_at,
  };
}

// Nights from the last `days` days, newest first
export async function getSleepEntries(days = 120): Promise<{ entries: SleepEntry[]; error: string | null }> {
  const user = await getUser();
  if (!user) return { entries: [], error: "Not signed in" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sleep_entries")
    .select("id, date, bedtime, wake_time, duration_hours, notes, created_at")
    .eq("user_id", user.id)
    .gte("date", formatDate(subDays(new Date(), days)))
    .order("date", { ascending: false });
  if (error) return { entries: [], error: error.message };
  return { entries: (data as Row[]).map(toEntry), error: null };
}

// Create or replace the night for a date
export async function upsertSleep(e: Pick<SleepEntry, "date" | "bedtime" | "wakeTime" | "durationHours" | "notes">) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("sleep_entries").upsert(
    {
      user_id: user.id,
      date: e.date,
      bedtime: e.bedtime,
      wake_time: e.wakeTime,
      duration_hours: e.durationHours,
      notes: e.notes,
    },
    { onConflict: "user_id,date" },
  );
  if (error) throw new Error(error.message);
}

// Delete a night (own rows only)
export async function deleteSleep(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Not signed in");
  const supabase = await createClient();
  const { error } = await supabase.from("sleep_entries").delete().eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
}

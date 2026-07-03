"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SleepEntry, SleepDays } from "@/types/sleep";
import { calcDuration } from "./sleep/calc";

const supabase = createClient();

export function useSleep() {
  const [days, setDays] = useState<SleepDays>({});
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("sleep_entries")
      .select("*")
      .order("date", { ascending: false });

    if (error || !data) { setLoading(false); return; }

    const next: SleepDays = {};
    for (const row of data) {
      next[row.date] = {
        id: row.id,
        date: row.date,
        bedtime: row.bedtime,
        wakeTime: row.wake_time,
        durationHours: Number(row.duration_hours),
        notes: row.notes ?? "",
        createdAt: row.created_at,
      };
    }
    setDays(next);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function upsertEntry(
    date: string,
    fields: { bedtime: string; wakeTime: string; notes: string }
  ) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const durationHours = calcDuration(fields.bedtime, fields.wakeTime);

    const optimistic: SleepEntry = {
      id: days[date]?.id ?? crypto.randomUUID(),
      date,
      bedtime: fields.bedtime,
      wakeTime: fields.wakeTime,
      durationHours,
      notes: fields.notes,
      createdAt: days[date]?.createdAt ?? new Date().toISOString(),
    };

    setDays((prev) => ({ ...prev, [date]: optimistic }));

    const { data, error } = await supabase
      .from("sleep_entries")
      .upsert({
        user_id: user.id,
        date,
        bedtime: fields.bedtime,
        wake_time: fields.wakeTime,
        duration_hours: durationHours,
        notes: fields.notes,
      }, { onConflict: "user_id,date" })
      .select()
      .single();

    if (error || !data) {
      setDays((prev) => { const next = { ...prev }; delete next[date]; return next; });
      return;
    }

    setDays((prev) => ({
      ...prev,
      [date]: { ...optimistic, id: data.id, createdAt: data.created_at },
    }));
  }

  async function deleteEntry(date: string) {
    const entry = days[date];
    if (!entry) return;
    setDays((prev) => { const next = { ...prev }; delete next[date]; return next; });
    await supabase.from("sleep_entries").delete().eq("id", entry.id);
  }

  return { days, loading, upsertEntry, deleteEntry };
}
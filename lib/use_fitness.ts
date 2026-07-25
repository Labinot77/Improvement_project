"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Activity, ActivityType, IntensityLevel } from "@/types/fitness";

const supabase = createClient();

export type ActivityInput = {
  date: string;
  type: ActivityType;
  durationMins: number;
  intensity: IntensityLevel;
  notes: string;
};

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]       = useState(true);

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("date", { ascending: false });

    if (error || !data) { setLoading(false); return; }

    setActivities(
      data.map((r) => ({
        id:           r.id,
        date:         r.date,
        type:         r.type as ActivityType,
        durationMins: r.duration_mins,
        intensity:    r.intensity as IntensityLevel,
        notes:        r.notes ?? "",
        createdAt:    r.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function addActivity(input: ActivityInput): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const tempId    = crypto.randomUUID();
    const optimistic: Activity = { id: tempId, ...input, createdAt: new Date().toISOString() };
    setActivities((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from("activities")
      .insert({
        user_id:       user.id,
        date:          input.date,
        type:          input.type,
        duration_mins: input.durationMins,
        intensity:     input.intensity,
        notes:         input.notes,
      })
      .select()
      .single();

    if (error || !data) {
      setActivities((prev) => prev.filter((a) => a.id !== tempId));
      return;
    }

    setActivities((prev) =>
      prev.map((a) =>
        a.id === tempId
          ? { id: data.id, date: data.date, type: data.type, durationMins: data.duration_mins, intensity: data.intensity, notes: data.notes ?? "", createdAt: data.created_at }
          : a
      )
    );
  }

  async function deleteActivity(id: string): Promise<void> {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    await supabase.from("activities").delete().eq("id", id);
  }

  return { activities, loading, addActivity, deleteActivity };
}
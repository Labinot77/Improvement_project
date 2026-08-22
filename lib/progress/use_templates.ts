"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProgressTemplate } from "@/types/Progress/templates";

const supabase = createClient();

function toTemplate(r: any): ProgressTemplate {
  return {
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    createdAt: r.created_at,
  };
}

export function useProgressTemplates() {
  const [templates, setTemplates] = useState<ProgressTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {

    // await wait(5000)
    const { data, error } = await supabase
      .from("progress_templates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);

    if (!error && data) setTemplates(data.map(toTemplate));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addTemplate = useCallback(
    async (input: { title: string; description: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const tempId = crypto.randomUUID();
      const optimistic: ProgressTemplate = {
        id: tempId,
        title: input.title,
        description: input.description,
        createdAt: new Date().toISOString(),
      };

      setTemplates((prev) => [optimistic, ...prev].slice(0, 12));

      const { data, error } = await supabase
        .from("progress_templates")
        .insert({ user_id: user.id, title: input.title, description: input.description })
        .select()
        .single();

      if (error || !data) {
        setTemplates((prev) => prev.filter((t) => t.id !== tempId));
        return;
      }

      setTemplates((prev) =>
        prev.map((t) => (t.id === tempId ? { ...t, id: data.id, createdAt: data.created_at } : t))
      );
    },
    []
  );

  const removeTemplate = useCallback(async (templateId: string) => {
    let removed: ProgressTemplate | undefined;
    let originalIndex = -1;

    setTemplates((prev) => {
      originalIndex = prev.findIndex((t) => t.id === templateId);
      removed = prev[originalIndex];
      return prev.filter((t) => t.id !== templateId);
    });

    const { error } = await supabase.from("progress_templates").delete().eq("id", templateId);
    if (error) {
      setTemplates((prev) => {
        if (!removed) return prev;
        const restored = [...prev];
        restored.splice(originalIndex, 0, removed);
        return restored;
      });
      console.error("Failed to delete template:", error);
    }
  }, []);

  return { templates, loading, addTemplate, removeTemplate };
}
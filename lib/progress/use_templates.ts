"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/lib/use_user";
import type { ProgressTemplate } from "@/types/progress";

const STORAGE_PREFIX = "progress_templates";

function getStorageKey(userId?: string | null) {
  return `${STORAGE_PREFIX}:${userId ?? "guest"}`;
}

export function useProgressTemplates() {
  const { user } = useUser();
  const [templates, setTemplates] = useState<ProgressTemplate[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = getStorageKey(user?.id ?? null);
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      setTemplates([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as ProgressTemplate[];
      setTemplates(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTemplates([]);
    }
  }, [user?.id]);

  const persistTemplates = useCallback(
    (next: ProgressTemplate[]) => {
      if (typeof window === "undefined") return;

      const key = getStorageKey(user?.id ?? null);
      window.localStorage.setItem(key, JSON.stringify(next));
      setTemplates(next);
    },
    [user?.id],
  );

  const addTemplate = useCallback(
    (template: ProgressTemplate) => {
      setTemplates((prev) => {
        const next = [template, ...prev.filter((item) => item.id !== template.id)].slice(0, 12);
        persistTemplates(next);
        return next;
      });
    },
    [persistTemplates],
  );

  const removeTemplate = useCallback(
    (templateId: string) => {
      setTemplates((prev) => {
        const next = prev.filter((item) => item.id !== templateId);
        persistTemplates(next);
        return next;
      });
    },
    [persistTemplates],
  );

  return { templates, addTemplate, removeTemplate };
}

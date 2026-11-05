"use client";

import { useModal } from "@/providers/Modalprovider";
import { deleteEntry, saveEntry } from "./action";
import type { JournalEntry, JournalFormValues } from "@/types/journal";

export function useJournalModals() {
  const { open, closeAll } = useModal();

  const save = (id: string | null) => async (values: JournalFormValues) => {
    const res = await saveEntry(id, values);
    if (res.error) throw new Error(res.error);
  };

  const remove = async (id: string) => {
    const res = await deleteEntry(id);
    if (res.error) throw new Error(res.error);
  };

  const openForm = (opts?: { entry?: JournalEntry; date?: string }) =>
    open("journal_form", {
      entry: opts?.entry,
      defaultDate: opts?.date,
      onSave: save(opts?.entry?.id ?? null),
    });

  const openPreview = (entry: JournalEntry) =>
    open("journal_preview", {
      entry,
      // editing from the preview: close everything after saving so no stale preview stays open
      onSave: async (values: JournalFormValues) => {
        await save(entry.id)(values);
        closeAll();
      },
      onDelete: () => remove(entry.id),
    });

  return { openForm, openPreview };
}
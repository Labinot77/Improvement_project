"use client";

import { useJournalModals } from "../actions/main";
import type { JournalEntry } from "@/types/journal";

// entry given → opens the preview, otherwise opens the form (optionally prefilled with `date`)
export function JournalButton({
  entry,
  date,
  className,
  children,
}: {
  entry?: JournalEntry;
  date?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { openForm, openPreview } = useJournalModals();

  return (
    <button
      type="button"
      className={className}
      onClick={() => (entry ? openPreview(entry) : openForm({ date }))}
    >
      {children}
    </button>
  );
}
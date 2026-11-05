"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { MoodChip } from "../MoodChips";
import { formatDay, moodOf, wordCount } from "@/constants/journal";
import type { JournalEntry, JournalFormValues } from "@/types/journal";

type Props = {
  entry: JournalEntry;
  onSave: (values: JournalFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function JournalPreviewModal({ entry, onSave, onDelete }: Props) {
  const { open, closeAll } = useModal();
  const mood = moodOf(entry.mood);

  const stats = [
    { label: "Mood", value: `${mood.emoji} ${mood.label}` },
    { label: "Words", value: String(wordCount(entry.content)) },
    {
      label: "Updated",
      value: new Date(entry.updatedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
    },
  ];

  function edit() {
    // open("journal_form", { entry, onSave });
  }

  function remove() {
    open("confirm", {
      title: "Delete this entry?",
      description: "This can't be undone.",
      itemName: formatDay(entry.date, true),
      confirmLabel: "Delete",
      cancelLabel: "Keep it",
      destructive: true,
      onConfirm: async () => {
        await onDelete();
        closeAll();
      },
    });
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] text-emerald-300/80">JOURNAL ENTRY</p>
          <h2 className="mt-1 text-2xl font-semibold text-zinc-100">
            {formatDay(entry.date, true)}
          </h2>
        </div>
        <MoodChip mood={entry.mood} />
      </div>

      {entry.prompt && (
        <div className="rounded-2xl bg-[#16181b] p-4">
          <p className="text-sm italic leading-relaxed text-zinc-400">{entry.prompt}</p>
        </div>
      )}

      <p className="max-h-72 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">
        {entry.content}
      </p>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-[#16181b] p-4">
            <p className="text-[11px] uppercase tracking-wider text-zinc-500">{s.label}</p>
            <p className="mt-1 text-sm font-medium text-zinc-100">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={edit}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300"
        >
          <Pencil className="size-4" /> Edit
        </button>
        <button
          type="button"
          onClick={remove}
          className="flex items-center justify-center gap-2 rounded-full bg-rose-400/10 px-5 py-2.5 text-sm font-medium text-rose-300 transition hover:bg-rose-400/20"
        >
          <Trash2 className="size-4" /> Delete
        </button>
      </div>
    </div>
  );
}
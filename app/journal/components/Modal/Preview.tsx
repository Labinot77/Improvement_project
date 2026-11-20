"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { formatDay, moodOf, wordCount } from "@/constants/journal";
import type { JournalEntry, JournalFormValues } from "@/types/journal";

type Props = {
  entry: JournalEntry;
  onSave: (values: JournalFormValues) => Promise<void>;
  onDelete: () => Promise<void>;
};

// Reading view: mood band, prompt, serif body, meta and actions
export function JournalPreviewModal({ entry, onSave, onDelete }: Props) {
  const { open, closeAll } = useModal();
  const mood = moodOf(entry.mood);
  const words = wordCount(entry.content);
  const updated = new Date(entry.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  // Stack the form on top; saving closes both
  const edit = () => open("journal_form", { entry, onSave });

  // Confirm, delete, close everything
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
    <article className="flex max-h-[90dvh] flex-col">
      <header className="p-7 pr-16" style={{ background: `linear-gradient(180deg, ${mood.color}1f, transparent)` }}>
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl text-3xl" style={{ background: `${mood.color}26` }}>{mood.emoji}</span>
          <div>
            <p className="text-xs tracking-[0.25em]" style={{ color: mood.color }}>{mood.label.toUpperCase()} DAY</p>
            <h2 className="mt-1 font-serif text-2xl text-zinc-100">{formatDay(entry.date, true)}</h2>
          </div>
        </div>
        {entry.prompt && (
          <blockquote className="mt-6 border-l-2 border-amber-200/40 pl-4 font-serif text-lg italic text-amber-100/70">{entry.prompt}</blockquote>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-7 pb-2">
        <p className="whitespace-pre-wrap font-serif text-lg leading-8 text-zinc-200 first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-5xl first-letter:leading-none first-letter:text-amber-100">
          {entry.content}
        </p>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-7 py-4">
        <p className="text-sm text-zinc-500">
          {words} words · {Math.max(1, Math.round(words / 200))} min read · edited {updated}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={remove} aria-label="Delete entry"
            className="grid size-10 place-items-center rounded-full text-zinc-500 transition hover:bg-rose-400/10 hover:text-rose-300">
            <Trash2 className="size-4" />
          </button>
          <button type="button" onClick={edit}
            className="flex items-center gap-2 rounded-full bg-amber-100 px-5 py-2.5 text-sm font-medium text-[#1a1510] transition hover:bg-amber-50">
            <Pencil className="size-4" /> Edit
          </button>
        </div>
      </footer>
    </article>
  );
}

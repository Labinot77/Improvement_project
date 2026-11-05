"use client";

import { useState } from "react";
import { Shuffle } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { MOODS, formatDay, promptForDate, todayISO, wordCount } from "@/constants/journal";
import type { JournalEntry, JournalFormValues, Mood } from "@/types/journal";

type Props = {
  onOpenChange: (open: boolean) => void;
  entry?: JournalEntry;
  defaultDate?: string;
  onSave: (values: JournalFormValues) => Promise<void>;
};

export function JournalForm({ onOpenChange, entry, defaultDate, onSave }: Props) {
  const { setDismissLocked } = useModal();

  const [date, setDate] = useState(entry?.date ?? defaultDate ?? todayISO());
  const [mood, setMood] = useState<Mood>(entry?.mood ?? "okay");
  const [shift, setShift] = useState(0);
  const [prompt, setPrompt] = useState(entry?.prompt ?? promptForDate(date));
  const [content, setContent] = useState(entry?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeDate(value: string) {
    setDate(value);
    if (!entry) {
      setShift(0);
      setPrompt(promptForDate(value));
    }
  }

  function shuffle() {
    setShift(shift + 1);
    setPrompt(promptForDate(date, shift + 1));
  }

  async function save() {
    if (!content.trim()) return setError("Write something first.");
    setSaving(true);
    setError(null);
    setDismissLocked(true);
    try {
      await onSave({ date, mood, prompt, content });
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save the entry.");
    } finally {
      setSaving(false);
      setDismissLocked(false);
    }
  }

  return (
    <div className="space-y-5 p-6">
      <div className="pr-10">
        <p className="text-xs tracking-[0.2em] text-emerald-300/80">
          {entry ? "EDIT ENTRY" : "NEW ENTRY"}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-zinc-100">{formatDay(date, true)}</h2>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-500">Date</label>
        <input
          type="date"
          value={date}
          max={todayISO()}
          onChange={(e) => e.target.value && changeDate(e.target.value)}
          className="w-full rounded-full bg-[#16181b] px-4 py-2.5 text-sm text-zinc-100 outline-none ring-1 ring-white/5 focus:ring-emerald-300/40 [color-scheme:dark]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-500">How was the day?</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                mood === m.value
                  ? "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/40"
                  : "bg-[#16181b] text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 rounded-2xl bg-[#16181b] p-4">
        <p className="text-sm italic leading-relaxed text-zinc-300">{prompt}</p>
        <button
          type="button"
          onClick={shuffle}
          aria-label="Another prompt"
          className="shrink-0 rounded-full p-2 text-zinc-400 transition hover:bg-white/5 hover:text-emerald-300"
        >
          <Shuffle className="size-4" />
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write freely…"
        className="h-56 w-full resize-none rounded-2xl bg-[#16181b] p-4 text-sm leading-relaxed text-zinc-100 outline-none ring-1 ring-white/5 placeholder:text-zinc-600 focus:ring-emerald-300/40"
      />

      <div className="flex items-center justify-between gap-3">
        <p className={`text-sm ${error ? "text-rose-300" : "text-zinc-500"}`}>
          {error ?? `${wordCount(content)} words`}
        </p>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-medium text-black transition hover:bg-emerald-300 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save entry"}
        </button>
      </div>
    </div>
  );
}
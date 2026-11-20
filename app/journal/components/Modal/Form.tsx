"use client";

import { useState, type KeyboardEvent } from "react";
import { CalendarDays, Shuffle } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { MOODS, formatDay, moodOf, promptForDate, todayISO, wordCount } from "@/constants/journal";
import type { JournalEntry, JournalFormValues, Mood } from "@/types/journal";

type Props = {
  onOpenChange: (open: boolean) => void;
  entry?: JournalEntry;
  defaultDate?: string;
  onSave: (values: JournalFormValues) => Promise<void>;
};

// Distraction-free writing sheet: date, mood, prompt, text
export function JournalForm({ onOpenChange, entry, defaultDate, onSave }: Props) {
  const { setDismissLocked } = useModal();
  const [date, setDate] = useState(entry?.date ?? defaultDate ?? todayISO());
  const [mood, setMood] = useState<Mood>(entry?.mood ?? "okay");
  const [shift, setShift] = useState(0);
  const [prompt, setPrompt] = useState(entry?.prompt ?? promptForDate(date));
  const [content, setContent] = useState(entry?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const words = wordCount(content);
  const accent = moodOf(mood).color;

  // New entries get the prompt for the chosen date
  function changeDate(value: string) {
    setDate(value);
    if (!entry) { setShift(0); setPrompt(promptForDate(value)); }
  }

  // Next prompt in the rotation
  function shuffle() {
    setShift(shift + 1);
    setPrompt(promptForDate(date, shift + 1));
  }

  // Validate, save, close on success
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

  // Cmd/Ctrl + Enter saves
  const onKey = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); save(); }
  };

  return (
    <div onKeyDown={onKey} className="flex max-h-[90dvh] flex-col">
      {/* Header: date + mood */}
      <div className="border-b border-white/[0.06] p-6 pr-16" style={{ background: `linear-gradient(180deg, ${accent}14, transparent)` }}>
        <p className="text-xs tracking-[0.25em] text-amber-200/70">{entry ? "EDITING ENTRY" : "NEW ENTRY"}</p>
        <label className="mt-2 flex w-fit cursor-pointer items-center gap-2">
          <span className="font-serif text-2xl text-zinc-100">{formatDay(date, true)}</span>
          <CalendarDays className="size-4 text-zinc-500" aria-hidden />
          <input type="date" value={date} max={todayISO()} aria-label="Entry date"
            onChange={(e) => e.target.value && changeDate(e.target.value)}
            className="w-0 opacity-0 [color-scheme:dark]" onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()} />
        </label>

        <div role="radiogroup" aria-label="Mood" className="mt-5 flex gap-2">
          {MOODS.map((m) => {
            const on = mood === m.value;
            return (
              <button key={m.value} type="button" role="radio" aria-checked={on} onClick={() => setMood(m.value)}
                className="flex flex-1 flex-col items-center gap-1 rounded-2xl border py-2.5 transition"
                style={{ borderColor: on ? `${m.color}80` : "rgba(255,255,255,0.06)", background: on ? `${m.color}1a` : "transparent" }}>
                <span className={`text-2xl transition ${on ? "scale-110" : "opacity-50 grayscale"}`}>{m.emoji}</span>
                <span className="text-xs" style={{ color: on ? m.color : "#71717a" }}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prompt + writing area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-start gap-3">
          <p className="flex-1 font-serif text-lg italic leading-snug text-amber-100/80">{prompt || "Free write"}</p>
          <button type="button" onClick={shuffle} aria-label="Another prompt" title="Another prompt"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.04] text-zinc-400 transition hover:bg-white/10 hover:text-amber-100">
            <Shuffle className="size-4" />
          </button>
        </div>
        <textarea autoFocus value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing…" aria-label="Entry"
          className="mt-5 min-h-[18rem] w-full resize-none bg-transparent font-serif text-lg leading-8 text-zinc-100 outline-none placeholder:text-zinc-700
            [background-image:repeating-linear-gradient(transparent,transparent_31px,rgba(255,255,255,0.04)_31px,rgba(255,255,255,0.04)_32px)]" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4">
        <p className={`text-sm ${error ? "text-rose-300" : "text-zinc-500"}`} role={error ? "alert" : undefined}>
          {error ?? <>{words} {words === 1 ? "word" : "words"} · <kbd className="text-zinc-400">⌘↵</kbd> to save</>}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => onOpenChange(false)} disabled={saving}
            className="rounded-full px-5 py-2.5 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200 disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={save} disabled={saving}
            className="rounded-full bg-amber-100 px-6 py-2.5 text-sm font-medium text-[#1a1510] transition hover:bg-amber-50 disabled:opacity-50">
            {saving ? "Saving…" : entry ? "Save changes" : "Save entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

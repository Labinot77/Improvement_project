"use client";

import { useState } from "react";
import { PenLine, Shuffle } from "lucide-react";
import { Input } from "@/components/ui/input";
import ModalHeader from "@/app/components/ModalHeader";
import { useModal } from "@/providers/Modalprovider";
import { MOODS, formatDay, promptForDate, todayISO, wordCount } from "@/constants/journal";
import type { JournalEntry, JournalFormValues, Mood } from "@/types/journal";

type Props = {
  onOpenChange: (open: boolean) => void;
  entry?: JournalEntry;
  defaultDate?: string;
  onSave: (values: JournalFormValues) => Promise<void>;
};

const LABEL = "mb-2 block text-xs font-medium text-zinc-500";

// Modal: write or edit an entry. Side panel for date/mood/prompt, big writing area
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

  // New entries get the date's prompt
  function changeDate(value: string) {
    setDate(value);
    if (!entry) {
      setShift(0);
      setPrompt(promptForDate(value));
    }
  }

  // Next prompt in the rotation
  function shuffle() {
    setShift(shift + 1);
    setPrompt(promptForDate(date, shift + 1));
  }

  // Save, keeping the modal open on error
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
    <div className="relative overflow-hidden">
      <ModalHeader
        icon={<PenLine className="size-4" />}
        color="#34d399"
        title={entry ? "Edit entry" : "New entry"}
        subtitle={formatDay(date, true)}
      />

      <div className="relative grid gap-6 p-6 md:grid-cols-[17rem_minmax(0,1fr)]">
        {/* Side panel */}
        <div className="space-y-5">
          <div>
            <span className={LABEL}>Date</span>
            <Input
              type="date"
              value={date}
              max={todayISO()}
              onChange={(e) => e.target.value && changeDate(e.target.value)}
              className="h-11 rounded-2xl border-white/10 bg-white/[0.04] [color-scheme:dark]"
            />
          </div>

          <div>
            <span className={LABEL}>How was the day?</span>
            <div className="grid grid-cols-5 gap-1.5 md:grid-cols-1">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs transition md:flex-row md:gap-3 md:px-3 md:text-sm ${
                    mood === m.value
                      ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/40"
                      : "bg-white/[0.03] text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-lg md:text-base">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Writing area */}
        <div className="flex min-w-0 flex-col gap-3">
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-emerald-400/[0.06] p-4 ring-1 ring-emerald-300/10">
            <p className="font-serif text-base italic leading-relaxed text-zinc-200">{prompt}</p>
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
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write freely…"
            className="min-h-64 w-full flex-1 resize-none rounded-2xl bg-white/[0.03] p-4 text-[15px] leading-relaxed text-zinc-100 outline-none ring-1 ring-white/[0.06] placeholder:text-zinc-600 focus:ring-emerald-300/40 md:min-h-80"
          />

          <div className="flex items-center justify-between gap-3">
            <p className={`text-sm ${error ? "text-rose-300" : "text-zinc-500"}`}>
              {error ?? `${words} ${words === 1 ? "word" : "words"}`}
            </p>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="h-10 rounded-full bg-emerald-400 px-6 text-sm font-semibold text-black transition hover:bg-emerald-300 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveJournal } from "@/app/progress/actions/actions";
import { RefreshCw, Sparkles } from "lucide-react";
import { PROMPTS } from "@/constants/journal";

// inside the component, with the other hooks:

type Status = "idle" | "saving" | "saved" | "error";

const STATUS_LABEL: Record<Status, string> = {
  idle: "Autosaves as you type",
  saving: "Saving…",
  saved: "Saved",
  error: "Couldn't save",
};

interface JournalEditorProps {
  date: string;
  initial: string;
}

export function promptIndexForDate(dateKey: string) {
  const day = Math.floor(Date.parse(`${dateKey}T00:00:00Z`) / 86_400_000);
  return ((day % PROMPTS.length) + PROMPTS.length) % PROMPTS.length;
}

export function JournalEditor({ date, initial }: JournalEditorProps) {
  const [promptIndex, setPromptIndex] = useState(() => promptIndexForDate(date));
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<string | null>(null);
  const latestValue = useRef(initial);
  const requestId = useRef(0);

  const flush = useCallback(async () => {
    if (pending.current === null) return;

    const text = pending.current;
    pending.current = null;

    const currentRequest = ++requestId.current;

    try {
      await saveJournal(date, text);

      if (currentRequest === requestId.current) {
        setStatus(
          latestValue.current === text && pending.current === null
            ? "saved"
            : "saving",
        );
      }
    } catch {
      if (currentRequest === requestId.current) {
        // Preserve the text so the user can retry.
        pending.current = text;
        setStatus("error");
      }
    }
  }, [date]);

  function handleChange(next: string) {
    latestValue.current = next;
    setValue(next);
    pending.current = next;
    setStatus("saving");

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      void flush();
    }, 800);
  }

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);

      // Best-effort save if the component unmounts before the debounce.
      if (pending.current !== null) {
        const text = pending.current;
        pending.current = null;
        void saveJournal(date, text);
      }
    };
  }, [date]);

 return (
  <div>
    {/* Prompt */}
    <div className="mt-6 flex items-start gap-3 rounded-2xl bg-violet-400/[0.06] p-4">
      <Sparkles className="mt-0.5 size-4 shrink-0 text-violet-300" />
      <p className="flex-1 text-sm leading-relaxed text-zinc-200">
        {PROMPTS[promptIndex]}
      </p>
      <button
        type="button"
        onClick={() => setPromptIndex((i) => (i + 1) % PROMPTS.length)}
        aria-label="Show another prompt"
        className="shrink-0 rounded-lg p-1 text-zinc-500 transition hover:text-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
      >
        <RefreshCw className="size-4" />
      </button>
    </div>

    <div className="mt-4 flex justify-end">
      <span
        className={`text-sm ${
          status === "error" ? "text-red-400" : "text-zinc-600"
        }`}
        aria-live="polite"
      >
        {STATUS_LABEL[status]}
      </span>
    </div>

    <textarea
      value={value}
      onChange={(event) => handleChange(event.target.value)}
      placeholder="Start writing…"
      aria-label="Journal entry"
      rows={6}
      className="mt-2 min-h-40 w-full resize-y rounded-2xl bg-white/[0.04] p-4 leading-relaxed text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
    />
  </div>
);
}
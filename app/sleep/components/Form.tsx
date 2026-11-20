"use client";

import { useState, useTransition } from "react";
import { Moon, Sun } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { calcDuration } from "@/lib/sleep/calc";
import { dayKey, formatDuration, sleepStatus } from "@/app/sleep/data/main";
import type { SleepEntry, SleepFormValues } from "@/types/sleep";

// Content only: ResponsiveModal (from the provider) is the shell
interface SleepFormProps {
  entry?: SleepEntry; // present = edit, absent = create
  onSave: (values: SleepFormValues) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-300/40 [color-scheme:dark]";
const label = "mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-300";

// Log or edit one night
export function SleepForm({ entry, onSave, onOpenChange }: SleepFormProps) {
  const { setDismissLocked } = useModal();
  const [date, setDate] = useState(entry?.date ?? dayKey());
  const [bedtime, setBedtime] = useState(entry?.bedtime ?? "23:00");
  const [wakeTime, setWakeTime] = useState(entry?.wakeTime ?? "07:00");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const hours = bedtime && wakeTime ? calcDuration(bedtime, wakeTime) : 0;
  const status = sleepStatus(hours);

  // Save, close on success
  function submit() {
    setError(null);
    startTransition(async () => {
      let saved = false;
      setDismissLocked(true);
      try {
        await onSave({ date, bedtime, wakeTime, notes: notes.trim() });
        saved = true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't save the entry.");
      } finally {
        setDismissLocked(false);
      }
      if (saved) onOpenChange(false);
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100">{entry ? "Edit night" : "Log sleep"}</h2>

      <div className="mt-5 max-h-[60dvh] space-y-5 overflow-y-auto px-0.5 pb-1">
        <div>
          <label htmlFor="s-date" className={label}>Night of (wake-up date)</label>
          <input id="s-date" type="date" value={date} max={dayKey()} disabled={!!entry}
            onChange={(e) => setDate(e.target.value)} className={`${field} disabled:opacity-60`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="s-bed" className={label}><Moon className="size-3.5 text-indigo-300" /> Bedtime</label>
            <input id="s-bed" type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="s-wake" className={label}><Sun className="size-3.5 text-amber-300" /> Wake up</label>
            <input id="s-wake" type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className={field} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white/[0.045] p-4">
          <span className="text-zinc-400">Duration</span>
          <span className="flex items-center gap-3">
            <span className="text-lg font-semibold tabular-nums">{formatDuration(hours)}</span>
            <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ color: status.color, background: `${status.color}1a` }}>
              {status.label}
            </span>
          </span>
        </div>

        <div>
          <label htmlFor="s-notes" className={label}>Notes</label>
          <textarea id="s-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel? Dreams, disturbances…" className={`${field} resize-y`} />
        </div>

        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={() => onOpenChange(false)} disabled={pending}
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] disabled:opacity-60">
          Cancel
        </button>
        <button type="button" onClick={submit} disabled={pending}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-60">
          {pending ? "Saving…" : entry ? "Save changes" : "Log sleep"}
        </button>
      </div>
    </div>
  );
}

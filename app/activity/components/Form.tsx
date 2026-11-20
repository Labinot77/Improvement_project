"use client";

import { useState, useTransition } from "react";
import { useModal } from "@/providers/Modalprovider";
import { ACTIVITY_META, ALL_ACTIVITY_TYPES, ALL_INTENSITIES, INTENSITY_META } from "@/constants/fitness";
import { dayKey } from "@/app/activity/data/main";
import type { ActivityFormValues, ActivityType, IntensityLevel } from "@/types/fitness";

// Content only: ResponsiveModal (from the provider) is the shell
interface ActivityFormProps {
  date?: string;
  onSave: (values: ActivityFormValues) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-300/40 [color-scheme:dark]";
const label = "mb-1.5 block text-sm font-medium text-zinc-300";

// Log a new training session
export function ActivityForm({ date: initialDate, onSave, onOpenChange }: ActivityFormProps) {
  const { setDismissLocked } = useModal();
  const [type, setType] = useState<ActivityType>("Gym");
  const [duration, setDuration] = useState("60");
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [date, setDate] = useState(initialDate ?? dayKey());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Validate, save, close on success
  function submit() {
    const mins = Number(duration);
    if (!mins || mins <= 0) return setError("Enter a duration greater than 0.");
    setError(null);

    startTransition(async () => {
      let saved = false;
      setDismissLocked(true);
      try {
        await onSave({ type, durationMins: Math.round(mins), intensity, date, notes: notes.trim() });
        saved = true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't save the session.");
      } finally {
        setDismissLocked(false);
      }
      if (saved) onOpenChange(false);
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100">Log session</h2>

      <div className="mt-5 max-h-[60dvh] space-y-5 overflow-y-auto px-0.5 pb-1">
        <div>
          <span className={label}>Activity</span>
          <div className="flex flex-wrap gap-2">
            {ALL_ACTIVITY_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={type === t}
                onClick={() => setType(t)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  type === t ? "border-rose-300/40 bg-rose-400/15 text-rose-200" : "border-white/10 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {ACTIVITY_META[t].icon} {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="a-dur" className={label}>Duration (min)</label>
            <input id="a-dur" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor="a-date" className={label}>Date</label>
            <input id="a-date" type="date" value={date} max={dayKey()} onChange={(e) => setDate(e.target.value)} className={field} />
          </div>
        </div>

        <div>
          <span className={label}>Intensity</span>
          <div className="grid grid-cols-5 gap-2">
            {ALL_INTENSITIES.map((l) => {
              const m = INTENSITY_META[l];
              const on = intensity === l;
              return (
                <button
                  key={l}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setIntensity(l)}
                  className="rounded-xl border py-2 text-xs transition"
                  style={{
                    borderColor: on ? m.color : "rgba(255,255,255,0.1)",
                    background: on ? `${m.color}1f` : "transparent",
                    color: on ? m.color : "#71717a",
                  }}
                >
                  <span className="block text-sm font-semibold">{l}</span>
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label htmlFor="a-notes" className={label}>Notes</label>
          <textarea id="a-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it go? PRs, technique, how you felt…" className={`${field} resize-y`} />
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
          {pending ? "Saving…" : "Log session"}
        </button>
      </div>
    </div>
  );
}

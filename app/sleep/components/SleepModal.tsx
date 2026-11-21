"use client";

import { useState, useTransition } from "react";
import { Moon, Sun, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ModalHeader from "@/app/components/ModalHeader";
import { useModal } from "@/providers/Modalprovider";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { today } from "@/lib/mics/date";
import { removeSleep, saveSleep } from "@/app/sleep/actions/main";
import { calcDuration, formatDuration } from "@/app/sleep/data/main";
import type { SleepEntry } from "@/types/sleep";

const FIELD = "h-11 rounded-2xl border-white/10 bg-white/[0.04]";
const LABEL = "mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-500";

type Props = { onOpenChange: (open: boolean) => void; date?: string; entry?: SleepEntry };

// Modal: log or edit a night, with a live duration preview
export function SleepModal({ onOpenChange, date: initialDate, entry }: Props) {
  const { setDismissLocked } = useModal();
  const [date, setDate] = useState(entry?.date ?? initialDate ?? today());
  const [bedtime, setBedtime] = useState(entry?.bedtime ?? "23:00");
  const [wakeTime, setWakeTime] = useState(entry?.wakeTime ?? "07:00");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const hours = bedtime && wakeTime ? calcDuration(bedtime, wakeTime) : 0;
  const pct = Math.min(100, (hours / TARGET_HOURS) * 100);

  // Run a server call with the modal locked, close on success
  function run(fn: () => Promise<{ error?: string } | void>) {
    setDismissLocked(true);
    startTransition(async () => {
      try {
        const res = await fn();
        if (res && res.error) return setError(res.error);
        onOpenChange(false);
      } catch {
        setError("Something went wrong. Try again.");
      } finally {
        setDismissLocked(false);
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      <ModalHeader
        icon={<Moon className="size-4" />}
        color={SLEEP_COLOR}
        title={entry ? "Edit night" : "Log a night"}
        subtitle="When did you fall asleep and wake up?"
      />

      <div className="relative space-y-5 p-6">
        <div>
          <span className={LABEL}>Night of</span>
          <Input
            type="date"
            value={date}
            max={today()}
            disabled={!!entry}
            onChange={(e) => setDate(e.target.value)}
            className={FIELD}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label>
            <span className={LABEL}>
              <Moon className="size-3.5" /> Bedtime
            </span>
            <Input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className={FIELD} />
          </label>
          <label>
            <span className={LABEL}>
              <Sun className="size-3.5" /> Wake up
            </span>
            <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className={FIELD} />
          </label>
        </div>

        {/* Live preview against target */}
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold tabular-nums">{formatDuration(hours)}</span>
            <span className="text-sm text-zinc-500">of {TARGET_HOURS}h target</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: SLEEP_COLOR }} />
          </div>
        </div>

        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dreams, wake-ups, caffeine, screens…"
          rows={3}
          className="resize-none rounded-2xl border-white/10 bg-white/[0.04]"
        />

        <div className="flex items-center justify-end gap-3 pt-1">
          {error && (
            <p role="alert" className="mr-auto text-sm text-red-400">
              {error}
            </p>
          )}
          {entry && (
            <button
              type="button"
              aria-label="Delete night"
              disabled={pending}
              onClick={() => run(() => removeSleep(entry.id))}
              className="mr-auto grid size-10 place-items-center rounded-full text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="size-4" />
            </button>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => saveSleep({ date, bedtime, wakeTime, notes }))}
            className="h-10 rounded-full px-6 text-sm font-semibold text-[#11131f] transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: SLEEP_COLOR }}
          >
            {pending ? "Saving…" : entry ? "Update night" : "Save night"}
          </button>
        </div>
      </div>
    </div>
  );
}

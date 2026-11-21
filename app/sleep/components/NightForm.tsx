"use client";

import { useState, useTransition } from "react";
import { Check, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { CARD } from "@/constants/ui";
import { today } from "@/lib/mics/date";
import { saveSleep } from "@/app/sleep/actions/main";
import { calcDuration, formatDuration } from "@/app/sleep/data/main";
import type { SleepEntry } from "@/types/sleep";

const FIELD = "border-white/[0.08] bg-white/[0.02]";

type Props = { date: string; entry?: SleepEntry; onDateChange: (date: string) => void };

// Log or edit the selected night, with a live duration preview (remounted per night)
export function NightForm({ date, entry, onDateChange }: Props) {
  const [bedtime, setBedtime] = useState(entry?.bedtime ?? "23:00");
  const [wakeTime, setWakeTime] = useState(entry?.wakeTime ?? "07:00");
  const [notes, setNotes] = useState(entry?.notes ?? "");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const hours = bedtime && wakeTime ? calcDuration(bedtime, wakeTime) : 0;
  const pct = Math.min(100, (hours / TARGET_HOURS) * 100);

  // Upsert on the server
  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveSleep({ date, bedtime, wakeTime, notes });
      if (res.error) return setError(res.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  }

  return (
    <form onSubmit={submit} className={`${CARD} space-y-5 p-6 sm:p-8`}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium">{entry ? "Edit night" : "Log a night"}</h2>
        <Input
          type="date"
          value={date}
          max={today()}
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
          className={`w-40 ${FIELD}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Moon className="size-3.5" /> Bedtime
          </span>
          <Input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className={FIELD} />
        </label>
        <label className="space-y-2">
          <span className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Sun className="size-3.5" /> Wake up
          </span>
          <Input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className={FIELD} />
        </label>
      </div>

      {/* Live preview against target */}
      <div className="rounded-2xl bg-white/[0.03] p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold tabular-nums">{formatDuration(hours)}</span>
          <span className="text-sm text-zinc-500">of {TARGET_HOURS}h</span>
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
        className={`resize-none ${FIELD}`}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl bg-[#8b9cf7] text-[#11131f] hover:bg-[#8b9cf7]/90">
        {saved ? (
          <>
            <Check className="size-4" /> Saved
          </>
        ) : pending ? (
          "Saving…"
        ) : entry ? (
          "Update night"
        ) : (
          "Save night"
        )}
      </Button>
    </form>
  );
}

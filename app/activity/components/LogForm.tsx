"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ACTIVITY_META, ALL_ACTIVITY_TYPES, ALL_INTENSITIES, INTENSITY_META } from "@/constants/fitness";
import { CARD } from "@/constants/ui";
import { today } from "@/lib/mics/date";
import { logActivity } from "@/app/activity/actions/main";
import type { ActivityType, IntensityLevel } from "@/types/fitness";

const QUICK_MINS = [30, 45, 60, 90];
const FIELD = "border-white/[0.08] bg-white/[0.02]";
const ITEM =
  "h-10 flex-1 rounded-xl border border-white/[0.06] text-zinc-500 data-[state=on]:border-transparent data-[state=on]:text-zinc-100";

// Log a session: type, minutes, intensity, date, notes
export function LogForm() {
  const [type, setType] = useState<ActivityType>(ALL_ACTIVITY_TYPES[0]);
  const [mins, setMins] = useState("60");
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  // Send to the server, then reset notes
  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await logActivity({ date, type, durationMins: Number(mins), intensity, notes });
      if (res.error) return setError(res.error);
      setError("");
      setNotes("");
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    });
  }

  return (
    <form onSubmit={submit} className={`${CARD} space-y-5 p-6 sm:p-8`}>
      <h2 className="text-lg font-medium">Log a session</h2>

      <ToggleGroup
        type="single"
        value={type}
        onValueChange={(v) => v && setType(v as ActivityType)}
        className="grid w-full grid-cols-4 gap-2"
        spacing={2}
      >
        {ALL_ACTIVITY_TYPES.map((t) => (
          <ToggleGroupItem
            key={t}
            value={t}
            aria-label={t}
            title={t}
            className="h-12 rounded-xl border border-white/[0.06] text-xl data-[state=on]:border-transparent"
            style={type === t ? { background: `${ACTIVITY_META[t].color}26` } : undefined}
          >
            {ACTIVITY_META[t].icon}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <p className="-mt-2 text-sm text-zinc-400">{type}</p>

      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Minutes</p>
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            inputMode="numeric"
            value={mins}
            onChange={(e) => setMins(e.target.value)}
            className={`w-20 ${FIELD}`}
          />
          {QUICK_MINS.map((m) => (
            <Button
              key={m}
              type="button"
              variant="ghost"
              onClick={() => setMins(String(m))}
              className={`flex-1 rounded-lg px-0 text-xs ${mins === String(m) ? "bg-white/[0.08] text-zinc-100" : "text-zinc-500"}`}
            >
              {m}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-zinc-500">
          Intensity · <span style={{ color: INTENSITY_META[intensity].color }}>{INTENSITY_META[intensity].label}</span>
        </p>
        <ToggleGroup
          type="single"
          value={String(intensity)}
          onValueChange={(v) => v && setIntensity(Number(v) as IntensityLevel)}
          className="flex w-full gap-2"
          spacing={2}
        >
          {ALL_INTENSITIES.map((lvl) => (
            <ToggleGroupItem
              key={lvl}
              value={String(lvl)}
              className={ITEM}
              style={intensity === lvl ? { background: `${INTENSITY_META[lvl].color}26` } : undefined}
            >
              {lvl}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-zinc-500">Date</p>
        <Input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} className={FIELD} />
      </div>

      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="How did it go? PRs, technique, how you felt…"
        rows={3}
        className={`resize-none ${FIELD}`}
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={pending} className="h-11 w-full rounded-xl bg-[#f97362] text-white hover:bg-[#f97362]/90">
        {saved ? (
          <>
            <Check className="size-4" /> Logged
          </>
        ) : pending ? (
          "Saving…"
        ) : (
          "Log session"
        )}
      </Button>
    </form>
  );
}

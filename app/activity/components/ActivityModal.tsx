"use client";

import { useState, useTransition } from "react";
import { Dumbbell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ModalHeader from "@/app/components/ModalHeader";
import { useModal } from "@/providers/Modalprovider";
import {
  ACTIVITY_COLOR,
  ACTIVITY_META,
  ALL_ACTIVITY_TYPES,
  ALL_INTENSITIES,
  INTENSITY_META,
} from "@/constants/fitness";
import { today } from "@/lib/mics/date";
import { logActivity } from "@/app/activity/actions/main";
import type { ActivityType, IntensityLevel } from "@/types/fitness";

const QUICK_MINS = [30, 45, 60, 90];
const FIELD = "h-11 rounded-2xl border-white/10 bg-white/[0.04]";
const LABEL = "mb-2 block text-xs font-medium text-zinc-500";

type Props = { onOpenChange: (open: boolean) => void; date?: string };

// Modal: log a training session
export function ActivityModal({ onOpenChange, date: initialDate }: Props) {
  const { setDismissLocked } = useModal();
  const [type, setType] = useState<ActivityType>(ALL_ACTIVITY_TYPES[0]);
  const [mins, setMins] = useState("60");
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [date, setDate] = useState(initialDate ?? today());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  // Save on the server, close on success
  function save() {
    setDismissLocked(true);
    startTransition(async () => {
      try {
        const res = await logActivity({ date, type, durationMins: Number(mins), intensity, notes });
        if (res.error) return setError(res.error);
        onOpenChange(false);
      } catch {
        setError("Couldn't save the session. Try again.");
      } finally {
        setDismissLocked(false);
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      <ModalHeader
        icon={<Dumbbell className="size-4" />}
        color={ACTIVITY_COLOR}
        title="Log a session"
        subtitle="What did you do, and how hard did it feel?"
      />

      <div className="relative space-y-5 p-6">
        <div>
          <span className={LABEL}>Activity · <span className="text-zinc-300">{type}</span></span>
          <ToggleGroup
            type="single"
            value={type}
            onValueChange={(v) => v && setType(v as ActivityType)}
            className="grid w-full grid-cols-4 gap-2 sm:grid-cols-7"
            spacing={2}
          >
            {ALL_ACTIVITY_TYPES.map((t) => (
              <ToggleGroupItem
                key={t}
                value={t}
                aria-label={t}
                title={t}
                className="h-12 w-full rounded-xl border border-white/[0.06] text-xl data-[state=on]:border-transparent"
                style={type === t ? { background: `${ACTIVITY_META[t].color}2e` } : undefined}
              >
                {ACTIVITY_META[t].icon}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className={LABEL}>Minutes</span>
            <div className="flex gap-2">
              <Input
                type="number"
                min={1}
                inputMode="numeric"
                value={mins}
                onChange={(e) => setMins(e.target.value)}
                className={`w-20 ${FIELD}`}
              />
              <div className="flex flex-1 gap-1">
                {QUICK_MINS.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMins(String(m))}
                    className={`flex-1 rounded-xl text-xs transition ${
                      mins === String(m) ? "bg-white/[0.1] text-zinc-100" : "text-zinc-500 hover:bg-white/[0.05]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className={LABEL}>Date</span>
            <Input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} className={FIELD} />
          </div>
        </div>

        <div>
          <span className={LABEL}>
            Intensity · <span style={{ color: INTENSITY_META[intensity].color }}>{INTENSITY_META[intensity].label}</span>
          </span>
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
                className="h-10 flex-1 rounded-xl border border-white/[0.06] text-zinc-500 data-[state=on]:border-transparent data-[state=on]:text-zinc-100"
                style={intensity === lvl ? { background: `${INTENSITY_META[lvl].color}2e` } : undefined}
              >
                {lvl}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div>
          <span className={LABEL}>
            Notes <span className="text-zinc-600">(optional)</span>
          </span>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="PRs, technique, how you felt…"
            rows={3}
            className="resize-none rounded-2xl border-white/10 bg-white/[0.04]"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-1">
          {error && (
            <p role="alert" className="mr-auto text-sm text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="h-10 rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: ACTIVITY_COLOR }}
          >
            {pending ? "Saving…" : "Log session"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Dumbbell, Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ModalHeader from "@/app/components/ModalHeader";
import { useModal } from "@/providers/Modalprovider";
import {
  ACTIVITY_COLOR,
  ALL_INTENSITIES,
  CARDIO_META,
  CARDIO_TYPES,
  COMMON_EXERCISES,
  INTENSITY_META,
} from "@/constants/fitness";
import { today } from "@/lib/mics/date";
import { logWorkout } from "@/app/activity/actions/main";
import type { CardioType, IntensityLevel, WorkoutSet, WorkoutTemplate } from "@/types/fitness";

type Last = Record<string, Pick<WorkoutSet, "reps" | "weightKg">[]>;
type SetDraft = { reps: string; weightKg: string };
type ExerciseDraft = { key: number; name: string; sets: SetDraft[] };

type Props = {
  onOpenChange: (open: boolean) => void;
  date?: string;
  template?: WorkoutTemplate;
  last?: Last;
  known?: string[];
};

const FIELD = "h-10 rounded-xl border-white/10 bg-white/[0.04]";
const LABEL = "mb-2 block text-xs font-medium text-zinc-500";
let nextKey = 0;

// Sets for an exercise: from the template, weights from last time
function draftFor(name: string, last: Last, count = 3, reps?: number): ExerciseDraft {
  const prev = last[name] ?? [];
  return {
    key: nextKey++,
    name,
    sets: Array.from({ length: count }, (_, i) => {
      const p = prev[i] ?? prev[prev.length - 1];
      return { reps: String(reps ?? p?.reps ?? 8), weightKg: p ? String(p.weightKg) : "" };
    }),
  };
}

// "80×8, 80×8, 77.5×8"
const summary = (sets: Last[string]) => sets.map((s) => `${s.weightKg}×${s.reps}`).join(", ");

// Modal: log a gym session (lifts + optional cardio)
export function WorkoutModal({ onOpenChange, date: initialDate, template, last = {}, known = [] }: Props) {
  const { setDismissLocked } = useModal();
  const [date, setDate] = useState(initialDate ?? today());
  const [name, setName] = useState(template?.name ?? "");
  const [exercises, setExercises] = useState<ExerciseDraft[]>(() =>
    template ? template.exercises.map((e) => draftFor(e.name, last, e.sets, e.reps)) : [draftFor("", last)],
  );
  const [cardioOn, setCardioOn] = useState(false);
  const [cardioType, setCardioType] = useState<CardioType>("Running");
  const [cardioMins, setCardioMins] = useState("15");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("60");
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const suggestions = [...new Set([...known, ...COMMON_EXERCISES])];

  // Update one exercise
  const patch = (key: number, fn: (e: ExerciseDraft) => ExerciseDraft) =>
    setExercises((xs) => xs.map((e) => (e.key === key ? fn(e) : e)));

  // Update one set field
  const setField = (key: number, i: number, field: keyof SetDraft, value: string) =>
    patch(key, (e) => ({ ...e, sets: e.sets.map((s, j) => (j === i ? { ...s, [field]: value } : s)) }));

  // Send to the server, close on success
  function save() {
    setDismissLocked(true);
    startTransition(async () => {
      try {
        const res = await logWorkout({
          date,
          workoutName: name,
          durationMins: Number(duration),
          intensity,
          notes,
          exercises: exercises.map((e) => ({
            name: e.name,
            sets: e.sets.map((s) => ({ reps: Number(s.reps), weightKg: Number(s.weightKg) })),
          })),
          cardio: cardioOn ? { type: cardioType, mins: Number(cardioMins), distanceKm: distance ? Number(distance) : null } : null,
        });
        if (res.error) return setError(res.error);
        onOpenChange(false);
      } catch {
        setError("Couldn't save the workout. Try again.");
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
        title={template ? template.name : "Log workout"}
        subtitle="Sets, reps and weight. Last time's numbers are pre-filled."
      />

      <div className="relative space-y-6 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className={LABEL}>Workout</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Push day" className={FIELD} />
          </label>
          <label>
            <span className={LABEL}>Date</span>
            <Input type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} className={FIELD} />
          </label>
        </div>

        {/* Exercises */}
        <datalist id="exercise-names">
          {suggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        <div className="space-y-3">
          {exercises.map((ex) => (
            <div key={ex.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <Input
                  list="exercise-names"
                  value={ex.name}
                  onChange={(e) => patch(ex.key, (d) => ({ ...d, name: e.target.value }))}
                  placeholder="Exercise"
                  className={`${FIELD} flex-1 font-medium`}
                />
                <button
                  type="button"
                  aria-label="Remove exercise"
                  onClick={() => setExercises((xs) => xs.filter((e) => e.key !== ex.key))}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {last[ex.name] && <p className="mt-2 text-xs text-zinc-500">Last time: {summary(last[ex.name])}</p>}

              <div className="mt-3 grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-2 text-xs text-zinc-500">
                <span>Set</span>
                <span>Reps</span>
                <span>kg</span>
                <span />
                {ex.sets.map((s, i) => (
                  <div key={i} className="contents">
                    <span className="text-center text-sm tabular-nums text-zinc-400">{i + 1}</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={s.reps}
                      onChange={(e) => setField(ex.key, i, "reps", e.target.value)}
                      className={FIELD}
                    />
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step={0.5}
                      value={s.weightKg}
                      onChange={(e) => setField(ex.key, i, "weightKg", e.target.value)}
                      placeholder="0"
                      className={FIELD}
                    />
                    <button
                      type="button"
                      aria-label="Remove set"
                      onClick={() => patch(ex.key, (d) => ({ ...d, sets: d.sets.filter((_, j) => j !== i) }))}
                      className="grid size-8 place-items-center rounded-full text-zinc-600 hover:text-zinc-300"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  patch(ex.key, (d) => ({ ...d, sets: [...d.sets, { ...(d.sets.at(-1) ?? { reps: "8", weightKg: "" }) }] }))
                }
                className="mt-3 text-sm text-zinc-400 hover:text-zinc-100"
              >
                + Add set
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setExercises((xs) => [...xs, draftFor("", last)])}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 text-sm text-zinc-400 transition hover:border-white/25 hover:text-zinc-100"
          >
            <Plus className="size-4" /> Add exercise
          </button>
        </div>

        {/* Cardio */}
        <div className="rounded-2xl border border-white/[0.06] p-3 sm:p-4">
          <button
            type="button"
            onClick={() => setCardioOn((v) => !v)}
            className="flex w-full items-center justify-between text-sm"
          >
            <span className="font-medium text-zinc-200">Cardio</span>
            <span className={`rounded-full px-3 py-1 text-xs ${cardioOn ? "bg-[#f97362]/20 text-[#f97362]" : "bg-white/[0.05] text-zinc-500"}`}>
              {cardioOn ? "Included" : "Add cardio"}
            </span>
          </button>
          {cardioOn && (
            <div className="mt-4 space-y-3">
              <ToggleGroup
                type="single"
                value={cardioType}
                onValueChange={(v) => v && setCardioType(v as CardioType)}
                className="grid w-full grid-cols-5 gap-2"
                spacing={2}
              >
                {CARDIO_TYPES.map((t) => (
                  <ToggleGroupItem
                    key={t}
                    value={t}
                    title={t}
                    className="flex h-14 w-full flex-col gap-0.5 rounded-xl border border-white/[0.06] text-[10px] text-zinc-500 data-[state=on]:border-transparent data-[state=on]:text-zinc-100"
                    style={cardioType === t ? { background: `${CARDIO_META[t].color}26` } : undefined}
                  >
                    <span className="text-lg">{CARDIO_META[t].icon}</span>
                    {t}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className={LABEL}>Minutes</span>
                  <Input type="number" min={1} value={cardioMins} onChange={(e) => setCardioMins(e.target.value)} className={FIELD} />
                </label>
                <label>
                  <span className={LABEL}>Distance (km, optional)</span>
                  <Input type="number" min={0} step={0.1} value={distance} onChange={(e) => setDistance(e.target.value)} className={FIELD} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Session */}
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
          <label>
            <span className={LABEL}>Total minutes</span>
            <Input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} className={FIELD} />
          </label>
          <div>
            <span className={LABEL}>
              Effort · <span style={{ color: INTENSITY_META[intensity].color }}>{INTENSITY_META[intensity].label}</span>
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
        </div>

        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did it feel? Form cues, pain, PR attempts…"
          rows={2}
          className="resize-none rounded-2xl border-white/10 bg-white/[0.04]"
        />

        <div className="flex items-center justify-end gap-4">
          {error && (
            <p role="alert" className="mr-auto text-sm text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="h-11 rounded-full px-7 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: ACTIVITY_COLOR }}
          >
            {pending ? "Saving…" : "Finish workout"}
          </button>
        </div>
      </div>
    </div>
  );
}

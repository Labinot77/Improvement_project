"use client";

import { useState, useTransition } from "react";
import { ListOrdered, Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import ModalHeader from "@/app/components/ModalHeader";
import { useModal } from "@/providers/Modalprovider";
import { ACTIVITY_COLOR, COMMON_EXERCISES } from "@/constants/fitness";
import { removeTemplate, saveTemplate } from "@/app/activity/actions/main";
import type { WorkoutTemplate } from "@/types/fitness";

type Row = { key: number; name: string; sets: string; reps: string };
type Props = { onOpenChange: (open: boolean) => void; template?: WorkoutTemplate };

const FIELD = "h-10 rounded-xl border-white/10 bg-white/[0.04]";
let nextKey = 0;

// Modal: create or edit one day of the workout program
export function TemplateModal({ onOpenChange, template }: Props) {
  const { setDismissLocked } = useModal();
  const [name, setName] = useState(template?.name ?? "");
  const [rows, setRows] = useState<Row[]>(() =>
    (template?.exercises.length ? template.exercises : [{ name: "", sets: 3, reps: 8 }]).map((e) => ({
      key: nextKey++,
      name: e.name,
      sets: String(e.sets),
      reps: String(e.reps),
    })),
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  // Update one row
  const patch = (key: number, field: keyof Row, value: string) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: value } : r)));

  // Run a server call, close on success
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
        icon={<ListOrdered className="size-4" />}
        color={ACTIVITY_COLOR}
        title={template ? "Edit program day" : "New program day"}
        subtitle="A workout you repeat, like Push, Pull or Legs."
      />

      <div className="relative space-y-5 p-5 sm:p-6">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Workout name, e.g. Push day" className={`${FIELD} h-11`} />

        <datalist id="template-exercises">
          {COMMON_EXERCISES.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>

        <div className="grid grid-cols-[1fr_3.5rem_3.5rem_2rem] items-center gap-2 text-xs text-zinc-500">
          <span>Exercise</span>
          <span>Sets</span>
          <span>Reps</span>
          <span />
          {rows.map((r) => (
            <div key={r.key} className="contents">
              <Input list="template-exercises" value={r.name} onChange={(e) => patch(r.key, "name", e.target.value)} placeholder="Bench press" className={FIELD} />
              <Input type="number" min={1} value={r.sets} onChange={(e) => patch(r.key, "sets", e.target.value)} className={FIELD} />
              <Input type="number" min={1} value={r.reps} onChange={(e) => patch(r.key, "reps", e.target.value)} className={FIELD} />
              <button
                type="button"
                aria-label="Remove exercise"
                onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
                className="grid size-8 place-items-center rounded-full text-zinc-600 hover:text-zinc-300"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setRows((rs) => [...rs, { key: nextKey++, name: "", sets: "3", reps: "8" }])}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100"
        >
          <Plus className="size-4" /> Add exercise
        </button>

        <div className="flex items-center justify-end gap-3 pt-1">
          {error && (
            <p role="alert" className="mr-auto text-sm text-red-400">
              {error}
            </p>
          )}
          {template && (
            <button
              type="button"
              aria-label="Delete program day"
              disabled={pending}
              onClick={() => run(() => removeTemplate(template.id))}
              className="mr-auto grid size-10 place-items-center rounded-full text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="size-4" />
            </button>
          )}
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              run(() =>
                saveTemplate(template?.id ?? null, {
                  name,
                  exercises: rows.map((r) => ({ name: r.name, sets: Number(r.sets), reps: Number(r.reps) })),
                }),
              )
            }
            className="h-10 rounded-full px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: ACTIVITY_COLOR }}
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

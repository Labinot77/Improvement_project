"use client";

import { useState } from "react";
import { Moon, Pencil, Sun, Trash2 } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { dateLabel, formatDuration, sleepStatus } from "@/app/sleep/data/main";
import type { SleepEntry, SleepFormValues } from "@/types/sleep";

interface Props {
  entry: SleepEntry;
  onSave: (values: SleepFormValues) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onOpenChange: (open: boolean) => void;
}

// One night's details, with edit and delete
export function SleepPreviewModal({ entry, onSave, onDelete, onOpenChange }: Props) {
  const { open } = useModal();
  const [error, setError] = useState<string | null>(null);
  const status = sleepStatus(entry.durationHours);

  // Confirm, delete, close
  function remove() {
    open("confirm", {
      title: "Delete night",
      destructive: true,
      onConfirm: async () => {
        try {
          await onDelete(entry.id);
          onOpenChange(false);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Couldn't delete the entry.");
        }
      },
    });
  }

  return (
    <div>
      <span className="rounded-full px-3 py-1 text-sm" style={{ color: status.color, background: `${status.color}1a` }}>
        {status.label}
      </span>
      <h2 className="mt-4 text-2xl font-semibold text-zinc-100">
        {dateLabel(entry.date, { weekday: "long", month: "long", day: "numeric" })}
      </h2>
      <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">{formatDuration(entry.durationHours)}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/[0.045] p-4">
          <p className="flex items-center gap-1.5 text-sm text-zinc-500"><Moon className="size-4 text-indigo-300" /> Bedtime</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{entry.bedtime}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.045] p-4">
          <p className="flex items-center gap-1.5 text-sm text-zinc-500"><Sun className="size-4 text-amber-300" /> Wake up</p>
          <p className="mt-1 text-xl font-semibold tabular-nums">{entry.wakeTime}</p>
        </div>
      </div>

      <p className="mt-5 whitespace-pre-wrap break-words text-zinc-400">{entry.notes || "No notes."}</p>
      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={remove}
          className="flex items-center gap-1.5 rounded-full border border-red-500/20 px-5 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10">
          <Trash2 className="size-4" /> Delete
        </button>
        <button type="button" onClick={() => { onOpenChange(false); open("sleep_form", { entry, onSave }); }}
          className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200">
          <Pencil className="size-4" /> Edit
        </button>
      </div>
    </div>
  );
}

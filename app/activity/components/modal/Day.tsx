"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Activity } from "@/types/fitness";
import { ACTIVITY_META, INTENSITY_META } from "@/constants/fitness";
import { useModal } from "@/providers/Modalprovider";
import { dateLabel, dayKey } from "@/app/activity/data/main";
import { useActivityModals } from "../UseActivityModal";

interface Props {
  onOpenChange: (open: boolean) => void;
  date: string;
  sessions: Activity[];
  onDelete: (id: string) => Promise<void>;
}

// Sessions on one day, with delete and quick-log
export function DayActivityModal({ onOpenChange, date, sessions, onDelete }: Props) {
  const { open } = useModal();
  const { openForm } = useActivityModals();
  const [list, setList] = useState(sessions);
  const [error, setError] = useState<string | null>(null);

  // Confirm, delete, drop from the local list
  function remove(id: string) {
    open("confirm", {
      title: "Delete session",
      destructive: true,
      onConfirm: async () => {
        try {
          await onDelete(id);
          setList((l) => l.filter((s) => s.id !== id));
        } catch (e) {
          setError(e instanceof Error ? e.message : "Couldn't delete the session.");
        }
      },
    });
  }

  return (
    <div>
      <p className="text-sm font-medium tracking-[0.2em] text-rose-300">
        {list.length} {list.length === 1 ? "SESSION" : "SESSIONS"}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-zinc-100">
        {dateLabel(date, { weekday: "long", month: "long", day: "numeric" })}
      </h2>

      <div className="mt-6 flex max-h-[55dvh] flex-col gap-3 overflow-y-auto">
        {list.length === 0 && (
          <p className="rounded-2xl bg-white/[0.04] p-5 text-zinc-500">No sessions on this day.</p>
        )}
        {list.map((s) => {
          const intensity = INTENSITY_META[s.intensity];
          return (
            <div key={s.id} className="flex items-start gap-4 rounded-2xl bg-white/[0.045] p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-rose-300/10 text-xl" aria-hidden>
                {ACTIVITY_META[s.type].icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-zinc-100">{s.type}</p>
                  <span className="rounded-full px-2 py-0.5 text-xs" style={{ color: intensity.color, background: `${intensity.color}1a` }}>
                    {intensity.label}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-zinc-500">{s.durationMins} minutes</p>
                {s.notes && <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-400">{s.notes}</p>}
              </div>
              <button type="button" aria-label="Delete session" onClick={() => remove(s.id)}
                className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400">
                <Trash2 className="size-4" />
              </button>
            </div>
          );
        })}
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={() => onOpenChange(false)}
          className="rounded-full border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05]">
          Close
        </button>
        {date <= dayKey() && (
          <button type="button" onClick={() => { onOpenChange(false); openForm(date); }}
            className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200">
            <Plus className="size-4" /> Log session
          </button>
        )}
      </div>
    </div>
  );
}

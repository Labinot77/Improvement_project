"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Activity } from "@/types/fitness";
import { ACTIVITY_META, INTENSITY_META } from "@/constants/fitness";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: string;
  sessions: Activity[];
}

export function DayActivityModal({ open, onOpenChange, date, sessions }: Props) {
  const label = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">{label}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-1">
          {sessions.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">
              No sessions on this day.
            </p>
          ) : (
            sessions.map((session) => {
              const meta    = ACTIVITY_META[session.type];
              const intMeta = INTENSITY_META[session.intensity];
              return (
                <div
                  key={session.id}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#131313] px-3 py-3"
                >
                  <span className="text-xl shrink-0">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-zinc-100">{session.type}</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          color: intMeta.color,
                          borderColor: `${intMeta.color}40`,
                          background: `${intMeta.color}12`,
                        }}
                      >
                        {intMeta.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{session.durationMins} minutes</p>
                    {session.notes && (
                      <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">{session.notes}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
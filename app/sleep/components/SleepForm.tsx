"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Save, Trash2 } from "lucide-react";
import type { SleepEntry } from "@/types/sleep";
import { calcDuration, formatDuration } from "@/lib/sleep/calc";
import { useUser } from "@/lib/use_user";
import { Textarea } from "@/components/ui/textarea";
import No_access from "@/app/components/no_access";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

interface Props {
  date: string;
  existing?: SleepEntry;
  onSave: (fields: { bedtime: string; wakeTime: string; notes: string }) => void;
  onDelete?: () => void;
}

export function SleepLogForm({ date, existing, onSave, onDelete }: Props) {
  const { isLoggedIn } = useUser();
  const [bedtime, setBedtime] = useState(existing?.bedtime ?? "23:00");
  const [wakeTime, setWakeTime] = useState(existing?.wakeTime ?? "07:00");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setBedtime(existing?.bedtime ?? "23:00");
    setWakeTime(existing?.wakeTime ?? "07:00");
    setNotes(existing?.notes ?? "");
    setSaved(false);
  }, [date, existing]);

  const duration = calcDuration(bedtime, wakeTime);
  const durationLabel = formatDuration(duration);
  const isUnder = duration < 7;
  const isOver  = duration > 9;

  function handleSave() {
    onSave({ bedtime, wakeTime, notes });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="relative flex flex-col gap-4">
      <div className={!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""}>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <Moon className="size-3 text-indigo-400" /> Bedtime
            </label>
            <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
              <Sun className="size-3 text-amber-400" /> Wake up
            </label>
            <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#131313] px-3 py-2 mt-4">
          <span className="text-xs text-zinc-500">Duration</span>
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold tabular-nums"
              style={{ color: isUnder ? "#ef4444" : isOver ? "#f97316" : "#22c55e" }}
            >
              {durationLabel}
            </span>
            <span className="text-xs text-zinc-600">
              {isUnder ? "below target" : isOver ? "above target" : "on target"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-4">
          <label className="text-xs font-medium text-zinc-500">Notes</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did you feel? Any dreams, disturbances…"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
            style={{
              background: saved ? "rgba(34,197,94,0.15)" : "rgba(99,102,241,0.18)",
              border: `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.28)"}`,
              color: saved ? "#86efac" : "#818cf8",
            }}
          >
            <Save className="size-4" />
            {saved ? "Saved!" : existing ? "Update" : "Log sleep"}
          </motion.button>

          {existing && onDelete && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onDelete}
              className="flex items-center justify-center rounded-xl px-3 py-2.5 transition-all
                border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
            >
              <Trash2 className="size-4" />
            </motion.button>
          )}
        </div>
      </div>

      {!isLoggedIn && <No_access />}
    </div>
  );
}
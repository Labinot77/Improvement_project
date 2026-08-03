"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { ActivityType, IntensityLevel } from "@/types/fitness";
import { ALL_ACTIVITY_TYPES, ALL_INTENSITIES, ACTIVITY_META, INTENSITY_META } from "@/constants/fitness";
import { formatDate } from "@/lib/mics/date";
import No_access from "@/app/components/NoAccess";
import { useUser } from "@/lib/use_user";
import type { ActivityInput } from "@/lib/use_fitness";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all";

interface Props {
  onSave: (input: ActivityInput) => void;
}

export function ActivityForm({ onSave }: Props) {
  const { isLoggedIn }   = useUser();
  const [type, setType]  = useState<ActivityType>("Martial Arts");
  const [duration, setDuration] = useState("60");
  const [intensity, setIntensity] = useState<IntensityLevel>(3);
  const [notes, setNotes] = useState("");
  const [date, setDate]  = useState(formatDate(new Date()));
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const mins = parseInt(duration);
    if (!mins || mins <= 0) return;

    onSave({ date, type, durationMins: mins, intensity, notes: notes.trim() });
    setSaved(true);
    setNotes("");
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="relative flex flex-col gap-4">
      <div className={!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""}>

        {/* Type + Date row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-zinc-500">Activity</p>
            <Select value={type} onValueChange={(v) => setType(v as ActivityType)}>
              <SelectTrigger className="rounded-xl border border-white/[0.08] bg-[#161616] text-sm text-zinc-100 focus:ring-red-500/20 focus:border-red-500/50">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{ACTIVITY_META[type].icon}</span>
                    <span>{type}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#161616] text-zinc-100">
                {ALL_ACTIVITY_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="focus:bg-white/[0.06]">
                    <span className="flex items-center gap-2">
                      <span>{ACTIVITY_META[t].icon}</span>
                      <span style={{ color: ACTIVITY_META[t].color }}>{t}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5 mt-3">
          <p className="text-xs font-medium text-zinc-500">Duration (minutes)</p>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 60"
            min={1}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 mt-3">
          <p className="text-xs font-medium text-zinc-500">Intensity</p>
          <div className="flex gap-2">
            {ALL_INTENSITIES.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setIntensity(lvl)}
                className="flex-1 flex flex-col items-center rounded-xl border py-2 transition-all"
                style={{
                  borderColor: intensity === lvl ? INTENSITY_META[lvl].color : "rgba(255,255,255,0.06)",
                  background:  intensity === lvl ? `${INTENSITY_META[lvl].color}18` : "transparent",
                  color:       intensity === lvl ? INTENSITY_META[lvl].color : "#52525b",
                }}
              >
                <span className="text-xs font-semibold">{lvl}</span>
                <span className="text-[9px] mt-0.5">{INTENSITY_META[lvl].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5 mt-3">
          <p className="text-xs font-medium text-zinc-500">Notes</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it go? PRs, technique, how you felt…"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all"
          style={{
            background: saved ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
            border:     `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            color:      saved ? "#86efac" : "#f87171",
          }}
        >
          <Save className="size-4" />
          {saved ? "Logged!" : "Log session"}
        </motion.button>
      </div>

      {!isLoggedIn && <No_access />}
    </div>
  );
}
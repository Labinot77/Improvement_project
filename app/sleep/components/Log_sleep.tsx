"use client";

import { SleepEntry } from "@/types/sleep";
import { useState } from "react";

interface LogSleepFormProps {
  onLog: (entry: Omit<SleepEntry, "id" | "duration_hours">) => void;
}

export default function LogSleepForm({ onLog }: LogSleepFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const qualityLabels: Record<number, string> = {
    1: "Terrible",
    2: "Poor",
    3: "Okay",
    4: "Good",
    5: "Excellent",
  };

  const qualityColors: Record<number, string> = {
    1: "#ef4444",
    2: "#f97316",
    3: "#eab308",
    4: "#22c55e",
    5: "#6366f1",
  };

  function handleSubmit() {
    onLog({ date, bedtime, wake_time: wakeTime, quality, notes });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all";

  const labelClass = "block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={today}
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className={labelClass}>Bedtime</label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className={labelClass}>Wake time</label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className={inputClass}
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Sleep quality —{" "}
          <span style={{ color: qualityColors[quality] }}>
            {qualityLabels[quality]}
          </span>
        </label>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as const).map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200"
              style={{
                borderColor:
                  quality === q ? qualityColors[q] : "rgba(255,255,255,0.06)",
                background:
                  quality === q
                    ? `${qualityColors[q]}20`
                    : "transparent",
                color: quality === q ? qualityColors[q] : "#71717a",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Woke up at 3am, vivid dreams, felt groggy..."
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200"
        style={{
          background: submitted
            ? "rgba(99,102,241,0.15)"
            : "rgba(99,102,241,0.2)",
          border: "1px solid rgba(99,102,241,0.3)",
          color: submitted ? "#a5b4fc" : "#818cf8",
        }}
      >
        {submitted ? "✓ Logged" : "Log sleep"}
      </button>
    </div>
  );
}
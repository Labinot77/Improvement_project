"use client";

interface BedtimeGoalRingProps {
  targetBedtime: string;   // "HH:MM"
  actualBedtime: string;   // "HH:MM" — last entry
  onTime: boolean;
  streakDays: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  const minutes = h * 60 + m;
  return minutes < 360 ? minutes + 1440 : minutes; // < 6am = next day
}

function minutesToLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function BedtimeGoalRing({
  targetBedtime,
  actualBedtime,
  onTime,
  streakDays,
}: BedtimeGoalRingProps) {
  const targetMins = timeToMinutes(targetBedtime);
  const actualMins = timeToMinutes(actualBedtime);
  const diffMins = actualMins - targetMins;
  const absDiff = Math.abs(diffMins);
  const diffLabel =
    absDiff === 0
      ? "On time"
      : `${absDiff}m ${diffMins > 0 ? "late" : "early"}`;

  // Ring: how close to target (within 60 min window)
  const closeness = Math.max(0, 1 - absDiff / 60);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - closeness);
  const ringColor = onTime ? "#6366f1" : absDiff <= 30 ? "#eab308" : "#ef4444";

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      {/* Ring */}
      <div className="relative shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="50" cy="50" r="40"
            fill="none"
            stroke={ringColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg" aria-hidden>
            {onTime ? "✓" : "→"}
          </span>
          <span
            className="text-[10px] font-medium"
            style={{ color: ringColor }}
          >
            {onTime ? "On track" : diffLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 flex-1 w-full">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-500">Target</span>
          <span className="text-sm font-semibold text-zinc-100">
            {minutesToLabel(targetBedtime)}
          </span>
        </div>
        <div className="h-px bg-white/[0.05]" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-500">Last night</span>
          <span className="text-sm font-semibold" style={{ color: ringColor }}>
            {minutesToLabel(actualBedtime)}
          </span>
        </div>
        <div className="h-px bg-white/[0.05]" />
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-500">On-time streak</span>
          <span className="text-sm font-semibold text-indigo-400">
            {streakDays} {streakDays === 1 ? "day" : "days"} 🔥
          </span>
        </div>
      </div>
    </div>
  );
}
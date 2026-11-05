import { moodOf } from "@/constants/journal";
import type { Mood } from "@/types/journal";

export function MoodChip({ mood }: { mood: Mood }) {
  const m = moodOf(mood);
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${m.chip}`}>
      {m.emoji} {m.label}
    </span>
  );
}
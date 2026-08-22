import { Signal } from "@/types/trading";

export const ACCENT = "rgba(99,102,241,0.20)"; // indigo — used for card glows, matches dashboard tile

export const SIGNAL_META: Record<
  Signal,
  { label: string; color: string; bg: string; border: string }
> = {
  very_bullish: {
    label: "Very Bullish",
    color: "#c7d2fe",
    bg: "#4f46e5",
    border: "rgba(79,70,229,0.5)",
  },
  bullish: {
    label: "Bullish",
    color: "#e0e7ff",
    bg: "#6366f1",
    border: "rgba(99,102,241,0.45)",
  },
  neutral: {
    label: "Neutral",
    color: "#e4e4e7",
    bg: "#3f3f46",
    border: "rgba(255,255,255,0.10)",
  },
  bearish: {
    label: "Bearish",
    color: "#fee2e2",
    bg: "#ef4444",
    border: "rgba(239,68,68,0.45)",
  },
  very_bearish: {
    label: "Very Bearish",
    color: "#fee2e2",
    bg: "#dc2626",
    border: "rgba(220,38,38,0.5)",
  },
};

/** Maps a -10..10 composite score to a Signal bucket. */
export function scoreToSignal(score: number): Signal {
  if (score >= 7) return "very_bullish";
  if (score >= 2) return "bullish";
  if (score > -2) return "neutral";
  if (score > -7) return "bearish";
  return "very_bearish";
}

/** Normalizes -10..10 to 0..1 for gauge placement. */
export function scoreToUnit(score: number): number {
  return (Math.max(-10, Math.min(10, score)) + 10) / 20;
}
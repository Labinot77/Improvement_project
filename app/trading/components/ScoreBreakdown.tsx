"use client";

import type { ScoreBreakdown as ScoreBreakdownType } from "@/types/trading";

interface Props {
  scores: ScoreBreakdownType;
}

export function ScoreBreakdown({ scores }: Props) {
  const rows: { label: string; value: number; max: number }[] = [
    { label: "EdgeFinder score", value: scores.edgeScore, max: 10 },
    { label: "Technical score", value: scores.technicalScore, max: 5 },
    { label: "Sentiment + COT score", value: scores.sentimentScore, max: 5 },
    { label: "Fundamentals score", value: scores.fundamentalsScore, max: 5 },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3">
          <span className="text-sm text-zinc-400">{row.label}</span>
          <div
            className="flex min-w-14 items-center justify-center rounded-lg px-3 py-1 text-sm font-semibold tabular-nums"
            style={{
              background: row.value >= 0 ? "rgba(99,102,241,0.18)" : "rgba(239,68,68,0.15)",
              color: row.value >= 0 ? "#a5b4fc" : "#fca5a5",
              border: `1px solid ${row.value >= 0 ? "rgba(99,102,241,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}

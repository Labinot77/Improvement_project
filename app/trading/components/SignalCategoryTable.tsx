"use client";

import { SIGNAL_META } from "@/constants/trading";
import { SignalCategory } from "@/types/trading";
import { InfoIcon } from "lucide-react";

interface Props {
  category: SignalCategory;
}

function SignalPill({ signal }: { signal: SignalCategory["signal"] }) {
  const meta = SIGNAL_META[signal];
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold sm:text-sm"
      style={{ background: meta.bg, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

export function SignalCategoryTable({ category }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
      {/* Category header */}
      <div className="flex items-center justify-between gap-3 bg-white/[0.03] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-zinc-200">{category.label}</span>
          <InfoIcon className="size-3 text-zinc-600" />
        </div>
        <span
          className="text-xs font-medium sm:text-sm"
          style={{ color: SIGNAL_META[category.signal].bg }}
        >
          {SIGNAL_META[category.signal].label}
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-white/[0.05]">
        {category.points.map((point) => (
          <div
            key={point.label}
            className="grid grid-cols-2 items-center gap-2 px-4 py-2.5 sm:grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.7fr] bg-[#101010]"
          >
            <span className="text-xs text-zinc-400 sm:text-sm">{point.label}</span>

            <div className="flex justify-start sm:justify-center">
              <SignalPill signal={point.signal} />
            </div>

            {point.note ? (
              <span className="col-span-2 text-xs text-zinc-500 sm:col-span-3 sm:text-sm">
                {point.note}
              </span>
            ) : (
              category.showColumns && (
                <>
                  <span className="hidden text-right text-sm text-zinc-300 tabular-nums sm:block">
                    {point.actual ?? "—"}
                  </span>
                  <span className="hidden text-right text-sm italic text-zinc-500 tabular-nums sm:block">
                    {point.forecast ?? "—"}
                  </span>
                  <span
                    className="hidden text-right text-sm tabular-nums sm:block"
                    style={{
                      color: point.surprise?.startsWith("-") ? "#f87171" : "#818cf8",
                    }}
                  >
                    {point.surprise ?? "—"}
                  </span>
                </>
              )
            )}

            {/* Mobile: compact actual/forecast/surprise row */}
            {!point.note && category.showColumns && (
              <div className="col-span-2 flex items-center gap-3 text-[11px] text-zinc-500 sm:hidden">
                {point.actual && <span>A: <span className="text-zinc-300">{point.actual}</span></span>}
                {point.forecast && <span>F: <span className="text-zinc-400">{point.forecast}</span></span>}
                {point.surprise && (
                  <span style={{ color: point.surprise.startsWith("-") ? "#f87171" : "#818cf8" }}>
                    S: {point.surprise}
                  </span>
                )}
                {point.releaseDate && <span className="ml-auto text-zinc-600">{point.releaseDate}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

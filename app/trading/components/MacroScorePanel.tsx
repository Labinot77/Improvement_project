"use client";

import { motion } from "framer-motion";
import SectionCard from "@/app/components/SectionCard";
import { ScoreGauge } from "./ScoreGauge";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ScoreHistoryChart } from "./ScoreHistoryChart";
import { SymbolSelect } from "./SymbolSelect";
import { ACCENT, SIGNAL_META } from "@/constants/trading";
import { MacroSnapshot } from "@/types/trading";

interface Props {
  snapshot: MacroSnapshot;
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function MacroScorePanel({ snapshot, symbol, onSymbolChange }: Props) {
  const meta = SIGNAL_META[snapshot.overallSignal];
  const updated = new Date(snapshot.updatedAt);

  return (
    <div className="flex flex-col gap-4">
      <SectionCard accentGlow={ACCENT}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Symbol
            </span>
            <div className="w-36">
              <SymbolSelect value={symbol} onChange={onSymbolChange} />
            </div>
          </div>

          <motion.div
            key={snapshot.overallSignal}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl py-3 text-center text-base font-bold"
            style={{ background: meta.bg, color: meta.color }}
          >
            {meta.label}
          </motion.div>

          <p className="text-center text-xs text-zinc-600">
            {updated.toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
            {", "}
            {updated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </p>

          <div className="flex justify-center">
            <ScoreGauge score={snapshot.scores.edgeScore} />
          </div>

          <ScoreBreakdown scores={snapshot.scores} />
        </div>
      </SectionCard>

      <SectionCard title="Score history" accentGlow={ACCENT}>
        <ScoreHistoryChart history={snapshot.history} />
      </SectionCard>
    </div>
  );
}

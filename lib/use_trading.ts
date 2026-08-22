"use client";

import { MacroSnapshot, ScoreHistoryPoint } from "@/types/trading";
import { useEffect, useState } from "react";

/**
 * Returns the macro/EdgeFinder-style snapshot for a symbol.
 * TODO(backend): replace the mock branch with a real fetch, e.g.
 *   const res = await fetch(`/api/trading/macro?symbol=${symbol}`);
 *   const data: MacroSnapshot = await res.json();
 * Keep the returned shape identical to MacroSnapshot so no UI changes are needed.
 */
export function useMacroSnapshot(symbol: string) {
  const [data, setData] = useState<MacroSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const timer = setTimeout(() => {
      if (cancelled) return;
      setData({ ...MOCK_SNAPSHOT, symbol });
      setLoading(false);
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [symbol]);

  return { data, loading };
}


function buildHistory(): ScoreHistoryPoint[] {
  // Deterministic mock trend: choppy negative -> recovering positive, ~7 weeks
  const raw = [-6, -7, -8, -6, -5, -6, -4, -3, -1, 1, 2, 4, 5, 6, 8];
  const start = new Date();
  start.setDate(start.getDate() - (raw.length - 1) * 5);
  return raw.map((score, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i * 5);
    return { date: d.toISOString().slice(0, 10), score };
  });
}

export const MOCK_SYMBOLS = ["GOLD", "SILVER", "EURUSD", "BTCUSD", "SPX500"] as const;

export const MOCK_SNAPSHOT: MacroSnapshot = {
  symbol: "GOLD",
  updatedAt: new Date().toISOString(),
  overallSignal: "very_bullish",
  scores: {
    edgeScore: 8,
    technicalScore: 3,
    sentimentScore: 1,
    fundamentalsScore: 4,
  },
  crowdSentiment: {
    bullishPct: 82,
    signal: "bearish", // contrarian crowd read, mirrors screenshot
  },
  history: buildHistory(),
  categories: [
    {
      key: "technicals",
      label: "Technicals",
      signal: "very_bullish",
      showColumns: false,
      points: [
        { label: "4H / Daily Chart Trend", signal: "bullish" },
        { label: "Seasonality Trend", signal: "bullish" },
      ],
    },
    {
      key: "institutional",
      label: "Institutional activity",
      signal: "bullish",
      showColumns: true,
      points: [
        { label: "COT – Net Positioning", signal: "bullish", actual: "85.4%", forecast: "14.6%", surprise: "0.78%" },
        { label: "COT – Latest Buys/Sells", signal: "bullish", actual: "85.4%", forecast: "14.6%", surprise: "0.78%" },
      ],
    },
    {
      key: "growth",
      label: "Economic growth",
      signal: "very_bullish",
      showColumns: true,
      points: [
        { label: "GDP Growth QoQ", signal: "bullish", actual: "1.50%", forecast: "2.10%", surprise: "-0.60%" },
        { label: "Manufacturing PMI", signal: "bearish", actual: "55.6", forecast: "54", surprise: "1.60" },
        { label: "Services PMI", signal: "bullish", actual: "54.1", forecast: "54.5", surprise: "-0.40" },
        { label: "Retail Sales MoM", signal: "neutral", actual: "0.20%", forecast: "0.20%", surprise: "0.00%" },
        { label: "Consumer Confidence", signal: "bullish", actual: "90.8", forecast: "92.4", surprise: "-1.60" },
      ],
    },
    {
      key: "inflation",
      label: "Inflation",
      signal: "bullish",
      showColumns: true,
      points: [
        { label: "CPI YoY", signal: "bullish", actual: "3.5%", forecast: "3.8%", surprise: "-0.3%" },
        { label: "PPI YoY", signal: "bullish", actual: "5.5%", forecast: "6.2%", surprise: "-0.7%" },
        { label: "PCE YoY", signal: "neutral", actual: "3.3%", forecast: "3.3%", surprise: "0%" },
        { label: "2 Yr Yield (21 day SMA)", signal: "bearish", note: "The 2yr yield is rising (hawkish)" },
      ],
    },
    {
      key: "jobs",
      label: "Jobs market",
      signal: "bullish",
      showColumns: true,
      points: [
        { label: "Non-Farm Payroll", signal: "bullish", actual: "57k", forecast: "114k", surprise: "-57k", releaseDate: "Jul 2" },
        { label: "Unemployment Rate %", signal: "bearish", actual: "4.20%", forecast: "4.30%", surprise: "-0.10%", releaseDate: "Jul 2" },
        { label: "Weekly Jobless Claims", signal: "bearish", actual: "199k", forecast: "202k", surprise: "-3k", releaseDate: "Aug 6" },
        { label: "ADP Employment Change", signal: "bullish", actual: "44k", forecast: "68k", surprise: "-24k", releaseDate: "Aug 5" },
        { label: "JOLTS Job Openings", signal: "bullish", actual: "7.36M", forecast: "7.44M", surprise: "-0.08M", releaseDate: "Aug 4" },
      ],
    },
  ],
};
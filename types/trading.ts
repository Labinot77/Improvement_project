export type Signal = "very_bullish" | "bullish" | "neutral" | "bearish" | "very_bearish";

export type SignalCategoryKey =
  | "technicals"
  | "institutional"
  | "growth"
  | "inflation"
  | "jobs";

export interface DataPoint {
  /** Row label, e.g. "CPI YoY" */
  label: string;
  signal: Signal;
  actual?: string;
  forecast?: string;
  surprise?: string;
  /** Freeform note shown instead of actual/forecast/surprise (e.g. "2yr yield is rising (hawkish)") */
  note?: string;
  releaseDate?: string;
}

export interface SignalCategory {
  key: SignalCategoryKey;
  label: string;
  /** Overall signal for the whole category, shown in the header row */
  signal: Signal;
  points: DataPoint[];
  /** Whether to show Actual/Forecast/Surprise columns for this category */
  showColumns?: boolean;
}

export interface ScoreBreakdown {
  edgeScore: number;       // -10 to 10 composite
  technicalScore: number;  // -5 to 5
  sentimentScore: number;  // -5 to 5
  fundamentalsScore: number; // -5 to 5
}

export interface ScoreHistoryPoint {
  date: string; // "YYYY-MM-DD"
  score: number; // -10 to 10
}

export interface MacroSnapshot {
  symbol: string;
  updatedAt: string; // ISO
  overallSignal: Signal;
  scores: ScoreBreakdown;
  history: ScoreHistoryPoint[];
  categories: SignalCategory[];
  crowdSentiment: {
    bullishPct: number; // 0-100
    signal: Signal;
  };
}


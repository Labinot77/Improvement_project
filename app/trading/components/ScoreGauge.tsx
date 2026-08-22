"use client";

import { scoreToUnit } from "@/constants/trading";
import { motion } from "framer-motion";

interface Props {
  score: number; // -10..10
}

const SIZE = 220;
const CX = SIZE / 2;
const CY = SIZE / 2 + 6;
const R = 92;
const STROKE = 16;

// Semicircle from 180deg (left) to 0deg (right), going over the top
function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToXY(cx, cy, r, startDeg);
  const end = polarToXY(cx, cy, r, endDeg);
  const largeArc = Math.abs(startDeg - endDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function ScoreGauge({ score }: Props) {
  const unit = scoreToUnit(score); // 0..1, 0 = full bearish (left), 1 = full bullish (right)
  const needleAngle = 180 - unit * 180; // 180deg (left) -> 0deg (right)

  const needleTip = polarToXY(CX, CY, R - STROKE / 2 - 2, needleAngle);

  // Three bands: bearish (red) 180-120, neutral (gray) 120-60, bullish (blue) 60-0
  const bands: { start: number; end: number; color: string }[] = [
    { start: 180, end: 115, color: "#ef4444" },
    { start: 115, end: 65, color: "#71717a" },
    { start: 65, end: 0, color: "#6366f1" },
  ];

  return (
    <div className="relative flex flex-col items-center">
      <svg width={SIZE} height={SIZE / 2 + 30} viewBox={`0 0 ${SIZE} ${SIZE / 2 + 30}`}>
        {bands.map((b) => (
          <path
            key={b.color}
            d={arcPath(CX, CY, R, b.start, b.end)}
            stroke={b.color}
            strokeWidth={STROKE}
            strokeLinecap="butt"
            fill="none"
            opacity={0.85}
          />
        ))}

        {/* Tick marks */}
        {Array.from({ length: 21 }, (_, i) => i).map((i) => {
          const angle = 180 - (i / 20) * 180;
          const outer = polarToXY(CX, CY, R + STROKE / 2 + 3, angle);
          const inner = polarToXY(CX, CY, R + STROKE / 2 - 2, angle);
          return (
            <line
              key={i}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
            />
          );
        })}

        {/* Needle */}
        <motion.line
          x1={CX}
          y1={CY}
          initial={{ x2: CX - (R - STROKE / 2 - 2), y2: CY }}
          animate={{ x2: needleTip.x, y2: needleTip.y }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          stroke="#f4f4f5"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r={5} fill="#f4f4f5" />
      </svg>

      {/* Score bubble */}
      <div className="absolute bottom-0 flex flex-col items-center">
        <div
          className="flex size-14 items-center justify-center rounded-full text-2xl font-bold text-zinc-100 ring-2 ring-white/[0.15]"
          style={{
            background:
              score >= 0
                ? "radial-gradient(circle at 30% 30%, #818cf8, #4f46e5)"
                : "radial-gradient(circle at 30% 30%, #f87171, #dc2626)",
          }}
        >
          {score}
        </div>
      </div>
    </div>
  );
}

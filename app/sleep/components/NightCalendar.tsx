"use client";

import { motion } from "framer-motion";
import { useModal } from "@/providers/Modalprovider";
import { SLEEP_COLOR, TARGET_HOURS } from "@/constants/sleep/main";
import { CARD } from "@/constants/ui";
import { formatDuration, type nightCalendar } from "@/app/sleep/data/main";

type Cell = ReturnType<typeof nightCalendar>[number];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Fill strength by how close the night got to target
function fill(hours: number) {
  const r = Math.min(1, hours / TARGET_HOURS);
  return `color-mix(in srgb, ${SLEEP_COLOR} ${Math.round(20 + r * 70)}%, transparent)`;
}

// Five weeks of nights; tap a logged night to edit, an empty one to log it
export function NightCalendar({ cells }: { cells: Cell[] }) {
  const { open } = useModal();

  return (
    <section className={`${CARD} p-6 sm:p-8`}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Night log</h2>
          <p className="text-sm text-zinc-500">Brighter nights are closer to {TARGET_HOURS}h. Dashed = not logged.</p>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {DAYS.map((d) => (
          <span key={d} className="pb-1 text-center text-[11px] uppercase tracking-wider text-zinc-600">
            {d}
          </span>
        ))}
        {cells.map((c, i) => (
          <motion.button
            key={c.date}
            type="button"
            disabled={c.future}
            onClick={() => open("sleep_form", c.entry ? { entry: c.entry } : { date: c.date })}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01 }}
            whileHover={c.future ? undefined : { scale: 1.06 }}
            className={`flex aspect-square flex-col items-center justify-center rounded-xl text-xs sm:aspect-[5/4] sm:rounded-2xl ${
              c.entry ? "text-white" : c.future ? "opacity-20" : "border border-dashed border-white/10 text-zinc-600 hover:border-white/25"
            }`}
            style={c.entry ? { background: fill(c.entry.durationHours) } : undefined}
            title={c.entry ? `${c.entry.bedtime} → ${c.entry.wakeTime}` : "Log this night"}
          >
            <span className="font-medium">{c.day}</span>
            {c.entry && <span className="hidden text-[10px] opacity-80 sm:block">{formatDuration(c.entry.durationHours)}</span>}
          </motion.button>
        ))}
      </div>
    </section>
  );
}

"use client";

import { TEMPLATE } from "@/constants/progress/template";
import { motion } from "framer-motion";
import { FileTextIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
};

export function JournalSection({ value, onChange }: Props) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(next: string) {
    setLocal(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(next), 1500);
    console.log(timer.current ,next)
  }

  function applyTemplate() {
    if (!local.trim()) handleChange(TEMPLATE);
    else if (confirm("Replace your current journal entry with the template?")) handleChange(TEMPLATE);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
      className="flex flex-col flex-1 min-h-0 rounded-2xl border border-white/[0.06] bg-[#0f0f0f] p-5 gap-3"
    >
      <div className="flex items-center justify-between shrink-0">
        <div>
          <p className="text-sm font-semibold text-zinc-100">Daily Journal</p>
          <p className="text-xs text-zinc-500 mt-0.5">Reflect on your day</p>
        </div>
        <button
          onClick={applyTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] text-xs text-zinc-400 hover:text-zinc-200 hover:border-white/[0.12] transition-all duration-200"
        >
          <FileTextIcon className="size-3" />
          Template
        </button>
      </div>
      <textarea
        className="flex-1 min-h-65 resize-none rounded-xl border border-white/[0.06] bg-[#161616] px-4 py-3 text-sm text-zinc-300 font-mono leading-relaxed placeholder-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        placeholder="Reflect on your day here…"
        value={local}
        onChange={(e) => handleChange(e.target.value)}
      />
    </motion.div>
  );
}
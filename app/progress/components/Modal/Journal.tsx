"use client";

import { useIsMobile } from "@/lib/Mobile";
import { useModal } from "@/providers/Modalprovider";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const Journal = ({ value, onChange }: Props) => {
  const isMobile = useIsMobile();
  const [local, setLocal] = useState(value);
  const [saving, setSaving] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { close } = useModal();

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (!isMobile) close();
  }, [isMobile, close]);

  function handleChange(next: string) {
    if (next === local) return;

    if (timer.current) clearTimeout(timer.current);
    if (savingTimer.current) clearTimeout(savingTimer.current);

    setLocal(next);

    setSaving(false);

    savingTimer.current = setTimeout(() => {
      setSaving(true);

      onChange(next);

      timer.current = setTimeout(() => {
        setSaving(false);
      }, 500);
    }, 600);
  }

  return (
    <div className="flex min-h-[420px] flex-col p-5 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">
            Daily Journal
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Reflect on your day
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[11px] transition-all duration-200 ${
              saving
                ? "translate-x-0 opacity-100 text-zinc-400"
                : "translate-x-1 opacity-0"
            }`}
          >
            Saving...
          </span>

          <div
            className={`size-1.5 rounded-full transition-all duration-200 ${
              saving
                ? "scale-100 bg-yellow-400 opacity-100"
                : "scale-50 bg-transparent opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Editor */}
      <div className="relative flex flex-1">
        <textarea
          value={local}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write about your day..."
          className="
            min-h-[300px]
            w-full
            resize-none
            rounded-xl
            border border-white/[0.06]
            bg-[#161616]
            px-4
            py-4
            text-sm
            leading-7
            text-zinc-300
            placeholder:text-zinc-600
            outline-none
            transition-all
            duration-200
            focus:border-indigo-500/30
            focus:ring-1
            focus:ring-indigo-500/10
          "
        />
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-zinc-600">
          Your thoughts are saved automatically
        </span>

        <span className="text-[11px] tabular-nums text-zinc-600">
          {local.length} characters
        </span>
      </div>
    </div>
  );
};

export default Journal;

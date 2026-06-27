"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";


type Props = {
  onAdd: (title: string, description: string) => void;
};

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAdd() {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
    setTitle("");
    setDescription("");
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        placeholder="Task title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAdd()}
        className={inputClass}
      />
      <textarea
        placeholder="Description (optional)…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className={`${inputClass} resize-none`}
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        disabled={!title.trim()}
        className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-30"
        style={{
          background: "rgba(99,102,241,0.18)",
          border: "1px solid rgba(99,102,241,0.28)",
          color: "#818cf8",
        }}
      >
        <PlusIcon className="size-4" />
        Add Task
      </motion.button>
    </div>
  );
}
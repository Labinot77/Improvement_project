"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useUser } from "@/lib/use_user";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import No_access from "@/app/components/no_access";
import DefaultButton from "@/app/components/button";

type Props = {
  onAdd: (title: string, description: string) => void;
};

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

export function AddTaskForm({ onAdd }: Props) {
  const { isLoggedIn } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAdd() {
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim());
    setTitle("");
    setDescription("");
  }

  return (
    <div className="relative flex flex-col gap-3">
      <div className={!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""}>
        <Input
          placeholder="Task title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAdd()}
          className={inputClass}
        />
        <Textarea
          placeholder="Description (optional)…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`${inputClass} resize-none mt-2`}
        />
        <DefaultButton
          whileTap={{ scale: 0.97 }}
          onClick={handleAdd}
          disabled={!title.trim()}
          className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-30"
          style={{
            background: "rgba(99,102,241,0.18)",
            border: "1px solid rgba(99,102,241,0.28)",
            color: "#818cf8",
          }}
        >
          <PlusIcon className="size-4" />
          Add Task
        </DefaultButton>
      </div>

      {!isLoggedIn && (
       <No_access />
      )}
    </div>
  );
}
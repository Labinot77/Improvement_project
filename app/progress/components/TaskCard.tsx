"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, Trash2Icon, ChevronDownIcon, Trash2 } from "lucide-react";
import type { Task } from "@/types/Progress/progress";
import { useModal } from "@/providers/Modalprovider";
import DefaultButton from "@/app/components/DefaultButton";

type Props = {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
};

export function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [showReflection, setShowReflection] = useState(!!task.reflection);
  const { open } = useModal()
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      whileHover={{ borderColor: "rgba(255,255,255,0.10)" }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="group rounded-xl border border-white/[0.06] bg-[#131313] transition-colors duration-150"
    >
      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={() => onUpdate({ ...task, completed: !task.completed })}
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200"
            style={{
              borderColor: task.completed ? "#6366f1" : "rgba(255,255,255,0.2)",
              background: task.completed ? "#6366f1" : "transparent",
            }}
          >
            <AnimatePresence>
              {task.completed && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.14 }}
                >
                  <CheckIcon className="size-3 text-white" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className={`font-medium text-sm leading-snug transition-all duration-200 ${task.completed ? "line-through text-zinc-600" : "text-zinc-100"}`}>
                {task.title}
              </p>
            </div>
            {task.description && (
              <p className="mt-1.5 -ml-7 text-xs text-zinc-500 leading-relaxed">{task.description}</p>
            )}
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <DefaultButton
              variant='ghost'
              onClick={() => setShowReflection((s) => !s)}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-colors"
              title="Reflection"
            >
              <motion.span animate={{ rotate: showReflection ? 180 : 0 }} transition={{ duration: 0.2 }} className="block">
                <ChevronDownIcon className="size-3.5" />
              </motion.span>
            </DefaultButton>
              <DefaultButton
                  variant={'outline'}
                  onClick={() => open('delete', {
                      title: "Delete task",
                      description: `Are you sure you want to delete "${task.title}"? This action cannot be undone. `,
                      itemName: `"${task.title}"`,
                      onConfirm: onDelete,
                      
                  })}
                  className="flex items-center border border-red-500/20
                    text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 className="size-3" /> Delete
                </DefaultButton>
          </div>
        </div>

        <AnimatePresence>
          {showReflection && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-3 -pl-7">
                <textarea
                  placeholder="Add a reflection…"
                  value={task.reflection || ""}
                  onChange={(e) => onUpdate({ ...task, reflection: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-white/[0.06] bg-[#0a0a0a] px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 resize-none focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
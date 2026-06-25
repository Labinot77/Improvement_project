"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { CheckIcon, Trash2Icon, ChevronDownIcon } from "lucide-react"
import { Task } from "@/types/progress"
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: () => void
}

export function TaskCard({ task, onUpdate, onDelete }: Props) {
  const [showReflection, setShowReflection] = useState(!!task.reflection)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "group rounded-2xl border bg-card shadow-sm transition-colors duration-200",
        task.completed
          ? "border-border opacity-55"
          : "border-border hover:border-foreground/20 hover:shadow-md"
      )}
    >
      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => onUpdate({ ...task, completed: !task.completed })}
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-all duration-200",
              task.completed
                ? "border-foreground bg-foreground text-background"
                : "border-muted-foreground/40 hover:border-foreground/60"
            )}
            aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          >
            <AnimatePresence>
              {task.completed && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <CheckIcon className="size-3" strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "font-medium text-sm text-foreground leading-snug transition-all duration-200",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => setShowReflection((s) => !s)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/8 transition-colors"
              title="Toggle reflection"
            >
              <motion.span
                animate={{ rotate: showReflection ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                <ChevronDownIcon className="size-3.5" />
              </motion.span>
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete task"
            >
              <Trash2Icon className="size-3.5" />
            </button>
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
              <div className="mt-3 pl-7">
                <Textarea
                  placeholder="Add a reflection…"
                  value={task.reflection || ""}
                  onChange={(e) => onUpdate({ ...task, reflection: e.target.value })}
                  className="min-h-14 resize-none bg-background/60 text-xs placeholder:text-muted-foreground"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
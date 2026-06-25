"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FlameIcon } from "lucide-react";
import { Task } from "@/types/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion"
import { TaskCard } from "./task_card";
import { JournalSection } from "./Jounral";

type Props = {
  tasks: Task[];
  journal: string;
  dayRating: number;
  onAddTask: (title: string, description: string) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onJournalChange: (journal: string) => void;
  onRatingChange: (rating: number) => void;
  streak: number;
};

export function DayView({
  tasks,
  journal,
  dayRating,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onJournalChange,
  onRatingChange,
  streak,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleAdd() {
    if (!title.trim()) return;

    onAddTask(title.trim(), description.trim());

    setTitle("");
    setDescription("");
  }

  const completed = tasks.filter((t) => t.completed).length;

  return (
    <div className="flex flex-col h-[calc(100vh-65px)]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
        className="pb-5 mb-6 shrink-0 border-b border-border"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            <AnimatePresence>
              {tasks.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  <span className="font-bold">Tasks:</span> {completed} of{" "}
                  {tasks.length} done
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
              streak > 0
                ? "bg-orange-500/15 text-orange-500 border border-orange-500/20"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            <motion.span
              animate={streak > 0 ? { rotate: [0, -10, 10, -6, 6, 0] } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <FlameIcon
                className={`size-3.5 ${
                  streak > 0
                    ? "fill-orange-400 text-orange-500"
                    : "text-muted-foreground"
                }`}
              />
            </motion.span>

            <AnimatePresence mode="wait">
              <motion.span
                key={streak}
                initial={{ opacity: 0, y: 8, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="inline-block tabular-nums"
              >
                {streak}
              </motion.span>
            </AnimatePresence>

            <span>day streak</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 min-h-0 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.25 }}
          className="flex flex-col gap-5 overflow-hidden"
        >
          {/* Add task form */}
          <div className="shrink-0 rounded-2xl bg-card border border-border p-4 space-y-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              New Task
            </p>
            <Input
              placeholder="Task title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAdd()}
              className="bg-background/60 h-9"
            />
            <Textarea
              placeholder="Description (optional)…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background/60 min-h-[64px] resize-none text-sm"
            />
            <Button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="w-full h-9 text-sm font-semibold disabled:opacity-40"
            >
              <PlusIcon className="size-4 mr-1.5" />
              Add Task
            </Button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <JournalSection value={journal} onChange={onJournalChange} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col gap-5 min-h-0 overflow-y-auto"
        >
          {/* <DayRatingSection
            rating={dayRating}
            onRatingChange={onRatingChange}
          /> */}

          <div className="flex-1 min-h-0 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 shrink-0">
              Tasks {tasks.length === 0 ? "" : `${completed}/${tasks.length}`}
            </p>

            <div className="flex-1 overflow-y-hidden space-y-3 pr-1">
              <AnimatePresence initial={false}>
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

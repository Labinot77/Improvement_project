"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/Modalprovider";
import type { TodoTask } from "@/types/Progress/progress";
import { ACCENT } from "@/constants/progress/template";

// "Mon, Nov 24"
function shortDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  tasks: TodoTask[];
  onToggle: (t: TodoTask) => void;
  onRemove: (t: TodoTask) => void;
  showDate?: boolean;
};

// Animated task rows with complete + actions menu
export function TaskList({ tasks, onToggle, onRemove, showDate = false }: Props) {
  const { open } = useModal();

  // Ask before deleting
  function confirmDelete(t: TodoTask) {
    open("confirm", {
      title: "Delete task",
      description: `Are you sure you want to delete "${t.title}"? This action cannot be undone.`,
      itemName: `"${t.title}"`,
      onConfirm: () => onRemove(t),
    });
  }

  return (
    <ul className="divide-y divide-white/[0.06]">
      <AnimatePresence initial={false}>
        {tasks.map((t) => (
          <motion.li
            key={t.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 24, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:px-6"
          >
            <motion.button
              type="button"
              whileTap={{ scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              aria-pressed={t.completed}
              aria-label={t.completed ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`}
              onClick={() => onToggle(t)}
              className="relative grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
              style={
                t.completed
                  ? { background: ACCENT, borderColor: ACCENT }
                  : { borderColor: "rgba(255,255,255,0.2)" }
              }
            >
              <AnimatePresence>
                {t.completed && (
                  <>
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <Check className="size-4 text-white" strokeWidth={3} />
                    </motion.span>
                    {/* Ripple on complete */}
                    <motion.span
                      key="ripple"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ background: ACCENT }}
                    />
                  </>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-lg transition-colors duration-300 ${
                  t.completed ? "text-zinc-600 line-through" : "text-zinc-100"
                }`}
              >
                {t.title}
              </p>
              {(showDate || t.description) && (
                <p className="truncate text-sm text-zinc-600">
                  {[showDate ? shortDate(t.date) : null, t.description].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            <span className="hidden shrink-0 rounded-full bg-white/[0.06] px-3 py-1 text-sm text-zinc-500 sm:inline-flex">
              {t.category}
            </span>

            {/* modal={false} avoids a Radix bug when a dialog opens from a menu item */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Actions for "${t.title}"`}
                  className="grid size-9 shrink-0 place-items-center rounded-full text-zinc-600 transition-colors hover:bg-white/[0.06] hover:text-zinc-200 data-[state=open]:bg-white/[0.06] data-[state=open]:text-zinc-200"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40 rounded-xl">
                <DropdownMenuItem
                  onSelect={() => confirmDelete(t)}
                  className="gap-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
                >
                  <Trash2 className="size-4" />
                  Delete
                </DropdownMenuItem>
                {/* TODO: edit modal not implemented yet */}
                <DropdownMenuItem disabled className="gap-2">
                  <Pencil className="size-4" />
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

"use client";

import { useOptimistic, useTransition } from "react";
import { Check, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/providers/Modalprovider";
import { removeTask, setTaskCompleted } from "@/app/progress/actions/actions";
import type { TodoTask } from "@/lib/progress/getTodos";
import { ACCENT } from "@/constants/progress/template";

type Action = { type: "toggle"; id: string } | { type: "remove"; id: string };

function shortDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TaskList({
  tasks,
  showDate = false,
}: {
  tasks: TodoTask[];
  showDate?: boolean;
}) {
  const { open } = useModal();
  const [, startTransition] = useTransition();
  const [items, apply] = useOptimistic(tasks, (state: TodoTask[], action: Action) =>
    action.type === "remove"
      ? state.filter((t) => t.id !== action.id)
      : state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
  );

  function toggle(t: TodoTask) {
    startTransition(async () => {
      apply({ type: "toggle", id: t.id });
      await setTaskCompleted(t.id, !t.completed);
    });
  }

  function confirmDelete(t: TodoTask) {
    open("confirm", {
      title: "Delete task",
      description: `Are you sure you want to delete "${t.title}"? This action cannot be undone.`,
      itemName: `"${t.title}"`,
      onConfirm: () =>
        startTransition(async () => {
          apply({ type: "remove", id: t.id });
          await removeTask(t.id);
        }),
    });
  }

  function edit(t: TodoTask) {
    // ? Edit task modal to be implemented. For now, we can open the progress_create modal with the task data.
    //  open("progress_create", {
    //    task: t
    //  });
  }

  return (
    <ul className="divide-y divide-white/[0.06]">
      {items.map((t) => (
        <li key={t.id} className="flex items-center gap-4 px-5 py-4 sm:px-6">
          <button
            type="button"
            aria-pressed={t.completed}
            aria-label={t.completed ? `Mark "${t.title}" as not done` : `Mark "${t.title}" as done`}
            onClick={() => toggle(t)}
            className="grid size-7 shrink-0 place-items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
            style={
              t.completed
                ? { background: ACCENT, borderColor: ACCENT }
                : { borderColor: "rgba(255,255,255,0.2)" }
            }
          >
            {t.completed && <Check className="size-4 text-white" strokeWidth={3} />}
          </button>

          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-lg ${
                t.completed ? "text-zinc-600 line-through" : "text-zinc-100"
              }`}
            >
              {t.title}
            </p>
            {(showDate || t.description) && (
              <p className="truncate text-sm text-zinc-600">
                {[showDate ? shortDate(t.date) : null, t.description]
                  .filter(Boolean)
                  .join(" · ")}
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
              <DropdownMenuItem
                onSelect={() => edit(t)}
                className="gap-2 "
              >
                <Pencil className="size-4" />
                Edit 
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
}
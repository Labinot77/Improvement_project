"use client";

import { useOptimistic, useTransition } from "react";
import { removeTask, setTaskCompleted } from "@/app/progress/actions/actions";
import type { TodoTask } from "@/lib/progress/getTodos";

type Action = { type: "toggle"; id: string } | { type: "remove"; id: string };

// Instant toggle/delete while the server catches up
export function useOptimisticTasks(tasks: TodoTask[]) {
  const [, startTransition] = useTransition();
  const [items, apply] = useOptimistic(tasks, (state: TodoTask[], action: Action) =>
    action.type === "remove"
      ? state.filter((t) => t.id !== action.id)
      : state.map((t) => (t.id === action.id ? { ...t, completed: !t.completed } : t)),
  );

  // Flip completion
  function toggle(t: TodoTask) {
    startTransition(async () => {
      apply({ type: "toggle", id: t.id });
      await setTaskCompleted(t.id, !t.completed);
    });
  }

  // Delete task
  function remove(t: TodoTask) {
    startTransition(async () => {
      apply({ type: "remove", id: t.id });
      await removeTask(t.id);
    });
  }

  return { items, toggle, remove };
}

"use client";

import type { TodoTask } from "@/types/Progress/progress";
import { CARD } from "@/constants/progress/template";
import { useOptimisticTasks } from "../hooks/useOptimisticTasks";
import { TaskList } from "./List";

// Upcoming tasks (next days)
export function UpcomingTasks({ tasks }: { tasks: TodoTask[] }) {
  const { items, toggle, remove } = useOptimisticTasks(tasks);
  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 flex items-baseline gap-2 text-lg font-medium">
        Upcoming
        <span className="text-zinc-600">{items.length}</span>
      </h2>
      <div className={`${CARD} overflow-hidden`}>
        <TaskList tasks={items} onToggle={toggle} onRemove={remove} showDate />
      </div>
    </section>
  );
}

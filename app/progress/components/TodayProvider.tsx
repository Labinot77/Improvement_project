"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TodoTask } from "@/types/Progress/progress";
import { useOptimisticTasks } from "../hooks/useOptimisticTasks";

type TodayContext = ReturnType<typeof useOptimisticTasks>;

const Ctx = createContext<TodayContext | null>(null);

// Shares today's optimistic tasks between the list and the progress ring
export function TodayProvider({ tasks, children }: { tasks: TodoTask[]; children: ReactNode }) {
  const value = useOptimisticTasks(tasks);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Read today's tasks
export function useToday() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToday must be used inside TodayProvider");
  return ctx;
}

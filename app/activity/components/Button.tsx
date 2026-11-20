"use client";

import type { ReactNode } from "react";
import type { Activity } from "@/types/fitness";
import { useActivityModals } from "./UseActivityModal";

interface ActivityButtonProps {
  mode: "form" | "day"; // form = log a session, day = preview a day's sessions
  date?: string;
  sessions?: Activity[];
  className?: string;
  children: ReactNode;
}

// Client trigger so the server page can open modals
export function ActivityButton({ mode, date, sessions = [], className, children }: ActivityButtonProps) {
  const { openForm, openDay } = useActivityModals();
  return (
    <button
      type="button"
      className={className}
      onClick={() => (mode === "day" && date ? openDay(date, sessions) : openForm(date))}
    >
      {children}
    </button>
  );
}

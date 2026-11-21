"use client";

import { BookOpen, Dumbbell, ListChecks, Moon, Pencil, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";
import { today } from "@/lib/mics/date";
import { saveLesson } from "@/app/lessons/actions/main";
import { useJournalModals } from "@/app/journal/components/useJournalModals";
import { useRecipeModals } from "@/app/recipes/components/UseRecipeModal";

export type QuickAction = { href: string; label: string; icon: LucideIcon; color: string; run: () => void };

// Every "create" action in the app, keyed by the page it belongs to
export function useQuickAdd(): QuickAction[] {
  const { open } = useModal();
  const journal = useJournalModals();
  const recipes = useRecipeModals();

  return [
    { href: "/progress", label: "Task", icon: ListChecks, color: "#7c6cf0", run: () => open("progress_create", {}) },
    { href: "/activity", label: "Workout", icon: Dumbbell, color: "#f97362", run: () => open("workout_form", {}) },
    { href: "/sleep", label: "Night", icon: Moon, color: "#8b9cf7", run: () => open("sleep_form", {}) },
    {
      href: "/lessons",
      label: "Lesson",
      icon: BookOpen,
      color: "#4ade80",
      run: () => open("lesson", { selectedDate: today(), onSave: (id, v) => void saveLesson(id, v) }),
    },
    { href: "/journal", label: "Journal", icon: Pencil, color: "#34d399", run: () => journal.openForm({ date: today() }) },
    { href: "/recipes", label: "Recipe", icon: UtensilsCrossed, color: "#e9a25c", run: () => recipes.openForm() },
  ];
}

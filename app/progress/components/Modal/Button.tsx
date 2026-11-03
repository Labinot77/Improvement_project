"use client";

import { Plus } from "lucide-react";
import { useModal } from "@/providers/Modalprovider";

export function NewTaskButton({ date }: { date: string }) {
  const { open } = useModal();

  return (
    <button
      type="button"
      onClick={() => open("progress_create", { date })}
      className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Plus className="size-4" />
      New task
    </button>
  );
}
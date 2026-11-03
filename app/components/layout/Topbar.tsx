"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { today } from "@/lib/mics/date";
import { useModal } from "@/providers/Modalprovider";
import { useLessons } from "@/lib/use_lessons"
import { useRecipeModals } from "@/app/recipes/components/UseRecipeModal";

function getWeekNumber(d: Date) {
  const start = new Date(d.getFullYear(), 0, 1);
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.ceil(
    ((d.getTime() - start.getTime()) / dayMs + start.getDay() + 1) / 7
  );
}

export default function AppTopbar() {
  const { updateLesson, addLesson } = useLessons();
  const pathname = usePathname();
  const { open } = useModal();
    const { openForm } = useRecipeModals();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => setNow(new Date()), []);

  const date = now?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const quickAddActions: Record<
    string,
    { label: string; action: () => void }
  > = {
   "/lessons": {
  label: "Add Lesson",
  action: () => {
    open("lesson", {
      selectedDate: today(),
      onSave: (id, values) => {
        if (id) {
          updateLesson(id, values);
        } else {
          addLesson(values);
        }
      },
    });
  },
},
    "/progress": {
      label: "Add Task",
      action: () => open("progress_create", {}),
    },
    "/activity": {
      label: "Add Activity",
      action: () => {
        // Open the Add Activity dialog
        console.log("Add activity");
      },
    },
    "/recipes": {
      label: "Add Recipe",
      action: () => { openForm()},
    },
    "/sleep": {
      label: "Add Sleep",
      action: () => {
        // Open the Add Sleep dialog
        console.log("Add sleep");
      },
    },
  };

  const quickAdd = quickAddActions[pathname];

  return (
    <header className="sticky top-0 z-10 flex h-24 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-10 text-muted-foreground hover:text-foreground" />

        <div className="min-h-[2.75rem]">
          <p className="text-lg font-medium leading-tight">
            {date ?? "\u00A0"}
          </p>
          <p className="text-muted-foreground">
            {now ? `Week ${getWeekNumber(now)} of 52` : "\u00A0"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="grid size-12 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="size-5" />
        </button>

        <button
          type="button"
          onClick={quickAdd?.action}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus className="size-5" />
          {quickAdd?.label ?? "Quick add"}
        </button>
      </div>
    </header>
  );
}
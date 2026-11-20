"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Activity, Bell, BookOpen, ChevronDown, ListChecks, Moon, Pencil, Plus, UtensilsCrossed } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { today } from "@/lib/mics/date";
import { useModal } from "@/providers/Modalprovider";
import { useLessons } from "@/lib/use_lessons";
import { useRecipeModals } from "@/app/recipes/components/UseRecipeModal";
import { useActivityModals } from "@/app/activity/components/UseActivityModal";
import { useSleepModals } from "@/app/sleep/components/UseSleepModal";
import { useJournalModals } from "@/app/journal/actions/main";

// ISO-ish week number for the subtitle
function getWeekNumber(d: Date) {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7);
}

const pill =
  "inline-flex h-12 items-center gap-2 rounded-full bg-foreground px-6 font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Sticky header: date, notifications and context-aware Quick add
export default function AppTopbar() {
  const pathname = usePathname();
  const { open } = useModal();
  const { updateLesson, addLesson } = useLessons();
  const recipe = useRecipeModals();
  const activity = useActivityModals();
  const sleep = useSleepModals();
  const journal = useJournalModals();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => setNow(new Date()), []);

  // Every quick-add action, keyed by the page it belongs to
  const actions = [
    { href: "/progress", label: "Add Task", Icon: ListChecks, run: () => open("progress_create", {}) },
    { href: "/activity", label: "Add Activity", Icon: Activity, run: () => activity.openForm() },
    { href: "/sleep", label: "Add Sleep", Icon: Moon, run: () => sleep.openForm() },
    { href: "/journal", label: "Add Journal entry", Icon: Pencil, run: () => journal.openForm() },
    {
      href: "/lessons", label: "Add Lesson", Icon: BookOpen,
      run: () => open("lesson", {
        selectedDate: today(),
        onSave: (id, values) => (id ? updateLesson(id, values) : addLesson(values)),
      }),
    },
    { href: "/recipes", label: "Add Recipe", Icon: UtensilsCrossed, run: () => recipe.openForm() },
  ];

  const current = actions.find((a) => pathname.startsWith(a.href));
  const date = now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <header className="sticky top-0 z-10 flex h-24 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-10 text-muted-foreground hover:text-foreground" />
        <div className="min-h-[2.75rem]">
          <p className="text-lg font-medium leading-tight">{date ?? " "}</p>
          <p className="text-muted-foreground">{now ? `Week ${getWeekNumber(now)} of 52` : " "}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" aria-label="Notifications"
          className="grid size-12 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Bell className="size-5" />
        </button>

        {current ? (
          <button type="button" onClick={current.run} className={pill}>
            <Plus className="size-5" /> {current.label}
          </button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={pill}>
                <Plus className="size-5" /> Quick add <ChevronDown className="size-4 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">Add to…</DropdownMenuLabel>
              {actions.map(({ label, Icon, run }) => (
                <DropdownMenuItem key={label} onSelect={run} className="gap-3 rounded-xl px-3 py-2.5 text-base">
                  <Icon className="size-4 text-muted-foreground" /> {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

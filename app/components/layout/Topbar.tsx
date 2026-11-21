"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuickAdd } from "@/app/components/useQuickAdd";

// ISO-ish week number for the subtitle
function weekNumber(d: Date) {
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - start.getTime()) / 86_400_000 + start.getDay() + 1) / 7);
}

// Client-only date (avoids a server/client mismatch)
const subscribe = () => () => {};
function useNow() {
  return useSyncExternalStore(subscribe, () => new Date().toDateString(), () => null);
}

const PILL =
  "inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-12 sm:px-6 sm:text-base";

// Sticky top bar: sidebar toggle, date, and a context-aware quick add
export default function AppTopbar() {
  const pathname = usePathname();
  const actions = useQuickAdd();
  const nowKey = useNow();
  const now = nowKey ? new Date(nowKey) : null;
  const current = actions.find((a) => pathname.startsWith(a.href));

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur sm:h-24 sm:px-8">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1 size-10 text-muted-foreground hover:text-foreground" />
        <div className="min-w-0">
          <p className="truncate font-medium leading-tight sm:text-lg">
            {now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) ?? " "}
          </p>
          <p className="hidden text-muted-foreground sm:block">{now ? `Week ${weekNumber(now)} of 52` : " "}</p>
        </div>
      </div>

      {current ? (
        <button type="button" onClick={current.run} className={PILL}>
          <Plus className="size-5" />
          <span className="hidden sm:inline">Add {current.label.toLowerCase()}</span>
        </button>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button type="button" className={PILL}>
              <Plus className="size-5" />
              <span className="hidden sm:inline">Quick add</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48 rounded-xl">
            {actions.map((a) => (
              <DropdownMenuItem key={a.href} onSelect={a.run} className="gap-3 py-2">
                <a.icon className="size-4" style={{ color: a.color }} />
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}

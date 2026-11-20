"use client";

import type { ReactNode } from "react";
import type { SleepEntry } from "@/types/sleep";
import { useSleepModals } from "./UseSleepModal";

// Client trigger so the server page can open the preview
export function SleepButton({ entry, className, children }: { entry: SleepEntry; className?: string; children: ReactNode }) {
  const { openPreview } = useSleepModals();
  return (
    <button type="button" className={className} onClick={() => openPreview(entry)}>
      {children}
    </button>
  );
}

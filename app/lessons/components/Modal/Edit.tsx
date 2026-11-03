"use client";

import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Lesson } from "@/types/lessons";
import { LessonFormModal, LessonFormValues } from "../Form_modal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson?: Lesson;
  selectedDate?: string;
  onSave: (id: string | undefined, values: LessonFormValues) => void;
}

export function LessonModal({
  open,
  onOpenChange,
  lesson,
  selectedDate,
  onSave,
}: Props) {
  const isEditing = !!lesson;
  const Icon = isEditing ? Pencil : Plus;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* The [&>button] classes restyle shadcn's built-in close button to match the design */}
      <DialogContent
        className="gap-0 overflow-hidden rounded-[24px] border-white/[0.11] bg-[#191a1f] p-0 shadow-[0_32px_100px_rgba(0,0,0,.7)] sm:max-w-lg [&>button]:right-5 [&>button]:top-[22px] [&>button]:grid [&>button]:size-8 [&>button]:place-items-center [&>button]:rounded-full [&>button]:bg-white/[0.06] [&>button]:text-white/50 [&>button]:opacity-100 [&>button]:transition [&>button]:hover:rotate-90 [&>button]:hover:bg-white/[0.1] [&>button]:hover:text-white"
      >
        {/* Green glow */}
        <div className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-[#55c487]/15 blur-3xl" />

        <DialogHeader className="relative flex-row items-center gap-3 border-b border-white/[0.07] p-5 pr-16 text-left">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#55c487]/10 text-[#72d9a0]">
            <Icon className="size-4" />
          </div>
          <div>
            <DialogTitle className="text-lg font-semibold text-zinc-100">
              {isEditing ? "Edit lesson" : "Add lesson"}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-[10px] text-white/30">
              {isEditing
                ? "Refine the details of this lesson."
                : "Add the details now—you can always refine them later."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="relative p-5">
          <LessonFormModal
            key={lesson?.id ?? `new-${selectedDate ?? "today"}`}
            initial={lesson}
            selectedDate={selectedDate}
            onSave={(values) => {
              onSave(lesson?.id, values);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
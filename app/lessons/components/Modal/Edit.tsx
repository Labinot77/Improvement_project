"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type LessonFormValues,
} from "@/app/lessons/components/Form";
import type { Lesson } from "@/types/lessons";
import { LessonFormModal } from "../Form_modal";

const supabase = createClient();

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson;
  onSave: (id: string, values: LessonFormValues) => void;
}

export function LessonModal({ open, onOpenChange, lesson, onSave }: Props) {
  console.log("LessonModal props:", { open, lesson });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Edit lesson</DialogTitle>
        </DialogHeader>

        {lesson ? (
          <LessonFormModal
            initial={lesson}
            onSave={(values) => {
              onSave(lesson.id, values); // ← values not lesson
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <p className="text-sm text-zinc-600 py-4 text-center">
            Lesson not found.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

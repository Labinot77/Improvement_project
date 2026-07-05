"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LessonForm, type LessonFormValues } from "@/app/lessons/components/Form";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lesson } from "@/types/lessons";

const supabase = createClient();

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  onSave: (id: string, values: LessonFormValues) => void;
}

export function LessonModal({ open, onOpenChange, lessonId, onSave }: Props) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !lessonId) return;
    setLoading(true);
    setLesson(null);

    supabase
      .from("lessons")
      .select("*")
      .eq("id", lessonId)
      .single()
      .then(({ data }) => {
        if (data) setLesson({
          id: data.id,
          title: data.title,
          body: data.body,
          category: data.category,
          impact: data.impact,
          date: data.date,
          createdAt: data.created_at,
        });
        setLoading(false);
      });
  }, [open, lessonId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Edit lesson</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-9 w-full rounded-xl bg-white/[0.04]" />
            <Skeleton className="h-28 w-full rounded-xl bg-white/[0.04]" />
            <Skeleton className="h-9 w-2/3 rounded-xl bg-white/[0.04]" />
            <Skeleton className="h-9 w-full rounded-xl bg-white/[0.04]" />
          </div>
        ) : lesson ? (
          <LessonForm
            initial={lesson}
            onSave={(values) => {
              onSave(lessonId, values);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        ) : (
          <p className="text-sm text-zinc-600 py-4 text-center">Lesson not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
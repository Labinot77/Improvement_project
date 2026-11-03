"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Lesson } from "@/types/lessons";
import { useModal } from "@/providers/Modalprovider";
import { Button } from "@/components/ui/button";
import { LessonFormValues } from "./Form_modal";

interface Props {
  lesson: Lesson;
  onUpdate: (id: string, values: LessonFormValues) => void;
  onDelete: () => void;
}

const iconButton =
  "grid size-10 place-items-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60";

export function LessonCard({ lesson, onUpdate, onDelete }: Props) {
  const { open } = useModal();

  return (
    <article
      className="flex h-full flex-col rounded-3xl border border-white/[0.06] bg-[#16181b] p-6"
      onClick={() => open("lesson_preview", { lesson })}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-emerald-400/10 px-3.5 py-1.5 text-sm text-emerald-400">
          {lesson.category}
        </span>

        <div className="-mr-2 -mt-1 flex items-center">
          <Button
            type="button"
            aria-label={`Edit "${lesson.title}"`}
            className={iconButton}
            variant={"ghost"}
            onClick={() =>
              open("lesson", {
                lesson,
                onSave: (id: string | undefined, values: LessonFormValues) =>
                  onUpdate(id ?? lesson.id, values),
              })
            }
          >
            <Pencil className="size-[18px]" />
          </Button>
          <Button
            type="button"
            variant={"outline"}
            aria-label={`Delete "${lesson.title}"`}
            className={`${iconButton} hover:text-red-400`}
            onClick={() =>
              open("confirm", {
                title: "Delete lesson",
                description: `Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`,
                itemName: `"${lesson.title}"`,
                onConfirm: onDelete,
              })
            }
          >
            <Trash2 className="size-[18px]" />
          </Button>
        </div>
      </div>

      <h3 className="mt-5 text-xl font-medium leading-snug">{lesson.title}</h3>

      <p className="mt-3 line-clamp-3 whitespace-pre-wrap leading-relaxed text-zinc-500">
        {lesson.body || "No description added."}
      </p>

      <p className="mt-auto pt-6 text-sm tabular-nums text-zinc-600">
        {lesson.date}
      </p>
    </article>
  );
}

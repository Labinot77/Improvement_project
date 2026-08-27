"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { LoginModal } from "@/app/components/dashboard/modal/login";
import { ProfileModal } from "@/app/components/dashboard/modal/profile";
import { LessonModal } from "@/app/lessons/components/Modal/Edit";
import { DeleteModal } from "@/app/components/dashboard/modal/delete";
import type { LessonFormValues } from "@/app/lessons/components/Form";
import type { Activity } from "@/types/fitness";
import { DayActivityModal } from "@/app/fitness/components/modal/Day";
import { Lesson } from "@/types/lessons";
import { TemplateModal } from "@/app/progress/components/Modal/Template";
import { LessonsExpandedModal } from "@/app/lessons/components/Modal/List";
import { RecipeForm, RecipeFormValues } from "@/app/recipes/components/modal/Form";
import { MealType, Recipe, RecipeFilters } from "@/types/Recipies/main";
import { RecipeFilterModal } from "@/app/recipes/components/modal/Filter";
import { RecipePreviewModal } from "@/app/recipes/components/modal/Preview";
import { ProgressTemplate } from "@/types/Progress/templates";

type ModalProps = {
  login: Record<string, never>;
  profile: Record<string, never>;
  lesson: {
    lesson: Lesson;
    onSave: (id: string, values: LessonFormValues) => void;
  };
  lessons_list: {
    lessons: Lesson[];
    onUpdate: (id: string, values: LessonFormValues) => void;
    onDelete: (id: string) => void;
    pendingLessonIds: Set<string>;
    onClose?: () => void; // NEW: fired when this modal closes, for any reason
  };
  delete: {
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    itemName?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
  };
  dayActivity: {
    date: string;
    sessions: Activity[];
  };
  progressTemplate: {
    onApplyTemplate: (template: ProgressTemplate) => void;
  };
  recipe_form: {
    recipe?: Recipe;
    onSave: (id: string, values: RecipeFormValues) => void;
  };
  recipe_filter: {
    value: RecipeFilters;
    onApply: (value: RecipeFilters) => void;
    recipes: Recipe[];
  };
  recipe_preview: {
    recipe: Recipe;
    onSave: (id: string, values: RecipeFormValues) => void;
  };
};

export type ModalName = keyof ModalProps;

type StackEntry = {
  [K in ModalName]: { id: number; name: K; props: ModalProps[K] };
}[ModalName];

interface ModalContextValue {
  open: <K extends ModalName>(name: K, props: ModalProps[K]) => void;
  close: () => void; // closes the topmost modal
  closeAll: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}

const MODALS = {
  login: LoginModal,
  profile: ProfileModal,
  lesson: LessonModal,
  lessons_list: LessonsExpandedModal,
  delete: DeleteModal,
  dayActivity: DayActivityModal,
  progressTemplate: TemplateModal,
  recipe_form: RecipeForm,
  recipe_filter: RecipeFilterModal,
  recipe_preview: RecipePreviewModal,
} as const;

let nextId = 0;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<StackEntry[]>([]);

  const open = <K extends ModalName>(name: K, props: ModalProps[K]) => {
    setStack((prev) => [...prev, { id: nextId++, name, props } as StackEntry]);
  };

  // closes the topmost modal only
  const close = () => setStack((prev) => prev.slice(0, -1));

  const closeAll = () => setStack([]);

  const context = useMemo(() => ({ open, close, closeAll }), []);

  return (
    <ModalContext.Provider value={context}>
      {children}
      {stack.map((entry, index) => {
        const ActiveComponent = MODALS[entry.name];
        const isTop = index === stack.length - 1;

        return (
          <ActiveComponent
            key={entry.id}
            open={true}
            onOpenChange={(o: boolean) => {
              if (!o && isTop) {
                // fire any per-modal onClose callback before removing it
                (entry.props as { onClose?: () => void }).onClose?.();
                setStack((prev) => prev.filter((e) => e.id !== entry.id));
              }
            }}
            {...(entry.props as any)}
          />
        );
      })}
    </ModalContext.Provider>
  );
}
"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";


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
import { ResponsiveModal } from "@/app/components/ResponsiveModal";
import Journal from "@/app/progress/components/Modal/Journal";

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
    onClose?: () => void;
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
  progress_journal: {
    value: string;
    onChange: (value: string) => void;
  };
};

export type ModalName = keyof ModalProps;

type StackEntry = {
  [K in ModalName]: { id: number; name: K; props: ModalProps[K] };
}[ModalName];

interface ModalContextValue {
  open: <K extends ModalName>(name: K, props: ModalProps[K]) => void;
  close: () => void;
  closeAll: () => void;
  /**
   * Lets the CURRENTLY OPEN (topmost) modal's content veto dismissal —
   * e.g. while a form is mid-save. Call with `true` to block overlay
   * clicks / swipe-to-dismiss / Esc, `false` to release the lock.
   * Always reset this to `false` when the operation finishes (including
   * on error), or the modal will become unclosable.
   */
  setDismissLocked: (locked: boolean) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}

/**
 * Every entry here is now CONTENT ONLY — no Dialog/Drawer wrapper.
 * ModalProvider supplies the responsive shell (ResponsiveModal) around
 * whatever these components return. Each component still receives
 * `open` (always true while mounted) and `onOpenChange`, but should
 * ignore/pass those through rather than rendering its own Dialog.
 *
 * Migration note: components not yet ported (still importing Dialog
 * directly) will render a Dialog-inside-a-Dialog/Drawer nesting bug —
 * port them to return plain content before relying on this behavior.
 */
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
  progress_journal: Journal,
} as const;

/**
 * Per-modal shell overrides — e.g. wider desktop dialogs for form-heavy
 * modals. Anything not listed uses ResponsiveModal's defaults (max-w-sm).
 */
const SHELL_OVERRIDES: Partial<Record<ModalName, { desktopClassName?: string; hideHeader?: boolean }>> = {
  lesson: { desktopClassName: "max-w-lg" },
  lessons_list: { desktopClassName: "lg:max-w-[55dvw]", hideHeader: true },
  recipe_form: { desktopClassName: "lg:min-w-[45dvw]", hideHeader: true },
  recipe_preview: { desktopClassName: "lg:max-w-2xl", hideHeader: true },
  progressTemplate: { desktopClassName: "max-w-md", hideHeader: true },
};

let nextId = 0;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<StackEntry[]>([]);
  const dismissLockedRef = useRef(false);

  const open = <K extends ModalName>(name: K, props: ModalProps[K]) => {
    dismissLockedRef.current = false; // fresh modal, never start locked
    setStack((prev) => [...prev, { id: nextId++, name, props } as StackEntry]);
  };

  const close = () => setStack((prev) => prev.slice(0, -1));
  const closeAll = () => setStack([]);
  const setDismissLocked = (locked: boolean) => {
    dismissLockedRef.current = locked;
  };

  const context = useMemo(() => ({ open, close, closeAll, setDismissLocked }), []);

  return (
    <ModalContext.Provider value={context}>
      {children}
      {stack.map((entry, index) => {
        const Content = MODALS[entry.name];
        const isTop = index === stack.length - 1;
        const overrides = SHELL_OVERRIDES[entry.name];

        function handleOpenChange(o: boolean) {
          if (!o && dismissLockedRef.current) return; // top modal vetoed dismissal
          if (!o && isTop) {
            (entry.props as { onClose?: () => void }).onClose?.();
            setStack((prev) => prev.filter((e) => e.id !== entry.id));
          }
        }

        return (
          <ResponsiveModal
            key={entry.id}
            open={true}
            onOpenChange={handleOpenChange}
            desktopClassName={overrides?.desktopClassName}
            hideHeader={overrides?.hideHeader}
          >
            <Content open={true} onOpenChange={handleOpenChange} {...(entry.props as any)} />
          </ResponsiveModal>
        );
      })}
    </ModalContext.Provider>
  );
}
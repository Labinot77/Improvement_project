"use client";

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";

import { LoginModal } from "@/app/components/dashboard/modal/login";
import { ProfileModal } from "@/app/components/dashboard/modal/profile";
import { LessonModal } from "@/app/lessons/components/Modal/Edit";
import { ConfirmModal } from "@/app/components/dashboard/modal/Confirm";
import { DayActivityModal } from "@/app/activity/components/modal/Day";
import { ActivityForm } from "@/app/activity/components/Form";
import { SleepForm } from "@/app/sleep/components/Form";
import { SleepPreviewModal } from "@/app/sleep/components/modal/Preview";
import { RecipeForm } from "@/app/recipes/components/Form"; // NEW
import { RecipePreviewModal } from "@/app/recipes/components/modal/Preview";
import { ResponsiveModal } from "@/app/components/ResponsiveModal";
import { JournalForm } from "@/app/journal/components/Modal/Form";
import { JournalPreviewModal } from "@/app/journal/components/Modal/Preview";
import { TaskModal } from "@/app/progress/components/Create";
import type { Activity, ActivityFormValues } from "@/types/fitness";
import type { SleepEntry, SleepFormValues } from "@/types/sleep";
import type { Lesson } from "@/types/lessons";
import type { Recipe, RecipeFilters, RecipeFormValues, RecipeImageChange } from "@/types/Recipies/main"; // CHANGED: + RecipeFormValues
import type { ProgressTemplate } from "@/types/Progress/templates";
import { LessonFormValues } from "@/app/lessons/components/Form_modal";
import Preview from "@/app/lessons/components/Modal/Preview";
import type { JournalEntry, JournalFormValues } from "@/types/journal";

/* -------------------------------------------------------------------------- */
/*  Modal names and the props each one takes                                  */
/* -------------------------------------------------------------------------- */

export type ModalProps = {
  login: Record<string, never>;
  profile: Record<string, never>;
  lesson: {
    lesson?: Lesson;
    selectedDate?: string;
    onSave: (id: string | undefined, values: LessonFormValues) => void;
  };
  lesson_preview: {
    // Add Edit and delete on it. 
    lesson: Lesson;
  }
  confirm: {
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    itemName?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
  };
  dayActivity: { date: string; sessions: Activity[]; onDelete: (id: string) => Promise<void> };
  activity_form: { date?: string; onSave: (values: ActivityFormValues) => Promise<void> };
  progress_create: { date?: string };
  sleep_form: { entry?: SleepEntry; onSave: (values: SleepFormValues) => Promise<void> };
  sleep_preview: { entry: SleepEntry; onSave: (values: SleepFormValues) => Promise<void>; onDelete: (id: string) => Promise<void> };
  // CHANGED: onSave may be async so the form can show "Saving…" and errors
  recipe_form: { recipe?: Recipe; onSave: (id: string, values: RecipeFormValues, image?: RecipeImageChange) => void | Promise<void> };
  recipe_preview: { recipe: Recipe; onSave: (id: string, values: RecipeFormValues, image?: RecipeImageChange) => void | Promise<void>; onDelete: (id:string) => void | Promise<void>};
  journal_form: {
    entry?: JournalEntry;
    defaultDate?: string;
    onSave: (values: JournalFormValues) => Promise<void>;
  };
  journal_preview: {
    entry: JournalEntry;
    onSave: (values: JournalFormValues) => Promise<void>;
    onDelete: () => Promise<void>;
  };
};

export type ModalName = keyof ModalProps;

type Entry = {
  [K in ModalName]: { id: number; name: K; props: ModalProps[K] };
}[ModalName];

/* -------------------------------------------------------------------------- */
/*  What each modal renders (content only; the shell is ResponsiveModal)      */
/* -------------------------------------------------------------------------- */

// `base` carries `open` and `onOpenChange`; every modal component accepts them.
function renderModal(entry: Entry, base: any) {
  switch (entry.name) {
    case "login":
      return <LoginModal {...base} />;
    case "profile":
      return <ProfileModal {...base} />;
    case "lesson":
      return <LessonModal {...base} {...entry.props} />;
    case "lesson_preview": 
    return <Preview {...base} {...entry.props} />;
    case "confirm":
      return <ConfirmModal {...base} {...entry.props} />;
    case "dayActivity":
      return <DayActivityModal {...base} {...entry.props} />;
    case "sleep_form":
      return <SleepForm {...base} {...entry.props} />;
    case "sleep_preview":
      return <SleepPreviewModal {...base} {...entry.props} />;
    case "activity_form":
      return <ActivityForm {...base} {...entry.props} />;
    case "progress_create":
      return <TaskModal {...base} {...entry.props} />;
    case "recipe_form":
      return <RecipeForm {...base} {...entry.props} />;
    case "recipe_preview":
      return <RecipePreviewModal {...base} {...entry.props} />;
    case "journal_form":
      return <JournalForm {...base} {...entry.props} />;
    case "journal_preview":
      return <JournalPreviewModal {...base} {...entry.props} />;
      
    default: {
      // Compile error here means a name in ModalProps has no case above
      const unhandled: never = entry;
      return unhandled;
    }
  }
}

/* -------------------------------------------------------------------------- */
/*  Shell options per modal (anything not listed uses ResponsiveModal's       */
/*  defaults)                                                                 */
/* -------------------------------------------------------------------------- */

const TASK_SHELL =
  "max-w-lg gap-0 overflow-hidden rounded-[24px] border-white/[0.11] bg-[#191a1f] p-0 shadow-[0_32px_100px_rgba(0,0,0,.7)] [&>button]:right-5 [&>button]:top-[22px] [&>button]:grid [&>button]:size-8 [&>button]:place-items-center [&>button]:rounded-full [&>button]:bg-white/[0.06] [&>button]:text-white/50 [&>button]:opacity-100 [&>button]:transition [&>button]:hover:rotate-90 [&>button]:hover:bg-white/[0.1] [&>button]:hover:text-white";

const PREVIEW_SHELL = TASK_SHELL.replace("max-w-lg", "max-w-2xl");

const SHELL: Partial<Record<ModalName, { desktopClassName?: string; hideHeader?: boolean }>> = {
  lesson: { desktopClassName: "max-w-lg" },
  dayActivity: { desktopClassName: "lg:max-w-xl", hideHeader: true },
  activity_form: { desktopClassName: "lg:max-w-xl", hideHeader: true },
  sleep_form: { desktopClassName: "lg:max-w-xl", hideHeader: true },
  sleep_preview: { desktopClassName: "lg:max-w-xl", hideHeader: true },
  recipe_form: { desktopClassName: "lg:min-w-[45dvw]", hideHeader: true },
  recipe_preview: { desktopClassName: "lg:max-w-2xl", hideHeader: true },
  progress_create: { desktopClassName: TASK_SHELL, hideHeader: true },
  journal_form: { desktopClassName: PREVIEW_SHELL, hideHeader: true },
  journal_preview: { desktopClassName: PREVIEW_SHELL, hideHeader: true },
};

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

interface ModalContextValue {
  open: <K extends ModalName>(name: K, props: ModalProps[K]) => void;
  close: () => void;
  closeAll: () => void;
  /**
   * Lets the topmost modal block dismissal (overlay click, swipe, Esc),
   * e.g. while a form is saving. Always reset to `false` when done,
   * including on error, or the modal can't be closed.
   */
  setDismissLocked: (locked: boolean) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}

let nextId = 0;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Entry[]>([]);
  const dismissLocked = useRef(false);

  const api = useMemo<ModalContextValue>(
    () => ({
      open: (name, props) => {
        dismissLocked.current = false; // a fresh modal never starts locked
        setStack((s) => [...s, { id: nextId++, name, props } as Entry]);
      },
      close: () => setStack((s) => s.slice(0, -1)),
      closeAll: () => setStack([]),
      setDismissLocked: (locked) => {
        dismissLocked.current = locked;
      },
    }),
    [],
  );

  return (
    <ModalContext.Provider value={api}>
      {children}

      {stack.map((entry, index) => {
        const isTop = index === stack.length - 1;

        // Only the topmost modal can be dismissed, and only when not locked
        function onOpenChange(open: boolean) {
          if (open || !isTop || dismissLocked.current) return;
          (entry.props as { onClose?: () => void }).onClose?.();
          setStack((s) => s.filter((e) => e.id !== entry.id));
        }

        return (
          <ResponsiveModal
            key={entry.id}
            open
            onOpenChange={onOpenChange}
            {...SHELL[entry.name]}
          >
            {renderModal(entry, { open: true, onOpenChange })}
          </ResponsiveModal>
        );
      })}
    </ModalContext.Provider>
  );
}
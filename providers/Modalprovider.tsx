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

type ModalProps = {
  login:       Record<string, never>;
  profile:     Record<string, never>;
  lesson: {
    lesson: Lesson;
    onSave: (id: string, values: LessonFormValues) => void;
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
};

export type ModalName = keyof ModalProps;

type ActiveModal = {
  [K in ModalName]: { name: K; props: ModalProps[K] };
}[ModalName];

interface ModalContextValue {
  open: <K extends ModalName>(name: K, props: ModalProps[K]) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}

const MODALS = {
  login:       LoginModal,
  profile:     ProfileModal,
  lesson:      LessonModal,
  delete:      DeleteModal,
  dayActivity: DayActivityModal,
} as const;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveModal | null>(null);

  const open = <K extends ModalName>(name: K, props: ModalProps[K]) => {
    setActive({ name, props } as ActiveModal);
  };

  const close = () => setActive(null);

  const context = useMemo(() => ({ open, close }), []);

  const sharedProps = {
    open: active !== null,
    onOpenChange: (o: boolean) => { if (!o) close(); },
  };

  const ActiveComponent = active && MODALS[active.name];

  return (
    <ModalContext.Provider value={context}>
      {children}
      {ActiveComponent && (
        <ActiveComponent {...sharedProps} {...(active.props as any)} />
      )}
    </ModalContext.Provider>
  );
}
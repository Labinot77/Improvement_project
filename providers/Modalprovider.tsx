"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { LoginModal } from "@/app/components/dashboard/modal/login";
import { ProfileModal } from "@/app/components/dashboard/modal/profile";
import { LessonModal } from "@/app/lessons/components/Modal/Edit";
import type { LessonFormValues } from "@/app/lessons/components/Form";

type ModalProps = {
  login: Record<string, never>;
  profile: Record<string, never>;
  lesson: {
    lessonId: string;
    onSave: (id: string, values: LessonFormValues) => void;
  };
};

export type ModalName = keyof ModalProps;

type ActiveModal = {
  [K in ModalName]: {
    name: K;
    props: ModalProps[K];
  };
}[ModalName];

interface ModalContextValue {
  open: <K extends ModalName>(name: K, props: ModalProps[K]) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }

  return context;
}

const MODALS = {
  login: LoginModal,
  profile: ProfileModal,
  lesson: LessonModal,
} as const;

export function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveModal | null>(null);

  const open = <K extends ModalName>(name: K, props: ModalProps[K]) => {
    setActive({ name, props } as ActiveModal);
  };

  const close = () => setActive(null);

  const context = useMemo(
    () => ({
      open,
      close,
    }),
    []
  );

  const sharedProps = {
    open: active !== null,
    onOpenChange: (open: boolean) => {
      if (!open) close();
    },
  };

  const ActiveComponent = active && MODALS[active.name];

  return (
    <ModalContext.Provider value={context}>
      {children}

      {ActiveComponent && (
        <ActiveComponent
        {...sharedProps}
        {...(active.props as any)}
        />
      )}
    </ModalContext.Provider>
  );
}
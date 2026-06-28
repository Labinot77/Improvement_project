"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoginModal } from "../app/components/dashboard/modal/login";
import { ProfileModal } from "../app/components/dashboard/modal/profile";
import { ModalName } from "@/types/Modal/main";

export const MODALS: Record<ModalName, ({ onClose }: { onClose: () => void }) => ReactNode> = {
  login:   ({ onClose }) => <LoginModal open onOpenChange={(o) => !o && onClose()} />,
  profile: ({ onClose }) => <ProfileModal open onOpenChange={(o) => !o && onClose()} />,
};

interface ModalContextType {
  open: (modal: ModalName) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextType>({
  open: () => {},
  close: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ModalName | null>(null);

  function close() { setActive(null); }

  return (
    <ModalContext.Provider value={{ open: setActive, close }}>
      {children}
      {active && MODALS[active]({ onClose: close })}
    </ModalContext.Provider>
  );
}
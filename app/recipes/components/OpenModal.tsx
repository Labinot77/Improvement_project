"use client";

import type { ReactNode } from "react";
import { useModal, type ModalName, type ModalProps } from "@/providers/Modalprovider";

interface OpenModalProps<K extends ModalName> {
  name: K;
  params: ModalProps[K]; // only works for modals whose params are serializable (no callbacks)
  className?: string;
  children: ReactNode;
}

export function OpenModal<K extends ModalName>({ name, params, className, children }: OpenModalProps<K>) {
  const { open } = useModal();
  return (
    <button type="button" onClick={() => open(name, params)} className={className}>
      {children}
    </button>
  );
}
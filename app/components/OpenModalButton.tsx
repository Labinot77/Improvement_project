"use client";

import type { ReactNode } from "react";
import { useModal, type ModalName, type ModalProps } from "@/providers/Modalprovider";

type Props<K extends ModalName> = {
  modal: K;
  props: ModalProps[K];
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
};

// Button that opens a registered modal (usable from server components)
export default function OpenModalButton<K extends ModalName>({ modal, props, className, style, children }: Props<K>) {
  const { open } = useModal();
  return (
    <button type="button" onClick={() => open(modal, props)} className={className} style={style}>
      {children}
    </button>
  );
}

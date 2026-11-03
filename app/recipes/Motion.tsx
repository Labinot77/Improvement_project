"use client";

import type { ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

// Client wrappers so a server-rendered list can animate. The server page keeps
// rendering the items; when its data changes (filter, new recipe) these stay mounted,
// so new items animate in, removed items animate out, and the rest slide into place.

export function MotionList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ul className={className}>
        <AnimatePresence initial={false}>{children}</AnimatePresence>
      </ul>
    </MotionConfig>
  );
}

// Give every <MotionItem> a stable `key` (the recipe id).
export function MotionItem({ children }: { children: ReactNode }) {
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, layout: { type: "spring", stiffness: 350, damping: 32 } }}
    >
      {children}
    </motion.li>
  );
}
"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";

export function MotionList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <ul className={className}>
        <AnimatePresence initial={false}>{children}</AnimatePresence>
      </ul>
    </MotionConfig>
  );
}

export function MotionItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.li>
  );
}
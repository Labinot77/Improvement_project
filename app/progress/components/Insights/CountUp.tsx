"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

// Number that springs up to its value
export function CountUp({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 60, damping: 18 });
  const shown = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className="tabular-nums">{shown}</motion.span>;
}

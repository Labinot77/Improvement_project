"use client";

import { Button } from "@/components/ui/button";
import { DashboardCardProps } from "@/types/main";
import { motion } from "framer-motion";
import Link from "next/link";


const MotionLink = motion(Link);

export default function DashboardCard({
  index,
  title,
  subtitle,
  emoji,
  href,
  accentGlow,
  size = "medium",
  className = "",
}: DashboardCardProps) {
  return (
    <MotionLink
      href={href}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      custom={index}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0f0f] p-5 transition-colors duration-300 hover:border-white/[0.12] ${className}`}
    >
      {/* Accent glow — scales, intensifies, and expands slightly on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          background: `radial-gradient(ellipse at 85% 10%, ${accentGlow}, transparent 65%)`,
        }}
        variants={{
          hover: {
            scale: 1.02,
            filter: "brightness(1.45) saturate(1.2)",
            background: `radial-gradient(ellipse at 85% 10%, ${accentGlow}, transparent 55%)`,
          },
        }}
      />

      <div className="relative flex items-start justify-between">
        <span className="text-xs font-medium text-zinc-600 tracking-widest">
          {`· ${index.toString().padStart(2, "0")}`}
        </span>
        <span className="text-2xl leading-none">{emoji}</span>
      </div>

      <div className="relative flex items-end justify-between mt-auto">
        <div className="flex flex-col gap-0.5">
          <h2
            className={`font-semibold text-zinc-100 leading-tight ${
              size === "large" ? "text-2xl" : "text-[17px]"
            }`}
          >
            {title}
          </h2>
          <div className="text-sm text-zinc-500 flex items-center gap-1.5 mt-1">
            <span>{subtitle}</span>
            <Button
              variant="ghost"
              className="p-0 h-auto hover:bg-transparent text-zinc-400 group-hover:text-zinc-100 group-hover:translate-x-0.5 transition-all duration-200"
            >
              →
            </Button>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}
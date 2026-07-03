"use client"
import { motion } from "framer-motion";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  emoji: string;
  backHref?: string;
}

const MotionLink = motion.create(Link);

export default function PageHeader({
  title,
  subtitle,
  emoji,
  backHref = "/",
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-center gap-4 justify-between w-full">
        <MotionLink
          href={backHref}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-all duration-200 shrink-0"
          aria-label="Back to dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </MotionLink>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <h1 className="text-xl text-right font-semibold text-zinc-100 tracking-tight">
              {title}
            </h1>
          </div>
          <p className="text-sm text-zinc-500 ml-6 mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
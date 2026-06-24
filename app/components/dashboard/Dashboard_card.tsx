import { Button } from "@/components/ui/button";
import { DashboardCardProps } from "@/types/main";
import Link from "next/link";

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
    <Link
      href={href}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0f0f] p-5 transition-all duration-300 hover:border-white/[0.12] ${className}`}
    >
      {/* Always-visible accent glow — top-right radial */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 85% 10%, ${accentGlow}, transparent 65%)`,
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
          <p className="text-sm text-zinc-500 flex items-center gap-1.5">
            {subtitle}
            <Button variant={"ghost"} className="group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </Button>
          </p>
        </div>
      </div>
    </Link>
  );
}
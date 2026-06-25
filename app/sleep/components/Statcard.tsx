interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accentGlow?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  sub,
  accentGlow = "rgba(99,102,241,0.15)",
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0f0f] p-5 flex flex-col gap-1 ${className}`}
    >
      {/* accent glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 85% 15%, ${accentGlow}, transparent 70%)`,
        }}
      />
      <span className="relative text-xs font-medium text-zinc-500 uppercase tracking-widest">
        {label}
      </span>
      <span className="relative text-3xl font-semibold text-zinc-100 leading-tight">
        {value}
      </span>
      {sub && (
        <span className="relative text-sm text-zinc-500">{sub}</span>
      )}
    </div>
  );
}
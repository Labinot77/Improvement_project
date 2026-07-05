interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
  accentGlow?: string;
}

export default function SectionCard({
  title,
  subtitle,
  children,
  className = "",
  action,
  accentGlow,
}: SectionCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0f0f0f] p-6 ${className}`}
    >
      {accentGlow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse at 90% 5%, ${accentGlow}, transparent 60%)`,
          }}
        />
      )}
      {(title || subtitle) && (
        <div className="relative mb-5">
          {title && (
            <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-zinc-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
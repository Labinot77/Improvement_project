import type { ReactNode } from "react";

type Props = { icon: ReactNode; color: string; title: string; subtitle: string };

// Modal header with a soft accent glow (pr-16 leaves room for the close button)
export default function ModalHeader({ icon, color, title, subtitle }: Props) {
  return (
    <>
      <div
        className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full opacity-20 blur-3xl"
        style={{ background: color }}
      />
      <div className="relative flex items-center gap-3 border-b border-white/[0.07] p-5 pr-16">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl" style={{ background: `${color}1f`, color }}>
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">{title}</h2>
          <p className="mt-0.5 text-xs text-white/40">{subtitle}</p>
        </div>
      </div>
    </>
  );
}

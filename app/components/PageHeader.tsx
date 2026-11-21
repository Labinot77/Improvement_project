import type { ReactNode } from "react";
import { EYEBROW } from "@/constants/ui";

type Props = {
  eyebrow: string;
  eyebrowClass: string; // page accent, e.g. "text-[#e9a25c]"
  title: string;
  subtitle: string;
  aside?: ReactNode; // badge on the right
};

// Big page title with eyebrow and optional right-side badge
export default function PageHeader({ eyebrow, eyebrowClass, title, subtitle, aside }: Props) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className={`mb-4 ${EYEBROW} ${eyebrowClass}`}>{eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
      </div>
      {aside}
    </header>
  );
}

import { FOCUS_TIPS } from "@/constants/progress/template";

export default function FocusTip() {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );

  const tip = FOCUS_TIPS[dayOfYear % FOCUS_TIPS.length];

  return (
    <section className="rounded-3xl border border-[#3a3465]/60 bg-[#1d1a2e] p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-400">
        Focus tip
      </p>
      <p className="mt-5 text-xl leading-relaxed text-zinc-200">
        {tip[0]}
        <br />
        {tip[1]}
      </p>
    </section>
  );
}
